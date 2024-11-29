const dynamoose = require('dynamoose');
const tradeSchema = require('../Schema/TradeSchema');

const Trade = dynamoose.model('trades', tradeSchema, {
    create: false,
    waitForActive: false
})

module.exports = Trade;