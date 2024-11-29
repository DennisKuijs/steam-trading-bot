const SteamUser = require('steam-user');
const SteamTOTP = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const logger = require('pino')()
const dotenv = require('dotenv');
const addFriend = require('./src/Services/FriendService');
const processOffer = require('./src/Services/OfferService');

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
    logger.error(`Oops.. There is an error occurred during login (${error.message})`)
});

// //Emits when a (friend) user sends a message to the bot 
client.chat.on('friendMessage', (message) => {
    client.chatMessage(message.steamid_friend, 'Bliep.. Bloop..');
});

//Emits when a user makes a friendrequest to the steam bot.s
client.on('friendRelationship', (steamID, relationShip) => {
    addFriend(client, steamID, relationShip)
    .then((personaName) => {
        logger.info(`Succesfully added ${personaName} to your friends list.`);
    })
    .catch((error) => {
        logger.error(`Oops.. There is an error occurred while adding user with SteamID ${steamID} as new friend (${error.message})`)
    })
});

manager.on('newOffer', (offer) => {
    console.log(offer);
    logger.info(`Received new offer with ID #${offer.id} from user ${offer.partner.getSteamID64()}`)
    processOffer(offer, community);
});