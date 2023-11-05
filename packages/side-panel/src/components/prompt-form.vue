<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { setValueToInput, submitPrompt } from '../services';
import PromptItem from '@/components/prompt-item.vue';

const LOCAL_KEY = 'local-prompts';
const local = localStorage.getItem(LOCAL_KEY);
const promptItems = ref<typeof PromptItem>();
const prompts = ref<string[]>(local ? JSON.parse(local) : ['']);
const currentExecuting = ref<number>(-1);

async function doAddPrompt(): Promise<void> {
  prompts.value.push('');
  await nextTick();
  if (!promptItems.value) return;
  promptItems.value[promptItems.value.length - 1].focus();
}
async function doSubmit(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) return;
  if (currentExecuting.value > -1) return;

  for (let i = 0, len = prompts.value.length; i < len; i++) {
    currentExecuting.value = i;
    const item = prompts.value[i];
    const prompt = item.trim();
    if (!prompt) continue;

    await setValueToInput(item);
    await submitPrompt();
  }
  currentExecuting.value = -1;
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
    ref="promptItems"
    :key="index"
    :index="index + 1"
    :is-executing="currentExecuting === index"
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
      :disabled="currentExecuting > -1"
    )
      span.loading.loading-spinner(v-if="currentExecuting > -1")
      i.bi.bi-play-fill(v-else)
      | Submit
</template>
