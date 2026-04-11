import { Timestamp } from 'firebase/firestore';

type TimestampLike = Timestamp | Date | string | number | null | undefined;

export function toDate(value: TimestampLike): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  if (typeof (value as Timestamp).toDate === 'function') return (value as Timestamp).toDate();
  return new Date();
}
