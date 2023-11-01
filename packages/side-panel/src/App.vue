<script setup lang="ts">
import PromptForm from '@/components/prompt-form.vue';

const version = __VERSION__;
</script>

<template lang="pug">
prompt-form
footer.border-t.py-2.mt-auto
  p.text-xs.text-center v{{version}}
</template>
