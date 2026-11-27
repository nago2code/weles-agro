import { motion } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useDialogMotion } from "../hooks/useDialogMotion";
import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { asset } from "../data/products";
const documents = [
  { id: "2019-4", title: "Свидетельство «Халяль»", meta: "Архив · 2019–2021" },
  {
    id: "2019-1",
    title: "Приложение к свидетельству",
    meta: "Перечень продукции · приложение № 1",
  },
  { id: "25", title: "Сертификат соответствия", meta: "Архив · 2016–2018" },
];
export function Certificates() {
  const fx = useMotionSettings();
  const [active, setActive] = useState<(typeof documents)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!active) {
      dialog.current?.close();
      return;
    }
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
  useDialogMotion(dialog, Boolean(active));
  return (
    <section id="certificates" className="section-wrap certificates-section">
      <div className="section-heading">
        <h2>
          Качество
          <br />
          <span>в документах.</span>
        </h2>
        <p>
          Сканы из открытого архива компании. <br />
          Документы можно рассмотреть крупнее.
        </p>
      </div>
      <div className="documents-grid">
        {documents.map((doc) => (
          <motion.button
            whileHover={{ y: fx.reduced ? 0 : -4 }}
            whileTap={{ scale: fx.reduced ? 1 : 0.99 }}
            className="document-card"
            key={doc.id}
            onClick={() => setActive(doc)}
          >
            <div className="document-image">
              <img
                src={asset(`documents/${doc.id}.jpg`)}
                alt={`Скан: ${doc.title}`}
                width="225"
                height="317"
                loading="lazy"
              />
              <span>
                <ZoomIn size={20} />
                Рассмотреть
              </span>
            </div>
            <h3>{doc.title}</h3>
            <p>{doc.meta}</p>
          </motion.button>
        ))}
      </div>
      <div className="documents-note">
        <p>
          Это архивные материалы. Актуальные сертификаты и документы на нужную
          продукцию запросите в отделе продаж.
        </p>
        <a href="#contacts" className="text-link">
          Запросить документы
        </a>
      </div>
      <dialog
        ref={dialog}
        className="document-dialog"
        aria-labelledby="document-title"
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <div className="document-viewer">
          <div>
            <h3 id="document-title">{active?.title}</h3>
            <button
              className="icon-button"
              onClick={() => setActive(null)}
              aria-label="Закрыть документ"
              autoFocus
            >
              <X />
            </button>
          </div>
          {active && (
            <img
              src={asset(`documents/${active.id}-full.jpg`)}
              alt={`Полный скан: ${active.title}`}
            />
          )}
          <p>Архивный документ с официального сайта компании.</p>
        </div>
      </dialog>
    </section>
  );
}
