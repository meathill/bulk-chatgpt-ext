import { PromptRequest } from '../../src/types';
import { sleep } from '../../src/utils';

type WaitOptions = {
  maxDuration?: number;
  log?: string;
}

console.log('[MuiBulk content] init');

async function waitUntil(
  condition: () => boolean | Promise<boolean>,
  {
    maxDuration = 150,
    log = 'wait one more second',
  }: WaitOptions
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - maxDuration * 1000 <= startTime) {
    if (await condition()) {
      return;
    }
    await sleep(1000);
    console.log(log);
  }
  throw new Error('waitUntil timeout');
}

chrome.runtime.onMessage.addListener(
  function (request: PromptRequest, sender, sendResponse) {
    if (request.type !== 'ExecutePrompt') { return; }

    const button = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
    button.click();

    (async function () {
      let finalMessage = '';

      const p = waitUntil(
        async () => {
          const beforeLength = document.querySelectorAll('[data-message-author-role="assistant"]').length;

          // wait for new message item is created
          await waitUntil(
            () =>
              document
                .querySelectorAll('[data-message-author-role="assistant"]')
                .length > beforeLength,
            { log: '[MuiBulk content] waiting for submitting' }
          );

          // wait for generating started
          await sleep(4000 + Math.random() * 2000);

          // wait for generating complete
          await waitUntil(
            () => document.getElementsByClassName('result-streaming').length === 0,
            { log: '[MuiBulk content] waiting for generating' }
          );
          console.log('[MuiBulk content] done');

          // find response content
          const contents = document.querySelectorAll('.markdown.prose.w-full');
          const content = contents[contents.length - 1];
          const message = content.textContent
            .replace(/jsonCopy code/g, '');
          finalMessage += message;

          // make sure "Continue generate" button does not exist
          await sleep(1000 + Math.random() * 1000);
          const buttons = document.getElementsByTagName('button');
          const continueButton = Array.from(buttons).find(button => button.textContent === 'Continue generate');
          if (continueButton) {
            continueButton.click();
            return false;
          }

          return true;
        },
        {
          log: '[MuiBulk content] waiting for continue',
          maxDuration: 1500,
        },
      );

      try {
        await p;
        console.log('[MuiBulk content]', finalMessage);
        sendResponse({
          code: 0,
          data: finalMessage,
        });
      } catch (e) {
        sendResponse({
          code: 1,
          data: finalMessage,
          error: e.message || String(e),
        });
      }
    })();

    return true;
  }
);
