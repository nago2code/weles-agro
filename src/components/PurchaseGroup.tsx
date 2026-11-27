import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useMotionSettings } from "../lib/motion";
interface Props {
  group: { id: string; title: string; items: string[]; matches: string[] };
  searching: boolean;
  onChoose: (title: string) => void;
}
export function PurchaseGroup({ group, searching, onChoose }: Props) {
  const [open, setOpen] = useState(searching);
  const fx = useMotionSettings();
  const regionId = `purchase-group-${group.id}`;
  return <div className={`purchase-group ${open ? "is-open" : ""}`}>
    <h3><button className="purchase-group-toggle" aria-expanded={open} aria-controls={regionId} onClick={() => setOpen(!open)}>
      <span>{group.title}</span>
      <small>{group.items.length ? `${searching ? group.matches.length : group.items.length} поз.` : "По согласованию"}</small>
      <motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }}><Plus size={22}/></motion.span>
    </button></h3>
    <motion.div id={regionId} inert={!open} aria-hidden={!open} initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ ...fx.transition, duration: fx.reduced ? 0 : 0.28 }} style={{ overflow: "hidden" }}>
      <div className="purchase-group-content">{group.items.length ? <ul>{group.matches.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p>Этикетки на тушку, полуфабрикаты и колбасные изделия. Требования к макетам, материалам и тиражу уточните в отделе закупок.</p>}
        <a href="#purchase-offer" className="text-link" onClick={() => onChoose(group.title)}>Предложить поставку <ArrowUpRight size={18}/></a>
      </div>
    </motion.div>
  </div>;
}
