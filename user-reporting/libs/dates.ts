const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _MS_PER_HOUR = 1000 * 60 * 60;

export const dateDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const dateBetween = (start: number | Date, end: number | Date, d: number | Date) => {
  return d.valueOf() > start.valueOf() && d.valueOf() <= end.valueOf();
};

export const addHoursToDate = (a: Date, hours: number) => {
  const dateInMs = a.valueOf();
  const hoursToMs = hours * _MS_PER_HOUR;
  const newMs = dateInMs + hoursToMs;
  return new Date(newMs);
};
