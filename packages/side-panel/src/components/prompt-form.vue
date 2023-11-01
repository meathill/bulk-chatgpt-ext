<script setup lang="ts">
import { ref } from 'vue';
import { setValueToInput, submitPrompt } from '@/utils';
import PromptItem from '@/components/prompt-item.vue';

const LOCAL_KEY = 'local-prompts';
const local = localStorage.getItem(LOCAL_KEY);
const prompts = ref<string[]>(local ? JSON.parse(local) : ['']);
const isExecuting = ref<boolean>(false);

function doAddPrompt(): void {
  prompts.value.push('');
}
async function doSubmit(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) return;
  if (isExecuting.value) return;

  isExecuting.value = true;
  for (const item of prompts.value) {
    const prompt = item.trim();
    if (!prompt) continue;

    await setValueToInput(item);
    await submitPrompt();
  }
  isExecuting.value = false;
}
function doClearAll(): void {
  if (!confirm('Are you sure you want to clear all prompts?')) return;
  prompts.value = [''];
}
function onChange(): void {
  // store to local storage
  localStorage.setItem(LOCAL_KEY, JSON.stringify(prompts.value));
}
</script>

<template lang="pug">
form.px-4.pt-4(
  @change="onChange"
  @submit.prevent="doSubmit"
)
  prompt-item(
    v-for="(item, index) in prompts"
    :key="index"
    :index="index + 1"
    :is-executing="isExecuting"
    v-model="prompts[index]"
    @delete="prompts.splice(index, 1)"
  )
  .flex.gap-2.mb-2
    button.btn.btn-sm.btn-outline.ml-8.mb-2(
      type="button"
      @click="doAddPrompt"
    )
      i.bi.bi-plus-lg
      | Add prompt
    button.btn.btn-sm.btn-outline.ml-auto.mb-2(
      type="button"
      @click="doClearAll"
    )
      i.bi.bi-trash
      | Clear all
  .form-control
    button.btn.btn-primary(
      :disabled="isExecuting"
    )
      span.loading.loading-spinner(v-if="isExecuting")
      i.bi.bi-play-fill(v-else)
      | Submit
</template>
