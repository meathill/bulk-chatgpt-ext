<script setup lang="ts">
import PromptForm from '@/components/prompt-form.vue';
import TextReplace from '@/components/text-replace.vue';

const version = __VERSION__;
</script>

<template lang="pug">
header.flex.p-2.border-b.shadow
  text-replace(button-class="btn-xs btn-ghost")
prompt-form
footer.border-t.py-2.mt-auto
  p.text-xs.text-center v{{version}}
</template>
