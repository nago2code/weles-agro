import { motion } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { ProductionCharts } from "./ProductionCharts";
import { asset } from "../data/products";
const stages = [
  {
    title: "Кормовая база",
    short: "Собственные корма",
    text: "Производственный путь начинается с зерна. На предприятии используют комбикорма собственного изготовления.",
    image: "production/6.jpg",
    alt: "Зерновые поля — фотография с сайта Велес Агро",
  },
  {
    title: "Выращивание",
    short: "Выращивание птицы",
    text: "Следующий этап — выращивание птицы. Единый производственный цикл позволяет связать кормление и содержание.",
    image: "production/3.jpg",
    alt: "Птица в производственном помещении — фотография с сайта Велес Агро",
  },
  {
    title: "Переработка",
    short: "Продукт и упаковка",
    text: "Из мяса птицы формируется ассортимент: разделка, полуфабрикаты, колбасные изделия и деликатесы.",
    image: "production/4.jpg",
    alt: "Подготовленная продукция из мяса птицы — фотография с сайта Велес Агро",
  },
  {
    title: "Поставка",
    short: "Отгрузка покупателю",
    text: "Завершает цикл отгрузка. Состав заказа и график доставки согласуются с отделом продаж и логистикой.",
    image: "hero.webp",
    alt: "Концепция фирменной оптовой упаковки Велес Агро",
    concept: true,
  },
];
export function Production() {
  const [active, setActive] = useState(0);
  const fx = useMotionSettings();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function handleStageKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  const stage = stages[active];
  return (
    <section
      id="production"
      className="production-section"
      aria-labelledby="production-title"
    >
      <div className="section-wrap">
        <div className="section-heading">
          <h2 id="production-title">
            От зерна
            <br />
            <span>до вашей поставки.</span>
          </h2>
          <p>
            Исследуйте каждый этап: переключайте сценарии и сравнивайте графики.
          </p>
        </div>
        <div
          className="production-steps"
          role="tablist"
          aria-label="Этапы производственного цикла"
        >
          {stages.map((s, i) => (
            <button
              key={s.title}
              id={`production-tab-${i}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              aria-selected={active === i}
              tabIndex={active === i ? 0 : -1}
              aria-controls="production-detail"
              onKeyDown={(event) => handleStageKey(event, i)}
              onClick={() => setActive(i)}
            >
              <span className="step-number">{i + 1}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
        <div
          id="production-detail"
          className="production-explorer"
          role="tabpanel"
          aria-labelledby={`production-tab-${active}`}
        >
          <div className="production-story">
            <figure>
              <motion.img
                initial={fx.from}
                animate={fx.enter}
                transition={fx.transition}
                key={stage.image}
                src={asset(stage.image)}
                alt={stage.alt}
                loading="lazy"
                width="608"
                height="520"
              />
              {stage.concept && <figcaption>Концепция упаковки</figcaption>}
            </figure>
            <motion.div key={active} initial={fx.from} animate={fx.enter} transition={fx.transition}>
              <p className="production-position">
                Этап {active + 1} из {stages.length}
              </p>
              <h3>{stage.short}</h3>
              <p>{stage.text}</p>
              <a
                href="https://www.weles-agro.ru/#about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                О производстве на сайте компании
              </a>
            </motion.div>
            <div className="production-paging">
              <span>
                Этап {active + 1} / {stages.length}
              </span>
              <button onClick={() => setActive((active + 1) % stages.length)}>
                Следующий этап
              </button>
            </div>
          </div>
          <ProductionCharts stage={active} />
        </div>
      </div>
    </section>
  );
}
