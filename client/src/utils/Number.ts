export const formatNumberWithSuffix = (number: number, threshold: number = 9999) => {
  if (number > threshold) {
    const suffixes = ['', 'k', 'M', 'B', 'T']; // You can extend this array for larger numbers if needed
    const magnitude = Math.floor(Math.log10(number) / 3); // Calculate the magnitude (k, M, B, etc.)
    const suffix = suffixes[magnitude];
    const scaledNumber = number / Math.pow(10, magnitude * 3); // Scale the number
    return `${scaledNumber.toFixed(1)} ${suffix}`; // Display with one decimal place
  }
  return `${number}`; // Return the original number if it's not over the threshold
};
