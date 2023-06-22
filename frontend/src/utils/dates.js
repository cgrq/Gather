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
    let [dateString, timeString] = dateTimeString.split(" ");

    if (dateString.includes("T")) {
      const [datePart, timePart] = dateString.split("T");
      dateString = datePart;
      timeString = timePart.slice(0, 8);
    }

    const [year, month, day] = dateString.split("-");
    const [hours, minutes, seconds] = timeString.split(":");
    const ampm = hours < 12 ? "AM" : "PM";
    const hour12 = hours % 12 || 12;
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const date = newDate.toLocaleDateString();
    const time = `${hour12}:${minutes} ${ampm}`;
    return [date, time];
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
