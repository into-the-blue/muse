import type { NoteLike, Notes } from '@muse/types';
const A4_FREQUENCY = 440;

const noteToSemitones = {
  C: -9,
  Db: -8,
  D: -7,
  Eb: -6,
  E: -5,
  F: -4,
  Gb: -3,
  G: -2,
  Ab: -1,
  A: 0,
  Bb: 1,
  B: 2,
};
export function getNoteFrequency(note: NoteLike) {
  const noteName = note.slice(0, -1) as Notes;
  const octave = parseInt(note.slice(-1));
  if (isNaN(octave) || !noteToSemitones[noteName]) {
    throw new Error(`Invalid note: ${note}`);
  }
  const semitonesFromA4 = noteToSemitones[noteName] + (octave - 4) * 12;

  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
}
