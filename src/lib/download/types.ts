export type UnknownObject = {
  [k: string]: unknown
}

export interface EventBody {
  entity:     string
  key:        string
  event:      string
  eventId:    string
  timestamp:  string
  meta:       UnknownObject
  data:       any
}

export interface ValidationContext {
  ledgerId:         string
  count:            number
  previousEventId:  string
}
