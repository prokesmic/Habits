export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "BRL" | "INR";

const currencies: { code: Currency; symbol: string; name: string; exchangeRate: number }[] = [
  { code: "USD", symbol: "$", name: "US Dollar", exchangeRate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", exchangeRate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", exchangeRate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", exchangeRate: 149.5 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", exchangeRate: 7.24 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", exchangeRate: 4.97 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", exchangeRate: 83.12 },
];

export const useCurrency = (userCurrency: Currency = "USD", userLocale = "en-US") => {
  const fmt = (amountInUSD: number) => {
    const currency = currencies.find((c) => c.code === userCurrency)!;
    const converted = amountInUSD * currency.exchangeRate;
    return new Intl.NumberFormat(userLocale, { style: "currency", currency: currency.code }).format(converted);
  };
  const toUSD = (amount: number) => {
    const currency = currencies.find((c) => c.code === userCurrency)!;
    return amount / currency.exchangeRate;
  };
  return { formatAmount: fmt, convertToUSD: toUSD, userCurrency };
};


