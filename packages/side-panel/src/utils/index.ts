function setValueToTextarea(selector: string, value: string): void {
  const textarea = document.querySelector(selector) as HTMLTextAreaElement;
  textarea.focus();
  textarea.select();
  textarea.value = value;
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
  console.log('[MuiBulk] setValueToTextarea', value, textarea.value);
}

async function submitPromptByClickButton(): Promise<void> {
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const button = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
  button.click();
  console.log('[MuiBulk] submit', button);
  await sleep(1500);
  const buttons = document.getElementsByTagName('button');
  let timeout = 0;
  while (timeout < 150000) { // 150s
    const regenerate = Array.from(buttons).find((button) => button.innerText === 'Regenerate');
    if (regenerate && regenerate.disabled === false) {
      break;
    }
    await sleep(1000);
    timeout += 1000;
  }
}

export async function getActiveTab(): Promise<Tab> {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}

export async function setValueToInput(value: string): Promise<void> {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setValueToTextarea,
    args: ['#prompt-textarea', value],
  });
}

export async function submitPrompt(): Promise<void> {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: submitPromptByClickButton,
  });
}
