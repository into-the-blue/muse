import axios from 'axios';
import { WEB_URL } from './constants';

export const getHtmlFromUrl = async (url: string) => {
  const res = await axios.get(url);
  console.log(res.data);
};
