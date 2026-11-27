import { asset } from "../data/products";
export function Hero({ onOpenRequest }: { onOpenRequest: () => void }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Ваш бизнес.
            <br />
            <span>Наш продукт.</span>
          </h1>
          <p>Мясо птицы и полуфабрикаты оптом напрямую от производителя.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#catalog">
              Выбрать продукцию
            </a>
            <button className="text-link" onClick={onOpenRequest}>
              Подготовить запрос
            </button>
          </div>
          <div className="hero-origin">
            <span className="origin-line" />
            <span>
              Велес Агро
              <br />
              <strong>Кабардино-Балкария</strong>
            </span>
          </div>
        </div>
        <figure className="hero-visual">
          <img
            src={asset("hero.webp")}
            alt="Концепция фирменной упаковки Велес Агро: птица в пакете, лотке и оптовой коробке"
            fetchPriority="high"
          />
          <figcaption>Концепция упаковки</figcaption>
        </figure>
      </section>
      <div className="assortment-strip" aria-label="Направления ассортимента">
        <span>Мясо птицы</span>
        <span>Полуфабрикаты</span>
        <span>Колбасы и деликатесы</span>
      </div>
    </>
  );
}
