export function isValidURL(url) {
    const regex = /^https?:\/\/.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
    return regex.test(url);
  }
