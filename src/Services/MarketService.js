const logger = require('pino')()

const getOfferValue = (items, community) => {
    return new Promise(resolve => {
        let totalValue = 0;
        const promises = [];
    
        for (const item of items) {
            promises.push(new Promise(resolve => {
                community.getMarketItem(item.appid, item.market_hash_name, (error, itemValue) => {
                    if (error) logger.error(`Oops. There is an error occurred while getting market item with name #${item.market_hash_name}`)
                    
                    logger.info(`Item ${item.name} has a value of €${itemValue.lowestPrice ? itemValue.lowestPrice / 100 : 0}`)
                    totalValue += itemValue.lowestPrice ? itemValue.lowestPrice : 0
                        
                    resolve(item)
                })
            }))
        }
    
        Promise.all(promises).then(result => {
            logger.info(`The total trade value is €${totalValue / 100}`);
            resolve(result);
        })
    })
}

module.exports = getOfferValue;