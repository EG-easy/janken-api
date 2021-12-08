// @ts-check
const { logs } = require('secretjs')

function parseRawLog (input) {
  const logsToParse = JSON.parse(input).map(({ events }, i) => ({
    msg_index: i,
    events,
    log: ''
  }))
  return logs.parseLogs(logsToParse)
}

module.exports = {
  parseRawLog
}
