const getOfferValue = require('./MarketService');
const saveTrade = require('./TradeService');
const logger = require('pino')()

const processOffer = (offer, community) => {
    return new Promise(async (resolve, reject) => {

        await saveTrade(offer);

        if (offer.isGlitched() || offer.state === 11) {
            logger.info(`Declining offer with ID #${offer.id} because the offer is glitched`);
            return await declineOffer(offer, 'Offer Glitched')
            .then(() => {
                resolve(offer);
            })
            .catch((error) => {
                reject(error);
            });
        }
        
        if (offer.itemsToGive.length > 0) {
            return await declineOffer(offer, 'Try to steal items from the bot')
            .then(() => {
                resolve(offer);
            })
            .catch((error) => {
                reject(error);
            });
        }

        const offerValue = await getOfferValue(offer.itemsToReceive, community);
        if (offerValue < 20) {
            return await declineOffer(offer, 'The offer value is below €0.20')
            .then(() => {
                resolve(offer);
            })
            .catch((error) => {
                reject(error);
            });
        }

        await acceptOffer(offer, community)
        .then(() => {
            resolve(offer);
            return;
        })
        .catch((error) => {
            reject(error);
        })
    });
}

const acceptOffer = (offer, community) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`Accepting offer with ID #${offer.id}`)
        offer.accept((error, status) => {
            if (error) {
                logger.error(`Oops. There is an error occurred while accepting offer with ID #${offer.id}`)
                reject(error);
            }
            
            logger.info(`Accepted offer with ID #${offer.id}`)
            switch (status) {
                case 'pending':
                    logger.info(`Offer with ID #${offer.id} needs additional confirmation`)
                    community.acceptConfirmationForObject(process.env.STEAM_IDENTITY_SECRET, offer.id, (error) => {
                        if (error) {
                            logger.error(`Oops. There is an error occurred while confirming the offer with ID #${offer.id}`)
                            reject(error);
                        }
                        logger.info(`Offer with ID #${offer.id} succesfully confirmed`)
                    })
                    break;
            }
            resolve();
        })
    })
}

const declineOffer = (offer, reason) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`Declining offer with ID #${offer.id} because ${reason}`)
        offer.decline((error) => {
            if (error) {
                logger.error(`Oops.. There is an error occurred while declining offer with ID #${offer.id}`)
                reject(error);
            }
            logger.info(`Offer with ID #${offer.id} succesfully declined with reason ${reason}`)
            resolve();
        })
    })
}

const createOffer = (user, item, manager) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`Creating new offer for user ${user}`);
        const offer = manager.createOffer(user);
        console.log(item);
    })
}

module.exports = { processOffer, createOffer }