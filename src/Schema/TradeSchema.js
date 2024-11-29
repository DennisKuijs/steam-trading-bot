const dynamoose = require('dynamoose');

const tradeSchema = new dynamoose.Schema({
    id: String,
    steamId: String,
    state: Number,
    created: Date,
    expires: Date,
}, {
    saveUnknown: false,
    timestamps: false
})

module.exports = tradeSchema;