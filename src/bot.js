//Import necessary modules.
const SteamUser = require('steam-user');
const SteamTOTP = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const dotenv = require('dotenv');

//Configure dotenv for storing secure values.
dotenv.config();

//Login into the Steam Account which will be used for the bot.
const client = new SteamUser();
let loginOptions = {
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
    twoFactorCode: SteamTOTP.generateAuthCode(process.env.STEAM_2FA_SHARED_SECRET)
}
client.logOn(loginOptions);

const manager = new TradeOfferManager({
    steam: client,
    domain: process.env.BOT_DOMAIN,
    language: process.env.BOT_LANGUAGE

});
const community = new SteamCommunity();


client.on('webSession', function(sessionID, cookies) {
    manager.setCookies(cookies, function(err) {
        if (err) {
            console.log(`There is an error occured (Error: ${err.message})`);
            process.exit(1);
        }
        console.log('Cookies Set');
    });

    community.setCookies();
});

//Emits when there is an error occured during login
client.on('error', function(err) {
    console.log(`There is an error occured (Error: ${err.message})`);
});

//Emits when successfully logged in to the Steam account
client.on('loggedOn', function() {
    console.log('------------------------------------------------------------------');
    console.log('[BOT] Successfully connected to Steam account');
    console.log(`[BOT] SteamID64: ${client.steamID.getSteamID64()}`);
    console.log(`[BOT] Steam2RenderedID: ${client.steamID.getSteam2RenderedID()}`);
    console.log(`[BOT] Steam3RenderedID: ${client.steamID.getSteam3RenderedID()}`);
    console.log('------------------------------------------------------------------');
   
    //Set Steam account profile status to Online.
    client.setPersona(SteamUser.EPersonaState.Online);

    // manager.getInventoryContents(client.steamID.getSteamID64(), 624820, 2, false, function(err, inventory) {
    //     console.log(inventory);
    // })
});

//Emits when a (friend) user sends a message to the bot 
client.chat.on('friendMessage', function(message) {
    client.chatMessage(message.steamid_friend, 'Bliep.. Bloop..');
});

//Emits when a user makes a friendrequest to the steam bot.
client.on('friendRelationship', function(SteamID, relationShip) {
    if(relationShip == SteamUser.EFriendRelationship.RequestRecipient) {
        client.addFriend(SteamID, function(err, steamUser) {
            if(err) {
                console.log(`Unable to add user with SteamID ${SteamID} as friend`)
            }
            console.log(steamUser);
        });
    }
});