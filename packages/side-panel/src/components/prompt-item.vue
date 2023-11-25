<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { marked } from 'marked';
import useStore from '@/store';
import FileUploader from '@/components/file-uploader.vue';
import type { PromptItem } from '@/types';

type Props = {
  index: number;
  isExecuting?: boolean;
  item: PromptItem;
};
const props = defineProps<Props>();
type Emits = {
  (event: 'delete'): void;
};
const emit = defineEmits<Emits>();

const store = useStore();
const file = shallowRef<File>();
const textarea = ref<HTMLTextAreaElement>();
const prompt = computed<string>({
  get(): string {
    return props.item.prompt;
  },
  set(value: string): void {
    store.setPrompt(props.index, { prompt: value });
  },
});
const fileContent = computed<string>({
  get(): string {
    return props.item.fileContent || '';
  },
  set(value: string): void {
    store.setPrompt(props.index, { fileContent: value });
  },
});
const markdown = computed<string>(() => {
  const { response } = props.item;
  return response ? marked.parse(response) : '';
});
const resultFile = computed<string>(() => {
  if (!file.value) return '';
  const names = file.value.name.split('.');
  names.splice(-1, 0, 'result');
  return names.join('.');
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
.flex.gap-2.mt-2
  .w-6.flex-none.pt-1
    .border.rounded-full.w-6.h-6.flex.justify-center.items-center.border-base-content(
      :class="item.success ? 'bg-success' : (isExecuting && 'bg-base-200')"
    )
      i.bi.bi-check-lg(v-if="item.success")
      i.bi.bi-play-fill(v-else-if="isExecuting")
      template(v-else) {{index + 1}}
    button.btn.btn-xs.btn-ghost.btn-circle.mt-2(
      tabindex="-1"
      type="button"
      @click="doRemove"
    )
      i.bi.bi-x-lg
  .flex-1.relative
    .alert.alert-error(v-if="item.error")
      p {{item.error}}
    .border.rounded-box.p-4(v-if="file")
      progress.progress.progress-primary.w-full.mb-2(
        :value="item.progress || 0"
        :max="item.total || 1"
      )
      .flex.justify-end.items-center
        button.btn.btn-ghost.btn-xs.btn-circle(
          type="button"
          @click="file = undefined; fileContent = ''"
        )
          i.bi.bi-trash3
    .form-control(v-else)
      label.label.sr-only
        span.label-text Prompt {{index + 1}}
      textarea.textarea.textarea-bordered.w-full.leading-normal.pt-2(
        ref="textarea"
        rows="3"
        required
        placeholder="Type here\n\nor"
        :tabindex="index + 1"
        v-model="prompt"
      )
    .absolute.flex.items-center.w-32(
      v-if="!prompt"
      :class="file ? 'left-4 top-8' : 'left-10 top-10'"
    )
      file-uploader(
        v-model:file="file"
        v-model:content="fileContent"
      )

    .chat.chat-start.mt-2(
      v-if="item.response"
    )
      .chat-bubble.text-base.prose.text-neutral-content
        a.btn.btn-success.btn-sm(
          v-if="item.url"
          :download="resultFile"
          :href="item.url"
          target="_blank"
        )
          i.bi.bi-download
          | Download transformed file
        article(v-else-if="!file" v-html="markdown")
</template>
