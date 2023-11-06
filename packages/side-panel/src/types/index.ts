export type PromptItem = {
  id?: string;
  prompt: string;
  response: string;
}

export type PromptRequest = {
  type: 'ExecutePrompt';
}
