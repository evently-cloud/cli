import {Transform, TransformCallback} from "stream"

export class LinesTransformer extends Transform {
  // Stream chunks are not broken along JSON lines, so use partial to store remainder text between chunks.
  partial = ""

  constructor() {
    super({objectMode: true})
  }

  _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
    const block = this.partial + chunk
    const lines = block.split("\n")
    // last line will be either a partial line or an empty string (for complete blocks)
    this.partial = lines.pop() ?? ""

    for (const line of lines) {
      this.push(line)
    }
    done()
  }

  _flush(done: TransformCallback) {
    if (this.partial) {
      this.push(this.partial)
    }
    done()
  }
}
