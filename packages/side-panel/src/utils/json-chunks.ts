import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

const MAX_CHUNK_SIZE = 2048;

export class JsonChunks {
  #done = false;
  #root: unknown;
  #chunks: Record<string, string | boolean | number>[] = [];
  #total = 0;
  #progress = 0;

  constructor(json: string) {
    this.#root = JSON.parse(json);
    // calculate total size without whitespaces

    // first, make a flattened object
    // ```js
    // const from = {
    //   a: 123,
    //   b: {
    //     c: 'bar',
    //     d: false,
    //   }
    // }
    // const transformed = {
    //   a: 123,
    //   'b.c': 'bar',
    //   'b.d': false,
    // }
    // ```
    const queue: unknown[] = [this.#root];
    const keys: string[] = [];
    const map: Record<string, number | string | boolean> = {};
    while (queue.length) {
      const value = queue.shift();
      const key = keys.shift() as string || '';
      if (isString(value) || isNumber(value) || typeof value === 'boolean') {
        map[key] = value;
        continue;
      }

      // need to split into smaller chunks
      for (const [k, v] of Object.entries(value as object)) {
        queue.push(v);
        keys.push(key ? `${key}.${k}` : k);
      }
    }
    this.#total = Object.keys(map).length;

    // then, split map into chunks
    const chunks = [];
    for (const [k, v] of Object.entries(map)) {
      const length = k.length + v.toString().length + 5;
      let isPushed = false;
      for (const chunk of chunks) {
        if (JSON.stringify(chunk).length + length < MAX_CHUNK_SIZE) {
          chunk[k] = v;
          isPushed = true;
          break;
        }
      }
      if (!isPushed) {
        chunks.push({ [k]: v });
      }
    }
    this.#chunks = chunks;
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

    const chunk = this.#chunks.shift();
    this.#progress++;
    return JSON.stringify(chunk);
  }

  setChunk(obj: Record<string, string>) {
    for (const [k, v] of Object.entries(obj)) {
      const keys = k.split('.');
      let target = this.#root;
      while (keys.length > 1) {
        const key = keys.shift() as string;
        target = target[key];
      }
      target[keys[0]] = v;
    }
  }
}
