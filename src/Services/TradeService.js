const logger = require('pino')();
const SteamID = require('steamid');
const Trade = require('../Models/Trade');

const createTrade = async (offer) => {
    const trade = new Trade({
        id: offer.id,
        steamId: offer.partner.getSteamID64(),
        state: offer.state,
        created: offer.created,
        expires: offer.expires
    });

    try {
        const savedTrade = await trade.save();
        logger.info(`Succesfully saved trade with ID #${offer.id} into the database`)
        return savedTrade;
    } catch (error) {
        logger.error(`Oops. There is an error occurred while saving the offer with ID #${offer.id} Error (${error})`)
    }
}

module.exports = createTrade;