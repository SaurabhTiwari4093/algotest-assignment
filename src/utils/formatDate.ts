export const formatDate = (date: string, long: boolean = true): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const inputDate = new Date(date);
  const today = new Date();

  // Extract day, month, and year
  const day = inputDate.getDate();
  const month = months[inputDate.getMonth()];
  const year = inputDate.getFullYear().toString().slice(-2);

  // Calculate the difference in days
  const diffTime = inputDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (long) {
    return `${day} ${month} ${year} (${diffDays} days)`;
  } else {
    return `${day} ${month} (${diffDays}d)`;
  }
};

export const formatDateFut = (date: string): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const inputDate = new Date(date);

  // Extract day, month, and year
  const day = inputDate.getDate();
  const month = months[inputDate.getMonth()];

  return `FUT (${day} ${month})`;
};
