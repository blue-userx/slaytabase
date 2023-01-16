# slaytabase
invite the bot: https://discord.com/oauth2/authorize?client_id=961824443653574687&permissions=0&scope=bot

## adding/updating mods
1. download [my version of modded spire exporter](https://github.com/OceanUwU/sts-exporter/releases/tag/v0.8.3)
2. launch mod the spire with Basemod, SpireExporter, and the mod(s) you'd like to add/update
3. in SpireExporter's mod config, disable "export vanilla items", and enable "export images"
4. create a directory called `gamedata` in this repo
5. on a profile where no beta art is enabled, create an export and move the `export` directory it creates into `gamedata` in this repo
6. (optional - do this if your mod has beta art for its cards) enable "Playtester Art Mode" in the slay the spire settings, then create another export and rename the `export` directory it creates to `betaartexport`, then move it into `gamedata` in this repo
7. you may need to edit `extraItems.js` at this point
8. (requires [node.js v16+](https://nodejs.org/en/download/)) run `npm install` then `node alterExport.js` (this can take a while)
9. if the mod contains a character, add data about them to `characters.js`
10. commit & push & make a pull request

## setup for running the bot
1. `npm ci`
2. create `cfg.js` and paste the following in: `export default {"token":"jsdakfhajksdfh", "exportURL": "https://oceanuwu.github.io/slaytabase", "overriders": ["106068236000329728"]}` and set `token` as your discord bot token
3. create a thread in a channel where you want daily discussions to be created and copy its id.
4. create `dailyDiscussion.json` and paste the following in: `{"next": 1666312415000, "voteChannel": "0", "options": ["slimebound:split"], "votes": [[]], "past":[]}` and set `voteChannel` as the thread id you just copied and set `next` as the current UNIX timestamp (the one with milliseconds)
5. `npm start`