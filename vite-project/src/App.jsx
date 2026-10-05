import { useState, useMemo } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Samsung Galaxy A15 smartfon, 128 GB", emoji: "📱", bg: "#e8dcff", price: 2390000, old: 2790000, rating: 4.7, reviews: 1284, tag: "Muddatli to'lov" },
  { id: 2, name: "Simsiz quloqchin TWS Pro", emoji: "🎧", bg: "#ffe3ec", price: 189000, old: 259000, rating: 4.5, reviews: 932, tag: "-27%" },
  { id: 3, name: "Erkaklar krossovkasi, yengil", emoji: "👟", bg: "#dff4ea", price: 329000, old: 420000, rating: 4.6, reviews: 611, tag: "Mashhur" },
  { id: 4, name: "Elektr choynak 1.8 L, zanglamas po'lat", emoji: "🫖", bg: "#fff0d6", price: 155000, old: 195000, rating: 4.8, reviews: 2043, tag: "Tezkor yetkazish" },
  { id: 5, name: "Bolalar uchun konstruktor, 520 detal", emoji: "🧱", bg: "#dcecff", price: 119000, old: 149000, rating: 4.9, reviews: 477, tag: "Sovg'a uchun" },
  { id: 6, name: "Sport ryukzak 25 L, suv o'tkazmaydi", emoji: "🎒", bg: "#f0e4d8", price: 97000, old: 135000, rating: 4.4, reviews: 358, tag: "-28%" },
];

const som = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";

export default function App() {
  const [q, setQ] = useState("");
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const list = useMemo(
    () => PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const items = PRODUCTS.filter((p) => cart[p.id]);
  const count = items.reduce((s, p) => s + cart[p.id], 0);
  const total = items.reduce((s, p) => s + cart[p.id] * p.price, 0);

  const change = (id, d) =>
    setCart((c) => {
      const n = (c[id] || 0) + d;
      const x = { ...c };
      if (n <= 0) delete x[id];
      else x[id] = n;
      return x;
    });

  const showToast = (text, ms = 1200) => {
    setToast(text);
    setTimeout(() => setToast(""), ms);
  };

  const add = (p) => {
    change(p.id, 1);
    showToast("Savatga qo'shildi");
  };

  return (
    <>
      <header>
        <span className="logo">uzum market</span>
        <input
          className="search"
          placeholder="Mahsulotlarni qidirish"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Qidiruv"
        />
        <button className="cartbtn" onClick={() => setOpen(true)}>
          Savat · {count}
        </button>
      </header>

      <main>
        <h2>Bugungi takliflar</h2>
        {list.length === 0 ? (
          <div className="empty">Hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.</div>
        ) : (
          <div className="grid">
            {list.map((p) => (
              <article className="card" key={p.id}>
                <div className="pic" style={{ background: p.bg }}>{p.emoji}</div>
                <div className="body">
                  <span className="tag">{p.tag}</span>
                  <div className="name">{p.name}</div>
                  <div className="meta">★ {p.rating} ({p.reviews} sharh)</div>
                  <div className="old">{som(p.old)}</div>
                  <div className="price">{som(p.price)}</div>
                  <button className="add" onClick={() => add(p)}>Savatga qo'shish</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {open && (
        <div className="panel" onClick={() => setOpen(false)}>
          <aside className="side" onClick={(e) => e.stopPropagation()}>
            <div className="sidehead">
              <h2>Savat</h2>
              <button className="close" onClick={() => setOpen(false)} aria-label="Yopish">✕</button>
            </div>

            {items.length === 0 ? (
              <div className="empty">Savat bo'sh. Mahsulot qo'shing.</div>
            ) : (
              items.map((p) => (
                <div className="row" key={p.id}>
                  <div className="em">{p.emoji}</div>
                  <div className="info">
                    <div className="name">{p.name}</div>
                    <div className="meta">{som(p.price)}</div>
                  </div>
                  <div className="qty">
                    <button onClick={() => change(p.id, -1)} aria-label="Kamaytirish">−</button>
                    <b>{cart[p.id]}</b>
                    <button onClick={() => change(p.id, 1)} aria-label="Ko'paytirish">+</button>
                  </div>
                </div>
              ))
            )}

            <div className="total"><span>Jami</span><span>{som(total)}</span></div>
            <button
              className="add"
              disabled={!count}
              style={{ opacity: count ? 1 : 0.5 }}
              onClick={() => {
                setCart({});
                setOpen(false);
                showToast("Buyurtma qabul qilindi", 1800);
              }}
            >
              Buyurtma berish
            </button>
          </aside>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}