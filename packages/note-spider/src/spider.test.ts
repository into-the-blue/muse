import { parseUrl } from './spider';
import { WEB_URL } from './constants';

describe('Scraping pre2012 website', () => {
  test('Scrape pre2012 normal site', async () => {
    const url = WEB_URL.pre2012.woodwinds.flute;
    const res = await parseUrl(url);
    expect(res['with_vibrato']).toHaveLength(11);
    expect(res['without_vibrato']).toHaveLength(11);
  });
  test('Scrape pre2012 no header, single column', async () => {
    const url = WEB_URL.pre2012.woodwinds.ebClarinet;
    const res = await parseUrl(url);
    expect(res['default']).toHaveLength(14);
  });
  test('Scrape post2012 multi headers in same column', async () => {
    const url = WEB_URL.pre2012.percussion.handPercussion;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(7);
  });
  test('Scrape pre2012, no headers, multi column', async () => {
    const url = WEB_URL.pre2012.piano.piano;
    const res = await parseUrl(url);
    expect(Object.keys(res).length).toBe(1);
    expect(res['default'].length).toBe(261);
  });
  test('Scrape pre2012 consectutive headers', async () => {
    const url = WEB_URL.pre2012.percussion.cymbals;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(10);
  });

  test('Scrape pre2012 header not in P tag', async () => {
    const url = WEB_URL.pre2012.woodwinds.altoSaxophone;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(2);
    expect(res['with_vibrato']).toHaveLength(9);
    expect(res['without_vibrato']).toHaveLength(9);
  });
});

describe('Scraping post2012 website', () => {
  test('Scrape post2012 normal site', async () => {
    const url = WEB_URL.post2012.strings.cello;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(2);
    expect(res['arco']).toBeTruthy();
    expect(res['pizzicato']).toBeTruthy();
  });

  test('Scrape post2012 no header, single column', async () => {
    const url = WEB_URL.post2012.woodwinds.ebClarinet;
    const res = await parseUrl(url);
    expect(res['default']).toHaveLength(44);
  });

  test('Scrape post2012 multi headers in same column', async () => {
    const url = WEB_URL.post2012.percussion.handPercussion;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(7);
  });

  test('Scrape post2012 consectutive headers', async () => {
    const url = WEB_URL.post2012.percussion.cymbals;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(10);
  });

  test('Scrape post2012 header not in P tag', async () => {
    const url = WEB_URL.post2012.woodwinds.altoSaxophone;
    const res = await parseUrl(url);
    expect(Object.keys(res)).toHaveLength(2);
    expect(res['with_vibrato']).toHaveLength(32);
    expect(res['without_vibrato']).toHaveLength(32);
  });
});
