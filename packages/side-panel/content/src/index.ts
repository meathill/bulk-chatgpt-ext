import { PromptRequest } from '../../src/types';

console.log('[MuiBulk content] init');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(
  function (request: PromptRequest, sender, sendResponse) {
    if (request.type !== 'ExecutePrompt') { return; }

    const button = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
    button.click();

    (async function () {
      await sleep(5000);
      let timeout = 0;
      const streaming = document.getElementsByClassName('result-streaming');
      while (timeout < 150000) { // 150s
        if (streaming.length === 0) {
          break;
        }
        console.log('[MuiBulk content] waiting for regenerate button');
        await sleep(1000);
        timeout += 1000;
      }

      console.log('[MuiBulk content] done');

      // find copy to clipboard button
      const contents = document.querySelectorAll('.markdown.prose.w-full');
      const content = contents[contents.length - 1];
      const message = content.innerHTML;

      // get value from clipboard
      sendResponse(message);
    })();

    return true;
  }
);
