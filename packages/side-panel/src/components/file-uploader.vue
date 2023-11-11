<script setup lang="ts">
import { readFile } from '@/services/file-reader';
import { ref, watch } from 'vue';

type Props = {
  file: File,
  content: string;
  accept?: string;
}
const props = withDefaults(defineProps<Props>(), {
  accept: 'application/json',
  content: '',
});
type Emits = {
  (event: 'update:content', value: string): void;
  (event: 'update:file', value: File): void;
};
const emit = defineEmits<Emits>();

const fileName = ref<string>('');
const fileSize = ref<number>(0);

async function onSelectFile(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files && target.files[0];
  if (!file) return;

  target.value = '';
  fileName.value = file.name;
  fileSize.value = file.size;
  const content = await readFile(file);
  emit('update:file', file);
  emit('update:content', content);
}

watch(() => props.file, (file) => {
  fileName.value = file ? file.name : '';
  fileSize.value = file ? file.size : 0;
});
</script>

<template lang="pug">
label.btn.btn-accent.btn-sm(

)
  input.hidden(
    type="file"
    :accept="accept"
    @change="onSelectFile"
  )
  i.bi.bi-filetype-json
  | {{fileName || 'Use file'}}
</template>
