const SteamUser = require("steam-user");

const addFriend = (client, steamID, relationShip) => {
    return new Promise((resolve, reject) => {
        if (relationShip === SteamUser.EFriendRelationship.RequestRecipient) {
            client.addFriend(steamID, (error, personaName) => {
                if (error) {
                    reject(error);
                }
                resolve(personaName);
            })
        }
    });
}

module.exports = addFriend;