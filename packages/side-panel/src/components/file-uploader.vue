<script setup lang="ts">
import { readFile } from '@/services/file-reader';
import { ref } from 'vue';

type Props = {
  modelValue: string;
  accept: string;
}
const props = withDefaults(defineProps<Props>(), {
  accept: 'application/json',
  modelValue: '',
});
type Emits = {
  (event: 'update:modelValue', value: string): void;
};
const emit = defineEmits<Emits>();

const fileName = ref<string>('');
const fileSize = ref<number>(0);

async function onSelectFile(event: Event): Promise<void> {
  const files = (event.target as HTMLInputElement)?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  fileName.value = file.name;
  fileSize.value = file.size;
  const content = await readFile(file);
  emit('update:modelValue', content);
}
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
