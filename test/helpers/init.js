const undici = require("undici")

process.env.TS_NODE_PROJECT = require("path").resolve("test/tsconfig.json")
process.env.NODE_ENV = "development"

global.oclif = global.oclif || {}
global.oclif.columns = 80

// Mock Evently connection.
const mockAgent = new undici.MockAgent()
undici.setGlobalDispatcher(mockAgent)
mockAgent.disableNetConnect()
global.mockEvently = mockAgent.get("https://preview.evently.cloud")
