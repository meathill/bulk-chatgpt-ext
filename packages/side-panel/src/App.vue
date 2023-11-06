<script setup lang="ts">
import PromptForm from '@/components/prompt-form.vue';
import TextReplace from '@/components/text-replace.vue';
import useStore from '@/store';

const version = __VERSION__;
const store = useStore();
</script>

<template lang="pug">
header.flex.p-2.border-b.shadow
  text-replace(button-class="btn-xs btn-ghost")
  button.btn.btn-xs.btn-ghost.ml-auto(
    type="button"
    @click="store.exportData"
  )
    i.bi.bi-download
prompt-form
footer.border-t.py-2.mt-auto
  p.text-xs.text-center v{{version}}
</template>
