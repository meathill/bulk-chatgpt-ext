import { defineStore } from 'pinia';
import { ref } from 'vue';
import defaults from 'lodash/defaults';
import { AppConfig, PromptItem } from '@/types';
import { createFileUrl } from '@/utils';

const LOCAL_CONFIG = 'local_config';
const LOCAL_KEY = 'local-prompts';

function createItem(): PromptItem {
  return {
    prompt: '',
    response: '',
    progress: 0,
    total: 0,
  };
}

function handleLocalPromptList(local: string): PromptItem[] {
  const prompts = JSON.parse(local) as PromptItem[];
  return prompts.map((item: PromptItem) => {
    const { isFile, response } = item;
    let url = '';
    if (isFile) {
      url = createFileUrl(response as string);
    }
    return {
      ...item,
      url,
      isFile,
    };
  });
}

const useStore = defineStore('store', () => {
  const local = localStorage.getItem(LOCAL_KEY);
  const prompts = ref<PromptItem[]>(local ? handleLocalPromptList(local) : [createItem()]);
  const localConfig = localStorage.getItem(LOCAL_CONFIG);
  const config = ref<AppConfig>(defaults(localConfig ? JSON.parse(localConfig) : {}, {
    hasPrefix: false,
    prefix: '',
  }));

  function addPrompt(): void {
    prompts.value.push(createItem());
  }
  function clearAll(): void {
    prompts.value = [createItem()];
    localStorage.removeItem(LOCAL_KEY);
  }
  function removePrompt(index: number): void {
    prompts.value.splice(index, 1);
    savePromptList();
  }
  function setPrompt(index: number, prompt: Partial<PromptItem>): void {
    Object.assign(prompts.value[index], prompt);
    savePromptList();
  }
  function savePromptList(): void {
    const list= prompts.value.map((item) => ({
      prompt: item.prompt,
      isFile: item.file ? 1 : 0,
      isSuccess: item.success ? 1 : 0,
      response: item.response,
    }));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }
  async function exportData(): Promise<void> {
    const url = createFileUrl(JSON.stringify(prompts.value));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mui-bulk-exported.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  function setConfig(value: Partial<AppConfig>) {
    Object.assign(config.value, value);
    localStorage.setItem(LOCAL_CONFIG, JSON.stringify(config.value));
  }

  return {
    config,
    prompts,

    addPrompt,
    clearAll,
    removePrompt,
    setPrompt,
    exportData,
    setConfig,
  };
});

export default useStore;
