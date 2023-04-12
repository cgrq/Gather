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
    const [dateString, timeString] = dateTimeString.split(" ");
    const [year, month, day] = dateString.split("-");
    const [hours, minutes, seconds] = timeString.split(":");
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const date = newDate.toLocaleDateString();
    const time = newDate.toLocaleTimeString();
    return [date,time];
}
