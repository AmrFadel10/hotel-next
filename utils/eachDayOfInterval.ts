const eachDayOfInterval = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const disabledDates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  while (start <= end) {
    disabledDates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return disabledDates;
};

export default eachDayOfInterval;
