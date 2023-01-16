import { bot, search } from './index.js';
import { User } from 'discord.js';
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
const masks = {};
['a', 's', 'p'].forEach(i => masks[i] = loadImage(`./artpreview/${i}.png`));
const shadows = {};
['a', 's', 'p'].forEach(i => shadows[i] = loadImage(`./artpreview/${i}s.png`));
const cuts = {};
['a', 's', 'p'].forEach(i => cuts[i] = loadImage(`./artpreview/${i}c.png`));
const cardTypes = {
    Attack: 'a',
    Power: 'p',
    Skill: 's',
    Status: 's',
    Curse: 's'
};

async function meme(msg, arg, options) {
    try {
        let args = arg.split('=');
        if (args.length != options.items.length)
            return {title: `This meme requires exactly ${options.items.length} item${options.items.length == 1 ? '' : 's'}. Separate items with the "=" symbol.`};
        let items = await Promise.all(args.map(async (a, i) => {
            a = a.trim();
            if (a.startsWith('user?')) {
                let id = a.slice(5)
                let user;
                if (id == 'me')
                    user = msg.author;
                else
                    user = await bot.users.fetch(id).catch(e => {});
                if (user) {
                    user.image = await loadImage(user.avatarURL().replace('webp', 'png'));
                    return user;
                }
            } else if (a.startsWith('att?')) {
                let n = parseInt(a.slice(4));
                let attachment = msg.attachments.at(n-1);
                if (attachment == undefined)
                    return {title: 'format for attachments is att?n?name where n is the number of the attachment e.g. att?1?awsom'};
                attachment.image = await loadImage(attachment.url);
                attachment.item = {name: a.slice(6)};
                return attachment;
            }
            return options.items[i] == 1 ? a : fn.find(a);
        }));
        for (let i in items) {
            if (options.items[i] == 0) {
                let item = items[i];
                if (items[i] instanceof User || items[i].hasOwnProperty('ephemeral')) continue;
                item.embed = await embed({...item.item, score: item.score, query: arg});
                if (item.embed.data.thumbnail == null)
                    return {title: `No image for ${item.item.itemType} "${item.item.name}"`};
                item.image = await loadImage(item.embed.data.thumbnail.url);
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
                drawText.default(ctx, typeof items[t[0]] == 'string' ? items[t[0]] : (items[t[0]] instanceof User ? items[t[0]].username : items[t[0]].item.name.toUpperCase()), font,
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
            color: typeof items[0] == 'string' || items[0] instanceof User || items[0].hasOwnProperty('ephemeral') ? null : items[0].embed.color,
        };
    } catch(e) {
        console.error(e);
        return {title: 'failed to generate image'};
    }
}

const commands =  {
    prefix: {
        help: () => ({
            title: 'Slaytabase',
            description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

If you edit or delete your message, I will update my reply to it, according to your changes.

__Commands:__
<[item name]> displays info about an item
<d~[item]>, <i~[item name]>, <t~[item]> and <~[item]> are the same as the above, but the result is formatted differently
<del> deletes your last search in this channel
<spoiler> adds spoiler tags to my last reply to you in this channel
<?[search query]> shows the most likely results for a search query
- search query may include the following:
- - page=? - specify result page
- - cost=? - only returns cards with specified cost
<choose [word1 word2 word3...]> chooses one of the specified words for you at random
<rps [rock|paper|scissors]> lets you play a game of rock paper scissors with me!
<memes> help with the bot's meme generator
<artpreview [card name]> takes your first attachment and uses it as card art for a card
<c~artpreview [card name]> compares the art preview to the current card
<cut~artpreview [card name]>
<lists> links to lists of all items in the database
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
            if (arg.startsWith('??')) {
                let item = fn.find('?'+arg);
                return (await embed({...item.item, score: item.score, query: '?'+arg})).data;
            }
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
            let firstEmbed = results.length > 0 ? await embed(results[0].item, msg) : {data: {thumbnail: null}};

            return {
                title: `Searched for "${searchQ}"`,
                description: results.length == 0 ? 'No results.' : resultText,
                thumbnail: firstEmbed.data.thumbnail,
                footer: {text: `Page ${page+1}/${Math.ceil(totalResults/10)}`},
                color: 14598591,
            };
        },

        'lists': async () => ({
            title: "lists",
            description: `export: ${cfg.exportURL}\nfull data: https://github.com/OceanUwU/slaytabase/blob/main/docs/data.json\nfull data (formatted): https://github.com/OceanUwU/slaytabase/blob/main/docs/dataFormatted.json\nmanually added items: https://github.com/OceanUwU/slaytabase/blob/main/extraItems.js`,
        }),

        'searchtext ': async (msg, arg) => {
            let result = fn.find(arg);
            if (result.item.itemType == 'fail') return {title: "no result?"};
            return {
                title: `"${arg}" yields:`,
                description: result.item.searchText.toLowerCase(),
            };
        },

        'i~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg});

            return {
                title: itemEmbed.data.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : ' ',
                image: itemEmbed.data.thumbnail,
                color: itemEmbed.data.color,
            };
        },

        't~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg});

            return {
                title: itemEmbed.data.thumbnail == null ? `No image for ${item.item.itemType} "${item.item.name}"` : '​',
                thumbnail: itemEmbed.data.thumbnail,
                color: itemEmbed.data.color,
            };
        },

        'd~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg});
            switch (item.item.itemType) {
                case 'relic':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,-1).join('\n');
                    break;
                case 'boss':
                    itemEmbed.data.description = itemEmbed.data.description.split('\n').slice(0,3).join('\n');
                    break;
                case 'event':
                    itemEmbed.data.description = `\n\n${item.item.description.replace('\n', ' ')}`;
                    break;
                default:
                    break;
            }
            return {
                ...itemEmbed.data,
                title: null,
                thumbnail: null,
                footer: null,
                description: `__**${itemEmbed.data.title}**__: ${itemEmbed.data.description.split('\n').slice(2).join(' ')}`,
            };
        },

        '~': async (msg, arg) => {
            let item = fn.find(arg);
            let itemEmbed = await embed({...item.item, score: item.score, query: arg});
            return {
                ...itemEmbed.data,
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

        'c~artpreview ': async (msg, arg) => {
            try {
                let args = arg.split('=');
                let att = 0;
                if (args.length > 1)
                    att = parseInt(args[1])-1;
                let art = msg.attachments.at(att);
                if (art == undefined) return {title: 'you need to attach an image to preview!'};
                let item = fn.find(args[0]);
                if (!item.item.hasOwnProperty('itemType') || item.item.itemType != 'card')
                    return {title: `couldnt find that card. found ${item.item.itemType} "${item.item.name}"`};
                let itemEmbed = await embed({...item.item, score: item.score, query: args[0]});
    
                let artcanvas = createCanvas(500,380);
                let artctx = artcanvas.getContext('2d');
                artctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                artctx.globalAlpha = 0.25;
                artctx.drawImage(await shadows[cardTypes[item.item.type]], 0, 0);
                artctx.globalAlpha = 1;
                artctx.globalCompositeOperation = 'destination-out';
                artctx.drawImage(await masks[cardTypes[item.item.type]], 0, 0);

                let canvas = createCanvas(1356,874);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 0, 0, 678, 874, 0, 0, 678, 874);
                ctx.drawImage(artcanvas, 89, 123);
                ctx.drawImage(await loadImage(itemEmbed.data.thumbnail.url), 678, 0);
    
                let filename = `${(item.item.id.includes(':') ? item.item.id.slice(item.item.id.indexOf(':')+1) : item.item.id).replaceAll(' ', '-')}_preview-${String(Math.random()).slice(10)}.png`;
                fs.writeFileSync(filename, canvas.toBuffer());


                let cutcanvas = createCanvas(500,380);
                let cutctx = cutcanvas.getContext('2d');
                cutctx.drawImage(await loadImage(art.url), 0, 0, 500, 380);
                cutctx.globalCompositeOperation = 'destination-out';
                cutctx.drawImage(await cuts[cardTypes[item.item.type]], 0, 0);
                let filename2 = filename.replace('_preview-', '_p-');
                fs.writeFileSync(filename2, cutcanvas.toBuffer());

                let smallcanvas = createCanvas(250,190);
                let smallctx = smallcanvas.getContext('2d');
                smallctx.drawImage(cutcanvas, 0, 0, 250, 190);
                let filename3 = filename2.replace('_p-', '-');
                fs.writeFileSync(filename3, smallcanvas.toBuffer());

                return {
                    title: item.item.name,
                    description: '250x190 →',
                    image: {url: 'attachment://'+filename},
                    thumbnail: {url: 'attachment://'+filename3},
                    footer: {iconURL: 'attachment://'+filename2, text: '← 500x380'},
                    files: [filename, filename2, filename3],
                    color: itemEmbed.data.color,
                };
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                let canvas = createCanvas(678,874);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(await loadImage(preview.files[0]), 0, 0, 678, 874, 0, 0, 678, 874);
                fs.writeFileSync(preview.files[0], canvas.toBuffer());
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'cut~artpreview ': async (msg, arg) => {
            try {
                let preview = await commands.prefix['c~artpreview '](msg, arg);
                delete preview.image;
                fs.unlinkSync(preview.files[0]);
                preview.files = preview.files.slice(1);
                return preview;
            } catch(e) {
                console.error(e);
                return {title: 'failed to generate image'};
            }
        },

        'rps': async (msg, arg, __, oa) => {
            //so you decided to dig deeper and find out why everyone except a certain few always loses...
            //well, you found us. i guess it's time to let you in on the secret.
            //to win or draw, copy the zero width space from inbetween these brackets --> (​) and include it anywhere in your call to this command
            //DON'T TELL ANYONE THIS, this remains between you and me and anyone else who's looked at this code 
            let rps = ['rock', 'paper', 'scissors']
            let n = 0;
            for (let i of ['r', 'p', 's']) {
                if (arg.startsWith(i)) {
                    if (oa.includes('​')) {
                        let win = Math.random() > 0.5;
                        return {title: `i choose ${rps[(n+(win?2:0))%3]} - ${win ? 'you win...' : 'it\'s a draw.'}`};
                    } else
                        return {title: `i choose ${rps[(n+1)%3]} - i win!`};
                }
                n++;
            }
            return {title: 'choose "rock", "paper", or "scissors"'};
        },

        memes: () => ({
            title: 'Meme generator',
            description: `Some memes take more than one item, separate items with the "=" symbol.
The bot can also take users as arguments, to grab their profile pictures, with <meme user?[userId]> for example: <user?${bot.user.id} my beloved>
You can also use just "user?me" to specify yourself.
            
__List of memes:__
<megamind no [item]>
<megamind textno [text]>
<friendship ended [bad item]=[good item]=[friender]>
<coolerdaniel [daniel]=[coolerdaniel]>
<19 dollar [fortnite card]>
<distracted [gf]=[distraction]=[bf]>
<[item] my beloved>
<why cant i hold all these [item]=[holder]>
<[item] speech bubble>
<the floor here is made out of [item]>
<the text here is made out of [text]>
<sb [item]=[text in speech bubble]>
<sb [item1]=[text1]=[item2]=[text2]>
<[item] from slay the spire>
`,
            thumbnail: {url: 'https://media.discordapp.net/attachments/802410376498249820/1002367368623825027/unknown.png?width=566&height=566'},
        }),

        'megamind no ': async (msg, arg) => await meme(msg, arg, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [0],
            put: [[0, 182, 39, 354, 96]]
        }),

        'megamind textno ': async (msg, _, __, oa) => await meme(msg, oa, {
            w: 640,
            h: 640,
            bg: 'mm.jpg',
            items: [1],
            texts: [[0, 182, 39, 354, 96, 'white']]
        }),

        'friendship ended ': async (msg, arg) => await meme(msg, arg, {
            w: 600,
            h: 450,
            bg: 'fse.png',
            items: [0, 0, 0],
            put: [
                [1, 113, 66, 111, 107],
                [2, 380, 103, 98, 127],
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

        'coolerdaniel ': async (msg, arg) => await meme(msg, arg, {
            w: 1452,
            h: 816,
            bg: 'daniel.png',
            items: [0, 0],
            put: [
                [0, 229, 84, 381, 458],
                [1, 794, 110, 341, 414],
            ]
        }),

        '19 dollar ': async (msg, arg) => await meme(msg, arg, {
            w: 779,
            h: 751,
            bg: '19dollar.png',
            items: [0],
            put: [[0, 60, 404, 157, 229]],
            texts: [[0, 82, 653, 622, 98, 'white']]
        }),

        'distracted ': async (msg, arg) => await meme(msg, arg, {
            w: 800,
            h: 533,
            bg: 'distracted.png',
            items: [0, 0, 0],
            put: [
                [0, 598, 145, 110, 108],
                [1, 152, 120, 158, 160],
                [2, 397, 88, 89, 106]
            ],
        }),

        'why cant i hold all these ': async (msg, arg) => await meme(msg, arg, {
            w: 450,
            h: 600,
            bg: 'hold.png',
            items: [0, 0],
            put: [
                [0, 116, 439, 38, 38],
                [0, 225, 374, 44, 40],
                [0, 187, 370, 38, 38],
                [0, 207, 390, 37, 37],
                [0, 148, 349, 44, 43],
                [0, 105, 367, 45, 43],
                ['holdhand.png', 87, 351, 253, 131],
                [0, 221, 398, 48, 45],
                [1, 139, 100, 124, 160],
            ],
            texts: [[0, 276, 518, 86, 48, 'white']]
        }),

        'the floor here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [0],
            put: [
                [0, 278, 208, 47, 50],
                [0, 496, 208, 47, 50],
            ],
        }),
        
        'the text here is made out of ': async (msg, arg) => await meme(msg, arg, {
            w: 554,
            h: 394,
            bg: 'floor.png',
            items: [1],
            texts: [
                [0, 278, 208, 47, 50, 'black'],
                [0, 496, 208, 47, 50, 'black'],
            ],
        }),
        
        'randomitem': async (msg, arg) => {
            let itemNum = Math.floor(Math.random() * search._docs.length);
            let item = search._docs[itemNum];
            return {...(await embed({...item, score: 0, query: fn.unPunctuate(item.name)})).data, footer: {text: `Item ${itemNum+1}/${search._docs.length}`}};
        },

        'sb ': async (msg, _, __, oa) => {
            let numArgs = oa.split('=').length;
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
            return await meme(msg, oa, options);
        },
    },

    suffix: {
        ' my beloved': async (msg, arg) => await meme(msg, arg, {
            w: 640,
            h: 480,
            bg: 'beloved.png',
            items: [0],
            put: [[0, 103, 200, 164, 139]],
            texts: [[0, 373, 130, 202, 71, 'black']]
        }),

        ' from slay the spire': async (msg, arg) => await meme(msg, arg, {
            w: 680,
            h: 538,
            bg: 'fromsts.png',
            items: [0],
            put: [[0, 234, 75, 137, 126]],
            texts: [[0, 235, 352, 243, 47, 'black']]
        }),

        ' speech bubble': async (msg, arg) => await meme(msg, arg, {
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

export default commands;