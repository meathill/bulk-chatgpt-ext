function setValueToTextarea(selector: string, value: string): HTMLElement | null {
  const textarea = document.querySelector(selector) as HTMLTextAreaElement;
  textarea.focus();
  textarea.select();
  textarea.value = value;
}

export async function getActiveTab(): Promise<Tab> {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}

export async function setValueToInput(value: string): Promise<HTMLElement> {
  const tab = await getActiveTab();
  return await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setValueToTextarea,
    args: ['#prompt-textarea', value],
  });
}
