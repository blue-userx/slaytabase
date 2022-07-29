import { bot, search } from './index.js';
import { createCanvas, loadImage } from 'canvas';
import drawText from 'node-canvas-text';
import opentype from 'opentype.js';
import { Gif } from 'make-a-gif'
import fs from 'fs';
import fn from './fn.js';
import embed from './embed.js';
import cfg from './cfg.js';

const delSearchLimit = 25;
const font = opentype.loadSync('./memetemplates/Kreon-Regular.ttf');

async function meme(arg, options) {
    try {
        let args = arg.split('=');
        if (args.length != options.items.length)
            return {title: `This meme requires exactly ${options.items.length} item${options.items.length == 1 ? '' : 's'}. Separate items with the "=" symbol.`};
        let items = args.map((a, i) => options.items[i] == 1 ? a : fn.find(a));
        for (let i in items) {
            if (options.items[i] == 0) {
                let item = items[i];
                item.embed = await embed({...item.item, score: item.score, query: arg});
                if (item.embed.thumbnail == null)
                    return {title: `No image for ${item.item.itemType} "${item.item.name}"`};
                item.image = await loadImage(item.embed.thumbnail.url);
            }
        }

        let canvas = createCanvas(options.w, options.h);
        let ctx = canvas.getContext('2d');

        ctx.drawImage(await loadImage('./memetemplates/'+options.bg), 0, 0);
        if (options.hasOwnProperty('put'))
            for (let p of options.put)
                ctx.drawImage(typeof p[0] == 'number' ? items[p[0]].image : await loadImage('./memetemplates/'+p[0]), p[1], p[2], p[3], p[4]);
        if (options.hasOwnProperty('texts'))
            for (let t of options.texts)
                drawText.default(ctx, typeof items[t[0]] == 'string' ? items[t[0]] : items[t[0]].item.name.toUpperCase(), font,
                    {x: t[1], y: t[2], width: t[3], height: t[4]}, 
                    {minSize: 5, maxSize: 200, vAlign: 'center', hAlign: 'center', textFillStyle: t[5], fitMethod: 'box', drawRect: false}
                );
        
        let buffer = canvas.toBuffer('image/png');
        let gif = new Gif(options.w, options.h, 500);
        await gif.addFrame({src: buffer});
        let render = await gif.encode();
        let filename = `export${String(Math.random()).slice(2)}.gif`;
        fs.writeFileSync(filename, render);
        return {
            title: ' ',
            image: {url: 'attachment://'+filename},
            files: [filename],
            color: typeof items[0] == 'string' ? null : items[0].embed.color,
        };
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate image'};
    }
}

export default {
    prefix: {
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
<memes> help with the bot's meme generator
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
                title: itemEmbed.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : ' ',
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

        memes: () => ({
            title: 'Meme generator',
            description: `Some memes take more than one item, separate items with the "=" symbol.
            
__List of memes:__
<megamind no [item]>
<megamind textno [text]>
<friendship ended [bad item]=[good item]>
<coolerdaniel [daniel]=[coolerdaniel]>
<19 dollar [fortnite card]>
<distracted [gf]=[distraction]>
<[item] my beloved>
<why cant i hold all these [item]>
<[item] speech bubble>
<sb [item]=[text in speech bubble]>
<sb [item1]=[text1]=[item2]=[text2]>
`,
            thumbnail: {url: 'https://media.discordapp.net/attachments/802410376498249820/1002367368623825027/unknown.png?width=566&height=566'},
        }),

        'megamind no ': async (msg, arg) => await meme(arg, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [0],
            put: [[0, 182, 39, 354, 96]]
        }),

        'megamind textno ': async (msg, arg) => await meme(arg, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [1],
            texts: [[0, 182, 39, 354, 96, 'white']]
        }),

        'friendship ended ': async (msg, arg) => await meme(arg, {
            w: 600,
            h: 450,
            bg: 'fse.png',
            items: [0, 0],
            put: [
                [1, 113, 66, 111, 107],
                [0, 0, 247, 143, 200],
                [0, 422, 271, 176, 177],
                ['fsecross1.png', 4, 260, 135, 184],
                ['fsecross2.png', 431, 283, 155, 149]
            ],
            texts: [
                [0, 402, 0, 170, 64, 'red'],
                [1, 235, 123, 98, 49, 'green'],
            ]
        }),

        'coolerdaniel ': async (msg, arg) => await meme(arg, {
            w: 1452,
            h: 816,
            bg: 'daniel.png',
            items: [0, 0],
            put: [
                [0, 229, 84, 381, 458],
                [1, 794, 110, 341, 414],
            ]
        }),

        '19 dollar ': async (msg, arg) => await meme(arg, {
            w: 779,
            h: 751,
            bg: '19dollar.png',
            items: [0],
            put: [[0, 60, 404, 157, 229]],
            texts: [[0, 82, 653, 622, 98, 'white']]
        }),

        'distracted ': async (msg, arg) => await meme(arg, {
            w: 800,
            h: 533,
            bg: 'distracted.png',
            items: [0, 0],
            put: [
                [0, 598, 145, 110, 108],
                [1, 152, 120, 158, 160]
            ],
        }),

        'why cant i hold all these ': async (msg, arg) => await meme(arg, {
            w: 450,
            h: 600,
            bg: 'hold.png',
            items: [0],
            put: [
                [0, 116, 439, 38, 38],
                [0, 225, 374, 44, 40],
                [0, 187, 370, 38, 38],
                [0, 207, 390, 37, 37],
                [0, 148, 349, 44, 43],
                [0, 105, 367, 45, 43],
                ['holdhand.png', 87, 351, 253, 131],
                [0, 221, 398, 48, 45],
            ],
            texts: [[0, 276, 518, 86, 48, 'white']]
        }),

        'sb ': async (msg, arg) => {
            let numArgs = arg.split('=').length;
            if (numArgs % 2 != 0) return {title: "The number of arguments for this must be a multiple of 2."};

            let options = {
                w: 100*numArgs,
                h: 200,
                bg: 'empty.png',
                items: [],
                put: [],
                texts: [],
            };
            for (let i = 0; i < numArgs / 2; i++) {
                let xOffset = 200*i;
                options.items.push(0);
                options.items.push(1);
                options.put.push([2*i, 25+xOffset, 50, 150, 150]);
                options.put.push(['speechbubble2.png', 0+xOffset, 0, 200, 200]);
                options.texts.push([2*i+1, 17+xOffset, 13, 164, 31, 'black']);
            }
            return await meme(arg, options);
        },

        'sb2 ': async (msg, arg) => await meme(arg, {
            w: 400,
            h: 200,
            bg: 'empty.png',
            items: [0, 1, 0, 1],
            put: [
                [0, 25, 50, 150, 150],
                ['speechbubble2.png', 0, 0, 200, 200],
                [2, 225, 50, 150, 150],
                ['speechbubble2.png', 200, 0, 200, 200]
            ],
            texts: [
                [1, 17, 13, 164, 31, 'black'],
                [3, 217, 13, 164, 31, 'black'],
            ],
        }),
    },

    suffix: {
        ' my beloved': async (msg, arg) => await meme(arg, {
            w: 640,
            h: 480,
            bg: 'beloved.png',
            items: [0],
            put: [[0, 103, 200, 164, 139]],
            texts: [[0, 373, 130, 202, 71, 'black']]
        }),

        ' speech bubble': async (msg, arg) => await meme(arg, {
            w: 200,
            h: 200,
            bg: 'empty.png',
            items: [0],
            put: [
                [0, 25, 50, 150, 150],
                ['speechbubble.png', 0, 0, 200, 200]
            ],
        }),
    }
};