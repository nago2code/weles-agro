// Illustrative scenarios adapted from demo-2. These are not enterprise measurements.
export const feedIngredients = [
  {
    name: "Кукуруза",
    color: "#ff9560",
    note: "Выбранная зерновая составляющая демонстрационного рациона.",
  },
  {
    name: "Растительный жмых",
    color: "#b3c79d",
    note: "Растительная составляющая. Доля меняется при переключении фазы.",
  },
  {
    name: "Пшеница",
    color: "#e6d29c",
    note: "Вторая зерновая составляющая в условной структуре корма.",
  },
  {
    name: "Масло и премикс",
    color: "#94a99b",
    note: "Дополнительные компоненты демонстрационной рецептуры.",
  },
];
export const feedPhases = [
  { name: "Старт", period: "1–14 дней", shares: [48, 30, 16, 6] },
  { name: "Рост", period: "15–28 дней", shares: [54, 25, 15, 6] },
  { name: "Финиш", period: "29–40 дней", shares: [60, 20, 14, 6] },
];
export const growth = [
  { day: 1, weight: 0.044, temperature: 33 },
  { day: 7, weight: 0.19, temperature: 30.2 },
  { day: 14, weight: 0.495, temperature: 27.5 },
  { day: 21, weight: 0.98, temperature: 24.8 },
  { day: 28, weight: 1.56, temperature: 22.4 },
  { day: 35, weight: 2.14, temperature: 20.8 },
  { day: 40, weight: 2.52, temperature: 20 },
];
export const cooling = [
  { minute: 0, air: 38.5, water: 38.5 },
  { minute: 20, air: 24, water: 21 },
  { minute: 40, air: 13.5, water: 11.5 },
  { minute: 60, air: 7.2, water: 6.4 },
  { minute: 90, air: 2.6, water: 3.1 },
  { minute: 120, air: 1.4, water: 2.2 },
];
export const routes = [
  {
    name: "Краснодар",
    hours: [0, 2, 4, 6, 8],
    chilled: [1.1, 1.3, 1.2, 1.4, 1.2],
    frozen: [-18.6, -18.5, -18.7, -18.4, -18.5],
  },
  {
    name: "Ростов-на-Дону",
    hours: [0, 3, 6, 9, 11],
    chilled: [1, 1.2, 1.4, 1.3, 1.2],
    frozen: [-18.8, -18.6, -18.5, -18.6, -18.5],
  },
  {
    name: "Москва",
    hours: [0, 7, 14, 21, 28],
    chilled: [0.9, 1.2, 1.3, 1.2, 1.1],
    frozen: [-19, -18.7, -18.6, -18.5, -18.6],
  },
];
