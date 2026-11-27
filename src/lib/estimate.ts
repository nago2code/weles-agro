export function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 && number <= 1000000
    ? number
    : null;
}
export function lineCost(quantity: number, price: string): number | null {
  const parsed = parsePrice(price);
  return parsed !== null && Number.isFinite(quantity) && quantity > 0
    ? Math.round(quantity * Math.round(parsed * 100)) / 100
    : null;
}
export const formatMoney = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(value);
