import axios from 'axios';
import * as fs from 'fs';
import * as afs from 'fs/promises';
import path from 'path';
import { DEBUG_MODE } from './util';

export const saveToLocalStreaming = async (
  url: string,
  pth: string
): Promise<boolean> => {
  const res = await axios.get(url, { responseType: 'stream' });
  if (!fs.existsSync(pth)) await afs.mkdir(pth, { recursive: true });
  return new Promise((resolve, reject) => {
    const filename = url.split('/').pop() as string;
    const targetPath = path.resolve(pth, filename);
    if (DEBUG_MODE) return resolve(true);
    const stream = fs.createWriteStream(targetPath, { autoClose: true });
    res.data.pipe(stream);
    stream.on('finish', () => {
      resolve(true);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};
