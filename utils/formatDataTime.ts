// 시간 포맷 함수
// Mar 26, 2025
// 12:40 PM

export const formatDateTime = (date: Date) => {
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
    date
  );
  const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
    date
  );

  return { formattedDate, formattedTime };
};
