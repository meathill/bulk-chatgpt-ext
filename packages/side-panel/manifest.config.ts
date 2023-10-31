import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' assert { type: 'json' };

export default defineManifest(async function (env) {
  return {
    manifest_version: 3,
    name: env.mode === 'staging'
      ? '[Internal] Bulk ChatGPT'
      : 'Bulk ChatGPT',
    version: pkg.version,
    permissions: [
      'activeTab',
      'scripting',
      'sidePanel',
    ],
    host_permissions: [
      'https://chat.openai.com/*',
    ],
    side_panel: {
      default_path: 'index.html',
    },
  };
});
