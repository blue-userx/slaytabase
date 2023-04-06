import { EmbedBuilder } from 'discord.js';
import wikiItems from './wikiItems.js';
import cfg from './cfg.js';
import fn from './fn.js';

const searchize = item => {
    if (!item.hasOwnProperty('name'))
        return '';
    let name = item.name;
    if (item.hasOwnProperty('character') && wikiItems[item.character[0]].hasOwnProperty(item.name))
        name = wikiItems[item.character[0]][item.name]
    return name.replaceAll(' ', '_').replaceAll('+', '').replaceAll('???', 'Unidentified');
};

let wikis = {'Slay the Spire': 'slay-the-spire'};
let stars = n => Array(Number(n)).fill('\\⭐').join('');

async function embed(item, msg, embeds=[], encode=true) {
    let e = {};
    e.title = `${item.name}`;
    let wiki = wikis.hasOwnProperty(item.mod) ? wikis[item.mod] : false;
    if (wiki)
        e.url = `https://${wikis[item.mod]}.fandom.com/wiki/${searchize(item)}`;
    if (item.hasOwnProperty('query') && !item.query.includes(fn.unPunctuate(item.name)) && item.query != item.searchId)
        e.footer = {
            //iconURL: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp?size=32`,
            text: `${item.query.filter ? '<' : '[['}${item.query}${item.query.filter ? '>' : ']]'} = ${item.name == 'No results' ? '?' : item.searchName}${item.score != undefined ? ', '+String(Math.round((1 - item.score) * 100))+'% sure' : ''}`, //text: `${msg.author.username}: <${item.query}>`,
        };
    switch (item.itemType) {
        case 'card':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/cards/${item.color.slice(0,10)}-${item.name.replace('+', '').replaceAll(' ', '').replaceAll(':', '-').replaceAll('\'', '').replaceAll('\"', '').replaceAll('?', '').replaceAll('/', '')}.png`};
            e.color = item.character[1];
            e.description = `${item.type != 'Curse' ? `${item.rarity} ${item.type} / ` : ''}${item.cost == '' ? '' : `${item.cost} ${item.character[2]} / `}${item.character[0]} / ${item.hasOwnProperty('pack') ? `Pack: ${item.pack}` : item.mod}\n\n${item.description}`;
            break;

        case 'relic':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/relics/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`};
            e.color = item.character[1];
            e.description = ` ${item.tier} Relic / ${item.character[0]} / ${item.mod}\n\n${item.description}\n*${item.flavorText}*`;
            break;
            
        case 'potion':
            if (wiki) e.url = `https://${wikis[item.mod]}.fandom.com/wiki/Potions`;
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/potions/${item.name.replaceAll(' ', '')}.png`};
            if (item.character[0] != 'All')
                e.color = item.character[1];
            e.description = `${item.rarity} Potion / ${item.character[0]} / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'event':
            e.color = 4608066;
            e.thumbnail = {url: `${cfg.exportURL}/extraImages/events/${item.name.toLowerCase().replaceAll(' ', '').replaceAll('?', '').replaceAll('!', '')}.jpg`};
            e.description = `Event / Act${item.acts.length > 1 ? 's' : ''} ${item.acts.join(', ')} / ${item.character[0]}${item.character == 'All' ? ' characters' : ''} / ${item.mod}\n\`\`\`ansi\n${item.colouredDesc.replaceAll('\n', '\n``````ansi\n')}\n\`\`\``;
            break;
            
        case 'creature':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/creatures/${item.type == 'Player' ? item.name.replace('the ', '').replace('The ', '') : item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '')}.png`};
            e.description = `${item.type} / ${item.minHP}-${item.maxHP} HP / ${item.mod}`;
            break;

        case 'blight':
            if (wiki) e.url = `https://${wikis[item.mod]}.fandom.com/wiki/Blights`;
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/blights/${item.id.slice(item.id.indexOf(':')+1).replaceAll(' ', '').replaceAll('\'', '')}.png`};
            e.description = `Blight / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'boss':
            e.thumbnail = {url: `${cfg.exportURL}/extraImages/bosses/${item.name.replaceAll(' ', '').toLowerCase()}.png`};
            e.color = item.character[1];
            e.description = item.description;
            if (wiki) e.url = e.url.replace('_', '_(Act_')+'_Boss)';
            break;
        
        case 'keyword':
            e.description = `Keyword / ${item.mod}\n\n${item.description}`;
            break;
        
        case 'pack':
            e.thumbnail = {url: `${cfg.exportURL}/${item.mod}/packs/${item.id.slice(item.id.indexOf(':')+1)}.png`};
            e.color = 12083229;
            e.description = `${item.mod.replace('The ', '')} Card Pack / By ${item.author}\n\n${item.description}\nOffense: ${stars(item.offense)}\nDefense: ${stars(item.defense)}\nSupport: ${stars(item.support)}\nFrontload: ${stars(item.frontload)}\nScaling: ${stars(item.scaling)}\nTags: ${item.tags.join(', ')}\n\nCards: ${item.cards.join(', ')}${item.credits.length > 0 ? '\n\nCredits: '+item.credits : ''}`;
            break;
        
        case 'command':
            e.color = 16777215;
            e.title = '';
            delete e.url;
            delete e.footer;
            let args;
            if (item.type == 'prefix')
                args = item.query.slice(item.name.length);
            else if (item.type == 'suffix')
                args = item.query.slice(0, item.query.length-item.name.length);
            else if (item.type == 'exact')
                args = '';
            else if (item.type == 'prefixAndSuffix')
                args = item.query.slice(item.name.length, item.query.length-item.suffix.length);
            args = args.trim().split(' ');
            let arg = new String(args.join(' '));
            arg.filter = item.query.filter;
            let oa = new String(item.originalQuery.slice(item.name.length));
            oa.filter = item.query.filter;
            let result = await item.do(msg, arg, args, oa);
            for (let i in result)
                e[i] = result[i];
            break;
        
        case 'fail':
            delete e.url;
            e.description = `If you think this is a mistake, contact <@106068236000329728>\n\n[Search for "${item.query.replaceAll('+', '')}" on the Slay the Spire wiki](https://slay-the-spire.fandom.com/wiki/Special:Search?query=${item.query.replaceAll('+', '').replaceAll(' ', '+')})?`;
            e.color = 0;
            break;
    }

    if (item.hasOwnProperty('img'))
        e.thumbnail = {url: cfg.exportURL+item.img};
    if (encode) {
        if (e.thumbnail && e.thumbnail.hasOwnProperty('url'))
            e.thumbnail.url = encodeURI(e.thumbnail.url);
        if (e.image && e.image.url)
            e.image.url = encodeURI(e.image.url);
        if (e.hasOwnProperty('url'))
            e.url += `?embnum=${embeds.length}`;
    }

    return e.title == '' ? null : new EmbedBuilder(e);
}

export default embed;