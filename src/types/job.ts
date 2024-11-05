export interface Job {
  id: string
  title: string
  client: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
  equipmentCount: number
}

export interface Equipment {
  id: string
  name: string
  category: string
  quantity: number
  notes?: string
} 