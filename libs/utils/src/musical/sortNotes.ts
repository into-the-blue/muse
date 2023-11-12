import { getNoteFrequency } from './getNoteFrequency';
import { sharpToFlat } from './util';

export function sortNotes(notes: string[]) {
  return notes
    .map(sharpToFlat)
    .sort((a, b) => getNoteFrequency(a) - getNoteFrequency(b));
}
