export interface Job {
  id?: number | string
  _id?: string
  title: string
  company: string
  location?: string
  city?: string
  country?: string
  industry?: string
  role?: string
  requirements: string[]
  matchScore?: number
  description?: string
}