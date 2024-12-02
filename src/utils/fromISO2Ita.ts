export const fromISO2ITA = (date?: string) => {
  const dateFormat = new Date(date as string);
  const day = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
  const year = dateFormat.getFullYear();

  return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
};
