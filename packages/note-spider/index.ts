import { parseUrl } from './src/spider';
import { WEB_URL } from './src/constants';
import * as fs from 'fs/promises';
import path from 'path';

const STORAGE_PATH = path.resolve(__dirname, 'data');

const run = async () => {
  await parseUrl(WEB_URL.post2012.woodwinds.flute);
};

run();
