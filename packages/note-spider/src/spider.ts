import axios from 'axios';
import { JSDOM } from 'jsdom';
import path from 'path';
import { mapValues, mergeWith } from 'lodash';

const getHtmlFromUrl = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  return res.data;
};

const _getTitleAndLinks = (
  elm: HTMLTableCellElement
): Record<string, string[]> => {
  const children = elm.children;
  const res: Record<string, string[]> = {};
  let currentKey = 'default';
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    const strongText = child?.querySelector('strong');
    if (strongText?.textContent) {
      currentKey = strongText.textContent
        .toLowerCase()
        .trim()
        .replace(/\s/g, '_');
      continue;
    }
    const as = child?.querySelectorAll('a');
    if (as?.length !== 1) continue;
    const href = as.item(0)?.getAttribute('href');
    if (href) {
      if (!res[currentKey]) res[currentKey] = [];
      res[currentKey].push(href);
    }
  }
  return res;
};

const getTable = (dom: JSDOM) => {
  const table = dom.window.document.querySelector(
    'table table table:first-child'
  );
  if (!table) throw new Error('Table not found');
  return table;
};
const resolveLink = (url: string, pth: string) => {
  const cleanedUrl = url.replace(/\/\w+\.\w+$/, '');
  return path.join(cleanedUrl, pth).replace(/^https?:\//, (s) => s + '/');
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

  const titleLinksMap = usefulCols
    .map(_getTitleAndLinks)
    .reduce((prev, curr) =>
      mergeWith(prev, curr, (target, src) => target?.concat(src))
    );
  const res: Record<string, string[]> = mapValues(titleLinksMap, (value) =>
    value.map((pth) => resolveLink(url, pth))
  );
  return res;
};
