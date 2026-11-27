export type Category =
  | "all"
  | "poultry"
  | "offal"
  | "frozen"
  | "sausage"
  | "delicacy";
export type Temperature = "all" | "chilled" | "frozen";
export interface Product {
  id: string;
  category: Category;
  name: string;
  image: string;
  packaging: string;
  temperatures: Temperature[];
}
export const categories: { id: Category; name: string; image: string }[] = [
  { id: "poultry", name: "Мясо птицы", image: "va-file" },
  { id: "offal", name: "Субпродукты", image: "va-pechenj" },
  { id: "frozen", name: "Полуфабрикаты", image: "pelmeni-klassicheskie" },
  { id: "sausage", name: "Колбасные изделия", image: "kolbasa-domashnyaya" },
  { id: "delicacy", name: "Деликатесы", image: "alpyiskaya-vyrezka" },
];
const rows: [string, Category, string, string, string, Temperature[]][] = [
  [
    "chicken",
    "poultry",
    "Тушка цыплёнка",
    "va-kuritsa",
    "Фирменный пакет · Гофрокороб",
    ["chilled", "frozen"],
  ],
  [
    "fillet",
    "poultry",
    "Филе грудки",
    "va-file",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "thigh",
    "poultry",
    "Бедро цыплёнка",
    "va-bedro",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "drumstick",
    "poultry",
    "Голень цыплёнка",
    "va-golinj",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "wings",
    "poultry",
    "Крылья цыплёнка",
    "va-krylya",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "mince",
    "poultry",
    "Фарш куриный",
    "va-farsh",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "liver",
    "offal",
    "Печень цыплёнка",
    "va-pechenj",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "heart",
    "offal",
    "Сердце цыплёнка",
    "va-serdtse",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "gizzard",
    "offal",
    "Желудки цыплёнка",
    "va-zheludki",
    "Гофрокороб · Подложка",
    ["chilled", "frozen"],
  ],
  [
    "pelmeni",
    "frozen",
    "Пельмени «Классические»",
    "pelmeni-klassicheskie",
    "Полуфабрикаты в тесте",
    ["frozen"],
  ],
  [
    "khinkali",
    "frozen",
    "Хинкали «Домашние»",
    "hinkali-domashnie",
    "Полуфабрикаты в тесте",
    ["frozen"],
  ],
  [
    "vareniki",
    "frozen",
    "Вареники с картофелем",
    "vareniki-kartofel",
    "Полуфабрикаты в тесте",
    ["frozen"],
  ],
  [
    "sausage",
    "sausage",
    "Колбаса «Домашняя»",
    "kolbasa-domashnyaya",
    "Вакуумная упаковка",
    ["chilled"],
  ],
  [
    "ham",
    "sausage",
    "Ветчина куриная",
    "vetchina-kurinaya",
    "Полиамидная оболочка · Батон",
    ["chilled"],
  ],
  [
    "alpine",
    "delicacy",
    "Вырезка «Альпийская»",
    "alpyiskaya-vyrezka",
    "Нарезка · Вакуумная упаковка",
    ["chilled"],
  ],
  [
    "austrian",
    "delicacy",
    "Филе по-австрийски",
    "file-po-avstryiski",
    "Нарезка · Вакуумная упаковка",
    ["chilled"],
  ],
];
export const products: Product[] = rows.map(
  ([id, category, name, image, packaging, temperatures]) => ({
    id,
    category,
    name,
    image,
    packaging,
    temperatures,
  }),
);
export const asset = (name: string) =>
  `${import.meta.env.BASE_URL}assets/${name}`;
