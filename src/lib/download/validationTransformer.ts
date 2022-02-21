import {Transform, TransformCallback} from "stream"
import {ValidationContext} from "./types"
import {validateEventLineStep} from "./validator"


export class ValidationTransformer extends Transform {

  context: ValidationContext

  constructor(private passThrough: boolean, startingContext?: ValidationContext) {
    super({objectMode: true})

    this.context = startingContext || {
      ledgerId:        "",
      count:           0,
      previousEventId: ""
    }
  }

  _transform(line: string, encoding: BufferEncoding, done: TransformCallback): void {
    validateEventLineStep(this.context, line)
    if (this.passThrough) {
      this.push(`${line}\n`)
    }
    done()
  }
}