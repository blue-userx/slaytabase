import fetch from 'node-fetch';
import { Client, Intents } from 'discord.js';
import Fuse from 'fuse.js'
import fs from 'fs';
import commands from './commands.js';
import embed from './embed.js';
import characters from './characters.js';
import keywordify from './keywords.js';
import emojify from './emojis.js';
import cfg from './cfg.js';
import fn from './fn.js';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

const search = new Fuse([], {
    includeScore: true,
    useExtendedSearch: true,
    keys: ['searchText'],
    ignoreLocation: true,
});
const queryLimit = 10; //max number of embeds on a discord message
search.add({
    name: 'help',
    itemType: 'help',
});

export {bot, search};

bot.once('ready', async () => {
    bot.user.setActivity('Downfall | <help>');
	console.log('connected to discord. ready!');
    await bot.channels.fetch().catch(e => {});
    bot.channels.cache.each(channel => {
        if (channel.type == 'GUILD_TEXT')
            channel.messages.fetch().catch(e => {});
    });
});

async function getEmbeds(msg) {
    let queries = [...msg.content.matchAll(/\<(.*?)\>/g)].map(e => e[1]);
    if (queries.length <= queryLimit) {
        if (queries.length > 0) {
            let embeds = [];
            for (let originalQuery of queries) {
                if (!(originalQuery.startsWith('@') || originalQuery.startsWith('#') || originalQuery.startsWith(':') || originalQuery.startsWith('a:') || originalQuery.startsWith('t:') || originalQuery.startsWith('http') || originalQuery == 'init')) {
                    let query = fn.unPunctuate(originalQuery);
                    if (query.length <= 0) continue;
                    let item = fn.find(query);
                    for (let i in commands)
                        if (query.startsWith(i))
                            item = {item: {
                                name: i,
                                do: commands[i],
                                itemType: 'command',
                            }};
                    console.log(`${msg.author.tag} searched for "${query}", found ${typeof item == 'object' ? `${item.item.itemType} "${item.item.name}"` : 'nothing'}`);
                    let genEmbed = await embed({...item.item, score: item.score, query}, msg, embeds);
                    if (genEmbed != null)
                        embeds.push(genEmbed)
                }
            }
            return embeds; //
        } else return 0;
    } else return null; //msg.reply("I can only take up to 10 queries at a time!").catch(e => {});
}

bot.on('messageCreate', async msg => {
    let embeds = await getEmbeds(msg);
    if (embeds === null)
        msg.reply('I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.').catch(e => {});
    else if (embeds === 0)
        return;
    else
        msg.reply({embeds, allowedMentions: {repliedUser: false}}).catch(e => {});
});

bot.on('messageUpdate', async (oldMsg, newMsg) => {
    let messages = await newMsg.channel.messages.fetch();
    let reply = messages.find(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == oldMsg.id);
    if (reply != undefined) {
        let embeds = await getEmbeds(newMsg);
        if (embeds === null)
            reply.edit({content: 'I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.', embeds: []}).catch(e => {});
        else if (embeds === 0)
            reply.delete().catch(e => {});
        else
            reply.edit({content: ' ', embeds, allowedMentions: {repliedUser: false}}).catch(e => {});
    } else
        bot.emit('messageCreate', newMsg);
});

bot.on('messageDelete', async msg => {
    let messages = await msg.channel.messages.fetch();
    let reply = messages.find(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == msg.id);
    if (reply != undefined)
        reply.delete().catch(e => {});
});

async function main() {
    console.log('loading and parsing data...');
    let data = JSON.parse(fs.readFileSync('./docs/altered/items.json'));
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

                case 'potions':
                    character = characters[item.hasOwnProperty('color') ? item.color : ''];
                    break;

                case 'bosss':
                    character = Object.values(characters).find(ch => ch[0].replace('The ', '') == item.name.slice(0, item.name.indexOf(' ')));
                    break;

                case 'events':
                    character = characters[item.character];
                    break;
            }
            let newItem = {
                ...item,
                searchName: fn.unPunctuate(item.name),
                itemType: itemType.slice(0,-1),
                mod: item.mod == '' ? 'slay-the-spire' : item.mod.toLowerCase(),
                description: item.hasOwnProperty('description') ? keywordify(item.description, character) : null,
                character,
            };
            newItem.character[0].replace('The ', '')
            newItem.searchText = fn.unPunctuate([
                    'name',
                    ['character', 0],
                    'campaign',
                    'itemType',
                    'type',
                    'color',
                    'description',
                    'tier',
                    'rarity',
                ].map(key => {
                    if (Array.isArray(key)) {
                        let look = newItem;
                        for (let j of key) {
                            if (!look.hasOwnProperty(j)) return '';
                            look = look[j];
                        }
                        return String(look);
                    } else if (newItem.hasOwnProperty(key)) return String(newItem[key]);
                    else return '';
                }).join(' '));
            if (newItem.description != null)
                newItem.description = emojify(newItem.description, character);
            search.add(newItem);
        }
    console.log('parsed data, connecting to discord...');
    bot.login(cfg.token);
}

main();