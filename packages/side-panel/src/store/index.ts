import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PromptItem } from '@/types';

const LOCAL_KEY = 'local-prompts';

function createItem(): PromptItem {
  return {
    prompt: '',
    response: '',
  };
}

const useStore = defineStore('store', () => {
  const local = localStorage.getItem(LOCAL_KEY);
  const prompts = ref<PromptItem[]>(local ? JSON.parse(local) : [createItem()]);

  function addPrompt(): void {
    prompts.value.push(createItem());
  }
  function clearAll(): void {
    prompts.value = [createItem()];
    localStorage.removeItem(LOCAL_KEY);
  }
  function removePrompt(index: number): void {
    prompts.value.splice(index, 1);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prompts.value));
  }
  function setPrompt(index: number, prompt: Partial<PromptItem>): void {
    Object.assign(prompts.value[index], prompt);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prompts.value));
  }
  async function exportData(): Promise<void> {
    const blob = new Blob([JSON.stringify(prompts.value)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mui-bulk-exported.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    prompts,

    addPrompt,
    clearAll,
    removePrompt,
    setPrompt,
    exportData,
  };
});

export default useStore;
