import moment from "moment";

export const GetYearMonth = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  
  return { year, month, day };
};
export const getCheckInCheckOut = (start: Date, end: Date) => {
  const checkIn = new Date(start);
  checkIn.setHours(0, 0, 0, 0);  // Set start time to 00:00:00

  const checkOut = new Date(end);
  checkOut.setHours(23, 59, 59, 999);  // Set end time to 23:59:59

  return { start: checkIn, end: checkOut };
};