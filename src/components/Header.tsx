import { useMenuScroll } from "../hooks/useMenuScroll";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useState } from "react";
import { Menu, X, ClipboardList } from "lucide-react";
import { Brand } from "./Brand";
interface Props {
  count: number;
  onOpenRequest: () => void;
}
const links = [
  { href: "#catalog", label: "Продукция" },
  { href: "#calculator", label: "Калькулятор" },
  { href: "#production", label: "Производство" },
  { href: "#certificates", label: "Сертификаты" },
  { href: "#contacts", label: "Контакты" },
  { href: "/purchase.html", label: "Поставщикам" },
];
export function Header({ count, onOpenRequest }: Props) {
  const scrollToSection = useMenuScroll();
  const fx = useMotionSettings();
  const [open, setOpen] = useState(false);
  return (
    <header
      className="header"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="header-inner">
        <Brand />
        <span className="brand-description">
          Продукция для
          <br />
          вашего бизнеса
        </span>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map((link) => (
            <a onClick={scrollToSection} key={link.href} href={link.href.startsWith("#") && window.location.pathname !== "/" ? `/${link.href}` : link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className="button button-light header-request"
          onClick={onOpenRequest}
        >
          <ClipboardList size={18} />
          <span>Мой запрос</span>
          <motion.span key={count} initial={{ scale: fx.reduced ? 1 : 0.8 }} animate={{ scale: 1 }} className="count">{count}</motion.span>
        </button>
        <button
          className="menu-toggle"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence initial={false}>
      {open && (
        <motion.nav
          initial={fx.from} animate={fx.enter} exit={{ opacity: 0, y: fx.reduced ? 0 : -8 }} transition={fx.transition}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Мобильная навигация"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href.startsWith("#") && window.location.pathname !== "/" ? `/${link.href}` : link.href} onClick={(event) => { setOpen(false); scrollToSection(event); }}>
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onOpenRequest();
            }}
          >
            Открыть мой запрос ({count})
          </button>
        </motion.nav>
      )}
      </AnimatePresence>
    </header>
  );
}
