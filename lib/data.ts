
import type { Experience } from '../pages/api/experiences'

export async function fetchExperiences(baseUrl='') : Promise<Experience[]> {
  const res = await fetch(baseUrl + '/api/experiences', { cache: 'no-store' })
  const data = await res.json()
  return data.items || []
}

export async function fetchExperienceById(id: string, baseUrl='') {
  const items = await fetchExperiences(baseUrl)
  return items.find((e: any) => e.id === id) || null
}
