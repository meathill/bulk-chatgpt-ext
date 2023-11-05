export type ExecuteMessage = {
  id: number;
  prompt: string;
}

export type CallbackMessage = {
  id: number;
  message: string;
}
