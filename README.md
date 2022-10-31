# downfallbot
invite the bot: https://discord.com/oauth2/authorize?client_id=961824443653574687&permissions=0&scope=bot

## setup
1. `npm ci`
2. create `cfg.js` and paste the following in: `export default {"token":"jsdakfhajksdfh", "exportURL": "https://oceanuwu.github.io/downfallbot", "overriders": ["106068236000329728"]}` and set `token` as your discord bot token
3. create a thread in a channel where you want daily discussions to be created and copy its id.
4. create `dailyDiscussion.json` and paste the following in: `{"next": 1666312415000, "voteChannel": "0", "options": ["Strike ironclad"], "votes": [[]], "past":[]}` and set `voteChannel` as the thread id you just copied and set `next` as the current UNIX timestamp (the one with milliseconds)
5. `npm start`

## updating export
1. download [modded spire exporter](https://steamcommunity.com/sharedfiles/filedetails/?id=2069872611) and enable "export vanilla items"
2. on a profile where no beta art is enabled, create an export and move the `export` directory it creates to `docs/export` in this repo
3. enable "Playtester Art Mode" in the slay the spire settings, then create another export and move the `export` directory it creates to `docs/betaartexport` in this repo
4. `node alterExport.js` (use `node alterExport.js -images` if you need to export card images)