import {ChronoField, Instant} from "@js-joda/core"
import {crc32c} from "@node-rs/crc32"
import {Transform, TransformCallback} from "stream"
import {EventBody, UnknownObject, ValidationContext} from "./types"


export class ValidationTransformer extends Transform {

  context: ValidationContext

  constructor(private passThrough: boolean, startingContext?: ValidationContext) {
    super({objectMode: true})

    if (startingContext) {
      this.context = startingContext
    } else {
      this.context = {
        ledgerId:         "",
        count:            0,
        previousEventId:  ""
      }
    }
  }

  _transform(line: string, encoding: BufferEncoding, done: TransformCallback) {
    validateEventLineStep(this.context, line)
    if (this.passThrough) {
      this.push(`${line}\n`)
    }
    done()
  }
}

const numberFormatter = new Intl.NumberFormat()

function validateEventLineStep(context: ValidationContext, line: string): void {
  const event: EventBody = JSON.parse(line)

  if (!context.ledgerId) {
    // Calculate the ledger ID from first event
    context.ledgerId = calculateLedgerId(event)
    context.previousEventId = context.ledgerId.padStart(32, "0")
  }

  const eventId = calculateEventId(event, context.ledgerId, context.previousEventId)
  context.count++

  if (event.eventId !== eventId) {
    console.error("IDs at event #%s not the same!", numberFormatter.format(context.count))
    console.error("  from Event: %s", readableEventId(event.eventId))
    console.error("  from calc:  %s", readableEventId(eventId))
    console.error(JSON.stringify(event, null, 2))
    throw new Error("Ledger validation failed.")
  }
  context.previousEventId = eventId
  if (context.count % 10_000 === 0) {
    console.info('Validated %s events', numberFormatter.format(context.count))
  }
}

const lidVersion = 0xfffffffc
function calculateLedgerId(firstEvent: EventBody): string {
  const ledgerId = calculateChecksumWithoutTimestamp(firstEvent) & lidVersion
  return int32ToHex(ledgerId)
}


function calculateEventId(eventIn: EventBody, ledgerIdHex: string, previousEventId: string): string {
  // calculate the base checksum
  let checksum = calculateChecksumWithoutTimestamp(eventIn)
  // add LedgerId
  checksum = crc32c(ledgerIdHex, checksum)
  // add timestamp
  const timestamp = Instant.parse(eventIn.timestamp)
  // ChronoField.MICRO_OF_DAY is not supported
  const epochSeconds = timestamp.epochSecond() * 1_000_000
  const micros = timestamp.getLong(ChronoField.MICRO_OF_SECOND)
  const tsHex = (epochSeconds + micros)
    .toString(16)
    .padStart(16, "0")
  checksum = crc32c(tsHex, checksum)
  checksum = crc32c(previousEventId, checksum)
  const checksumHex = int32ToHex(checksum)

  return `${tsHex}${checksumHex}${ledgerIdHex}`
}


function calculateChecksumWithoutTimestamp(eventIn: EventBody): number {
  const {entity, key, event, meta, data} = eventIn
  const jsonMeta = JSON.stringify(sortObject(meta))
  const jsonData = JSON.stringify(sortUnknown(data))
  let checksum = crc32c(entity)
  checksum = crc32c(key, checksum)
  checksum = crc32c(event, checksum)
  checksum = crc32c(jsonMeta, checksum)
  return crc32c(jsonData, checksum)
}

function readableEventId(eventId: string): string {
  const timestamp = eventId.slice(0, 16)
  const checksum = eventId.slice(16, 24)
  const ledgerId = eventId.slice(24)
  return `${timestamp}|${checksum}|${ledgerId}`
}


function sortObject(inObject: UnknownObject): object {
  const newObject: UnknownObject = {}
  for (const key of Object.keys(inObject).sort()) {
    newObject[key] = sortUnknown(inObject[key])
  }
  return newObject
}

function sortUnknown(inValue: unknown): unknown {
  if (typeof inValue === "object") {
    if (Array.isArray(inValue)) {
      const sorted = []
      for (const value of inValue) {
        sorted.push(sortUnknown(value))
      }
      return sorted
    } else {
      return sortObject(inValue as UnknownObject)
    }
  }
  return inValue
}

function int32ToHex(num: number): string {
  return (num >>> 0)
    .toString(16)
    .padStart(8, "0")
}
