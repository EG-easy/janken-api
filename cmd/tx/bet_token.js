// @ts-check
const initClient = require('../../client/client')
const { Executor } = require('../../service/executor/Executor')

/**
 * declineOffer
 * @param {Number} id
 */
const betToken = async (id) => {
  const client = await initClient()
  const contractAddress = process.env.JANKEN_CONTRACT

  console.log(contractAddress)

  const executor = new Executor(client, contractAddress)

  const handleMsg = {
    bet_token: {
      denom: 'uscrt',
      amount: 1000,
      hand: 1,
      entropy: 'aaaaa'
    }
  }
  console.log(JSON.stringify(handleMsg))
  const response = await executor.execute(handleMsg)
  console.log('response: ', JSON.stringify(response))
}

module.exports = betToken
