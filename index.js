import fetch from 'node-fetch';
import { Client, Intents } from 'discord.js';
import * as JsSearch from 'js-search';
import embed from './embed.js';
import cfg from './cfg.js';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const search = new JsSearch.Search('id');
search.addIndex('name');
search.addIndex('itemType');
search.addIndex('color');

bot.once('ready', async () => {
	console.log('connected to discord. ready!');
});

bot.on('messageCreate', msg => {
    let queries = [...msg.content.matchAll(/\<(.*?)\>/g)];
    for (let i of queries) {
        let query = i[1]
        let results = search.search(query);
        let item = results.length > 0 ? (query.includes('+') ? results.find(e => e.name.includes('+')) : results[0]) : undefined;
        console.log(`${msg.author.tag} searched for "${query}", found ${typeof item == 'object' ? `${item.itemType} "${item.name}"` : 'nothing'}`);
        msg.channel.send({embeds: [embed(item)]});
    }
});

async function main() {
    console.log('fetching data...');
    let response = await fetch('https://darkvexon.github.io/export/items.json');
    console.log('fetched data, parsing it...');
    let data = await response.json();
    let i = 0;
    for (let itemType in data)
        for (let item of data[itemType])
            search.addDocument({
                ...item,
                id: i++,
                itemType: itemType.slice(0,-1),
                mod: item.mod == '' ? 'slay-the-spire' : item.mod.toLowerCase(),
            });
    console.log('parsed data, connecting to discord...');
    bot.login(cfg.token);
}

main();