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
  enabled?: boolean;
  success?: boolean;
  error?: string;
}

export type PromptRequest = {
  type: 'ExecutePrompt';
}

export type PromptResponse = {
  code: number;
  data: string;
  error?: string;
}
