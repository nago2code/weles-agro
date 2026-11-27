import { Phone, Mail, MapPin } from "lucide-react";
import { ContactLocations } from "./ContactLocations";
export function Contacts({ onOpenRequest }: { onOpenRequest: () => void }) {
  return (
    <section id="contacts" className="contacts-section">
      <div className="section-wrap contacts-layout">
        <div className="contacts-intro">
          <h2>
            Обсудим
            <br />
            вашу поставку.
          </h2>
          <p>Уточните ассортимент, цены и документы напрямую у компании.</p>
          <a className="contact-phone" href="tel:+79995177777">
            8 (999) 517-77-77
          </a>
          <a className="contact-email" href="mailto:weles-agro-sbit@mail.ru">
            weles-agro-sbit@mail.ru
          </a>
        </div>
        <div className="contact-details">
          <div>
            <MapPin size={22} />
            <div>
              <h3>Производственный комплекс</h3>
              <address>
                361016, Россия, Кабардино-Балкарская Республика, Прохладненский
                район, х. Матвеевский
              </address>
              <a
                href="https://yandex.ru/maps/?text=%D0%92%D0%B5%D0%BB%D0%B5%D1%81%20%D0%90%D0%B3%D1%80%D0%BE%20%D1%85%D1%83%D1%82%D0%BE%D1%80%20%D0%9C%D0%B0%D1%82%D0%B2%D0%B5%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Найти на карте
              </a>
            </div>
          </div>
          <div>
            <Phone size={22} />
            <div>
              <h3>Дополнительный телефон</h3>
              <a href="tel:+78006007005">8 (800) 600-70-05</a>
            </div>
          </div>
          <div>
            <Mail size={22} />
            <div>
              <h3>Начните с подбора</h3>
              <p>
                Соберите позиции и объёмы. Готовый список можно скачать и
                приложить к письму.
              </p>
              <button className="button button-dark" onClick={onOpenRequest}>
                Открыть мой запрос
              </button>
            </div>
          </div>
          <a
            className="contacts-source"
            href="https://www.weles-agro.ru/#contacts"
            target="_blank"
            rel="noopener noreferrer"
          >
            Контакты на официальном сайте
          </a>
        </div>
      </div>
      <div className="locations-section">
        <ContactLocations />
      </div>
    </section>
  );
}
