<script setup lang="ts">
import { computed, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { setValueToInput, submitPrompt } from '../services';
import PromptItem from '@/components/prompt-item.vue';
import useStore from '@/store';
import { JsonChunks } from '@/utils/json-chunks.ts';
import { sleep } from '@/utils';

const store = useStore();
const promptItems = ref<typeof PromptItem>();
const currentExecuting = ref<number>(-1);
const prefix = computed<string>({
  get(): string {
    return store.config.prefix;
  },
  set(value: string) {
    store.setConfig({ prefix: value });
  },
});

async function doAddPrompt(): Promise<void> {
  store.addPrompt();
}
async function doSubmit(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) return;
  if (currentExecuting.value > -1) return;

  for (let i = 0, len = store.prompts.length; i < len; i++) {
    currentExecuting.value = i;
    const item = store.prompts[i];
    const prompt = item.prompt.trim();
    if (prompt) {
      await setValueToInput(prompt);
      const response = await submitPrompt();
      store.setPrompt(i, { response });
    } else if (item.fileContent) {
      const chunks = new JsonChunks(item.fileContent);
      while (!chunks.done) {
        const prompt = chunks.getChunk();
        await setValueToInput(`${store.config.prefix}

\`\`\`json
${prompt}
\`\`\`
`);
        let response = await submitPrompt();
        response = response.replace(/\\(?![tnbrfv0])/g, '');
        console.log('response:', response);
        chunks.setChunk(response);
        store.setPrompt(i, { progress: chunks.progress });
      }
      store.setPrompt(i, { response: chunks.result });
    }
    await sleep(Math.random() * 3000 + 1000);
  }
  currentExecuting.value = -1;
}
function doClearAll(): void {
  if (!confirm('Are you sure you want to clear all prompts?')) return;
  store.clearAll();
}
</script>

<template lang="pug">
form.px-4.pt-2(
  @submit.prevent="doSubmit"
)
  .form-control.mb-4(
    v-if="store.config.hasPrefix"
  )
    label.label
      span.label-text Prefix
    textarea.textarea.textarea-bordered(
      placeholder="Prefix will be prepended to each prompt"
      rows="4"
      v-model="prefix"
    )
  prompt-item(
    v-for="(item, index) in store.prompts"
    ref="promptItems"
    :key="index"
    :index="index"
    :is-executing="currentExecuting === index"
    @delete="store.removePrompt(index)"
  )
  .flex.gap-2.my-4
    button.btn.btn-sm.btn-outline.ml-8(
      type="button"
      @click="doAddPrompt"
    )
      i.bi.bi-plus-lg
      | Add prompt
    button.btn.btn-sm.btn-outline.ml-auto(
      type="button"
      @click="doClearAll"
    )
      i.bi.bi-trash
      | Clear all
  .form-control
    button.btn.btn-primary(
      :disabled="currentExecuting > -1"
    )
      span.loading.loading-spinner(v-if="currentExecuting > -1")
      i.bi.bi-play-fill(v-else)
      | Submit
</template>
