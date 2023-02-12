import axios from 'axios';
import * as fs from 'fs';

export const saveToLocalStreaming = async (url: string): Promise<boolean> => {
  const res = await axios.get(url, { responseType: 'stream' });
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(url.split('/').pop() as string);
    res.data.pipe(stream);
    stream.on('finish', () => {
      stream.close();
      resolve(true);
    });
    stream.on('error', (err) => {
      stream.close();
      reject(err);
    });
  });
};
