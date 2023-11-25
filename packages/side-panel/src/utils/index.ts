export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createFileUrl(content: string): string {
  const blob = new Blob([content], { type: 'application/json' });
  return URL.createObjectURL(blob);
}
