
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { formatARS } from '../utils/currency'

type Exp = {
  id: string
  title: string
  category?: string
  season?: string
  bookingType?: 'instant'|'consult'
  priceAdultARS?: number|null
  durationHours?: number|null
  difficulty?: string
  images?: string[]
  description?: string
}

export default function Home() {
  const [items, setItems] = useState<Exp[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('Todas')
  const [season, setSeason] = useState('Todas')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experiences')
      .then(r => r.json())
      .then(data => setItems(data.items || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return items.filter(e => {
      const mq = (e.title || '').toLowerCase().includes(q.toLowerCase()) || (e.description || '').toLowerCase().includes(q.toLowerCase())
      const mc = category === 'Todas' || e.category === category
      const ms = season === 'Todas' || e.season === season
      return mq && mc && ms
    })
  }, [items, q, category, season])

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1 className="hero">Descubrí <span style={{color:'#0284c7'}}>Ushuaia</span> con una sonrisa</h1>
          <p className="sub">Armá tu viaje con experiencias auténticas. Comprá al instante o consultá disponibilidad: todo en un mismo lugar.</p>
          <div className="filters">
            <input placeholder="¿Qué querés vivir? (Beagle, trekking…)" value={q} onChange={e=>setQ(e.target.value)} />
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              <option>Todas</option>
              <option>Aventura</option>
              <option>Navegación</option>
              <option>Naturaleza</option>
              <option>Cultura</option>
              <option>Nieve</option>
            </select>
            <select value={season} onChange={e=>setSeason(e.target.value)}>
              <option>Todas</option>
              <option>Todo el año</option>
              <option>Verano</option>
              <option>Invierno</option>
              <option>Otoño</option>
              <option>Primavera</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:24, paddingBottom:24}}>
        {loading ? <div>Cargando experiencias…</div> : (
          <div className="grid">
            {filtered.map((e) => (
              <article key={e.id} className="card">
                {e.images?.[0] && <img src={e.images[0]} alt={e.title} />}
                <div className="body">
                  <h3 style={{marginTop:0}}>
                    <Link href={`/experience/${encodeURIComponent(e.id)}`}>{e.title}</Link>
                  </h3>
                  <div style={{opacity:.75, fontSize:14}}>{e.category} · {e.season} · {e.durationHours ? `${e.durationHours} h` : ''}</div>
                  <div style={{marginTop:8, display:'flex', gap:8, alignItems:'center', justifyContent:'space-between'}}>
                    <span className="price">{formatARS(e.priceAdultARS ?? null)}</span>
                    {e.bookingType === 'instant' ? (
                      <Link className="btn" href={`/experience/${encodeURIComponent(e.id)}#comprar`}>Comprar ahora</Link>
                    ) : (
                      <Link className="btn secondary" href={`/experience/${encodeURIComponent(e.id)}#consultar`}>Consultar</Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <div>¿Listo para viajar? Armá tu plan a tu ritmo.</div>
        <a className="btn" href={`mailto:${process.env.CONTACT_EMAIL || 'contacto@example.com'}`}>Escribinos</a>
      </footer>
    </div>
  )
}
