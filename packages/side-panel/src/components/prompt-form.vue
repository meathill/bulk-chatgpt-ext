<script setup lang="ts">
import { computed, ref } from 'vue';
import { setValueToInput, submitPrompt } from '../services';
import PromptItem from '@/components/prompt-item.vue';
import useStore from '@/store';
import { JsonChunks } from '@/utils/json-chunks.ts';
import { sleep } from '@/utils';

const store = useStore();
const promptItems = ref<typeof PromptItem>();
const currentExecuting = ref<number>(-1);
const message = ref<string>('');
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
  message.value = '';
  if ((event.target as HTMLFormElement).matches(':invalid')) return;
  if (currentExecuting.value > -1) return;

  const _prefix = prefix.value.trim();
  for (let i = 0, len = store.prompts.length; i < len; i++) {
    currentExecuting.value = i;
    const item = store.prompts[i];
    const prompt = item.prompt.trim();

    try {
      if (prompt) {
        await setValueToInput(_prefix ? `${_prefix}

${prompt}` : prompt);
        const response = await submitPrompt();
        store.setPrompt(i, { response });

      } else if (item.fileContent) {
        const chunks = new JsonChunks(item.fileContent);
        store.setPrompt(i, { total: chunks.total });
        while (!chunks.done) {
          const prompt = chunks.getChunk();
          if (!prompt) break;

          await setValueToInput(_prefix ? `${_prefix}

\`\`\`json
${prompt}
\`\`\`
` : prompt);
          const response = await submitPrompt();
          // I forgot why I should replace \{char}, but for now it should not be needed
          //response = response.replace(/\\(?![tnbrfv0])/g, '');
          console.log('response:', response);
          chunks.setChunk(response);
          store.setPrompt(i, { progress: chunks.progress });
        }
        store.setPrompt(i, {
          response: chunks.result,
          url: chunks.url,
        });
      }

    } catch (e) {
      message.value = (e as Error).message || String(e);
      break;
    }

    store.setPrompt(i, { success: true });
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
form.px-4.pt-2.relative(
  @submit.prevent="doSubmit"
)
  .absolute.top-4.left-4.right-4.alert.alert-error(v-if="message" role="alert")
    p {{message}}
    button.btn.btn-ghost.btn-sm.btn-circle(
      type="button"
      @click="message = ''"
    )
      i.bi.bi-x-lg

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
    :item="item"
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
