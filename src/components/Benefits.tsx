import { motion } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { asset } from "../data/products";
const benefits = [
  {
    title: "Напрямую.\nБез посредников.",
    text: "Ассортимент и условия закупки обсуждаете с производителем. Прямой контакт с теми, кто выпускает продукцию.",
    link: "Посмотреть ассортимент",
    href: "#catalog",
  },
  {
    title: "Своя логистика.\nПонятный маршрут.",
    text: "Логистическая служба компании организует поставку. Маршрут и график согласуются под ваш заказ.",
    link: "Обсудить доставку",
    href: "#contacts",
  },
  {
    title: "Личный менеджер.\nЕдиный контакт.",
    text: "Помощь с выбором продукции, документами и отгрузкой — в одном диалоге с менеджером компании.",
    link: "Связаться с отделом продаж",
    href: "#contacts",
  },
];
export function Benefits() {
  const fx = useMotionSettings();
  return (
    <section
      id="benefits"
      className="buyer-benefits"
      aria-labelledby="benefits-title"
    >
      <div className="section-wrap buyer-benefits-inner">
        <div className="buyer-benefits-hero">
          <div className="buyer-benefits-copy">
            <h2 id="benefits-title">
              Ближе к производителю.
              <br />
              <span>Проще для бизнеса.</span>
            </h2>
            <p>
              Мясо птицы, полуфабрикаты и деликатесы. Собственное производство,
              логистика и персональный менеджер — для вашей закупки.
            </p>
            <div className="buyer-benefits-actions">
              <a className="button button-dark" href="#catalog">
                Подобрать ассортимент
              </a>
              <a className="buyer-process-link" href="#production">
                Как устроено производство
              </a>
            </div>
          </div>
          <figure className="buyer-product-composition">
            <motion.img
              initial={false}
              whileInView={{ opacity: [0.45, 1], y: fx.reduced ? [0, 0] : [35, 0], rotate: -9 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fx.transition, duration: fx.reduced ? 0.12 : 0.65, delay: fx.reduced ? 0 : 0.0 }}
              className="buyer-pack buyer-pack-chicken"
              src={asset("va-kuritsa.png")}
              alt="Тушка цыплёнка в упаковке"
              loading="lazy"
              width="400"
              height="400"
            />
            <motion.img
              initial={false}
              whileInView={{ opacity: [0.45, 1], y: fx.reduced ? [0, 0] : [35, 0], rotate: 9 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fx.transition, duration: fx.reduced ? 0.12 : 0.65, delay: fx.reduced ? 0 : 0.08 }}
              className="buyer-pack buyer-pack-fillet"
              src={asset("va-file.png")}
              alt="Филе грудки в упаковке"
              loading="lazy"
              width="400"
              height="400"
            />
            <motion.img
              initial={false}
              whileInView={{ opacity: [0.45, 1], y: fx.reduced ? [0, 0] : [35, 0], rotate: -7 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fx.transition, duration: fx.reduced ? 0.12 : 0.65, delay: fx.reduced ? 0 : 0.16 }}
              className="buyer-pack buyer-pack-deli"
              src={asset("alpyiskaya-vyrezka.png")}
              alt="Деликатес «Альпийская» в вакуумной упаковке"
              loading="lazy"
              width="400"
              height="400"
            />
            <figcaption>От мяса птицы до готовой продукции</figcaption>
          </figure>
        </div>
        <div className="buyer-benefits-proof">
          <p>
            Собственные корма.
            <br />
            <strong>Полный цикл производства.</strong>
          </p>
          <p>
            От сырья до готовой продукции — связанные этапы одного предприятия.
          </p>
          <a href="#production" className="text-link">
            Посмотреть производственный цикл
          </a>
        </div>
        <div className="buyer-benefits-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <h3>
                {benefit.title.split("\n").map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <p>{benefit.text}</p>
              <a href={benefit.href}>{benefit.link}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
