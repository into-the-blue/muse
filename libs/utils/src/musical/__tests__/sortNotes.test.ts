import type { NoteLike } from '@muse/types';
import { sortNotes } from '../sortNotes';
test('common case', () => {
  const SET: NoteLike[] = ['C4', 'Gb3', 'D5'];
  expect(sortNotes(SET)).toEqual(['Gb3', 'C4', 'D5']);
});

test('sharp note', () => {
  const SET = ['C4', 'C#4', 'D3', 'D#3'];
  expect(sortNotes(SET)).toEqual(['D3', 'Eb3', 'C4', 'Db4']);
});
