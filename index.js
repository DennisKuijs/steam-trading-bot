const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');

const dotenv = require('dotenv');
dotenv.config();

let client = new SteamUser();
let loginOptions = {
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
	twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_2FA_SHARED_SECRET)
}
client.logOn(loginOptions);

client.on('loggedOn', async function() {
    console.log('[BOT] Logged into Steam Account ' + client.steamID.getSteam3RenderedID());
    client.setPersona(SteamUser.EPersonaState.Online);
});
