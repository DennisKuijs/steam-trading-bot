const getItemValue = require('./MarketService');

const logger = require('pino')()

const processOffer = (offer, community) => {
    console.log(offer);
    return new Promise((resolve, reject) => {
        if (offer.isGlitched() || offer.state === 11) {
            logger.info(`Declining offer with ID #${offer.id} because the offer is glitched`);
            declineOffer(offer, 'Offer Glitched')
            resolve();
        }
        
        if (offer.itemsToGive.length > 0) {
            declineOffer(offer, 'Try to steal items from the bot')
        }

        offer.itemsToReceive.map((item) => {
            const value = getItemValue(community, item.appid, item.market_hash_name);
            console.log(value)
        })
    });
}

const acceptOffer = (offer, community) => {
    logger.info(`Accepting offer with ID #${offer.id}`)
    offer.accept((error, status) => {
        if (error) logger.error(`Oops. There is an error occurred while accepting offer with ID #${offer.id}`)
        
        logger.info(`Accepted offer with ID #${offer.id}`)
        switch (status) {
            case 'pending':
                logger.info(`Offer with ID #${offer.id} needs additional confirmation`)
                community.acceptConfirmationForObject(process.env.STEAM_IDENTITY_SECRET, offer.id, (error) => {
                    if (error) logger.error(`Oops. There is an error occurred while confirming the offer with ID #${offer.id}`)
                    logger.info(`Offer with ID #${offer.id} succesfully confirmed`)
                })
                break;
        }
        
    })
}

const declineOffer = (offer, reason) => {
    logger.info(`Declining offer with ID #${offer.id} because ${reason}`)
    offer.decline((error) => {
        if (error) logger.error(`Oops.. There is an error occurred while declining offer with ID #${offer.id}`)
        logger.info(`Offer with ID #${offer.id} succesfully declined with reason ${reason}`)
    })
}

module.exports = processOffer, declineOffer;