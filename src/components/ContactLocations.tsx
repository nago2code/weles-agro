import { motion, animate } from "framer-motion";
import { useMotionSettings } from "../lib/motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { LocateFixed, MapPin, Phone } from "lucide-react";
import "leaflet/dist/leaflet.css";
import {
  companyLocations,
  locationMapUrl,
  type LocationCity,
} from "../data/locations";
type LeafletApi = typeof import("leaflet");
export function ContactLocations() {
  const fx = useMotionSettings();
  const [city, setCity] = useState<LocationCity>("nalchik");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [tileLoaded, setTileLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const detailsElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!detailsElement.current) return;
    const control = animate(detailsElement.current, { opacity: [0.4, 1] }, { duration: fx.reduced ? 0.12 : 0.24 });
    return () => control.complete();
  }, [selectedId, fx.reduced]);
  const mapElement = useRef<HTMLDivElement>(null);
  const instance = useRef<Leaflet.Map | null>(null);
  const api = useRef<LeafletApi | null>(null);
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const selectionFromMap = useRef(false);
  const visible = useMemo(
    () =>
      companyLocations.filter((point) => city === "all" || point.city === city),
    [city],
  );
  const selected = companyLocations.find((point) => point.id === selectedId);
  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let resize: ResizeObserver | undefined;
    let started = false;
    setReady(false);
    setMapError(false);
    setTileError(false);
    setTileLoaded(false);
    async function init() {
      if (started) return;
      started = true;
      try {
        const L = await import("leaflet");
        if (cancelled || !mapElement.current) return;
        api.current = L;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const map = L.map(mapElement.current, {
          scrollWheelZoom: false,
          zoomControl: false,
          zoomAnimation: !reduced,
          fadeAnimation: !reduced,
          markerZoomAnimation: !reduced,
        }).setView([43.496, 43.638], 13);
        instance.current = map;
        mapElement.current.setAttribute(
          "aria-label",
          "Карта точек Велес-Агро. Перемещение стрелками, масштаб клавишами плюс и минус.",
        );
        L.control
          .zoom({
            position: "topright",
            zoomInTitle: "Приблизить карту",
            zoomOutTitle: "Отдалить карту",
          })
          .addTo(map);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        })
          .on("tileerror", () => {
            if (!cancelled) setTileError(true);
          })
          .on("tileload", () => {
            if (!cancelled) setTileLoaded(true);
          })
          .addTo(map);
        map.attributionControl.setPrefix(
          '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>',
        );
        resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
        resize.observe(mapElement.current);
        setReady(true);
      } catch {
        if (!cancelled) setMapError(true);
      }
    }
    if ("IntersectionObserver" in window && mapElement.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            void init();
          }
        },
        { rootMargin: "300px" },
      );
      observer.observe(mapElement.current);
    } else void init();
    return () => {
      cancelled = true;
      observer?.disconnect();
      resize?.disconnect();
      instance.current?.remove();
      instance.current = null;
      markers.current.clear();
    };
  }, [attempt]);
  function fitVisible() {
    const points = visible.flatMap((point) =>
      point.coordinates ? [point.coordinates] : [],
    );
    if (points.length && instance.current && api.current)
      instance.current.fitBounds(api.current.latLngBounds(points), {
        padding: [44, 44],
        maxZoom: points.length === 1 ? 15 : 14,
        animate: false,
      });
  }
  useEffect(() => {
    const map = instance.current;
    const L = api.current;
    if (!ready || !map || !L) return;
    const layer = L.layerGroup().addTo(map);
    markers.current.clear();
    visible.forEach((point) => {
      if (!point.coordinates) return;
      const index =
        companyLocations.findIndex((item) => item.id === point.id) + 1;
      const icon = L.divIcon({
        className: "company-map-marker",
        html: `<span>${index}</span>`,
        iconSize: [44, 50],
        iconAnchor: [22, 48],
        popupAnchor: [0, -46],
      });
      const content = document.createElement("div");
      content.className = "company-map-popup";
      const title = document.createElement("strong");
      title.textContent = point.cityName;
      const address = document.createElement("p");
      address.textContent = point.address;
      const kind = document.createElement("span");
      kind.textContent = point.kind;
      content.append(title, address, kind);
      const marker = L.marker(point.coordinates, {
        icon,
        title: `${point.cityName}, ${point.address}`,
        alt: `Точка ${index}: ${point.cityName}, ${point.address}`,
        keyboard: true,
        riseOnHover: true,
      })
        .addTo(layer)
        .bindPopup(content, { maxWidth: 250, autoPanPaddingTopLeft: [30, 80] });
      marker.on("popupopen", () => {
        selectionFromMap.current = true;
        setSelectedId(point.id);
      });
      marker
        .getElement()
        ?.setAttribute(
          "aria-label",
          `Точка ${index}: ${point.cityName}, ${point.address}`,
        );
      markers.current.set(point.id, marker);
    });
    fitVisible();
    return () => {
      map.removeLayer(layer);
      markers.current.clear();
    };
  }, [ready, visible]);
  useEffect(() => {
    if (!ready || !instance.current) return;
    markers.current.forEach((marker, id) => {
      const element = marker.getElement();
      element?.classList.toggle("is-selected", id === selectedId);
      if (element)
        element.setAttribute("aria-pressed", String(id === selectedId));
    });
    const point = companyLocations.find((item) => item.id === selectedId);
    if (point?.coordinates) {
      if (!selectionFromMap.current) {
        instance.current.setView(point.coordinates, 15, { animate: false });
        markers.current.get(point.id)?.openPopup();
      }
    } else instance.current.closePopup();
  }, [ready, selectedId]);
  function changeCity(value: LocationCity) {
    setCity(value);
    setSelectedId(null);
  }
  return (
    <div
      id="locations"
      className="section-wrap contact-locations"
      role="region"
      aria-labelledby="locations-title"
    >
      <div className="locations-heading">
        <div>
          <h2 id="locations-title">Найдите свою точку.</h2>
          <p>Нажмите на метку или выберите адрес в списке.</p>
        </div>
        <span>Кабардино-Балкария</span>
      </div>
      <div className="locations-toolbar">
        <div role="group" aria-label="Город точек">
          {(
            [
              { id: "all", label: "Все точки" },
              { id: "nalchik", label: "Нальчик" },
              { id: "prokhladny", label: "Прохладный" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              aria-pressed={city === filter.id}
              onClick={() => changeCity(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p>
          {visible.filter((point) => point.coordinates).length} на карте
          {visible.some((point) => !point.coordinates) &&
            " · есть адреса без метки"}
        </p>
      </div>
      <div className="locations-layout">
        <div className="locations-list" role="group" aria-label="Список точек">
          {visible.map((point) => (
            <button
              key={point.id}
              aria-pressed={selectedId === point.id}
              className={`location-list-item ${selectedId === point.id ? "is-selected" : ""}`}
              onClick={() => {
                selectionFromMap.current = false;
                setSelectedId(point.id);
              }}
            >
              <span
                className={`location-list-number ${!point.coordinates ? "is-pending" : ""}`}
              >
                {point.coordinates ? (
                  companyLocations.findIndex((item) => item.id === point.id) + 1
                ) : (
                  <MapPin size={16} />
                )}
              </span>
              <span>
                <strong>{point.cityName}</strong>
                <span>{point.address}</span>
                <small>{point.kind}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="locations-main">
          <div className="locations-map-shell">
            <div ref={mapElement} className="locations-map" />
            {!ready && (
              <div className="map-loading" role="status">
                <MapPin size={28} />
                <p>
                  {mapError
                    ? "Карта не загрузилась. Адреса доступны в списке."
                    : "Загружаем интерактивную карту…"}
                </p>
                {mapError && (
                  <button
                    className="text-link"
                    onClick={() => setAttempt((value) => value + 1)}
                  >
                    Повторить загрузку
                  </button>
                )}
              </div>
            )}
            {ready && (
              <button
                className="map-show-all"
                onClick={() => {
                  setSelectedId(null);
                  instance.current?.closePopup();
                  fitVisible();
                }}
              >
                <LocateFixed size={16} />
                Все метки
              </button>
            )}
            {ready && (tileError || !tileLoaded) && (
              <div className="map-tile-status" role="status">
                {tileError
                  ? "Не все фрагменты карты загрузились. Адреса доступны в списке и Яндекс Картах."
                  : "Загружаем подложку карты…"}
              </div>
            )}
          </div>
          <motion.div
            ref={detailsElement}
            id="location-details"
            className="location-details"
            aria-live="polite"
            aria-atomic="true"
          >
            {selected ? (
              <>
                <div className="location-detail-heading">
                  <h3>
                    {selected.cityName}
                    <span>{selected.address}</span>
                  </h3>
                  <span className="location-source-tag">
                    {selected.coordinates
                      ? "По справочнику"
                      : "Адрес уточняется"}
                  </span>
                </div>
                <p className="location-kind">{selected.kind}</p>
                <p>{selected.description}</p>
                <div className="location-actions">
                  <a
                    className="button button-dark"
                    href={locationMapUrl(selected)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.coordinates
                      ? "Открыть в Яндекс Картах"
                      : "Искать адрес в Яндекс Картах"}
                  </a>
                  <a className="location-call" href="tel:+79995177777">
                    <Phone size={16} />
                    Уточнить у компании
                  </a>
                </div>
                {selected.source && (
                  <p className="location-source">
                    Источник:{" "}
                    <a
                      href={selected.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selected.source.name}
                    </a>
                    . Адрес и координаты просмотрены 26.11.2026.
                  </p>
                )}
              </>
            ) : (
              <div className="location-unselected">
                <MapPin size={24} />
                <div>
                  <h3>Выберите точку</h3>
                  <p>Здесь появятся адрес, тип точки и ссылка на карту.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <p className="locations-note">
        Справочная карта по открытым источникам, не полный реестр торговой сети.
        Перед поездкой уточните работу точки, часы и наличие продукции. Адрес
        без подтверждённых координат не нанесён на карту.
      </p>
    </div>
  );
}
