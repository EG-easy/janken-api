class OfferResponse {
  constructor (offerId) {
    this.offerId = offerId
  }

  setStatus (status) {
    this.status = status
    return this
  }

  setOfferor (offeror) {
    this.offeror = offeror
    return this
  }

  setOfferee (offeree) {
    this.offeree = offeree
    return this
  }

  setOfferorNFT (nft) {
    this.offerorNFT = nft
    return this
  }

  setOffereeNFT (nft) {
    this.offereeNFT = nft
    return this
  }

  setOfferorHands (hands) {
    this.offerorHands = hands
    return this
  }

  setOffereeHands (hands) {
    this.offereeHands = hands
    return this
  }

  setDrawPoint (p) {
    this.drawPoint = p
    return this
  }

  setWinner (addr) {
    this.winner = addr
    return this
  }
}

module.exports = OfferResponse
