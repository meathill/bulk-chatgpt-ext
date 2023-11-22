import { sleep } from '@/utils';
import { PromptResponse } from '@/types';

function setValueToTextarea(selector: string, value: string): void {
  const textarea = document.querySelector(selector) as HTMLTextAreaElement;
  textarea.focus();
  textarea.select();
  textarea.value = value;
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}

export async function setValueToInput(value: string): Promise<void> {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({
    target: { tabId: tab.id as number },
    func: setValueToTextarea,
    args: ['#prompt-textarea', value],
  });
  await sleep(1000);
}

export async function submitPrompt(): Promise<string> {
  const tab = await getActiveTab();
  const result = (await chrome.tabs.sendMessage(tab.id as number, {
    type: 'ExecutePrompt',
  })) as PromptResponse;
  if (result.code !== 0) {
    throw new Error(result.error);
  }
  return result.data;
}
