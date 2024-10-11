const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');

let client = new SteamUser();
let manager = new TradeOfferManager({
    "steam": client,
    "domain": "localhost",
    "language": "en"
})

let loginOptions = {
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
}

client.logOn(loginOptions);

client.on('loggedOn', function() {
    console.log('[BOT] Logged into Steam Account ' + client.steamID.getSteam3RenderedID());
    client.setPersona(SteamUser.EPersonaState.Online);
});

manager.on('newOffer', function(offer) {
	console.log("New offer #" + offer.id + " from " + offer.partner.getSteam3RenderedID());
	offer.accept(function(err, status) {
		if (err) {
			console.log("Unable to accept offer: " + err.message);
		} else {
			console.log("Offer accepted: " + status);
			if (status == "pending") {
				community.acceptConfirmationForObject("identitySecret", offer.id, function(err) {
					if (err) {
						console.log("Can't confirm trade offer: " + err.message);
					} else {
						console.log("Trade offer " + offer.id + " confirmed");
					}
				});
			}
		}
	});
});