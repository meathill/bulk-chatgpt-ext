<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import useStore from '@/store';

const store = useStore();
const root = ref<HTMLDetailsElement>();

function doTogglePrefix(): void {
  store.setConfig({ hasPrefix: !store.config.hasPrefix });
}
async function onClick(event: MouseEvent): Promise<void> {
  if (!root.value) return;
  if (root.value.contains(event.target as Node)) return;

  await nextTick();
  root.value.open = false;
}

onMounted(() => {
  document.body.addEventListener('click', onClick);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('click', onClick);
});
</script>

<template lang="pug">
details.dropdown(ref="root")
  summary.btn.btn-ghost.btn-sm
    i.bi.bi-gear.text-lg
  ul.p-2.menu.shadow.shadow-base-content.dropdown-content.z-10.bg-base-100.rounded.w-52
    li
      button(
        type="button"
        @click="doTogglePrefix"
      )
        i.bi.bi-check-lg(v-if="store.config.hasPrefix")
        | Prefix
</template>

<script lang="ts">
export default {
  name: 'AppSettings',
};
</script>
