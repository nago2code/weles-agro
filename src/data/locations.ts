export type LocationCity = "all" | "nalchik" | "prokhladny";
export interface CompanyLocation {
  id: string;
  city: Exclude<LocationCity, "all">;
  cityName: string;
  address: string;
  kind: string;
  coordinates?: [number, number];
  description: string;
  source?: { name: string; url: string };
}
const nalchikSource =
  "https://urbanplaces.su/ru_kabardino-balkarskaya-respublika/nalchik-gorodskoj-okrug-nalchik/";
export const companyLocations: CompanyLocation[] = [
  {
    id: "ashurova",
    city: "nalchik",
    cityName: "Нальчик",
    address: "ул. Ашурова, 32",
    kind: "Магазин полуфабрикатов",
    coordinates: [43.504116, 43.642766],
    description:
      "В открытом справочнике указан магазин «Велес-Агро». Наличие продукции и возможность покупки уточните перед поездкой.",
    source: {
      name: "UrbanPlaces",
      url: nalchikSource + "card-70000001024610188-veles-agro",
    },
  },
  {
    id: "akhokhova",
    city: "nalchik",
    cityName: "Нальчик",
    address: "ул. Ахохова, 96а",
    kind: "Магазин полуфабрикатов",
    coordinates: [43.491143, 43.610843],
    description:
      "Адрес и расположение взяты из карточки магазина «Велес-Агро» в справочнике. Часы работы и ассортимент уточняйте у компании.",
    source: {
      name: "UrbanPlaces",
      url: nalchikSource + "card-4211221-veles-agro",
    },
  },
  {
    id: "shogenova",
    city: "nalchik",
    cityName: "Нальчик",
    address: "ул. Шогенова, 2а/1",
    kind: "Магазин полуфабрикатов",
    coordinates: [43.487211, 43.664447],
    description:
      "В справочнике указана точка «Велес-Агро» по этому адресу. Актуальность розничных продаж и наличие нужной продукции требуют уточнения.",
    source: {
      name: "UrbanPlaces",
      url: nalchikSource + "card-70000001024610576-veles-agro",
    },
  },
  {
    id: "promyshlennaya",
    city: "prokhladny",
    cityName: "Прохладный",
    address: "ул. Промышленная, 5А",
    kind: "Производственная площадка",
    coordinates: [43.752476, 44.065252],
    description:
      "В справочнике указано производство продуктов питания. Розничные продажи, самовывоз и порядок посещения площадки нужно согласовать с компанией.",
    source: {
      name: "Справбиз",
      url: "https://spravbiz.ru/prohladnyij/company-veles-agro-1/",
    },
  },
  {
    id: "gagarina",
    city: "prokhladny",
    cityName: "Прохладный",
    address: "ул. Гагарина · номер дома уточняется",
    kind: "Адрес уточняется",
    description:
      "Адрес из предоставленного списка. Номер дома, координаты и действующая точка не подтверждены. Поэтому метка на карте не установлена.",
  },
];
export const locationMapUrl = (point: CompanyLocation) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(`Велес-Агро ${point.cityName} ${point.coordinates ? point.address : "улица Гагарина"}`)}`;
