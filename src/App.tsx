import { useMotionPreference } from "./components/MotionProvider";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Purchase } from "./components/Purchase";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Catalog } from "./components/Catalog";
import { RequestPanel } from "./components/RequestPanel";
import { Brand } from "./components/Brand";
import { Calculator } from "./components/Calculator";
import { Benefits } from "./components/Benefits";
import { Production } from "./components/Production";
import { Certificates } from "./components/Certificates";
import { Contacts } from "./components/Contacts";
import { products } from "./data/products";
import { usePageMotion } from "./hooks/usePageMotion";
const STORAGE_KEY = "weles-demo-3-selection";
function readSelection(): Record<string, number> {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      products
        .filter((p) => Number.isFinite(saved[p.id]) && saved[p.id] > 0)
        .map((p) => [
          p.id,
          Math.min(100000, Math.max(1, Math.round(saved[p.id]))),
        ]),
    );
  } catch {
    return {};
  }
}
function readPrices(): Record<string, string> {
  try {
    const saved = JSON.parse(
      localStorage.getItem("weles-demo-3-prices") ?? "{}",
    );
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      products
        .filter((p) => typeof saved[p.id] === "string")
        .map((p) => [p.id, saved[p.id].slice(0, 14)]),
    );
  } catch {
    return {};
  }
}
export default function App() {
  usePageMotion();
  const motionPreference = useMotionPreference();
  const [selection, setSelection] =
    useState<Record<string, number>>(readSelection);
  const [prices, setPrices] = useState<Record<string, string>>(readPrices);
  const [requestOpen, setRequestOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const isPurchase = /\/purchase(?:\.html)?$/.test(window.location.pathname);
  useEffect(() => { document.title = isPurchase ? "Поставщикам — Велес Агро" : "Велес Агро — продукция для вашего бизнеса"; }, [isPurchase]);
  const count = Object.keys(selection).length;
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
      localStorage.setItem("weles-demo-3-prices", JSON.stringify(prices));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [selection, prices]);
  function toggle(id: string) {
    const removing = Boolean(selection[id]);
    setSelection((current) => {
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
    setAnnouncement(
      `${products.find((p) => p.id === id)?.name}: ${removing ? "убрано из запроса" : "добавлено в запрос"}`,
    );
  }
  const setQuantity = (id: string, n: number) =>
    setSelection((current) => ({
      ...current,
      [id]: Math.min(100000, Math.max(1, Math.round(n))),
    }));
  const remove = (id: string) =>
    setSelection((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  return (
    <>
      <a href={isPurchase ? "#purchase-directions" : "#catalog"} className="skip-link">
        {isPurchase ? "Перейти к направлениям закупок" : "Перейти к каталогу"}
      </a>
      <div id="top" />
      <Header count={count} onOpenRequest={() => setRequestOpen(true)} />
      <main>
        {isPurchase ? <Purchase /> : <>
        <Hero onOpenRequest={() => setRequestOpen(true)} />
        <Catalog
          selection={selection}
          onToggle={toggle}
          onOpenRequest={() => setRequestOpen(true)}
        />
        <Calculator
          selection={selection}
          prices={prices}
          onPrice={(id, value) =>
            setPrices((current) => ({ ...current, [id]: value }))
          }
          onQuantity={setQuantity}
          onAdd={(id) =>
            setSelection((current) => ({ ...current, [id]: current[id] ?? 1 }))
          }
          onRemove={remove}
          onOpenRequest={() => setRequestOpen(true)}
        />
        <Benefits />
        <Production />
        <Certificates />
        <Contacts onOpenRequest={() => setRequestOpen(true)} />
        </>}
      </main>
      <footer className="footer">
        <Brand />
        <p>
          Велес Агро · продукция для вашего бизнеса
          <br />
          <span>Мясо птицы, полуфабрикаты и деликатесы.</span>
        </p>
        <a href="./purchase.html">Поставщикам</a>
        <button className="motion-toggle" aria-pressed={!motionPreference.reduced} onClick={motionPreference.toggle}>
          {motionPreference.reduced ? "Включить анимации" : "Сократить анимации"}
        </button>
        <a href="#top">Наверх</a>
      </footer>
      {!isPurchase && <button
        className="mobile-request button button-dark"
        onClick={() => setRequestOpen(true)}
      >
        <ClipboardList size={20} />
        Мой запрос<span className="count">{count}</span>
      </button>}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {storageWarning && (
        <p className="storage-warning" role="status">
          Браузер не разрешил сохранить подбор. Скачайте список перед закрытием
          страницы.
        </p>
      )}
      <RequestPanel
        open={requestOpen}
        selection={selection}
        prices={prices}
        onClose={() => setRequestOpen(false)}
        onQuantity={(id, n) =>
          setSelection((current) => ({
            ...current,
            [id]: Math.min(100000, Math.max(1, Math.round(n))),
          }))
        }
        onRemove={(id) =>
          setSelection((current) => {
            const next = { ...current };
            delete next[id];
            return next;
          })
        }
        onClear={() => setSelection({})}
      />
    </>
  );
}
