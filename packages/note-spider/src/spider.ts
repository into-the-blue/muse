import axios from 'axios';
import { JSDOM } from 'jsdom';
import path from 'path';

const getHtmlFromUrl = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  return res.data;
};

const _getTitleAndLinks = (elm: HTMLTableCellElement): [string, string[]] => {
  const children = elm.children;
  const keyName = children[0].textContent as string;
  const links: string[] = [];
  for (let i = 1; i < children.length; i++) {
    const child = children.item(i);
    const as = child?.querySelectorAll('a');
    if (as?.length !== 1) continue;
    const href = as.item(0)?.getAttribute('href');
    if (href) links.push(href);
  }
  return [keyName, links];
};

const getTable = (dom: JSDOM) => {
  const table = dom.window.document.querySelector(
    'table table table:first-child'
  );
  if (!table) throw new Error('Table not found');
  return table;
};
const resolveLink = (url: string, pth: string) => {
  const baseUrl = url.split('/');
  const lastItem = baseUrl.pop();
  if (!!lastItem && !lastItem.includes('.')) baseUrl.push(lastItem);
  return path.join(baseUrl.join('/'), pth);
};
export const parseUrl = async (
  url: string
): Promise<Record<string, string[]>> => {
  const html = await getHtmlFromUrl(url);
  const dom = new JSDOM(html);
  const table = getTable(dom);
  const columns = table.querySelectorAll('td');
  const usefulCols: HTMLTableCellElement[] = [];
  columns.forEach((node, key) => {
    if (key > 1) usefulCols.push(node);
  });
  const res: Record<string, string[]> = Object.fromEntries(
    usefulCols
      .map(_getTitleAndLinks)
      .map(([key, value]) => [
        key,
        (value as string[]).map((pth) => resolveLink(url, pth)),
      ])
  );
  return res;
};
