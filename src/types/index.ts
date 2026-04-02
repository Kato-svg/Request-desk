export type TicketStatus =
  | 'new'
  | 'in_progress'
  | 'waiting'
  | 'resolved'
  | 'closed'
  | 'cancelled'

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export type TicketChannel = 'email' | 'phone' | 'web' | 'chat'

export type Client = {
  name: string
  email: string
  phone?: string
}

export type Ticket = {
  id: number
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  channel: TicketChannel
  client: Client
  assignee_id: number
  created_at: string
  updated_at: string
  sla_deadline: string
}

export type Comment = {
  id: number
  ticket_id: number
  author_id: number
  text: string
  created_at: string
}

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: 'manager'
}

export type AuthUser = Omit<User, 'password'>

export type CreateTicketDTO = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>

export type UpdateTicketDTO = Partial<Omit<Ticket, 'id' | 'created_at'>>

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}
