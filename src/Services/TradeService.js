const logger = require('pino')();
const Trade = require('../Models/Trade');

const saveTrade = async (offer) => {
    const trade = new Trade({
        id: offer.id,
        steamId: offer.partner.getSteamID64(),
        state: offer.state,
        created: offer.created,
        expires: offer.expires
    });

    try {
        await trade.save();
        logger.info(`Succesfully saved trade with ID #${offer.id} into the database`)
    } 
    catch (error) {
        logger.error(`Oops. There is an error occurred while saving the offer with ID #${offer.id} Error (${error})`)
        throw error;
    }
}

module.exports = saveTrade;