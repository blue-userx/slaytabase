import fetch from 'node-fetch';
import { Client, Intents } from 'discord.js';
import Fuse from 'fuse.js'
import fs from 'fs';
import commands from './commands.js';
import embed from './embed.js';
import characters from './characters.js';
import keywordify from './keywords.js';
import cfg from './cfg.js';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

const search = new Fuse([], {
    includeScore: true,
    useExtendedSearch: true,
    keys: ['searchText'],
    distance: 1000,
});
const queryLimit = 10; //max number of embeds on a discord message
search.add({
    name: 'help',
    itemType: 'help',
});

String.prototype.unPunctuate = function() {return this.replace(/[^\w\s+]|_/g, "").replace(/\s+/g, " ")};

bot.once('ready', async () => {
    bot.user.setActivity('Downfall | <help>');
	console.log('connected to discord. ready!');
});

bot.on('messageCreate', async msg => {
    let queries = [...msg.content.matchAll(/\<(.*?)\>/g)].map(e => e[1]);
    if (queries.length <= queryLimit) {
        if (queries.length > 0) {
            let embeds = []
            for (let originalQuery of queries) {
                if (!(originalQuery.startsWith('@') || originalQuery.startsWith('#') || originalQuery.startsWith(':') || originalQuery == 'init')) {
                    let query = originalQuery.trim().toLowerCase().unPunctuate();
                    let results = search.search(query);
                    let item = results.length > 0 ? results[0] : undefined; //(query.includes('+') ? results.find(e => e.name.includes('+')) : results[0])
                    if (commands.hasOwnProperty(query))
                        item = {item: {
                            do: commands[query],
                            itemType: 'command',
                        }};
                    else if (item == undefined)
                        item = {item: {
                            itemType: 'fail',
                            name: 'No results',
                        }};
                    else if (item.item.name.toLowerCase().unPunctuate() != query) {
                        let exactMatch = search._docs.find(e => e.name.toLowerCase().unPunctuate() == query);
                        if (exactMatch != undefined)
                            item = {item: exactMatch, score: 0};
                    } else
                    console.log(`${msg.author.tag} searched for "${query}", found ${typeof item == 'object' ? `${item.item.itemType} "${item.item.name}"` : 'nothing'}`);
                    let genEmbed = await embed({...item.item, score: item.score, query}, msg, embeds);
                    if (genEmbed != null)
                        embeds.push(genEmbed)
                }
            }
            msg.reply({embeds, allowedMentions: {repliedUser: false}}).catch(e => {});
        }
    } else {
        msg.reply("I can only take up to 10 queries at a time!").catch(e => {});
    }
});

async function main() {
    console.log('loading and parsing data...');
    let data = JSON.parse(fs.readFileSync('./docs/items.json'));
    for (let itemType in data)
        for (let item of data[itemType]) {
            let character = characters[''];
            if (item.type == 'Player') continue;
            switch(itemType) {
                case 'cards':
                    character = characters[item.color];
                    break;

                case 'relics':
                    character = characters[item.pool];
                    break;
            }
            let newItem = {
                ...item,
                itemType: itemType.slice(0,-1),
                mod: item.mod == '' ? 'slay-the-spire' : item.mod.toLowerCase(),
                description: item.hasOwnProperty('description') ? keywordify(item.description, character) : null,
                character,
            };
            newItem.character[0].replace('The ', '')
            newItem.searchText = [
                    'name',
                    ['character', 0],
                    'itemType',
                    'type',
                    'color',
                    'description',
                ].map(key => {
                    if (Array.isArray(key)) {
                        let look = newItem;
                        for (let j of key) {
                            if (!look.hasOwnProperty(j)) return '';
                            look = look[j];
                        }
                        return String(look).unPunctuate();
                    } else if (newItem.hasOwnProperty(key)) return String(newItem[key]).unPunctuate();
                    else return '';
                }).join(' '),
            search.add(newItem);
        }
    console.log('parsed data, connecting to discord...');
    bot.login(cfg.token);
}

main();