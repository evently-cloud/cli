export type Event = {
  entity: string
  key: string
  event: string
  eventId: string
  timestamp: string
  meta: Record<string, string>
  data: Record<string, any>
}
