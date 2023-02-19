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
  toArray,
} from 'rxjs';
import { mapValues } from 'lodash';
import fs from 'fs';

const BATCH_SIZE = 10;
const BATCH_MIN_TIME = 3_000;
const CONCURRNET_DOWNLOADING = 20;
const STORAGE_PATH = Path.resolve(__dirname, 'data');
if (fs.existsSync(STORAGE_PATH)) {
  console.log('Removing storage directory...', STORAGE_PATH);
  fs.rmSync(STORAGE_PATH, { recursive: true });
}

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
  let totalUrls = 0;
  let finishedUrls = 0;
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
      toArray(),
      map((v) => v.flat()),
      tap((data) => {
        totalBatch = Math.ceil(data.length / BATCH_SIZE);
        console.log('Data length: ', data.length, 'Total batch: ', totalBatch);
      }),
      mergeMap((data) => from(data)),
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
                ...mapValues(categoryUrls, (urls) => urls.length),
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
            toArray(),
            map((res) => res.flat())
          ),
          timeout: timer(BATCH_MIN_TIME).pipe(take(1)),
        }).pipe(
          map((v) => v.value),
          catchError((err) => {
            console.warn('Error when processing: ', current, '/', totalBatch);
            return throwError(() => err);
          }),
          tap((v) => {
            console.log(`Done scraping: ${v.length}`, current, '/', totalBatch);
            current += 1;
          })
        );
      }),
      tap(
        (
          data: {
            url: string;
            path: string;
          }[]
        ) => {
          totalUrls += data.length;
          console.log(
            'New Urls: ',
            data.length,
            'Current status: ',
            finishedUrls,
            '/',
            totalUrls
          );
        }
      ),
      mergeMap(
        (
          res: {
            url: string;
            path: string;
          }[]
        ) => from(res)
      ),
      mergeMap(
        (
          data: {
            url: string;
            path: string;
          }[]
        ) =>
          from(data).pipe(
            mergeMap(({ url, path }) =>
              saveToLocalStreaming(url, path).then(() => ({ url, path }))
            ),
            tap(({ url, path }) => {
              finishedUrls += 1;
              console.log(
                'Downloading finished',
                { url, path },
                finishedUrls,
                '/',
                totalUrls
              );
            })
          ),
        CONCURRNET_DOWNLOADING
      )
    )
    .subscribe({
      complete: () => console.log('All done'),
      error: (err) => console.error('Error encountered', err),
    });
};

run();
