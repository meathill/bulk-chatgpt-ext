<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { marked } from 'marked';
import useStore from '@/store';

type Props = {
  index: number;
  isExecuting?: boolean;
};
const props = defineProps<Props>();
type Emits = {
  (event: 'delete'): void;
};
const emit = defineEmits<Emits>();

const store = useStore();
const textarea = ref<HTMLTextAreaElement>();
const prompt = computed<string>({
  get(): string {
    return store.prompts[props.index].prompt;
  },
  set(value: string): void {
    store.setPrompt(props.index, { prompt: value });
  },
});
const markdown = computed<string>(() => {
  const { response } = store.prompts[props.index];
  return response ? marked.parse(response) : '';
});

function doRemove(): void {
  if (prompt.value.trim()
    && !confirm('Are you sure you want to delete this prompt?')) {
    return;
  }
  emit('delete');
}

onMounted(() => {
  textarea.value?.focus();
});
</script>

<template lang="pug">
.flex.gap-2.mb-2
  .w-6.flex-none.pt-1
    .border.rounded-full.w-6.h-6.flex.justify-center.items-center.border-base-content(
      :class="{'bg-base-200': isExecuting}"
    )
      i.bi.bi-play-fill(v-if="isExecuting")
      template(v-else) {{index + 1}}
    button.btn.btn-xs.btn-ghost.btn-circle.mt-2(
      tabindex="-1"
      type="button"
      @click="doRemove"
    )
      i.bi.bi-x-lg
  .flex-1
    textarea.textarea.textarea-bordered.w-full.leading-normal.pt-2(
      ref="textarea"
      rows="3"
      required
      placeholder="Type here"
      :tabindex="index + 1"
      v-model="prompt"
    )
    .chat.chat-start(
      v-if="markdown"
    )
      .chat-bubble.prose(
        v-html="markdown"
      )

</template>
