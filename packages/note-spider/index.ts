import { parseUrl } from './src/spider';
import { WEB_URL } from './src/constants';
import { saveToLocalStreaming } from './src/download';
import * as fs from 'fs/promises';
import path from 'path';

const STORAGE_PATH = path.resolve(__dirname, 'data');

const run = async () => {
  // const res = await parseUrl(WEB_URL.pre2012.woodwinds.flute);
  // console.warn({ res });
};

run();
