const CHAT_GPT_ORIGIN = 'https://chat.openai.com';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
