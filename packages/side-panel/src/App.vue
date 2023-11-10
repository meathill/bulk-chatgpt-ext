<script setup lang="ts">
import PromptForm from '@/components/prompt-form.vue';
import TextReplace from '@/components/text-replace.vue';
import useStore from '@/store';
import AppSettings from '@/components/settings.vue';

const version = __VERSION__;
const store = useStore();
</script>

<template lang="pug">
header.flex.gap-2.p-2.border-b.shadow
  text-replace(button-class="btn-sm btn-ghost")
  app-settings
  button.btn.btn-sm.btn-ghost.ml-auto(
    type="button"
    @click="store.exportData"
  )
    i.bi.bi-download.text-lg
prompt-form
footer.border-t.py-2.mt-auto
  p.text-xs.text-center v{{version}}
</template>
