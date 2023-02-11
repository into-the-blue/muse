import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as cheerio from 'cheerio';

const getHtmlFromUrl = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  return res.data;
};

export const parseUrl = async (url: string) => {
  const html = await getHtmlFromUrl(url);
  const $ = cheerio.load(html);
  const res = $('//table');
  console.warn({
    res,
  });
};
