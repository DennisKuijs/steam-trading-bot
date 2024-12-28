const SteamUser = require('steam-user');
const SteamTOTP = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const logger = require('pino')()
const dotenv = require('dotenv');
const addFriend = require('./src/Services/FriendService');
const { processOffer, createOffer } = require('./src/Services/OfferService');
const ioClient = require('socket.io-client');

dotenv.config();

//Login into the Steam Account which will be used for the bot.
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    domain: process.env.BOT_DOMAIN,
    language: process.env.BOT_LANGUAGE,
    useAccessToken: true
});

client.logOn({
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
    twoFactorCode: SteamTOTP.generateAuthCode(process.env.STEAM_2FA_SHARED_SECRET)
});

const socket = ioClient.connect("http://localhost:3000");
socket.on('trade', (trade) => {
    createOffer(trade.user, trade.item, manager);
})

//Emits when successfully logged in to the Steam account
client.on('loggedOn', () => {
    logger.info(`Succesfully connected to Steam account with SteamID ${client.steamID.getSteamID64()}`)

    //Set Steam account profile status to Online.
    client.setPersona(SteamUser.EPersonaState.Online);
    //Set Games played to TF2 (Team Fortress 2)
    client.gamesPlayed(440);
});

client.on('webSession', (sessionID, cookies) => {
    manager.setCookies(cookies, (error) => {
        if(err) {
            logger.error(`Oops.. There is an error occurred while setting cookies (${error.message})`)
            return;
        }
        logger.info(`Succesfully set cookies for Trade Offer Manager`)
    })
});

client.on('error', (error) => {
    logger.error(`Oops.. There is an error occurred during login Error: (${error.message})`)
});

// //Emits when a (friend) user sends a message to the bot 
client.chat.on('friendMessage', (message) => {
    client.chatMessage(message.steamid_friend, 'Bliep.. Bloop..');
});

//Emits when a user makes a friendrequest to the steam bot.s
client.on('friendRelationship', (steamID, relationShip) => {
    logger.info(`Received new friend request from SteamID ${steamID} with status ${relationShip}}`)

    addFriend(client, steamID, relationShip)
    .then(() => {
        logger.info(`Succesfully processed friend request from SteamID ${steamID}`);
    })
    .catch((error) => {
        logger.error(`There is an error occurred while processing the friend request from SteamID ${steamID} Error: (${error.message})`)
    })
});

manager.on('newOffer', (offer) => {
    logger.info(`Received new offer with ID #${offer.id} from user ${offer.partner.getSteamID64()}`)
    
    processOffer(offer, community)
    .then((processedOffer) => {
        logger.info(`Succesfully processed offer with ID ${processedOffer.id}`)
    })
    .catch((error) => {
        logger.error(`Oops.. There is an error occurred while processing the offer with ID ${offer.id} Error: (${error.message})`)
    })
});