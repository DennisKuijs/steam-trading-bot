const logger = require('pino')()

const getItemValue = (community, appId, hashName) => {
    community.getMarketItem(appId, hashName, (error, item) => {
        if (error) logger.error(`Oops. There is an error occurred while getting market item with name #${hashName}`)
        return (item.lowestPrice / 100) * 80
    });
}

module.exports = getItemValue;