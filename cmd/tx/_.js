'use strict'

const acceptOffer = require('./accept_offer')
const approve = require('./approve')
const betToken = require('./bet_token')
const declineOffer = require('./decline_offer')
const generateViewingKey = require('./generate_viewing_key')
const makeOffer = require('./make_offer')
const mintNft = require('./mint_nft')
const setViewingKey = require('./set_viewing_key')
const transferNft = require('./transfer_nft')

const commander = require('commander')

const myParseInt = require('../utils/parseInt')

/**
 * makeTxCommand
 */
function makeTxCommand () {
  const tx = new commander
    .Command('tx')
    .alias('t')

  tx
    .command('accept_offer')
    .argument('<id>', 'offer id', myParseInt)
    .action((id) => {
      console.log('===tx accept_offer===')
      acceptOffer(id).catch((e) => { console.log(e) })
    })

  tx
    .command('approve')
    .argument('<token id>', 'token id')
    .action((tokenId) => {
      console.log('===tx approve===')
      approve(tokenId).catch((e) => { console.log(e) })
    })

  tx
    .command('bet_token')
    .argument('<bet id>', 'bet id', myParseInt)
    .action((id) => {
      console.log('===tx bet_token===')
      betToken(id).catch((e) => { console.log(e) })
    })

  tx
    .command('decline_offer')
    .argument('<id>', 'offer id', myParseInt)
    .action((id) => {
      console.log('===tx decline_offer===')
      declineOffer(id).catch((e) => { console.log(e) })
    })

  tx
    .command('generate_viewing_key')
    .action(() => {
      console.log('===tx generate_viewing_key===')
      generateViewingKey().catch((e) => { console.log(e) })
    })

  tx
    .command('make_offer')
    .argument('<id>', 'offer id', myParseInt)
    .argument('<offeree>', 'offeree address')
    .argument('<offeror token id>', 'offeror token id')
    .argument('<offeree token id>', 'offeree token id')
    .action((id, offeree, offerorTokenId, offereeTokenId) => {
      console.log('===tx make_offer===')
      makeOffer(id, offeree, offerorTokenId, offereeTokenId).catch((e) => { console.log(e) })
    })

  tx
    .command('mint_nft')
    .argument('<owner>', 'owner address')
    .action((owner) => {
      console.log('===tx mint_nft===')
      mintNft(owner).catch((e) => { console.log(e) })
    })

  tx
    .command('set_viewing_key')
    .action(() => {
      console.log('===tx set_viewing_key===')
      setViewingKey().catch((e) => { console.log(e) })
    })

  tx
    .command('transfer_nft')
    .argument('<recipient>', 'recipient address')
    .argument('<token id>', 'token id')
    .action((recipient, tokenId) => {
      console.log('===tx transfer_nft===')
      transferNft(recipient, tokenId).catch((e) => { console.log(e) })
    })

  return tx
}

module.exports = makeTxCommand
