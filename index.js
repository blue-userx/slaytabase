import fetch from 'node-fetch';
import { Client, Intents } from 'discord.js';
import * as JsSearch from 'js-search';
import embed from './embed.js';
import characters from './characters.js';
import keywordify from './keywords.js';
import cfg from './cfg.js';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

const search = new JsSearch.Search('id');
search.addIndex('name');
search.addIndex('itemType');
search.addIndex('color');
search.addIndex('type');
search.addIndex(['character', 0]);

const queryLimit = 10; //max number of embeds on a discord message

bot.once('ready', async () => {
    bot.user.setActivity('Downfall | <help>');
	console.log('connected to discord. ready!');
});

bot.on('messageCreate', msg => {
    let queries = [...msg.content.matchAll(/\<(.*?)\>/g)];
    if (queries.length <= queryLimit) {
        if (queries.length > 0) {
            let embeds = []
            for (let i of queries) {
                let query = i[1]
                if (!(query.startsWith('@') || query.startsWith('#') || query.startsWith(':') || query == 'init')) {
                    let results = search.search(query);
                    let item = results.length > 0 ? (query.includes('+') ? results.find(e => e.name.includes('+')) : results[0]) : undefined;
                    let exactResult = results.find(e => e.name.toLowerCase() == query.toLowerCase());
                    if (exactResult != undefined)
                        item = exactResult;
                    if (item == undefined)
                        item = {
                            itemType: 'fail',
                            name: 'No results',
                        };
                    console.log(`${msg.author.tag} searched for "${query}", found ${typeof item == 'object' ? `${item.itemType} "${item.name}"` : 'nothing'}`);
                    embeds.push(embed({...item, query}))
                }
            }
            msg.reply({embeds, allowedMentions: {repliedUser: false}}).catch(e => {});
        }
    } else {
        msg.channel.send("I can only take up to 10 queries at a time").catch(e => {});
    }
});

async function main() {
    console.log('fetching data...');
    let response = await fetch(`${cfg.exportURL}/items.json`);
    console.log('fetched data, parsing it...');
    let data = await response.json();
    let i = 0;
    for (let itemType in data)
        for (let item of data[itemType]) {
            let character = characters[''];
            switch(itemType) {
                case 'cards':
                    character = characters[item.color];
                    break;

                case 'relics':
                    character = characters[item.pool];
                    break;
            }
            search.addDocument({
                ...item,
                id: i++,
                itemType: itemType.slice(0,-1),
                mod: item.mod == '' ? 'slay-the-spire' : item.mod.toLowerCase(),
                description: item.hasOwnProperty('description') ? keywordify(item.description, character) : null,
                character,
            });
        }
    search.addDocument({
        id: i++,
        name: 'help',
        itemType: 'help',
    });
    console.log('parsed data, connecting to discord...');
    bot.login(cfg.token);
}

main();