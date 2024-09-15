/**
 * Formats a numerical value into a currency string with two decimal places
 * and appends the currency code.
 *
 * @param amount - The numerical value to format.
 * @param currencyCode - The optional currency code (default is 'USD').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
    return `${amount.toFixed(2)} ${currencyCode}`;
}