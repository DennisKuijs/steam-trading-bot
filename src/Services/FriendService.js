const SteamUser = require("steam-user");

const addFriend = (client, steamID, relationShip) => {
    return new Promise((resolve, reject) => {
        if (relationShip === SteamUser.EFriendRelationship.RequestRecipient) {
            client.addFriend(steamID, (error, personaName) => {
                
                if (error) {
                    logger.error(`Oops.. There is an error occurred while adding the user with SteamID ${steamID} as new friend Error: (${error.message})`)
                    reject();
                }

                logger.info(`Succesfully added ${personaName} to your friends list.`);
                resolve();
            })
        }
    });
}

module.exports = addFriend;