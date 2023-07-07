import moment from 'moment-timezone';

export const compareEventDates = (a, b) => {
    const dateA = new Date(
        a.startDate.substring(0, 4), // year
        a.startDate.substring(5, 7) - 1, // month
        a.startDate.substring(8, 10), // day
        a.startDate.substring(11, 13), // hours
        a.startDate.substring(14, 16), // minutes
        a.startDate.substring(17, 19) // seconds
    );
    const dateB = new Date(
        b.startDate.substring(0, 4), // year
        b.startDate.substring(5, 7) - 1, // month
        b.startDate.substring(8, 10), // day
        b.startDate.substring(11, 13), // hours
        b.startDate.substring(14, 16), // minutes
        b.startDate.substring(17, 19) // seconds
    );
    return dateB - dateA;
};


export const seperateDateAndTime = (dateTimeString) => {
    const localDate = moment.utc(dateTimeString).local();

  const formattedDate = localDate.format('LL');
  const formattedTime = localDate.format('h:mm A');

  return [formattedDate, formattedTime];
  };

export function padZeros(num) {
    return num.toString().padStart(2, '0');
}

export function formatDate(unformattedDate) {
    const date = new Date(unformattedDate);
    return `${date.getFullYear()}-${padZeros(date.getMonth() + 1)}-${padZeros(date.getDate())} ${padZeros(date.getHours())}:${padZeros(date.getMinutes())}:${padZeros(date.getSeconds())}`;
}

export function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
}
