
export const formatARS = (n?: number|null) => {
  if (typeof n !== 'number') return 'A consultar'
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
  } catch { return `${n} ARS` }
}
