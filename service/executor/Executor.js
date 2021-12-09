// @ts-check
const fs = require('fs')

class Executor {
  /**
   * @constructor
   * @param {import('secretjs').SigningCosmWasmClient} client
   * @param {string} contractAddress
   */
  constructor (client, contractAddress = '') {
    this.client = client
    this.contractAddress = contractAddress
  }

  /**
   * deploy
   * @param {String} wasmPATH
   * @param {Object} initMsg
   * @param {String} contractName
   */

  async deploy (wasmPATH, initMsg, contractName, token = null) {
    const wasm = fs.readFileSync(wasmPATH)
    console.log('Uploading contract')
    const uploadReceipt = await this.client.upload(wasm, {}).catch((err) => {
      throw new Error(`Could not upload contract: ${err}`)
    })

    console.log('uploadReceipt', JSON.stringify(uploadReceipt))

    // Get the code ID from the receipt
    const { codeId } = uploadReceipt
    const contract = await this.client.instantiate(
      codeId,
      initMsg,
      contractName,
      'memo',
      token
    )
      .catch((err) => {
        throw new Error(`Could not instantiate contract: ${err}`)
      })

    const { contractAddress } = contract

    console.log('contract: ', JSON.stringify(contract), 'address:', contractAddress)
  }

  /**
   * execute
   * @param {Object} handleMsg
   */
  async execute (handleMsg, token = null) {
    const response = await this.client.execute(
      this.contractAddress,
      handleMsg,
      'memo',
      token
    )
      .catch((e) => { throw new Error(`fail to execute Msg: ${e}`) })
    console.log('res:', response)
    return response
  }

  /**
   * query
   * @param {Object} queryMsg
   */
  async query (queryMsg) {
    const response = await this.client.queryContractSmart(this.contractAddress, queryMsg)
      .catch((e) => { throw new Error(`fail to query Msg: ${e}`) })
    return response
  }
}

module.exports = {
  Executor
}
