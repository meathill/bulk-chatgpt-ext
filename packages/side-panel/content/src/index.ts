import { ExecuteMessage } from '../../src/types';

console.log('[MuiBulk content] init');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(
  function (request: ExecuteMessage, sender, sendResponse) {
    const { id, prompt } = request;

    const button = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
    button.click();

    (async function () {
      await sleep(1500);
      const buttons = document.getElementsByTagName('button');
      let timeout = 0;
      while (timeout < 150000) { // 150s
        const reButton = Array.from(buttons).find((button) => button.innerText === 'Regenerate');
        if (reButton && !reButton.disabled) {
          break;
        }
        console.log('[MuiBulk content] waiting for regenerate button');
        await sleep(1000);
        timeout += 1000;
      }

      console.log('[MuiBulk content] done');
      sendResponse({
        id,
        message: 'ok',
      });
    })();

    return true;
  }
);
