export type AppConfig = {
  hasPrefix: boolean;
  prefix: string;
}

export type PromptItem = {
  id?: string;
  prompt: string;
  response: string;
  file?: File;
  fileContent?: string;
  progress?: number;
}

export type PromptRequest = {
  type: 'ExecutePrompt';
}
