
# Ushuaia CRM — Next.js + Google Sheets (v2)

Listo para Vercel. Incluye:
- API `/api/experiences` (lee la hoja `experiences`)
- Home con catálogo, filtros y precios
- Vista de detalle con **Comprar** (checkoutUrl/email) o **Consultar** (WhatsApp)
- Variables `.env.example` con WhatsApp y email

## Pasos rápidos
1) Subí este proyecto a Vercel (ZIP o Git).
2) En **Environment Variables** agregá:
```
SHEET_ID=181tOQAOfnPGUx4A06JfxeOrQLEwsKuTslzzp5J5Y4UU
SHEET_RANGE=experiences!A1:AG
GOOGLE_SA_EMAIL=tu-service-account@ushuaia-crm.iam.gserviceaccount.com
GOOGLE_SA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU-CLAVE-CON-SALTOS\n-----END PRIVATE KEY-----\n"
WHATSAPP_PHONE=549XXXXXXXXXX
CONTACT_EMAIL=contacto@example.com
```
3) Deploy y probá: `/api/experiences` y `/`.

> Agregá una columna opcional **checkoutUrl** en tu Sheet para habilitar pago directo por experiencia. Si no está, usa email.

## Desarrollo local
```
npm install
npm run dev
```
Abrí `http://localhost:3000/`.

## Seguridad
- La Service Account debe tener **Lector** sobre la hoja.
- Guardar las claves solo como **Environment Variables**.
