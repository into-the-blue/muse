import type { NoteLike } from '@muse/types';
export const sharpToFlat = (note: string): NoteLike => {
  const noteName = note.slice(0, -1);
  const octave = note.slice(-1);
  const sharpToFlatMap = {
    'C#': 'Db',
    'D#': 'Eb',
    'E#': 'F',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
    'B#': 'C',
  };
  const sharpNote =
    sharpToFlatMap[noteName as keyof typeof sharpToFlatMap] ?? noteName;
  if (isNaN(parseInt(octave))) {
    throw new Error(`Invalid note: ${note}`);
  }
  return (sharpNote + octave) as NoteLike;
};
