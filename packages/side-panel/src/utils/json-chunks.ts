import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

const MAX_CHUNK_SIZE = 1024;

export class JsonChunks {
  #done = false;
  #root: unknown;
  #queue: unknown[] = [];
  #keys: string[][] = [];
  #path: string[] = [];
  #total = 0;
  #progress = 0;

  constructor(json: string) {
    this.#root = JSON.parse(json);
    // calculate total size without whitespaces
    this.#total = JSON.stringify(this.#root).length;

    const chunks: unknown[] = [this.#root];
    const keys: string[][] = [];
    while (chunks.length) {
      const chunk = chunks.shift();
      const key = keys.shift() as string[] || [];
      if (isString(chunk) || isNumber(chunk)) {
        this.#queue.push(chunk);
        this.#keys.push(key);
        continue;
      }

      const string = JSON.stringify(chunk);
      // enough for one chunk, save it into queue
      if (string.length < MAX_CHUNK_SIZE) {
        this.#queue.push(chunk);
        this.#keys.push(key);
        continue;
      }

      // need to split into smaller chunks
      for (const [k, v] of Object.entries(chunk as object)) {
        chunks.push(v);
        keys.push([...key, k]);
      }
    }
  }

  get done() {
    return this.#done;
  }
  get result() {
    return JSON.stringify(this.#root);
  }
  get progress(): number {
    return this.#progress / this.#total;
  }

  getChunk(): string {
    if (this.#done) {
      return '';
    }

    const chunk = JSON.stringify(this.#queue.shift());
    this.#path = this.#keys.shift() as string[] || [];
    this.#done = this.#queue.length <= 0;
    this.#progress = this.#progress + chunk.length;
    return chunk;
  }

  setChunk<T extends object>(obj: unknown) {
    obj = isString(obj) ? JSON.parse(obj) : obj;
    if (this.#path.length === 0) {
      this.#root = obj;
      return;
    }

    let target: T = this.#root as T;
    for (const key of this.#path.slice(0, -1)) {
      if (!(key in target)) {
        throw new Error('Invalid Path');
      }
      target = target[key as keyof T] as T;
    }
    target[this.#path[this.#path.length - 1] as keyof T] = obj as T[keyof T];
  }
}
