<script setup lang="ts">
import { ref } from 'vue';
import { setValueToInput, submitPrompt } from './utils';

const prompt = ref<string>('');
const isExecuting = ref<boolean>(false);
async function doSubmit(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) return;
  if (isExecuting.value) return;

  isExecuting.value = true;
  const prompts = prompt.value.split('\n')
    .map(p => p.trim())
    .filter(Boolean);
  for (const item of prompts) {
    await setValueToInput(item);
    await submitPrompt();
  }
  isExecuting.value = false;
}
</script>

<template lang="pug">
form.p-4(
  @submit.prevent="doSubmit"
)
  .form-control.mb-2
    label.label
      span.label-text Bulk prompt
      span.label-text-alt (one per line)
    textarea.textarea.textarea-bordered(
      rows="15"
      placeholder="Type here"
      v-model="prompt"
      required
    )
  .form-control
    button.btn.btn-primary(
      :disabled="!prompt"
    )
      span.loading.loading-spinner(v-if="isExecuting")
      i.bi.bi-play-fill(v-else)
      | Submit
</template>
