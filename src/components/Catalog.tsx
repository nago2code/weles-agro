import { motion, AnimatePresence } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import {
  asset,
  categories,
  products,
  type Category,
  type Temperature,
} from "../data/products";
interface Props {
  selection: Record<string, number>;
  onToggle: (id: string) => void;
  onOpenRequest: () => void;
}
export function Catalog({ selection, onToggle, onOpenRequest }: Props) {
  const fx = useMotionSettings();
  const [category, setCategory] = useState<Category>("poultry");
  const [temperature, setTemperature] = useState<Temperature>("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (temperature === "all" || p.temperatures.includes(temperature)) &&
          (!query.trim() ||
            `${p.name} ${p.packaging}`
              .toLocaleLowerCase("ru")
              .includes(query.trim().toLocaleLowerCase("ru"))),
      ),
    [category, temperature, query],
  );
  function reset() {
    setCategory("all");
    setTemperature("all");
    setQuery("");
  }
  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="catalog-title"
    >
      <div className="catalog-heading">
        <h2 id="catalog-title">
          Выбирайте продукт.
          <br />
          <span>Собирайте поставку.</span>
        </h2>
        <p>
          Добавьте нужные позиции в запрос. <br />
          Объёмы можно указать в подборе.
        </p>
      </div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="Категории продукции">
          <div className="category-list">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`category-button ${category === c.id ? "is-active" : ""}`}
                aria-pressed={category === c.id}
                onClick={() => {
                  setCategory(c.id);
                  setTemperature("all");
                }}
              >
                <img
                  src={asset(`${c.image}.png`)}
                  alt=""
                  width="64"
                  height="64"
                />
                <span>{c.name}</span>
              </button>
            ))}
            <button
              className={`category-all ${category === "all" ? "is-active" : ""}`}
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
            >
              Весь ассортимент <span>{products.length}</span>
            </button>
          </div>
          <div className="catalog-help">
            <h3>Подбор под ваши задачи</h3>
            <p>
              Сохраните список и обсудите условия поставки с отделом продаж.
            </p>
            <button className="text-link" onClick={onOpenRequest}>
              Открыть мой запрос
            </button>
          </div>
        </aside>
        <div className="catalog-content">
          <div className="catalog-toolbar">
            <label className="search-field">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">Поиск продукции</span>
              <input
                type="search"
                placeholder="Найти продукт"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCategory("all");
                }}
              />
              {query && (
                <button
                  aria-label="Очистить поиск"
                  onClick={() => setQuery("")}
                >
                  <X size={18} />
                </button>
              )}
            </label>
            <div
              className="temperature-filters"
              role="group"
              aria-label="Температурный режим"
            >
              {(
                [
                  ["all", "Все"],
                  ["chilled", "Охлаждённые"],
                  ["frozen", "Замороженные"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  aria-pressed={temperature === id}
                  className={temperature === id ? "is-active" : ""}
                  onClick={() => setTemperature(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="catalog-meta">
            <h3>
              {query
                ? "Результаты поиска"
                : (categories.find((c) => c.id === category)?.name ??
                  "Весь ассортимент")}
            </h3>
            <span role="status">Позиций: {filtered.length}</span>
          </div>
          <div className="product-grid" style={{ position: "relative" }}>
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((p) => (
                <motion.article layout={fx.reduced ? false : "position"} initial={fx.from} animate={fx.enter} exit={{ opacity: 0, scale: fx.reduced ? 1 : 0.97 }} transition={fx.transition} key={p.id} className="product-card">
                  <div className="product-photo">
                    <motion.img
                      whileHover={{ scale: fx.reduced ? 1 : 1.035 }}
                      transition={fx.transition}
                      src={asset(`${p.image}.png`)}
                      alt={p.name}
                      width="400"
                      height="400"
                      loading="lazy"
                    />
                    {selection[p.id] && (
                      <motion.span initial={{ scale: fx.reduced ? 1 : 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="selected-mark">
                        <Check size={18} />
                        <span className="sr-only">В запросе</span>
                      </motion.span>
                    )}
                  </div>
                  <h4>{p.name}</h4>
                  <p>{p.packaging}</p>
                  <button
                    className={`button product-add ${selection[p.id] ? "is-selected" : ""}`}
                    aria-pressed={Boolean(selection[p.id])}
                    onClick={() => onToggle(p.id)}
                  >
                    {selection[p.id] ? <Check size={17} /> : <Plus size={17} />}
                    {selection[p.id] ? "В запросе" : "В запрос"}
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          {!filtered.length && (
            <motion.div initial={fx.from} animate={fx.enter} className="empty-state">
              <h4>Таких позиций пока нет</h4>
              <p>Измените название или сбросьте фильтры.</p>
              <button className="button button-dark" onClick={reset}>
                Сбросить фильтры
              </button>
            </motion.div>
          )}
          <p className="catalog-note">
            Демонстрационный ассортимент. Доступность, упаковка и температурный
            режим уточняются при заказе.
          </p>
        </div>
      </div>
    </section>
  );
}
