<script setup lang="ts">
import { computed, ref } from 'vue';

type Props = {
  index: number;
  modelValue: string;
  isExecuting?: boolean;
};
const props = defineProps<Props>();
type Emits = {
  (event: 'update:modelValue', value: string): void;
  (event: 'delete'): void;
};
const emit = defineEmits<Emits>();

const textarea = ref<HTMLTextAreaElement>();
const prompt = computed<string>({
  get(): string {
    return props.modelValue;
  },
  set(value: string): void {
    emit('update:modelValue', value);
  },
});

function doRemove(): void {
  if (prompt.value.trim()
    && !confirm('Are you sure you want to delete this prompt?')) {
    return;
  }
  emit('delete');
}
function focus(): void {
  textarea.value?.focus();
}

defineExpose({
  focus,
});
</script>

<template lang="pug">
.flex.gap-2.mb-2
  .w-6.flex-none.pt-1
    .border.rounded-full.w-6.h-6.flex.justify-center.items-center.border-base-content(
      :class="{'bg-base-200': isExecuting}"
    )
      i.bi.bi-play-fill(v-if="isExecuting")
      template(v-else) {{index}}
    button.btn.btn-xs.btn-ghost.btn-circle.mt-2(
      tabindex="-1"
      type="button"
      @click="doRemove"
    )
      i.bi.bi-x-lg
  .flex-1
    textarea.textarea.textarea-bordered.w-full.leading-normal.pt-2(
      ref="textarea"
      rows="4"
      required
      placeholder="Type here"
      :tabindex="index"
      v-model="prompt"
    )
</template>
