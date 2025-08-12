
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatARS } from '../../utils/currency'

type Exp = {
  id: string
  title: string
  category?: string
  season?: string
  bookingType?: 'instant'|'consult'
  priceAdultARS?: number|null
  priceChildARS?: number|null
  durationHours?: number|null
  difficulty?: string
  includes?: string[]
  notIncludes?: string[]
  highlights?: string[]
  meetingPoint?: string
  schedule?: string
  images?: string[]
  description?: string
  checkoutUrl?: string
}

const phone = process.env.WHATSAPP_PHONE || '549XXXXXXXXXX'
const mail = process.env.CONTACT_EMAIL || 'contacto@example.com'

export default function ExperienceDetail() {
  const { query } = useRouter()
  const [item, setItem] = useState<Exp | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query.id) return
    fetch('/api/experiences')
      .then(r => r.json())
      .then(data => {
        const found = (data.items || []).find((x: any) => x.id === query.id)
        setItem(found || null)
      })
      .finally(() => setLoading(false))
  }, [query.id])

  if (loading) return <div className="container">Cargando…</div>
  if (!item) return <div className="container">No encontramos esta experiencia. <Link href="/">Volver</Link></div>

  const waMsg = encodeURIComponent(`Hola! Quiero información sobre: ${item.title} (${item.id}).`)
  const waLink = `https://wa.me/${phone}?text=${waMsg}`

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Inicio</Link> · <span>{item.category}</span>
      </div>

      {item.images?.[0] && <img src={item.images[0]} alt={item.title} className="hero-img" />}

      <h1 style={{marginBottom:4}}>{item.title}</h1>
      <div style={{opacity:.75}}>
        {item.category} · {item.season} · {item.durationHours ? `${item.durationHours} h` : ''} · {item.difficulty}
      </div>

      <div className="section">
        <h3>Descripción</h3>
        <p>{item.description || 'Experiencia inolvidable en Ushuaia.'}</p>
      </div>

      {item.highlights?.length ? (
        <div className="section">
          <h3>Lo mejor de esta experiencia</h3>
          <ul>
            {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      ) : null}

      {(item.includes?.length || item.notIncludes?.length) ? (
        <div className="section">
          <h3>Incluye / No incluye</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
            <div>
              <strong>Incluye</strong>
              <ul>{item.includes?.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div>
              <strong>No incluye</strong>
              <ul>{item.notIncludes?.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      ) : null}

      {(item.meetingPoint || item.schedule) ? (
        <div className="section">
          <h3>Logística</h3>
          <p><strong>Punto de encuentro:</strong> {item.meetingPoint || 'A confirmar'}</p>
          <p><strong>Horarios:</strong> {item.schedule || 'A confirmar'}</p>
        </div>
      ) : null}

      <div id="comprar" className="section" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
        <div>
          <div style={{opacity:.7, fontSize:14}}>Precio por adulto</div>
          <div style={{fontSize:22, fontWeight:800}}>{formatARS(item.priceAdultARS ?? null)}</div>
        </div>
        {item.bookingType === 'instant' ? (
          item.checkoutUrl ? (
            <a className="btn" href={item.checkoutUrl} target="_blank" rel="noreferrer">Comprar ahora</a>
          ) : (
            <a className="btn" href={`mailto:${mail}?subject=Compra ${encodeURIComponent(item.title)}`}>Comprar (por email)</a>
          )
        ) : (
          <a id="consultar" className="btn secondary" href={waLink} target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
        )}
      </div>

      {item.images?.length ? (
        <div className="section">
          <h3>Galería</h3>
          <div className="gallery">
            {item.images.slice(1).map((src, i) => <img key={i} src={src} style={{width:'100%', height:140, objectFit:'cover', borderRadius:12}} />)}
          </div>
        </div>
      ) : null}

      <div style={{marginTop:24}}>
        <Link className="btn secondary" href="/">← Volver</Link>
      </div>
    </div>
  )
}
