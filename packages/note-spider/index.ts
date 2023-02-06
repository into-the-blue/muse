import { getHtmlFromUrl } from './src/spider';
import { WEB_URL } from './src/constants';

const run = async () => {
  await getHtmlFromUrl(WEB_URL.post2012.woodwinds.flute);
};

run();
