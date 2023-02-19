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
  tap,
  catchError,
  throwError,
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
  let totalBatch = 1;
  let current = 1;
  of(WEB_URL)
    .pipe(
      mergeMap((rootCat) => from(transformCategoryObj(rootCat))), // pre2012, post2012
      mergeMap(({ value, path }) => from(transformCategoryObj(value, path))), // woodwinds, brass ...
      map(
        ({ value, path }) =>
          transformCategoryObj(value, path) as {
            value: string;
            path: string;
          }[]
      ), // flute, altoFlute ...
      tap((data) => {
        totalBatch = Math.ceil(data.length / BATCH_SIZE);
        console.log('Total batch: ', totalBatch);
      }),
      mergeMap((data) => from(data)),
      take(1),
      bufferCount(BATCH_SIZE),
      concatMap((values) => {
        console.log('Processing...: ', current, '/', totalBatch);
        return forkJoin({
          value: from(values).pipe(
            mergeMap(({ path, value }) =>
              parseUrl(value).then((categoryUrls) => ({ path, categoryUrls }))
            ), // each batch, scrape data
            tap(({ categoryUrls, path }) =>
              console.log('Web scraped ', {
                ...forInRight(categoryUrls, (urls) => urls.length),
                path,
              })
            ), // each url contains multiple resource urls
            map(({ categoryUrls, path }) =>
              Object.keys(categoryUrls).map((category) => ({
                urls: categoryUrls[category],
                path: Path.join(path, category),
              }))
            ), // for each resource url
            mergeMap((res) => from(res)),
            map(({ urls, path }) => urls.map((url) => ({ url, path }))),
            mergeMap((res) => from(res)),
            mergeMap(({ url, path }) =>
              saveToLocalStreaming(url, path).then(() => ({ url, path }))
            ),
            tap(({ url, path }) =>
              console.log('Downloading finished', { url, path })
            )
          ),
          timeout: timer(BATCH_MIN_TIME).pipe(take(1)),
        }).pipe(
          catchError((err) => {
            console.warn('Error when processing: ', current, '/', totalBatch);
            return throwError(() => err);
          }),
          tap(() => {
            console.log('Done processing: ', current, '/', totalBatch);
            current += 1;
          })
        );
      })
    )
    .subscribe({
      complete: () => console.log('All done'),
      error: (err) => console.error('Error encountered', err),
    });
};

run();
