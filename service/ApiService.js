// @ts-check
const s3AvatarUploader = require('../graphql/s3')

const getArraysDiff = require('./helper/getArraysDiff')

const OfferResponse = require('./types/OfferResponse')

/**
 * ApiService
 */
class ApiService {
  /**
   * @constructor
   * @param {import('./executor/JankenExecutor').JankenExecutor} jankenExecutor
   * @param {import('./executor/SNIP721Executor').SNIP721Executor} snip721Executor
   * @param {import('./orm/OrmWrapper').OrmWrapper} orm
   */
  constructor (jankenExecutor = null, snip721Executor = null, orm) {
    this.jankenExecutor = jankenExecutor
    this.snip721Executor = snip721Executor
    this.orm = orm
  }

  /**
   * postUploadImage
   * @param {Object} args
   */
  async postUploadImage (args) {
    const { createReadStream, filename, mimetype, encoding } = await args.file.file
    const uri = await s3AvatarUploader.upload(createReadStream(), {
      filename,
      mimetype
    })
      .catch((e) => { throw new Error(`fail to upload image: ${e}`) })

    return {
      filename,
      mimetype,
      encoding,
      uri
    }
  }

  /**
   * postMintNFT
   * @param {Object} args
   */
  async postMintNFT (args) {
    const tokenId = 'snip721-' + Math.floor(Math.random() * 10000).toString()

    // check tokenId
    await this.orm.checkIfTokenIDIsUnique(tokenId)

    args.tokenId = tokenId

    const response = await this.snip721Executor.executeMintNFT(args)

    // save to DB
    await this.orm.postNFT(args)

    return response
  }

  /**
   * fetchAllNFTs
   */
  async fetchAllNFTs () {
    return await this.orm.getNFTs()
  }

  /**
   * fetchNFT
   * @param {Object} args
   */
  async fetchNFT (args) {
    return await this.orm.getNFT(args)
  }

  /**
   * fetchNFTsByOwner
   * @param {Object} args
   */
  async fetchNFTsByOwner (args) {
    return await this.orm.getNFTsByOwner(args)
  }

  /**
   * postPollingNFTOwners
   */
  async postPollingNFTOwners () {
    const owners = await this.orm.getAllNFTOwners()
    const ownersList = owners.map(value => value.owner)

    console.log(owners)

    for (const owner of ownersList) {
      const args = { owner: owner }
      const NFTsInDB = await this.orm.getNFTsByOwner(args)
      const tokenIdsFromDB = NFTsInDB.map(value => value.tokenId)
      console.log(tokenIdsFromDB)

      const NFTsFromContract = await this.snip721Executor.queryTokens(owner)
      const tokenIdsFromContract = NFTsFromContract.token_list.tokens

      const diffNFTs = getArraysDiff(tokenIdsFromDB, tokenIdsFromContract)
      console.log('diff: ', diffNFTs)
      for (const tokenId of diffNFTs) {
        try {
          const res = await this.snip721Executor.queryAllNftInfo(tokenId)
          console.log(res)

          const owner = res.all_nft_info.access.owner

          await this.orm.updateNFTOwner(tokenId, owner)
            .catch((e) => console.log(e))
        } catch (e) {
          console.log('failed to query')
        }
      }
    }

    return { status: 'ok' }
  }

  async postMakeOffer (args) {
    const id = args.input.offerId

    // check offerId
    await this.orm.checkIfOfferIDIsUnique(id)

    const response = await this.jankenExecutor.queryOffer(id)

    if (response === '') {
      throw new Error('failed to query offer id, offer is not exsit')
    }

    // // save to DB
    await this.orm.postOffer(args)

    return { status: 'ok' }
  }

  /**
   * postAcceptOffer
   * @param {Object} args
   */
  async postAcceptOffer (args) {
    const offerId = args.input.offerId
    const offer = await this.orm.getOffer({ offerId: offerId })

    const response = await this.jankenExecutor.queryOffer(offer.offerId)
    offer.offereeHands = JSON.stringify(args.input.offereeHands)
    offer.status = response.status
    offer.winner = response.winner

    await this.orm.updateOffer(offer)
    return { status: 'ok' }
  }

  /**
   * postDeclineOffer
   * @param {Object} args
   */
  async postDeclineOffer (args) {
    const offerId = args.input.offerId
    const offer = await this.orm.getOffer({ offerId: offerId })

    const response = await this.jankenExecutor.queryOffer(offer.offerId)
    offer.status = response.status

    await this.orm.updateOffer(offer)

    return { status: 'ok' }
  }

  /**
   * fetchOffers
   * @param {Object} args
   */
  async fetchOffers (args) {
    const offers = await this.orm.getOffers(args)

    const offerResponse = []
    for (const offer of offers) {
      const offerorNFT = await this.orm.getNFT({ tokenId: offer.offerorNft })
      const offereeNFT = await this.orm.getNFT({ tokenId: offer.offereeNft })

      const res = new OfferResponse(offer.offerId)
        .setStatus(offer.status)
        .setOfferorNFT(offerorNFT)
        .setOffereeNFT(offereeNFT)
        .setOfferorHands(JSON.parse(offer.offerorHands))
        .setOffereeHands(JSON.parse(offer.offereeHands))
        .setDrawPoint(offer.drawPoint)
        .setWinner(offer.winner)

      offerResponse.push(res)
    }

    return offerResponse
  }

  async fetchBattles (args) {
    const offers = await this.orm.getBattles(args)

    const offerResponse = []
    for (const offer of offers) {
      const offerorNFT = await this.orm.getNFT({ tokenId: offer.offerorNft })
      const offereeNFT = await this.orm.getNFT({ tokenId: offer.offereeNft })

      const res = new OfferResponse(offer.offerId)
        .setStatus(offer.status)
        .setOfferorNFT(offerorNFT)
        .setOffereeNFT(offereeNFT)
        .setOfferorHands(JSON.parse(offer.offerorHands))
        .setOffereeHands(JSON.parse(offer.offereeHands))
        .setDrawPoint(offer.drawPoint)
        .setWinner(offer.winner)
        .setOfferor(offer.offeror)
        .setOfferee(offer.offeree)
      offerResponse.push(res)
    }

    return offerResponse
  }
}

module.exports = ApiService
