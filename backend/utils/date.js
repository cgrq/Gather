function padZeros(num) {
    return num.toString().padStart(2, '0');
  }

function formatDate(unformattedDate) {
    const date = new Date(unformattedDate);
    return `${date.getFullYear()}-${padZeros(date.getMonth() + 1)}-${padZeros(date.getDate())} ${padZeros(date.getHours())}:${padZeros(date.getMinutes())}:${padZeros(date.getSeconds())}`;
}

function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
  }

module.exports = {
    formatDate, parseDate
};
