import type { NoteLike } from '@muse/types';
import { Text } from '@muse/ui-native';

type NoteItemProps = {
  note: NoteLike;
};
export const NoteItem = ({ note }: NoteItemProps) => {
  return <Text>{note}</Text>;
};
