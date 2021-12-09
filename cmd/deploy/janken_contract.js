// @ts-check
const initClient = require('../../client/client')
const { Executor } = require('../../service/executor/Executor')

/**
 * jankenDeploy
 */
const jankenDeploy = async () => {
  const client = await initClient()
  const executor = new Executor(client)

  const wasmPATH = './wasm/janken.wasm'
  const initMsg = {
    prng_seed: 'prng_seed',
    fee_recipient: client.senderAddress
  }
  const contractName = `My Janken${Math.ceil(Math.random() * 10000)}`

  const initialDepositToken = [{
    denom: 'uscrt',
    amount: '100000000'
  }]

  await executor.deploy(wasmPATH, initMsg, contractName, initialDepositToken)
}

module.exports = jankenDeploy
