function padZeros(num) {
    return num.toString().padStart(2, '0');
  }

function formatDate(unformattedDate) {
    const date = new Date(unformattedDate);
    return `${date.getFullYear()}-${padZeros(date.getMonth() + 1)}-${padZeros(date.getDate())} ${padZeros(date.getHours())}:${padZeros(date.getMinutes())}:${padZeros(date.getSeconds())}`;
}

module.exports = {
    formatDate
};
