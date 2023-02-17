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

const STORAGE_PATH = Path.resolve(__dirname, 'data');

const transformCategoryObj = <K extends string, V>(
  obj: Record<K, V>,
  parentPath = STORAGE_PATH
): { value: V; path: string }[] => {
  return Object.entries(obj).map(([key, value]) => ({
    value: value as V,
    path: Path.join(parentPath, key),
  }));
};

const run = async () => {
  of(WEB_URL)
    .pipe(
      mergeMap((rootCat) => from(transformCategoryObj(rootCat))),
      mergeMap(({ value, path }) => from(transformCategoryObj(value, path))),
      mergeMap(({ value, path }) => from(transformCategoryObj(value, path))),
      bufferCount(5),
      tap((data) => console.log('Start processing', { data })),
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
            switchMap((res) => from(res)),
            map(({ urls, path }) => urls.map((url) => ({ url, path }))),
            switchMap((res) => from(res)),
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
          timeout: timer(15_000).pipe(take(1)),
        })
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
