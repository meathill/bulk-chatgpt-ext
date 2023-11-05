import { defineStore } from 'pinia';
import { ref } from 'vue';

const LOCAL_KEY = 'local-prompts';

const useStore = defineStore('store', () => {
  const local = localStorage.getItem(LOCAL_KEY);
  const prompts = ref<string[]>(local ? JSON.parse(local) : ['']);

  function addPrompt(): void {
    prompts.value.push('');
  }
  function clearAll(): void {
    prompts.value = [''];
    localStorage.removeItem(LOCAL_KEY);
  }
  function removePrompt(index: number): void {
    prompts.value.splice(index, 1);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prompts.value));
  }
  function setPrompts(index: number, prompt: string): void {
    prompts.value[index] = prompt;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prompts.value));
  }

  return {
    prompts,

    addPrompt,
    clearAll,
    removePrompt,
    setPrompts,
  };
});

export default useStore;
