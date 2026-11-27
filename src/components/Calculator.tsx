import { motion } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useState } from "react";
import { Plus, Trash2, Calculator as CalculatorIcon } from "lucide-react";
import { products } from "../data/products";
import { formatMoney, lineCost } from "../lib/estimate";
interface Props {
  selection: Record<string, number>;
  prices: Record<string, string>;
  onPrice: (id: string, value: string) => void;
  onQuantity: (id: string, value: number) => void;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenRequest: () => void;
}
export function Calculator({
  selection,
  prices,
  onPrice,
  onQuantity,
  onAdd,
  onRemove,
  onOpenRequest,
}: Props) {
  const fx = useMotionSettings();
  const [addId, setAddId] = useState("");
  const selected = products.filter((p) => selection[p.id]);
  const available = products.filter((p) => !selection[p.id]);
  const calculated = selected.map((p) => ({
    ...p,
    cost: lineCost(selection[p.id], prices[p.id] ?? ""),
  }));
  const pricedCount = calculated.filter((p) => p.cost !== null).length;
  const total =
    calculated.reduce((sum, p) => sum + Math.round((p.cost ?? 0) * 100), 0) /
    100;
  return (
    <section
      id="calculator"
      className="calculator-section section-wrap"
      aria-labelledby="calculator-title"
    >
      <div className="section-heading">
        <h2 id="calculator-title">
          Посчитайте
          <br />
          <span>будущую поставку.</span>
        </h2>
        <p>
          Ваш ассортимент, ваши объёмы. <br />
          Введите цены из полученного прайса.
        </p>
      </div>
      <div className="calculator-layout">
        <div className="calculator-editor">
          <div className="calculator-add">
            <label>
              <span>Добавить продукцию</span>
              <select
                value={available.some((p) => p.id === addId) ? addId : ""}
                onChange={(e) => setAddId(e.target.value)}
              >
                <option value="">Выберите позицию</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button button-dark"
              disabled={!available.some((p) => p.id === addId)}
              onClick={() => {
                onAdd(addId);
                setAddId("");
              }}
            >
              <Plus size={18} />
              Добавить
            </button>
          </div>
          {selected.length ? (
            <div className="calculation-lines">
              {calculated.map((p) => (
                <motion.div layout={fx.reduced ? false : "position"} initial={fx.from} animate={fx.enter} transition={fx.transition} className="calculation-line" key={p.id}>
                  <div className="calculation-product">
                    <h3>{p.name}</h3>
                    <button
                      className="icon-button"
                      aria-label={`Удалить из расчёта: ${p.name}`}
                      onClick={() => onRemove(p.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="calculation-fields">
                    <label>
                      <span>Объём, кг</span>
                      <input
                        aria-label={`Объём в калькуляторе: ${p.name}`}
                        type="number"
                        min="1"
                        max="100000"
                        step="1"
                        value={selection[p.id]}
                        onChange={(e) => {
                          if (Number.isFinite(e.target.valueAsNumber))
                            onQuantity(p.id, e.target.valueAsNumber);
                        }}
                      />
                    </label>
                    <label>
                      <span>Цена за кг, ₽</span>
                      <input
                        aria-label={`Цена за кг: ${p.name}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="Из прайса"
                        maxLength={14}
                        value={prices[p.id] ?? ""}
                        aria-invalid={Boolean(prices[p.id]) && p.cost === null}
                        onChange={(e) => onPrice(p.id, e.target.value)}
                      />
                      {prices[p.id] && p.cost === null && (
                        <small className="field-error">
                          Цена от 0,01 до 1 000 000 ₽, до двух знаков после
                          запятой.
                        </small>
                      )}
                    </label>
                    <div className="line-result">
                      <span>Стоимость</span>
                      <strong>
                        {p.cost === null ? "Нужна цена" : formatMoney(p.cost)}
                      </strong>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="calculator-empty">
              <CalculatorIcon size={32} strokeWidth={1.5} />
              <h3>Начните с одной позиции</h3>
              <p>
                Выберите продукт выше или добавьте товары в каталоге. Они
                появятся в расчёте автоматически.
              </p>
            </div>
          )}
        </div>
        <aside className="calculation-summary">
          <div>
            <h3>Предварительный расчёт</h3>
            <p>
              Цены вводите вы. Это расчёт по вашему прайсу, а не публичное
              предложение.
            </p>
          </div>
          <div className="estimate-total" aria-live="polite" aria-atomic="true">
            <span>
              {pricedCount && pricedCount < selected.length
                ? "Сумма заполненных позиций"
                : "Стоимость продукции"}
            </span>
            <strong>{pricedCount ? formatMoney(total) : "—"}</strong>
            <p>
              {selected.length
                ? `Рассчитано ${pricedCount} из ${selected.length} позиций`
                : "Добавьте продукцию для расчёта"}
            </p>
          </div>
          <p className="estimate-note">
            Доставка не включена. Состав цены и окончательные условия подтвердит
            отдел продаж.
          </p>
          <button className="button button-orange" onClick={onOpenRequest}>
            Открыть подбор ({selected.length})
          </button>
          <a className="text-link" href="#contacts">
            Уточнить цены и доставку
          </a>
        </aside>
      </div>
    </section>
  );
}
