import { PurchaseGroup } from "./PurchaseGroup";
import { useState } from "react";
import { ArrowUpRight, Search, Mail, Phone } from "lucide-react";
import { purchaseGroups } from "../data/purchase";
const source = "https://www.weles-agro.ru/purchase.html";
export function Purchase() {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState("");
  const term = query.trim().toLocaleLowerCase("ru");
  const groups = purchaseGroups.map(group => ({ ...group,
    matches: group.title.toLocaleLowerCase("ru").includes(term)
      ? group.items : group.items.filter(item => item.toLocaleLowerCase("ru").includes(term)),
  })).filter(group => !term || group.matches.length || group.title.toLocaleLowerCase("ru").includes(term));
  const body = `Здравствуйте!\n\nПредлагаем поставку${direction ? ` по направлению «${direction}»` : ""}.\n\nКомпания:\nПродукция и характеристики:\nЦена и условия оплаты:\nОбъём и сроки поставки:\nКонтактное лицо и телефон:\n\nКоммерческое предложение приложено к письму.`;
  return <>
    <section className="purchase-hero section-wrap" aria-labelledby="purchase-title">
      <a href="./" className="text-link">Главная / Поставщикам</a>
      <div className="purchase-intro">
        <h1 id="purchase-title">Ваше сырьё.<br/><span>Наше производство.</span></h1>
        <div><p>Приглашаем поставщиков товаров и материалов для производства Велес Агро.</p><a href="#purchase-directions" className="button button-dark">Посмотреть направления <ArrowUpRight size={18}/></a></div>
      </div>
      <div className="purchase-hero-bottom"><span>Отдел закупок</span><a href="tel:+79995177777">8 (999) 517-77-77</a><a href="mailto:weles-agro-snab@mail.ru">weles-agro-snab@mail.ru <ArrowUpRight size={18}/></a></div>
    </section>
    <section className="section-wrap purchase-directions" id="purchase-directions" aria-labelledby="purchase-directions-title">
      <div className="section-heading"><h2 id="purchase-directions-title">Что нужно<br/><span>производству.</span></h2><p>Выберите направление или найдите материал по названию. Номенклатура приведена по официальному сайту; текущую потребность уточняйте в отделе закупок.</p></div>
      <label className="purchase-search"><Search size={20}/><span className="sr-only">Поиск по закупкам</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Например, пшеница или оболочка"/>{query && <button onClick={()=>setQuery("")}>Сбросить</button>}</label>
      <p className="purchase-results" role="status">{term ? `Найдено направлений: ${groups.length}` : "6 направлений для сотрудничества"}</p>
      <div className="purchase-groups">{groups.map(group => <PurchaseGroup key={`${group.id}-${term ? "search" : "all"}`} group={group} searching={Boolean(term)} onChoose={setDirection}/>)}</div>
      {!groups.length && <div className="purchase-empty"><h3>Такого материала в перечне нет</h3><p>Попробуйте другое название или обсудите своё предложение с отделом закупок.</p><button className="button button-dark" onClick={()=>setQuery("")}>Показать все направления</button></div>}
      <p className="purchase-source">Названия и состав перечней сохранены из источника. Количество рассчитано по опубликованным позициям. <a href={source} target="_blank" rel="noreferrer">Официальная страница закупок</a> · Проверено 26.11.2026.</p>
    </section>
    <section className="purchase-offer" id="purchase-offer" aria-labelledby="purchase-offer-title"><div className="section-wrap purchase-offer-layout">
      <div><h2 id="purchase-offer-title">Есть предложение?<br/><span>Давайте обсудим.</span></h2><p>Напишите в отдел снабжения. Укажите характеристики продукции, стоимость, доступные объёмы и условия доставки.</p><a className="purchase-email" href="mailto:weles-agro-snab@mail.ru">weles-agro-snab@mail.ru <ArrowUpRight/></a></div>
      <div className="purchase-compose"><label htmlFor="purchase-direction">Направление поставки</label><select id="purchase-direction" value={direction} onChange={e=>setDirection(e.target.value)}><option value="">Выберите направление</option>{purchaseGroups.map(group=><option key={group.id}>{group.title}</option>)}</select><a className="button button-dark" href={`mailto:weles-agro-snab@mail.ru?subject=${encodeURIComponent(`Коммерческое предложение${direction ? `: ${direction}` : ""}`)}&body=${encodeURIComponent(body)}`}><Mail size={18}/>Подготовить письмо</a><p>Откроется ваша почтовая программа с шаблоном. Приложите коммерческое предложение и отправьте письмо.</p><a href="tel:+79995177777" className="text-link"><Phone size={16}/> 8 (999) 517-77-77</a></div>
    </div></section>
    <div className="section-wrap purchase-legal"><p>Информация о закупках не является объявлением торгов, тендером, публичным конкурсом или офертой и не создаёт обязательств до заключения договора. Компания самостоятельно выбирает контрагентов.</p><a href={source} target="_blank" rel="noreferrer">Полные условия на официальном сайте <ArrowUpRight size={16}/></a></div>
  </>;
}
