import { bot, search } from './index.js';
import fn from './fn.js';
import embed from './embed.js';
import cfg from './cfg.js';

const delSearchLimit = 25;

export default {
    help: () => ({
        title: 'DownfallBot',
        description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

If you edit or delete your message, I will update my reply to it, according to your changes.

__Commands:__
<[item name]> displays info about an item
<~[item name]> shows just the name and thumbnail of an item
<img [item name]> shows the full-size image from an embed
<del> deletes your last search in this channel
<spoiler> adds spoiler tags to my last reply to you in this channel
<?[search query]> shows the most likely results for a search query
- search query may include the following:
- - page=? - specify result page
- - cost=? - only returns cards with specified cost
<choose [word1 word2 word3...]> chooses one of the specified words for you at random
<lists> links to lists of all items in the database
<wiki> links to the homepage of the wiki
`,
        thumbnail: {url: bot.user.avatarURL()},
    }),

    'del': async msg => {
        let messages = await msg.channel.messages.fetch();
        messages = messages.filter(i => i.author.id == bot.user.id && i.reference != null);
        let i = 0;
        for (let m of messages) {
            i++;
            m = m[1];
            let found = true;
            let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
            if (!found) continue;
            if (repliedTo.author.id == msg.author.id) {
                await m.delete().catch(e => {});
                await repliedTo.delete().catch(e => {});
                await msg.delete().catch(e => {});
                return;
            }
            if (i >= delSearchLimit) break;
        }
        return;
    },

    'spoiler': async msg => {
        let messages = await msg.channel.messages.fetch();
        messages = messages.filter(i => i.author.id == bot.user.id && i.reference != null);
        let i = 0;
        for (let m of messages) {
            i++;
            m = m[1];
            let found = true;
            let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
            if (!found) continue;
            if (repliedTo.author.id == msg.author.id) {
                await msg.delete().catch(e => {});
                //spoiler hack
                let origEmbeds = m.embeds;
                if (origEmbeds.length > 0) {
                    await m.edit({content: `||https://bit.ly/3aSgJDF||`, embeds: [], allowedMentions: {repliedUser: false}}).catch(e => {});
                    await (new Promise(res => setTimeout(res, 1000)));
                    await m.edit({content: m.content, embeds: origEmbeds, allowedMentions: {repliedUser: false}}).catch(e => {});
                }
                return;
            }
            if (i >= delSearchLimit) break;
        }
        return;
    },

    '?': async (msg, arg, args) => {
        let searchQ = args.filter(a => !a.includes("=")).join(" ");
        let results = search.search(searchQ);
        let page = 0;
        for (let i of args) {
            if (i.includes("=")) {
                let prop = i.slice(0, i.indexOf("="));
                let val = i.slice(i.indexOf("=")+1);
                switch (prop) {
                    case "cost":
                        results = results.filter(r => r.item.hasOwnProperty('cost') && r.item.cost.toLowerCase().includes(val));
                        break;
                    
                    case "page":
                        page = Math.max(0, parseInt(val)-1);
                        if (Number.isNaN(page)) page = 0;
                        break;
                }
            }
        }
        let totalResults = results.length;
        results = results.slice(10*page, 10*(page+1));

        let resultText = results.map((i, index) => `${(page*10)+index+1}: ${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '').toLowerCase() : ''} ${i.item.itemType} **${i.item.name}** - ${String(Math.round((1 - i.score) * 100))}% sure`).join('\n');
        let firstEmbed = results.length > 0 ? await embed(results[0].item, msg) : {thumbnail: null};

        return {
            title: `Searched for "${searchQ}"`,
            description: results.length == 0 ? 'No results.' : resultText,
            thumbnail: firstEmbed.thumbnail,
            footer: {text: `Page ${page+1}/${Math.ceil(totalResults/10)}`},
            color: 14598591,
        };
    },

    'lists': async () => ({
        title: "lists",
        description: "export: https://oceanuwu.github.io/downfallbot/\nmanually added items: https://github.com/OceanUwU/downfallbot/blob/main/extraItems.json",
    }),

    'wiki': async () => ({
        title: "wiki",
        url: "https://sts-downfall.fandom.com/wiki/Downfall_Wiki"
    }),

    'searchtext ': async (msg, arg) => {
        let result = fn.find(arg);
        if (result.item.itemType == 'fail') return {title: "no result?"};
        return {
            title: `"${arg}" yields:`,
            description: result.item.searchText.toLowerCase(),
        };
    },

    'img ': async (msg, arg) => {
        let item = fn.find(arg);
        let itemEmbed = await embed({...item.item, score: item.score, query: arg});

        return {
            title: itemEmbed.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : ` `,
            image: itemEmbed.thumbnail,
            color: itemEmbed.color,
        };
    },

    '~': async (msg, arg) => {
        let item = fn.find(arg);
        let itemEmbed = await embed({...item.item, score: item.score, query: arg});
        return {
            ...itemEmbed,
            footer: null,
            description: null,
        };
    },

    'choose ': async (msg, arg, args) => {
        if (args.length > 0)
            return {
                title: `I choose "${args[Math.floor(Math.random() * args.length)]}"`,
            };
    },

    'discuss ': async (msg, arg) => {
        if (msg.channel.type == "GUILD_TEXT" && cfg.overriders.includes(msg.author.id)) { //has manage messages permission?
            msg.startThread({name: `${arg}`})
                .then(async thread => {
                    await thread.send(`<${arg}>`).catch(e => {});
                    thread.awaitMessages({max: 1, time: 5000, errors: ['time']})
                        .then(collected => {
                            if (collected.size > 0) {
                                collected.first().pin().catch(e => {});
                                thread.edit({name: `${collected.first().embeds[0].title}`}).catch(e => {});
                            }
                        })
                        .catch(e => {});
                })
                .catch(e => {});
        } else
            return {
                title: 'Cannot create a discussion',
                description: 'Only certain people may create discussions'
            };  
    },
};