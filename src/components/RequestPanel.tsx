import { useDialogMotion } from "../hooks/useDialogMotion";
import { useEffect, useRef, useState } from "react";
import { Download, Trash2, X } from "lucide-react";
import { asset, products } from "../data/products";
import { lineCost, formatMoney } from "../lib/estimate";
interface Props {
  open: boolean;
  selection: Record<string, number>;
  prices: Record<string, string>;
  onClose: () => void;
  onQuantity: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}
export function RequestPanel({
  open,
  selection,
  prices,
  onClose,
  onQuantity,
  onRemove,
  onClear,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [exported, setExported] = useState(false);
  const selected = products.filter((p) => selection[p.id]);
  useEffect(() => {
    const el = dialog.current;
    if (open && el && !el.open) {
      el.showModal();
      setExported(false);
    } else if (!open && el?.open) el.close();
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  useDialogMotion(dialog, open);
  function download() {
    const text = [
      "ВЕЛЕС АГРО — ПОДБОР ПРОДУКЦИИ",
      "",
      ...selected.map((p) => {
        const cost = lineCost(selection[p.id], prices[p.id] ?? "");
        return `${p.name} — ${selection[p.id]} кг${cost !== null ? ` × ${prices[p.id]} ₽/кг = ${formatMoney(cost)}` : " — цена не указана"}`;
      }),
      "Цены введены покупателем. Доставка не включена.",
      "",
      "Демонстрационный список. Данные менеджеру не отправлены.",
      "Объёмы указаны покупателем; условия и доступность требуют согласования.",
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "Велес-Агро-подбор.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported(true);
  }
  return (
    <dialog
      className="request-dialog"
      ref={dialog}
      aria-labelledby="request-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="request-panel">
        <div className="request-top">
          <div>
            <h2 id="request-title">Мой запрос</h2>
            <p>Позиций: {selected.length}</p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Закрыть запрос"
            autoFocus
          >
            <X />
          </button>
        </div>
        <div className="request-body">
          {selected.length ? (
            <>
              <p className="request-intro">
                Укажите ориентировочный объём для каждой позиции. Подбор
                сохраняется на этом устройстве.
              </p>
              <ul className="request-items">
                {selected.map((p) => (
                  <li key={p.id}>
                    <img
                      src={asset(`${p.image}.png`)}
                      alt=""
                      width="70"
                      height="70"
                    />
                    <div>
                      <h3>{p.name}</h3>
                      <label className="quantity-field">
                        <span className="sr-only">Объём: {p.name}</span>
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          step="1"
                          value={selection[p.id]}
                          onChange={(e) => {
                            const n = e.target.valueAsNumber;
                            if (Number.isFinite(n)) onQuantity(p.id, n);
                          }}
                        />{" "}
                        кг
                      </label>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={`Убрать: ${p.name}`}
                      onClick={() => onRemove(p.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <button className="text-link clear-selection" onClick={onClear}>
                Очистить подбор
              </button>
            </>
          ) : (
            <div className="request-empty">
              <h3>Начните с продукции</h3>
              <p>
                Добавьте товары из каталога. Затем здесь можно будет указать
                объёмы и скачать список.
              </p>
              <button
                className="button button-dark"
                onClick={() => {
                  onClose();
                  document.getElementById("catalog")?.scrollIntoView();
                }}
              >
                Перейти в каталог
              </button>
            </div>
          )}
        </div>
        <div className="request-bottom">
          <button
            className="button button-orange"
            disabled={!selected.length}
            onClick={download}
          >
            <Download size={18} />
            Скачать подбор
          </button>
          <p role="status">
            {exported
              ? "Список скачан. Менеджеру он не отправлен."
              : "Демо: список можно скачать. Отправка менеджеру пока не подключена."}
          </p>
        </div>
      </div>
    </dialog>
  );
}
