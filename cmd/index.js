// @ts-check
const { parseRawLog } = require('./logs')
const initClient = require('../client/client')

const main = async () => {
  const client = await initClient()

  const q = { id: 'A55C50155D34A4599A2AA2E07A37CAFD91F95E60D6FAB7751A7C1B93AF521DFF' }
  // const q = { height: 141454 }
  const txs = await client.restClient.txById(q.id, true)
    .catch((e) => {
      throw new Error(`failed to get txs: ${e}`)
    })

  console.log(JSON.stringify(txs))
}

main()
