'use client'

interface Props {
  appId: string
  screenId: string
  onNavigate: (screenId: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: string
}

function BottomNav({ items, activeId, onNavigate, activeColor }: {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
  activeColor: string
}) {
  return (
    <div className="flex border-t border-gray-100 bg-white">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="flex-1 py-1.5 flex flex-col items-center gap-0.5 text-[9px] transition-colors"
          style={{ color: activeId === item.id ? activeColor : '#9ca3af' }}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── LIDL ────────────────────────────────────────────────────────────────────

function LidlScreen({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const nav: NavItem[] = [
    { id: 'home', label: 'Główna', icon: '🏠' },
    { id: 'oferty', label: 'Oferty', icon: '🏷️' },
    { id: 'produkty', label: 'Produkty', icon: '📦' },
    { id: 'konto', label: 'Konto', icon: '👤' },
  ]
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ backgroundColor: '#E3000B' }}>
        <span className="font-black text-[15px] tracking-widest" style={{ color: '#FFD700' }}>LIDL</span>
        <button className="text-white text-sm">🔍</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {screenId === 'home' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span>🔍</span><span className="text-gray-400 text-[10px]">Szukaj produktów w Lidl...</span>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#FFD700' }}>
              <div className="font-bold text-[13px]" style={{ color: '#E3000B' }}>🎉 Super ceny każdego dnia!</div>
              <div className="text-[10px] mt-0.5 text-red-800">Nowa gazetka od poniedziałku</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 text-[11px] mb-1.5">Kategorie</div>
              <div className="flex gap-1.5 flex-wrap">
                {['🥦 Świeże', '🥩 Mięso', '🧀 Nabiał', '🍞 Piekarnia'].map(c => (
                  <span key={c} className="bg-gray-100 rounded-full px-2 py-0.5 text-[9px]">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 text-[11px] mb-1.5">Polecane</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: 'Mleko 3,2% 1L', price: '2,49 zł', old: '2,99 zł', e: '🥛' },
                  { name: 'Chleb pszenny 500g', price: '3,29 zł', old: '3,79 zł', e: '🍞' },
                  { name: 'Masło 200g', price: '5,49 zł', old: '6,99 zł', e: '🧈' },
                  { name: 'Ser żółty 150g', price: '4,99 zł', old: '5,99 zł', e: '🧀' },
                ].map(p => (
                  <div key={p.name} className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <div className="text-xl text-center mb-1">{p.e}</div>
                    <div className="text-[10px] font-medium text-gray-800 leading-tight">{p.name}</div>
                    <div className="text-[9px] text-gray-400 line-through">{p.old}</div>
                    <div className="font-bold text-[11px]" style={{ color: '#E3000B' }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {screenId === 'oferty' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-3 py-2 font-bold text-white text-[11px]" style={{ backgroundColor: '#E3000B' }}>
                📰 Gazetka 01.07 – 07.07.2026
              </div>
            </div>
            {[
              { name: 'Schab wieprzowy', unit: '/kg', price: '12,99 zł', old: '17,99 zł', e: '🥩' },
              { name: 'Truskawki', unit: '500g', price: '6,49 zł', old: '8,99 zł', e: '🍓' },
              { name: 'Masło ekstra 200g', unit: '', price: '5,49 zł', old: '7,49 zł', e: '🧈' },
              { name: 'Jogurt naturalny 4×125g', unit: '', price: '3,99 zł', old: '5,49 zł', e: '🥛' },
              { name: 'Sok pomarańczowy 1L', unit: '', price: '4,29 zł', old: '5,99 zł', e: '🍊' },
              { name: 'Pizza mrożona 420g', unit: '', price: '7,99 zł', old: '11,99 zł', e: '🍕' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-2xl">{p.e}</span>
                <div className="flex-1">
                  <div className="font-medium text-[11px] text-gray-800">{p.name}{p.unit && <span className="text-gray-400"> {p.unit}</span>}</div>
                  <div className="text-[9px] text-gray-400 line-through">{p.old}</div>
                </div>
                <div className="font-bold text-[13px]" style={{ color: '#E3000B' }}>{p.price}</div>
              </div>
            ))}
          </div>
        )}
        {screenId === 'produkty' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="flex gap-1.5 flex-wrap">
              {['Wszystkie', 'Świeże', 'Mięso', 'Nabiał', 'Piekarnia', 'Napoje'].map((f, i) => (
                <span key={f} className={`rounded-full px-2.5 py-0.5 text-[9px] font-medium ${i === 0 ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                  style={i === 0 ? { backgroundColor: '#E3000B' } : {}}>
                  {f}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Mleko pełne 1L', price: '2,49 zł', e: '🥛' },
                { name: 'Jajka L 10szt', price: '6,99 zł', e: '🥚' },
                { name: 'Filet z kurczaka /kg', price: '13,99 zł', e: '🍗' },
                { name: 'Bagietka 250g', price: '1,89 zł', e: '🥖' },
                { name: 'Pomidory /kg', price: '4,49 zł', e: '🍅' },
                { name: 'Serek wiejski 200g', price: '3,29 zł', e: '🧀' },
              ].map(p => (
                <div key={p.name} className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                  <div className="text-2xl text-center mb-1">{p.e}</div>
                  <div className="text-[10px] font-medium text-gray-800 leading-tight">{p.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-[11px]" style={{ color: '#E3000B' }}>{p.price}</span>
                    <button className="text-white text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#E3000B' }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {screenId === 'konto' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #E3000B, #a00008)' }}>
              <div className="text-[9px] opacity-70 mb-1">LIDL PLUS</div>
              <div className="font-bold text-[15px] tracking-widest mb-3" style={{ color: '#FFD700' }}>LIDL</div>
              <div className="bg-white/20 rounded-lg h-8 flex items-center px-3">
                <span className="text-[9px] font-mono tracking-widest opacity-80">|||| |||| |||| ||||</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-[13px] text-gray-800">1 240</div>
                <div className="text-[9px] text-gray-500">punktów</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <div className="text-2xl mb-1">🎟️</div>
                <div className="font-bold text-[13px] text-gray-800">3</div>
                <div className="text-[9px] text-gray-500">kupony</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 text-[11px] mb-1.5">Moje kupony</div>
              {[
                { v: '5% rabatu', d: 'Nabiał i jaja', exp: 'do 07.07' },
                { v: '-2 zł', d: 'Zakupy min. 50 zł', exp: 'do 10.07' },
                { v: '10% rabatu', d: 'Wyroby cukiernicze', exp: 'do 14.07' },
              ].map(c => (
                <div key={c.v} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#E3000B' }}>{c.v}</div>
                  <div>
                    <div className="text-[10px] font-medium text-gray-800">{c.d}</div>
                    <div className="text-[9px] text-gray-400">{c.exp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav items={nav} activeId={screenId} onNavigate={onNavigate} activeColor="#E3000B" />
    </div>
  )
}

// ─── KAUFLAND ────────────────────────────────────────────────────────────────

function KauflandScreen({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const nav: NavItem[] = [
    { id: 'home', label: 'Główna', icon: '🏠' },
    { id: 'gazetka', label: 'Gazetka', icon: '📰' },
    { id: 'oferty', label: 'Oferty', icon: '🏷️' },
    { id: 'konto', label: 'Konto', icon: '👤' },
  ]
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: '#E30613' }}>
        <span className="font-black text-[14px] text-white tracking-wide">Kaufland</span>
        <button className="text-white text-sm">🔍</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {screenId === 'home' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-2xl p-3 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#E30613' }}>🃏</div>
              <div>
                <div className="font-bold text-[11px] text-gray-800">Karta Kaufland</div>
                <div className="text-[9px] text-gray-500">Aktywuj i zbieraj punkty</div>
              </div>
              <button className="ml-auto text-[9px] text-white px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: '#E30613' }}>Aktywuj</button>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-3 py-2 font-bold text-white text-[11px]" style={{ backgroundColor: '#E30613' }}>📅 Oferty tygodnia</div>
              <div className="grid grid-cols-2 gap-1.5 p-2">
                {[
                  { name: 'Kurczak cały /kg', price: '7,99 zł', e: '🐔' },
                  { name: 'Szynka wieprzowa 300g', price: '8,99 zł', e: '🥩' },
                ].map(p => (
                  <div key={p.name} className="bg-gray-50 rounded-xl p-2 border border-gray-100 text-center">
                    <div className="text-2xl mb-1">{p.e}</div>
                    <div className="text-[9px] text-gray-700">{p.name}</div>
                    <div className="font-bold text-[12px] mt-0.5" style={{ color: '#E30613' }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-3 text-white text-[11px] font-medium" style={{ backgroundColor: '#E30613' }}>
              📰 Gazetka 01.07 – 07.07 →
            </div>
          </div>
        )}
        {screenId === 'gazetka' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="font-bold text-[11px] text-gray-700">📅 Gazetka 01.07 – 07.07.2026</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Kurczak cały /kg', price: '7,99 zł', old: '11,99 zł', e: '🐔' },
                { name: 'Szynka wieprzowa 300g', price: '8,99 zł', old: '12,49 zł', e: '🥩' },
                { name: 'Ser Gouda /100g', price: '1,99 zł', old: '2,99 zł', e: '🧀' },
                { name: 'Łosoś norweski /100g', price: '3,49 zł', old: '4,99 zł', e: '🐟' },
                { name: 'Piwo jasne 6×500ml', price: '18,99 zł', old: '24,99 zł', e: '🍺' },
                { name: 'Detergent 3L', price: '14,99 zł', old: '22,99 zł', e: '🧴' },
              ].map(p => (
                <div key={p.name} className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                  <div className="text-2xl text-center mb-1">{p.e}</div>
                  <div className="text-[9px] font-medium text-gray-800 leading-tight">{p.name}</div>
                  <div className="text-[8px] text-gray-400 line-through">{p.old}</div>
                  <div className="font-bold text-[12px]" style={{ color: '#E30613' }}>{p.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {screenId === 'oferty' && (
          <div className="p-2.5 space-y-1.5 text-xs">
            <div className="font-bold text-[11px] text-gray-700 mb-2">🔥 Oferty specjalne</div>
            {[
              { name: 'Wino czerwone Chianti 750ml', price: '24,99 zł', badge: '-30%', e: '🍷' },
              { name: 'Kawa mielona 500g', price: '19,99 zł', badge: '-25%', e: '☕' },
              { name: 'Oliwa z oliwek extra 500ml', price: '16,99 zł', badge: '-20%', e: '🫙' },
              { name: 'Herbata zielona 100szt', price: '9,99 zł', badge: '-35%', e: '🍵' },
              { name: 'Czekolada Lindt 100g', price: '5,99 zł', badge: '-40%', e: '🍫' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-xl">{p.e}</span>
                <span className="flex-1 text-[10px] font-medium text-gray-800">{p.name}</span>
                <span className="text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#E30613' }}>{p.badge}</span>
                <span className="font-bold text-[11px] text-gray-800">{p.price}</span>
              </div>
            ))}
          </div>
        )}
        {screenId === 'konto' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
              <div>
                <div className="font-bold text-[12px] text-gray-800">Jan Kowalski</div>
                <div className="text-[9px] text-gray-500">jan.kowalski@email.pl</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <div className="font-bold text-[15px] text-gray-800">850</div>
                <div className="text-[9px] text-gray-500">punktów</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <div className="font-bold text-[15px] text-gray-800">Silver</div>
                <div className="text-[9px] text-gray-500">poziom</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[11px] text-gray-700 mb-1.5">Ostatnie zakupy</div>
              {[
                { shop: 'Kaufland Kraków Bonarka', date: '28.06.2026', val: '87,43 zł' },
                { shop: 'Kaufland Kraków Kurdwanów', date: '21.06.2026', val: '124,15 zł' },
                { shop: 'Kaufland Warszawa Praga', date: '15.06.2026', val: '56,99 zł' },
              ].map(t => (
                <div key={t.date} className="flex items-center gap-2 py-2 border-b border-gray-100">
                  <span className="text-base">🧾</span>
                  <div className="flex-1">
                    <div className="text-[10px] font-medium text-gray-800">{t.shop}</div>
                    <div className="text-[9px] text-gray-400">{t.date}</div>
                  </div>
                  <span className="font-bold text-[11px] text-gray-800">{t.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav items={nav} activeId={screenId} onNavigate={onNavigate} activeColor="#E30613" />
    </div>
  )
}

// ─── BIEDRONKA ───────────────────────────────────────────────────────────────

function BiedronkaScreen({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const nav: NavItem[] = [
    { id: 'home', label: 'Główna', icon: '🏠' },
    { id: 'oferty', label: 'Oferty', icon: '🐞' },
    { id: 'ulubione', label: 'Ulubione', icon: '❤️' },
    { id: 'konto', label: 'Konto', icon: '👤' },
  ]
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: '#E2001A' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-base">🐞</span>
          <span className="font-black text-[15px] text-white">Biedronka</span>
        </div>
        <button className="text-white text-sm">🔍</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {screenId === 'home' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-2xl p-3 text-white" style={{ backgroundColor: '#E2001A' }}>
              <div className="text-[9px] opacity-80 mb-0.5">OFERTA DNIA</div>
              <div className="font-bold text-[13px]">Ser Gouda 400g</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-black text-[20px]">5,99 zł</span>
                <span className="text-[10px] opacity-70 line-through">9,99 zł</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: '#E2001A' }}>🎉 Weekendowe okazje</div>
              <div className="p-2 space-y-1.5">
                {[
                  { name: 'Jogurt grecki 400g', price: '3,49 zł', e: '🥛' },
                  { name: 'Banan /kg', price: '2,49 zł', e: '🍌' },
                  { name: 'Majonez Kielecki 400g', price: '5,99 zł', e: '🫙' },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1.5">
                    <span className="text-xl">{p.e}</span>
                    <span className="flex-1 text-[10px] text-gray-800">{p.name}</span>
                    <span className="font-bold text-[11px]" style={{ color: '#E2001A' }}>{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {screenId === 'oferty' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="flex gap-1 flex-wrap">
              {['Wszystkie', 'Spożywcze', 'Chemia', 'Mięso'].map((t, i) => (
                <span key={t} className="rounded-full px-2.5 py-0.5 text-[9px] font-medium"
                  style={i === 0 ? { backgroundColor: '#E2001A', color: 'white' } : { backgroundColor: '#f3f4f6', color: '#4b5563' }}>
                  {t}
                </span>
              ))}
            </div>
            {[
              { name: 'Szynka konserwowa 300g', price: '7,99 zł', disc: '-40%', e: '🥩' },
              { name: 'Pieczarki 400g', price: '2,99 zł', disc: '-30%', e: '🍄' },
              { name: 'Płatki owsiane 500g', price: '3,49 zł', disc: '-25%', e: '🌾' },
              { name: 'Woda mineralna 6×1,5L', price: '8,99 zł', disc: '-20%', e: '💧' },
              { name: 'Proszek do prania 3kg', price: '19,99 zł', disc: '-35%', e: '🧺' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-xl">{p.e}</span>
                <span className="flex-1 text-[10px] font-medium text-gray-800">{p.name}</span>
                <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#E2001A' }}>{p.disc}</span>
                <span className="font-bold text-[11px]" style={{ color: '#E2001A' }}>{p.price}</span>
              </div>
            ))}
          </div>
        )}
        {screenId === 'ulubione' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="font-semibold text-[11px] text-gray-700 mb-2">❤️ Ulubione produkty</div>
            {[
              { name: 'Ser Gouda 400g', price: '9,99 zł', e: '🧀' },
              { name: 'Jogurt grecki 400g', price: '3,49 zł', e: '🥛' },
              { name: 'Chleb razowy 500g', price: '4,29 zł', e: '🍞' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-2xl">{p.e}</span>
                <span className="flex-1 text-[10px] font-medium text-gray-800">{p.name}</span>
                <span className="font-bold text-[11px]" style={{ color: '#E2001A' }}>{p.price}</span>
                <button className="text-red-300 text-base">❤️</button>
              </div>
            ))}
          </div>
        )}
        {screenId === 'konto' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #E2001A, #900012)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🐞</span>
                <span className="font-bold text-[13px]">Moja Biedronka</span>
              </div>
              <div className="text-[9px] opacity-70 mb-1">TWOJE PUNKTY</div>
              <div className="font-black text-[28px] leading-none">2 150</div>
            </div>
            <div>
              <div className="font-semibold text-[11px] text-gray-700 mb-1.5">Aktywne kupony (5)</div>
              {[
                { v: '-3 zł', d: 'Mięso i wędliny', exp: '07.07' },
                { v: '10%', d: 'Nabiał i jaja', exp: '10.07' },
                { v: '-5 zł', d: 'Min. zakupy 60 zł', exp: '14.07' },
              ].map(c => (
                <div key={c.v} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 mb-1.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#E2001A' }}>{c.v}</div>
                  <div className="flex-1">
                    <div className="text-[10px] font-medium text-gray-800">{c.d}</div>
                    <div className="text-[9px] text-gray-400">do {c.exp}</div>
                  </div>
                  <button className="text-[9px] text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E2001A' }}>Użyj</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav items={nav} activeId={screenId} onNavigate={onNavigate} activeColor="#E2001A" />
    </div>
  )
}

// ─── DECATHLON ───────────────────────────────────────────────────────────────

function DecathlonScreen({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const nav: NavItem[] = [
    { id: 'home', label: 'Główna', icon: '🏠' },
    { id: 'kategorie', label: 'Sporty', icon: '⚽' },
    { id: 'produkt', label: 'Produkt', icon: '📦' },
    { id: 'koszyk', label: 'Koszyk', icon: '🛒' },
  ]
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: '#007DBA' }}>
        <span className="font-black text-[14px] text-white tracking-widest">DECATHLON</span>
        <button className="text-white text-sm">🔍</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {screenId === 'home' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-xl p-3 text-white" style={{ backgroundColor: '#007DBA' }}>
              <div className="font-bold text-[12px]">🌞 Nowa kolekcja Lato 2026</div>
              <div className="text-[10px] opacity-80 mt-0.5">Sprawdź nowości na sezon</div>
            </div>
            <div>
              <div className="font-semibold text-[11px] text-gray-700 mb-2">Wybierz sport</div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'kategorie', label: 'Rower', icon: '🚴' },
                  { id: 'kategorie', label: 'Running', icon: '🏃' },
                  { id: 'kategorie', label: 'Piłka nożna', icon: '⚽' },
                  { id: 'kategorie', label: 'Pływanie', icon: '🏊' },
                  { id: 'kategorie', label: 'Fitness', icon: '🏋️' },
                  { id: 'kategorie', label: 'Camping', icon: '⛺' },
                ].map(s => (
                  <button key={s.label} onClick={() => onNavigate(s.id)}
                    className="bg-gray-50 rounded-xl py-2.5 flex flex-col items-center gap-1 border border-gray-100 hover:border-blue-200 transition-colors">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-[9px] text-gray-600 font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="text-[10px] font-bold text-blue-700 mb-1.5">⭐ Bestsellery tygodnia</div>
              {[
                { name: 'Koszulka do biegania Kiprun', price: '89,99 zł', e: '👕' },
                { name: 'Buty trailowe NH500', price: '199,99 zł', e: '👟' },
              ].map(p => (
                <div key={p.name} onClick={() => onNavigate('produkt')}
                  className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <span className="text-xl">{p.e}</span>
                  <span className="flex-1 text-[10px] text-gray-700">{p.name}</span>
                  <span className="font-bold text-[11px]" style={{ color: '#007DBA' }}>{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {screenId === 'kategorie' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="font-bold text-[11px] text-gray-700 mb-2">Wszystkie sporty</div>
            {[
              { label: 'Fitness i siłownia', count: '1 234 produkty', icon: '🏋️' },
              { label: 'Rower i kolarstwo', count: '876 produktów', icon: '🚴' },
              { label: 'Running i bieganie', count: '654 produkty', icon: '🏃' },
              { label: 'Piłka nożna', count: '543 produkty', icon: '⚽' },
              { label: 'Pływanie', count: '432 produkty', icon: '🏊' },
              { label: 'Camping i turystyka', count: '765 produktów', icon: '⛺' },
              { label: 'Tenis', count: '321 produkty', icon: '🎾' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-gray-800">{c.label}</div>
                  <div className="text-[9px] text-gray-400">{c.count}</div>
                </div>
                <span className="text-gray-400 text-[11px]">›</span>
              </div>
            ))}
          </div>
        )}
        {screenId === 'produkt' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-xl h-28 flex items-center justify-center text-4xl" style={{ backgroundColor: '#e0f0fb' }}>👕</div>
            <div>
              <div className="font-bold text-[13px] text-gray-900">Koszulka do biegania Kiprun 500</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-black text-[18px]" style={{ color: '#007DBA' }}>89,99 zł</span>
                <span className="text-[10px] text-gray-400 line-through">119,99 zł</span>
                <span className="text-[9px] text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#007DBA' }}>-25%</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {'⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} className="text-yellow-400 text-[11px]">{s}</span>)}
                <span className="text-[9px] text-gray-400 ml-1">4,2 (234 opinii)</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 mb-1.5">Rozmiar</div>
              <div className="flex gap-1.5">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz, i) => (
                  <button key={sz} className="px-2 py-1 rounded-lg text-[9px] font-medium border transition-colors"
                    style={i === 2 ? { backgroundColor: '#007DBA', color: 'white', borderColor: '#007DBA' } : { borderColor: '#e5e7eb', color: '#4b5563' }}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => onNavigate('koszyk')}
              className="w-full py-2.5 rounded-xl font-bold text-[11px] text-white transition-colors"
              style={{ backgroundColor: '#007DBA' }}>
              Dodaj do koszyka 🛒
            </button>
          </div>
        )}
        {screenId === 'koszyk' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="font-bold text-[11px] text-gray-700">🛒 Koszyk (2 produkty)</div>
            {[
              { name: 'Koszulka Kiprun 500 — L', price: '89,99 zł', e: '👕', qty: 1 },
              { name: 'Spodenki do biegania — M', price: '59,99 zł', e: '🩳', qty: 1 },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <span className="text-2xl">{p.e}</span>
                <div className="flex-1">
                  <div className="text-[10px] font-medium text-gray-800">{p.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="w-5 h-5 bg-gray-200 rounded-full text-[10px] font-bold">-</button>
                    <span className="text-[10px] font-medium">{p.qty}</span>
                    <button className="w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#007DBA' }}>+</button>
                  </div>
                </div>
                <span className="font-bold text-[11px]" style={{ color: '#007DBA' }}>{p.price}</span>
              </div>
            ))}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                <span>Produkty (2)</span><span>149,98 zł</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 mb-2">
                <span>Dostawa</span><span>0,00 zł</span>
              </div>
              <div className="flex justify-between font-bold text-[13px] text-gray-800">
                <span>Suma</span><span style={{ color: '#007DBA' }}>149,98 zł</span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl font-bold text-[11px] text-white" style={{ backgroundColor: '#007DBA' }}>
              Przejdź do kasy →
            </button>
          </div>
        )}
      </div>
      <BottomNav items={nav} activeId={screenId} onNavigate={onNavigate} activeColor="#007DBA" />
    </div>
  )
}

// ─── CARREFOUR ───────────────────────────────────────────────────────────────

function CarrefourScreen({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const nav: NavItem[] = [
    { id: 'home', label: 'Główna', icon: '🏠' },
    { id: 'program', label: 'Program', icon: '🏆' },
    { id: 'oferty', label: 'Oferty', icon: '🏷️' },
    { id: 'koszyk', label: 'Koszyk', icon: '🛒' },
  ]
  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: '#004A96' }}>
        <span className="font-black text-[15px] text-white">Carrefour</span>
        <button className="text-white text-sm">🔍</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {screenId === 'home' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span>🔍</span><span className="text-gray-400 text-[10px]">Szukaj w Carrefour...</span>
            </div>
            <div className="rounded-2xl p-3 text-white" style={{ background: 'linear-gradient(135deg, #004A96, #E31837)' }}>
              <div className="text-[9px] opacity-80 mb-0.5">PROGRAM CARREFOUR</div>
              <div className="font-bold text-[13px]">3 420 punktów 🏆</div>
              <div className="text-[10px] opacity-80 mt-0.5">Poziom: Złoty · do Platynowego 580 pkt</div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: '#E31837' }}>🔥 Oferty tygodnia</div>
              <div className="p-2 space-y-1.5">
                {[
                  { name: 'Cola 6×1,5L', price: '12,99 zł', e: '🥤' },
                  { name: 'Łosoś norweski /100g', price: '3,99 zł', e: '🐟' },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1.5">
                    <span className="text-xl">{p.e}</span>
                    <span className="flex-1 text-[10px] text-gray-800">{p.name}</span>
                    <span className="font-bold text-[11px]" style={{ color: '#E31837' }}>{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {screenId === 'program' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #004A96, #0066cc)' }}>
              <div className="text-[9px] opacity-70 mb-1">PROGRAM CARREFOUR</div>
              <div className="font-black text-[26px] leading-none mb-0.5">3 420 pkt</div>
              <div className="text-[10px] opacity-80">Poziom Złoty 🥇</div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: '68%', backgroundColor: '#FFD700' }} />
              </div>
              <div className="flex justify-between text-[9px] opacity-70 mt-0.5">
                <span>Złoty</span><span>Platynowy 4 000 pkt</span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[11px] text-gray-700 mb-1.5">Dostępne nagrody</div>
              {[
                { pts: '500 pkt', name: 'Rabat 5 zł', icon: '🎟️' },
                { pts: '1 000 pkt', name: 'Rabat 15 zł', icon: '💳' },
                { pts: '2 000 pkt', name: 'Voucher 50 zł', icon: '🎁' },
              ].map(r => (
                <div key={r.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 mb-1.5">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium text-gray-800">{r.name}</div>
                    <div className="text-[9px] text-gray-400">{r.pts}</div>
                  </div>
                  <button className="text-[9px] text-white px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: '#004A96' }}>Wymień</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {screenId === 'oferty' && (
          <div className="p-2.5 space-y-2 text-xs">
            <div className="font-bold text-[11px] text-gray-700 mb-2">🏷️ Aktualne oferty</div>
            {[
              { name: 'Kawa Jacobs 500g', price: '21,99 zł', disc: '-30%', e: '☕' },
              { name: 'Proszek Ariel 4,5kg', price: '59,99 zł', disc: '-25%', e: '🧺' },
              { name: 'Camembert 120g', price: '4,49 zł', disc: '-40%', e: '🧀' },
              { name: 'Pasta Barilla 500g', price: '3,29 zł', disc: '-20%', e: '🍝' },
              { name: 'Piwo Heineken 6×330ml', price: '19,99 zł', disc: '-15%', e: '🍺' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-xl">{p.e}</span>
                <span className="flex-1 text-[10px] font-medium text-gray-800">{p.name}</span>
                <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#E31837' }}>{p.disc}</span>
                <span className="font-bold text-[11px]" style={{ color: '#E31837' }}>{p.price}</span>
              </div>
            ))}
          </div>
        )}
        {screenId === 'koszyk' && (
          <div className="p-2.5 space-y-2.5 text-xs">
            <div className="font-bold text-[11px] text-gray-700">🛒 Koszyk (3 produkty)</div>
            {[
              { name: 'Kawa Jacobs 500g', price: '21,99 zł', e: '☕', qty: 2 },
              { name: 'Camembert 120g', price: '4,49 zł', e: '🧀', qty: 1 },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <span className="text-2xl">{p.e}</span>
                <div className="flex-1">
                  <div className="text-[10px] font-medium text-gray-800">{p.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="w-5 h-5 bg-gray-200 rounded-full text-[10px] font-bold">-</button>
                    <span className="text-[10px] font-medium">{p.qty}</span>
                    <button className="w-5 h-5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#004A96' }}>+</button>
                  </div>
                </div>
                <span className="font-bold text-[11px]" style={{ color: '#004A96' }}>{p.price}</span>
              </div>
            ))}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex justify-between font-bold text-[13px] text-gray-800">
                <span>Suma</span><span style={{ color: '#004A96' }}>48,47 zł</span>
              </div>
              <div className="text-[9px] text-green-600 mt-0.5">+ 48 punktów Carrefour</div>
            </div>
            <button className="w-full py-2.5 rounded-xl font-bold text-[11px] text-white" style={{ backgroundColor: '#004A96' }}>
              Przejdź do kasy →
            </button>
          </div>
        )}
      </div>
      <BottomNav items={nav} activeId={screenId} onNavigate={onNavigate} activeColor="#004A96" />
    </div>
  )
}

// ─── Default ─────────────────────────────────────────────────────────────────

function DefaultScreen({ appId }: { appId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <span className="text-4xl">📱</span>
      <span className="text-xs text-center px-4">{appId}</span>
    </div>
  )
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export function MockScreenContent({ appId, screenId, onNavigate }: Props) {
  switch (appId) {
    case 'lidl':
      return <LidlScreen screenId={screenId} onNavigate={onNavigate} />
    case 'kaufland':
      return <KauflandScreen screenId={screenId} onNavigate={onNavigate} />
    case 'biedronka':
      return <BiedronkaScreen screenId={screenId} onNavigate={onNavigate} />
    case 'decathlon':
      return <DecathlonScreen screenId={screenId} onNavigate={onNavigate} />
    case 'carrefour':
      return <CarrefourScreen screenId={screenId} onNavigate={onNavigate} />
    default:
      return <DefaultScreen appId={appId} />
  }
}
