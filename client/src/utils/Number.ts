export const formatNumberWithSuffix = (number: number): string => {
  if (number > 9999) {
    const suffixes: string[] = ['', 'k', 'M', 'B', 'T']; // You can extend this array for larger numbers if needed
    const magnitude: number = Math.floor(Math.log10(number) / 3); // Calculate the magnitude (k, M, B, etc.)
    const suffix: string = suffixes[magnitude];
    const scaledNumber: number = number / Math.pow(10, magnitude * 3); // Scale the number
    return `${scaledNumber.toFixed(1)}${suffix}`; // Display with one decimal place
  }
  return `${number}`; // Return the original number if it's not over 9999
};
