import { MessageEmbed } from 'discord.js';
const exportURL = 'https://darkvexon.github.io/export';

const characters = {
    'Red': ['The Ironclad',  12196378, '<:e_red:961808772177731624>', ''],
    'Green': ['The Silent', 6078315, '<:e_green:961808772114833428>', ''],
    'Blue': ['The Defect', 3186687, '<:e_blue:961808772244832278>', ''],
    'Purple': ['The Watcher', 11489522, '<:e_purple:961808772127399967>', ''],
    'Colorless': ['Colorless', 8026746, '<:e_colorless:961808772609769512>', ''],
    'Curse': ['Curse', 1315860, '<:e_colorless:961808772609769512>', ''],
    'Boss': ['Boss', 11548764, '<:e_guardian:961809971950014504>', ''],
    'Hexa_ghost_purple': ['The Hexaghost', 10704819, '<:e_hexa:961809972105199636>', 'hexamod-'],
    'The_bronze_automaton': ['The Automaton', 16772999, '<:e_automaton:961809971572523069>', 'bronze-'],
    'Slimebound': ['The Slime Boss', 27404, '<:e_slime:961809971840950275>', 'Slimebound-'],
    'Gremlin': ['Gremlins', 11693019, '<:e_red:961808772177731624>', 'Gremlin-'],
    'Snecko_cyan': ['The Snecko', 6333629, '<:e_snecko:961809971954217030>', 'sneckomod-'],
    'The_champ_gray': ['The Champ', 2242624, '<:e_champ:961809971920633936>', 'champ-'],
    'Guardian': ['The Guardian', 10721357, '<:e_guardian:961809971950014504>', 'Guardian-'],
    '': ['All', 8026746, '<:e_colorless:961808772609769512>', ''],
};

const relicPools = {
    'The_bronze_automaton': 'bronze',
    'The_champ_gray': 'champ',
};

const keywords = {
    '[R]': '<:e_red:961808772177731624>',
    '[G]': '<:e_green:961808772114833428>',
    '[B]': '<:e_blue:961808772244832278>',
    '[W]': '<:e_purple:961808772127399967>',
    '[fist_icon]': '<:finisher:961810374120849418>',
    'champ:Finisher': 'Finisher',
};

function keywordify(text, character) {
    text = text.replaceAll('[E]', character[2]);
    for (let i in keywords)
        text = text.replaceAll(i, `**${keywords[i]}**`);
    return text;
}

function embed(item) {
    let e = new MessageEmbed();
    if (item == undefined) {
        e.title = 'Unknown Query';
        e.description = 'Sorry, couldn\'t find anything matching that query.'
    } else {
        e.title = item.name;
        switch (item.itemType) {
            case 'card':
                let character = characters[item.color];
                e.thumbnail = {url: `${exportURL}/${item.mod}/card-images/${item.color.slice(0,10)}-${item.name.replaceAll(' ', '').replace('+', 'Plus')}.png`};
                e.color = character[1];
                e.description = `${item.type} / ${item.cost} [E] / ${item.rarity} / ${character[0]}\n\n${item.description}`;
                e.description = keywordify(e.description, character);
                break;

            case 'relic':
                let pool = characters[item.pool];
                e.thumbnail = {url: `${exportURL}/${item.mod}/relics/${pool[3]}${item.name.replaceAll(' ', '')}.png`};
                e.color = pool[1];
                e.description = `Relic / ${item.tier} / ${pool[0]}\n\n${item.description}\n*${item.flavorText}*`;
                e.description = keywordify(e.description, pool);
                break;
                
            case 'potion':
                e.thumbnail = {url: `${exportURL}/${item.mod}/potions/${item.name.replaceAll(' ', '')}.png`};
                e.description = `${item.rarity}\n\n${item.description}`;
                e.description = keywordify(e.description, characters['']);
                break;
                
            case 'creature':
                e.description = `${item.type} / ${item.minHP}-${item.maxHP} HP`;
                break;
            
            case 'keyword':
                e.description = `Keyword\n\n${item.description}`
                e.description = keywordify(e.description, characters['']);
                break;
        }
    }
    return e;
}

export default embed;