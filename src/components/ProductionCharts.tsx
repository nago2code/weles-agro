import { motion } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  cooling,
  feedIngredients,
  feedPhases,
  growth,
  routes,
} from "../data/production";
const number = (value: number) =>
  value.toLocaleString("ru-RU", { maximumFractionDigits: 3 });
interface Point {
  x: number;
  y: number;
}
interface PlotProps {
  points: Point[];
  comparison?: Point[];
  selected: number;
  onSelect: (index: number) => void;
  min: number;
  max: number;
  unit: string;
  xUnit: string;
  label: string;
}
function LinePlot({
  points,
  comparison,
  selected,
  onSelect,
  min,
  max,
  unit,
  xUnit,
  label,
}: PlotProps) {
  const fx = useMotionSettings();
  const xMin = points[0].x;
  const xMax = points[points.length - 1].x;
  const x = (value: number) => 54 + ((value - xMin) / (xMax - xMin)) * 492;
  const y = (value: number) => 210 - ((value - min) / (max - min)) * 170;
  const path = (series: Point[]) =>
    series
      .map((point, i) => `${i ? "L" : "M"}${x(point.x)},${y(point.y)}`)
      .join(" ");
  const current = points[selected];
  return (
    <svg
      className="process-plot"
      viewBox="0 0 580 270"
      role="group"
      aria-label={label}
    >
      {[0, 1, 2, 3, 4].map((tick) => {
        const value = min + ((max - min) * tick) / 4;
        return (
          <g key={tick} aria-hidden="true">
            <line
              className="plot-grid"
              x1="54"
              x2="546"
              y1={y(value)}
              y2={y(value)}
            />
            <text x="43" y={y(value) + 4} textAnchor="end">
              {number(Math.round(value * 10) / 10)}
            </text>
          </g>
        );
      })}
      <text x="54" y="19" className="plot-unit" aria-hidden="true">
        {unit}
      </text>
      <path
        className="plot-area"
        d={`${path(points)} L546,210 L54,210 Z`}
        aria-hidden="true"
      />
      {comparison && (
        <path
          className="plot-comparison"
          d={path(comparison)}
          aria-hidden="true"
        />
      )}
      <motion.path className="plot-line" initial={{ pathLength: fx.reduced ? 1 : 0 }} animate={{ pathLength: 1, d: path(points) }} d={path(points)} transition={{ ...fx.transition, duration: fx.reduced ? 0.12 : 0.5 }} aria-hidden="true" />
      <motion.line
        className="plot-cursor"
        animate={{ x1: x(current.x), x2: x(current.x) }}
        transition={{ duration: fx.reduced ? 0 : 0.15 }}
        y1="36"
        y2="210"
        aria-hidden="true"
      />
      {points.map((point, i) => (
        <g
          key={point.x}
          role="button"
          tabIndex={0}
          aria-label={`${xUnit}: ${number(point.x)}, ${number(point.y)} ${unit}`}
          aria-pressed={selected === i}
          onClick={() => onSelect(i)}
          onFocus={() => onSelect(i)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(i);
            }
          }}
          className="plot-point"
        >
          <rect
            x={x(point.x) - 20}
            y="20"
            width="40"
            height="225"
            fill="transparent"
          />
          <circle
            className={selected === i ? "is-current" : ""}
            cx={x(point.x)}
            cy={y(point.y)}
            r={selected === i ? 6 : 4}
          />
          <text x={x(point.x)} y="235" textAnchor="middle" aria-hidden="true">
            {number(point.x)}
          </text>
        </g>
      ))}
      <text
        x="546"
        y="261"
        textAnchor="end"
        className="plot-unit"
        aria-hidden="true"
      >
        {xUnit}
      </text>
    </svg>
  );
}
function ChartOptions<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="chart-options" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
export function ProductionCharts({ stage }: { stage: number }) {
  const fx = useMotionSettings();
  const [phaseIndex, setPhaseIndex] = useState(2);
  const [ingredientIndex, setIngredientIndex] = useState(0);
  const [growthIndex, setGrowthIndex] = useState(6);
  const [growthMetric, setGrowthMetric] = useState<"weight" | "temperature">(
    "weight",
  );
  const [coolingIndex, setCoolingIndex] = useState(5);
  const [comparison, setComparison] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);
  const [cargo, setCargo] = useState<"chilled" | "frozen">("chilled");
  const [checkpoint, setCheckpoint] = useState(4);
  const phase = feedPhases[phaseIndex];
  let content;
  if (stage === 0)
    content = (
      <>
        <div className="chart-title-row">
          <h3>
            Состав корма
            <br />
            по фазам выращивания
          </h3>
          <span className="chart-period">{phase.period}</span>
        </div>
        <ChartOptions
          label="Фаза кормления"
          value={String(phaseIndex)}
          options={feedPhases.map((p, i) => ({
            value: String(i),
            label: p.name,
          }))}
          onChange={(value) => setPhaseIndex(Number(value))}
        />
        <div
          className="feed-stack"
          aria-label={`Состав рациона, фаза ${phase.name}`}
        >
          {phase.shares.map((share, i) => (
            <motion.div
              key={feedIngredients[i].name}
              initial={false}
              animate={{ width: `${share}%` }}
              transition={{ ...fx.transition, duration: fx.reduced ? 0 : 0.32 }}
              style={{
                backgroundColor: feedIngredients[i].color,
              }}
              aria-hidden="true"
            >
              {share >= 10 ? `${share}%` : ""}
            </motion.div>
          ))}
        </div>
        <div
          className="feed-legend"
          role="group"
          aria-label="Компоненты рациона"
        >
          {feedIngredients.map((ingredient, i) => (
            <button
              key={ingredient.name}
              aria-pressed={ingredientIndex === i}
              onClick={() => setIngredientIndex(i)}
            >
              <span
                className="feed-dot"
                style={{ backgroundColor: ingredient.color }}
              />
              <span>{ingredient.name}</span>
              <strong>{phase.shares[i]}%</strong>
            </button>
          ))}
        </div>
        <div className="chart-insight" role="status">
          <span>{feedIngredients[ingredientIndex].name}</span>
          <strong>
            {phase.shares[ingredientIndex]}
            <small>%</small>
          </strong>
          <p>{feedIngredients[ingredientIndex].note}</p>
        </div>
      </>
    );
  else if (stage === 1) {
    const point = growth[growthIndex];
    const isWeight = growthMetric === "weight";
    content = (
      <>
        <div className="chart-title-row">
          <h3>
            Динамика
            <br />
            выращивания
          </h3>
          <span className="chart-period">40 дней · пример</span>
        </div>
        <ChartOptions
          label="Показатель выращивания"
          value={growthMetric}
          options={[
            { value: "weight", label: "Масса птицы" },
            { value: "temperature", label: "Микроклимат" },
          ]}
          onChange={setGrowthMetric}
        />
        <LinePlot
          points={growth.map((p) => ({ x: p.day, y: p[growthMetric] }))}
          selected={growthIndex}
          onSelect={setGrowthIndex}
          min={isWeight ? 0 : 15}
          max={isWeight ? 3 : 35}
          unit={isWeight ? "кг" : "°C"}
          xUnit="День"
          label={`Демонстрационный график: ${isWeight ? "масса птицы" : "температура в помещении"} по дням`}
        />
        <label className="chart-slider">
          <span>
            День выращивания <strong>{point.day}</strong>
          </span>
          <input
            type="range"
            min="0"
            max={growth.length - 1}
            step="1"
            value={growthIndex}
            aria-label="День выращивания"
            aria-valuetext={`День ${point.day}`}
            onChange={(e) => setGrowthIndex(Number(e.target.value))}
          />
        </label>
        <div className="chart-readout" role="status">
          <div>
            <span>Масса в модели</span>
            <strong>
              {number(point.weight)} <small>кг</small>
            </strong>
          </div>
          <div>
            <span>Температура в модели</span>
            <strong>
              {number(point.temperature)} <small>°C</small>
            </strong>
          </div>
        </div>
      </>
    );
  } else if (stage === 2) {
    const point = cooling[coolingIndex];
    content = (
      <>
        <div className="chart-title-row">
          <h3>
            Изменение температуры
            <br />
            при охлаждении
          </h3>
          <span className="chart-period">120 минут · пример</span>
        </div>
        <button
          className="comparison-toggle"
          aria-pressed={comparison}
          onClick={() => setComparison(!comparison)}
        >
          <span className="comparison-check" aria-hidden="true">
            {comparison && <Check size={14} />}
          </span>
          Сравнить два способа охлаждения
        </button>
        <LinePlot
          points={cooling.map((p) => ({ x: p.minute, y: p.air }))}
          comparison={
            comparison
              ? cooling.map((p) => ({ x: p.minute, y: p.water }))
              : undefined
          }
          selected={coolingIndex}
          onSelect={setCoolingIndex}
          min={0}
          max={40}
          unit="°C"
          xUnit="Минуты"
          label="Демонстрационный график снижения температуры при охлаждении"
        />
        <div className="plot-legend">
          <span>
            <i />
            Воздушное охлаждение
          </span>
          {comparison && (
            <span>
              <i className="comparison-swatch" />
              Водяное охлаждение
            </span>
          )}
        </div>
        <label className="chart-slider">
          <span>
            Время охлаждения <strong>{point.minute} мин</strong>
          </span>
          <input
            type="range"
            min="0"
            max={cooling.length - 1}
            value={coolingIndex}
            aria-label="Время охлаждения"
            aria-valuetext={`${point.minute} минут`}
            onChange={(e) => setCoolingIndex(Number(e.target.value))}
          />
        </label>
        <div className="chart-readout" role="status">
          <div>
            <span>Воздушное · модель</span>
            <strong>
              {number(point.air)} <small>°C</small>
            </strong>
          </div>
          {comparison && (
            <div>
              <span>Водяное · модель</span>
              <strong>
                {number(point.water)} <small>°C</small>
              </strong>
            </div>
          )}
        </div>
      </>
    );
  } else {
    const route = routes[routeIndex];
    content = (
      <>
        <div className="chart-title-row">
          <h3>
            Температурная кривая
            <br />в пути
          </h3>
          <span className="chart-period">Пример маршрута</span>
        </div>
        <label className="route-select">
          <span>Направление из КБР</span>
          <select
            value={routeIndex}
            onChange={(e) => setRouteIndex(Number(e.target.value))}
          >
            {routes.map((r, i) => (
              <option value={i} key={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <ChartOptions
          label="Режим груза"
          value={cargo}
          options={[
            { value: "chilled", label: "Охлаждённая продукция" },
            { value: "frozen", label: "Замороженная продукция" },
          ]}
          onChange={setCargo}
        />
        <LinePlot
          points={route.hours.map((hour, i) => ({
            x: hour,
            y: route[cargo][i],
          }))}
          selected={checkpoint}
          onSelect={setCheckpoint}
          min={cargo === "chilled" ? 0 : -20}
          max={cargo === "chilled" ? 4 : -16}
          unit="°C"
          xUnit="Часы в пути"
          label={`Иллюстративная температурная кривая: ${route.name}, ${cargo === "chilled" ? "охлаждённая" : "замороженная"} продукция`}
        />
        <label className="chart-slider">
          <span>
            Контрольная точка{" "}
            <strong>
              {checkpoint + 1} из {route.hours.length}
            </strong>
          </span>
          <input
            type="range"
            min="0"
            max={route.hours.length - 1}
            value={checkpoint}
            aria-label="Контрольная точка маршрута"
            aria-valuetext={`${route.hours[checkpoint]} часов в пути`}
            onChange={(e) => setCheckpoint(Number(e.target.value))}
          />
        </label>
        <div className="chart-readout" role="status">
          <div>
            <span>Время в модели</span>
            <strong>
              {route.hours[checkpoint]} <small>ч</small>
            </strong>
          </div>
          <div>
            <span>Температура в модели</span>
            <strong>
              {number(route[cargo][checkpoint])} <small>°C</small>
            </strong>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="production-chart">
      <div className="chart-demo-label">Иллюстративная модель</div>
      <motion.div className="chart-content" key={stage} initial={fx.from} animate={fx.enter} transition={fx.transition}>{content}</motion.div>
      <p className="chart-disclaimer">
        Демонстрационные данные. Это не показатели предприятия, технологические
        нормы или обещание сроков поставки.
      </p>
    </div>
  );
}
