
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import useStore from '@/store';

type Props = {
  buttonClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  buttonClass: '',
});

const store = useStore();
const dialog = ref<HTMLDialogElement>();
const findInput = ref<HTMLInputElement>();
const isOpen = ref<boolean>(false);
const toFind = ref<string>('');
const toReplace = ref<string>('');

async function doOpen(): Promise<void> {
  isOpen.value = true;
  await nextTick();
  dialog.value?.showModal();
  findInput.value?.focus();
  findInput.value?.select();
}
function doReplace(): void {
  for (let i = 0, len = store.prompts.length; i < len; i++) {
    const item = store.prompts[i];
    let prompt = item.prompt.trim();
    if (!prompt) continue;

    prompt = prompt.replaceAll(toFind.value, toReplace.value);
    store.setPrompt(i, { prompt });
  }
  dialog.value?.close();
}
</script>

<template lang="pug">
button.btn(
  type="button"
  :class="buttonClass"
  @click="doOpen"
)
  i.bi.bi-arrow-repeat
teleport(to="body")
  dialog.modal(
    v-if="isOpen"
    ref="dialog"
    @close="isOpen = false"
  )
    .modal-box
      form(method="dialog")
        button.btn.btn-sm.btn-circle.btn-ghost.absolute.top-2.right-2 ✕

      h3.font-bold.text-lg Replace Text
      form#replace-form.flex.gap-2(
        @submit.prevent="doReplace"
      )
        .form-control(class="w-1/2")
          label.label(for="find")
            span.label-text Find
          input#find.input.input-bordered(
            ref="findInput"
            required
            v-model="toFind"
          )
        .form-control(class="w-1/2")
          label.label(for="replace")
            span.label-text Replace
          input#replace.input.input-bordered(
            required
            v-model="toReplace"
          )
      .modal-action
        button.btn.btn-sm.btn-primary(form="replace-form") Replace
        form(method="dialog")
          button.btn.btn-sm.btn-ghost Cancel
    form.modal-backdrop(method="dialog")
      button close
</template>
