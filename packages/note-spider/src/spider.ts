import axios from 'axios';
import Jsdom from 'jsdom';

export const getHtmlFromUrl = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  return res.data;
};
