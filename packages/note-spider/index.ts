import { parseUrl } from './src/spider';
import { WEB_URL } from './src/constants';
import { saveToLocalStreaming } from './src/download';
import Path from 'path';
import {
  mergeMap,
  of,
  from,
  concatMap,
  bufferCount,
  timer,
  forkJoin,
  map,
  take,
  switchMap,
  tap,
} from 'rxjs';
import { forInRight } from 'lodash';

const BATCH_SIZE = 1;
const BATCH_MIN_TIME = 10_000;
const STORAGE_PATH = Path.resolve(__dirname, 'data');

const transformCategoryObj = <K extends string, V>(
  obj: Record<K, V>,
  parentPath = STORAGE_PATH
  // @TODO resolve type
): { value: any; path: string }[] => {
  return Object.entries(obj).map(([key, value]) => ({
    value: value as V,
    path: Path.join(parentPath, key),
  }));
};

const run = async () => {
  let totalBatch: number = 1;
  let current: number = 1;
  of(WEB_URL)
    .pipe(
      mergeMap((rootCat) => from(transformCategoryObj(rootCat))), // pre2012, post2012
      mergeMap(({ value, path }) => from(transformCategoryObj(value, path))), // woodwinds, brass ...
      mergeMap(({ value, path }) => {
        const allData = transformCategoryObj(value, path) as {
          value: string;
          path: string;
        }[];
        totalBatch = Math.ceil(allData.length / BATCH_SIZE);
        return from(allData);
      }), // flute, altoFlute ...
      bufferCount(BATCH_SIZE),
      concatMap((values) =>
        forkJoin({
          value: from(values).pipe(
            mergeMap(({ path, value }) =>
              parseUrl(value).then((categoryUrls) => ({ path, categoryUrls }))
            ),
            tap(({ categoryUrls, path }) =>
              console.log('Web scraped ', {
                ...forInRight(categoryUrls, (urls) => urls.length),
                path,
              })
            ),
            map(({ categoryUrls, path }) =>
              Object.keys(categoryUrls).map((category) => ({
                urls: categoryUrls[category],
                path: Path.join(path, category),
              }))
            ),
            mergeMap((res) => from(res)),
            map(({ urls, path }) => urls.map((url) => ({ url, path }))),
            mergeMap((res) => from(res)),
            tap(({ url, path }) =>
              console.log('Downloading...', { url, path })
            ),
            mergeMap(({ url, path }) =>
              saveToLocalStreaming(url, path).then(() => ({ url, path }))
            ),
            tap(({ url, path }) =>
              console.log('Downloading finished', { url, path })
            )
          ),
          timeout: timer(BATCH_MIN_TIME).pipe(take(1)),
        }).pipe(tap(() => console.log('Done processing')))
      )
    )
    .subscribe({
      complete: () => console.log('All done'),
      error: (err) => console.error('Error encountered', err),
    });
  // const res = await parseUrl(WEB_URL.pre2012.woodwinds.flute);
  // console.warn({ res });
};

run();
