import { PromptRequest } from '../../src/types';
import { sleep } from '../../src/utils';

console.log('[MuiBulk content] init');

chrome.runtime.onMessage.addListener(
  function (request: PromptRequest, sender, sendResponse) {
    if (request.type !== 'ExecutePrompt') { return; }

    const beforeLength = document.querySelectorAll('[data-message-author-role="assistant"]').length;
    const button = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
    button.click();

    (async function () {
      // wait for new message item is created
      let timeout = 0;
      while (timeout < 150) { // 150s
        const currentLength = document.querySelectorAll('[data-message-author-role="assistant"]').length;
        if (currentLength > beforeLength) {
          break;
        }
        console.log('[MuiBulk content] waiting for submitting');
        await sleep(1000);
        timeout += 1;
      }

      await sleep(4000 + Math.random() * 2000);

      // wait for generating complete
      timeout = 0;
      while (timeout < 150) { // 150s
        const streaming = document.getElementsByClassName('result-streaming');
        if (streaming.length === 0) {
          break;
        }
        console.log('[MuiBulk content] waiting for generating');
        await sleep(1000);
        timeout += 1;
      }

      console.log('[MuiBulk content] done');

      // find copy to clipboard button
      const contents = document.querySelectorAll('.markdown.prose.w-full');
      const content = contents[contents.length - 1];
      const message = content.textContent
        .replace(/jsonCopy code/g, '');

      // get value from clipboard
      console.log('[MuiBulk content]', message);
      sendResponse(message);
    })();

    return true;
  }
);
