import fetch from 'node-fetch';
import { Client, GatewayIntentBits, ContextMenuCommandBuilder, ApplicationCommandType, Partials, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Fuse from 'fuse.js'
import fs from 'fs';
import commands from './commands.js';
import embed from './embed.js';
import characters from './characters.js';
import keywordify from './keywords.js';
import emojify from './emojis.js';
import cfg from './cfg.js';
import fn from './fn.js';
import startDailyDiscussion from './dailyDiscussion.js';
import { match } from 'assert';

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });

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
    await bot.users.fetch().catch(e => {});
    await bot.channels.fetch().catch(e => {});
    bot.channels.cache.each(channel => {
        if (channel.hasOwnProperty('messages'))
            channel.messages.fetch().catch(e => {});
    });
    startDailyDiscussion();

    await bot.application?.commands.set([
        new SlashCommandBuilder()
            .setName('i')
            .setDescription('Finds an item from Slay the Spire and displays info about it.')
            .addStringOption(option =>
                option.setName('query')
                .setDescription('Item name')
                .setRequired(true)
                .setAutocomplete(true)),
        new ContextMenuCommandBuilder()
            .setName('find items')
            .setType(ApplicationCommandType.Message)
    ]);
});

async function getEmbeds(msg) {
    let queries = [...msg.content.matchAll(/\<(.*?)\>/g)]
        .map(e => e[1])
        .filter(q => !(q.startsWith('@') || q.startsWith('#') || q.startsWith(':') || q.startsWith('a:') || q.startsWith('t:') || q.startsWith('http') || q == 'init'));
    if (queries.length <= queryLimit) {
        if (queries.length > 0) {
            let embeds = [];
            for (let originalQuery of queries) {
                let query = fn.unPunctuate(originalQuery);
                if (query.length <= 0) continue;
                let item = fn.find(query);
                for (let type of [['prefix', 'startsWith'], ['suffix', 'endsWith']])
                    for (let i in commands[type[0]])
                        if (query[type[1]](i))
                            item = {item: {
                                name: i,
                                type: type[0],
                                do: commands[type[0]][i],
                                itemType: 'command',
                                originalQuery,
                            }};
                console.log(`${msg.author.tag} searched for "${query}", found ${typeof item == 'object' ? `${item.item.itemType} "${item.item.name}"` : 'nothing'}`);
                let genEmbed = await embed({...item.item, score: item.score, query}, msg, embeds);
                if (genEmbed != null)
                    embeds.push(genEmbed)
            }
            return embeds; //
        } else return 0;
    } else return null; //msg.reply("I can only take up to 10 queries at a time!").catch(e => {});
}

function getFilesFromEmbeds(embeds) {
    let files = [];
    for (let embed of embeds) {
        files = [...files, ...(Array.isArray(embed.data.files) ? embed.data.files : [])];
        delete embed.files;
    }
    return files;
}

const delfiles = files => files.forEach(file => fs.unlinkSync(file));

bot.on('messageCreate', async msg => {
    if (msg.content.includes('```java')) return;
    let embeds = await getEmbeds(msg);
    if (embeds === null)
        msg.reply('I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.').catch(e => {});
    else if (embeds === 0) return;
    else {
        let files = getFilesFromEmbeds(embeds);
        if (files.length > 10) await msg.reply('I can only attach 10 images per message! Edit your message so that I would use fewer than 10 images in my reply, and I\'ll update mine.');
        else await msg.reply({embeds, files, allowedMentions: {repliedUser: false}}).catch(e => {});
        delfiles(files);
    }
});

bot.on('messageUpdate', async (oldMsg, newMsg) => {
    let messages;
    try {
        messages = await newMsg.channel.messages.fetch();
    } catch(e) {
        return;
    }
    let reply = messages.find(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == oldMsg.id);
    if (reply != undefined) {
        if (oldMsg.attachments.size > newMsg.attachments.size) return;
        let embeds = await getEmbeds(newMsg);
        if (embeds === null)
            reply.edit({content: 'I can only take up to 10 queries at a time! Edit your message to use 10 or fewer queries, and I\'ll update mine.', embeds: []}).catch(e => {});
        else if (embeds === 0)
            reply.delete().catch(e => {});
        else {
            let files = getFilesFromEmbeds(embeds)
            if (files.length > 10) await reply.edit({content: 'I can only attach 10 images per message! Edit your message so that I would use fewer than 10 images in my reply, and I\'ll update mine.', embeds: [], files: []});
            else await reply.edit({content: ' ', embeds, files, allowedMentions: {repliedUser: false}}).catch(e => {});
            delfiles(files);
        }
    } else
        bot.emit('messageCreate', newMsg);
});

bot.on('messageDelete', async msg => {
    let messages = await msg.channel.messages.fetch();
    let reply = messages.find(i => i.author.id == bot.user.id && i.reference != null && i.reference.messageId == msg.id);
    if (reply != undefined)
        reply.delete().catch(e => {});
});

bot.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            await interaction.deferReply();
            interaction.content = `<${interaction.options.getString('query')}>`;
            if (fn.unPunctuate(interaction.content) == 'del' || fn.unPunctuate(interaction.content) == 'spoiler')
                return await interaction.deleteReply();
            interaction.author = interaction.user;
            let embeds = await getEmbeds(interaction);
            if (embeds.length == 0)
                return await interaction.deleteReply();
            await interaction.editReply({embeds});
        } else if (interaction.isAutocomplete()) {
            await interaction.respond(search.search(fn.unPunctuate(interaction.options.getFocused() == '' ? 'basic card' : interaction.options.getFocused())).slice(0,25).map(i => ({
                name: `${i.item.name} (${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '')+' ' : ''}${i.item.itemType})${i.item.originalDescription ? ` - ${i.item.originalDescription.replaceAll('\n', ' ')}` : ''}`.slice(0,94) + ` (${String(Math.round((1 - i.score) * 100))}%)`,
                value: i.item.searchText.slice(0,100)//i.item.hasOwnProperty('id') ? i.item.id : i.item.name,
            })));
        } else if (interaction.isMessageContextMenuCommand()) {
            let words = fn.unPunctuate(interaction.targetMessage.content).split(' ');
            let matches = [];
            for (let i = 0; i < words.length; i++) {
                for (let j = i; j < words.length && j < i + 3; j++) {
                    let query = words.slice(i, j+1).join(' ');
                    let exactMatch = search._docs.find(e => e.searchName == query);
                    if (exactMatch != undefined) matches.push(exactMatch.name);
                }
            }
            if (matches.length > 0) {
                await interaction.deferReply({ephemeral: true});
                matches = [...new Set(matches)];
                if (matches.length > 20) matches = matches.slice(0,20);
                interaction.content = matches.slice(0,10).map(m => `<d~${m}>`).join('');
                console.log(interaction.content)
                interaction.author = interaction.user;
                let embeds = await getEmbeds(interaction);
                matches = matches.reduce((acc, curr, i) => {
                    if (!(i % 5)) acc.push(matches.slice(i, i + 5));
                    return acc;
                },[]);
                await interaction.editReply({
                    content: `${interaction.targetMessage.url}\nFound the following item names on this message, click them to select which to send info about, then click send to send:`, ephemeral: true,
                    ephemeral: true,
                    embeds,
                    components: [
                        ...matches.map(row => new ActionRowBuilder().setComponents(
                            row.map(match => new ButtonBuilder().setCustomId(`item${match.replace(/[^a-zA-Z' ']+/g, '').replaceAll(' ', '-')}`).setLabel(match).setStyle(ButtonStyle.Secondary))
                        )),
                        new ActionRowBuilder().setComponents(new ButtonBuilder().setCustomId('send').setLabel('Send').setStyle(ButtonStyle.Success))
                    ]
                });
            } else {
                interaction.reply({content: 'Couldn\'t find any item names on this message, sorry!', ephemeral: true});
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('item')) {
                if (interaction.message) {
                    await interaction.update({components: interaction.message.components.map(row => ({...row, components: row.components.map(button => {
                        if (button.customId == interaction.customId)
                            button.data.style = button.style == ButtonStyle.Secondary ? ButtonStyle.Primary : ButtonStyle.Secondary;
                        return ButtonBuilder.from(button.data);
                    })}))});
                }
            } else if (interaction.customId == 'send') {
                let items = interaction.message.components.map(i => i.components).flat(1).filter(i=>i.data.style == ButtonStyle.Primary).map(i => `<${i.data.custom_id.slice(4)}>`);
                if (items.length > 10) return await interaction.reply({content: 'Please select at most 10 items!', ephemeral: true});
                await interaction.deferReply();
                interaction.content = items.join('');
                interaction.author = interaction.user;
                let embeds = await getEmbeds(interaction);
                await interaction.deleteReply();
                if (embeds === 0 || embeds.length == 0) return;
                await interaction.channel.send({
                    content: `${interaction.user} searched from ${interaction.message ? interaction.message.content.split('\n')[0] : '?'}`,
                    embeds,
                    allowedMentions: {users: []}
                }).catch(e => {});
            }
        }
    } catch (e) {
        console.error(e)
    }
});

async function main() {
    console.log('loading and parsing data...');
    let data = JSON.parse(fs.readFileSync('./docs/altered/items.json'));
    for (let itemType in data)
        for (let item of data[itemType]) {
            let character = characters[''];
            if (item.type == 'Player' && item.name != 'The Snecko') continue;
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
                searchId: item.hasOwnProperty('id') ? fn.unPunctuate(item.id) : undefined,
                itemType: itemType.slice(0,-1),
                mod: item.mod == '' ? 'slay-the-spire' : item.mod.toLowerCase(),
                originalDescription: item.hasOwnProperty('description') ? item.description : undefined,
                description: item.hasOwnProperty('description') ? keywordify(item.description, character) : undefined,
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
                    'id',
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