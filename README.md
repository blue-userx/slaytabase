# downfallbot
invite the bot: https://discord.com/oauth2/authorize?client_id=961824443653574687&permissions=0&scope=bot

## setup
1. `npm ci`
2. create `cfg.json` and paste the following in : `export default {"token":"jsdakfhajksdfh", "exportURL": "https://oceanuwu.github.io/downfallbot"}` and set `token` as your discord bot token
3. `npm start`

## updating export
1. download [modded spire exporter](https://steamcommunity.com/sharedfiles/filedetails/?id=2069872611) and run it in-game with "export vanilla items" enabled.
2. move the `export` directory it creates to `docs` in this repo
3. `node alterExport.js`