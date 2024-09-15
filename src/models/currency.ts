export interface Currency {
    code: string;
    symbol: string;
}

export interface AvailableCurrencies {
    [key: string]: Currency;
}

export const currencies: AvailableCurrencies = {
    PLN: {
        code: 'PLN',
        symbol: 'zł'
    },
    EUR: {
        code: 'EUR',
        symbol: '€'
    },
    USD: {
        code: 'USD',
        symbol: '$'
    }
}