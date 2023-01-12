import {Readable} from "stream"


export async function* linesIterator(reader: Readable): AsyncGenerator<string> {
  reader.setEncoding("utf8")
  // Stream chunks are not broken along JSON lines, so use partial to store remainder text between chunks.
  let partial = ""
  for await (const chunk of reader) {
    const block = partial + chunk
    const lines = block.split("\n")
    // last line will be either a partial line or an empty string (for complete blocks)
    partial = lines.pop() ?? ""

    for (const line of lines) {
      yield line
    }
  }
  if (partial) {
    yield partial
  }
}
