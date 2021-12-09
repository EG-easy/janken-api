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

  const betToken = [{
    denom: 'uscrt',
    amount: '1000000'
  }]

  const handleMsg = {
    bet_token: {
      id: id,
      hand: 1,
      entropy: 'aaaaa'
    }
  }
  console.log(JSON.stringify(handleMsg))
  const response = await executor.execute(handleMsg, betToken)
  console.log('response: ', JSON.stringify(response))
}

module.exports = betToken
