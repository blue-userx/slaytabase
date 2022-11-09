import { bot, search } from './index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionResponse } from 'discord.js';
import commands from './commands.js';
import embed from './embed.js';
import fs from 'fs';
import fn from './fn.js';

const filename = './dailyDiscussion.json';

var data = JSON.parse(fs.readFileSync(filename));
const saveData = () => fs.writeFileSync(filename, JSON.stringify(data));
const itemTitle = item => `${item.name} (${item.itemType == 'boss' || item.character[0] == 'All' ? '' : item.character[0].replace('The ', '')+' '}${item.itemType})`;

function start() {
    startThread();
    setInterval(startThread, 60000);

    bot.on('interactionCreate', async interaction => {
        try {
            if (interaction.isButton()) {
                let num = Number(interaction.customId);
                if (Number.isInteger(num) && num >= 0 && num < data.votes.length) {
                    for (let i in data.votes)
                        data.votes[i] = data.votes[i].filter(u => u != interaction.user.id);
                    data.votes[num].push(interaction.user.id);
                    saveData();
                    await interaction.update({embeds: interaction.message.embeds.map((e, i) => ({...e.data, footer: data.votes[i].length > 0 ? {text: `${data.votes[i].length} vote${data.votes[i].length == 1 ? '' : 's'}`} : {}}))});
                }
            }
        } catch(e) {
            console.error(e);
        }
    });
};

async function startThread() {
    if (Date.now() >= data.next && data.options.length > 0) {
        console.log('Daily Discussion time!');
        let oldThread = await bot.channels.fetch(data.voteChannel);

        let winner = 0;
        let longest = 0;
        for (let i in data.votes) {
            if (data.votes[i].length > longest || (data.votes[i].length == longest && Math.random() > 0.5)) {
                winner = i;
                longest = data.votes[i].length;
            }
        }

        let itemId = data.options[winner];
        let item = fn.find(itemId);
        let thread = await oldThread.parent.threads.create({name: `${itemTitle(item.item)} - Daily Discussion ${(new Date()).getDate()} ${(new Date()).toLocaleString('default', {month: 'long'}).slice(0, 3)}`})

        let possibleItems = search._docs
            .filter(item => item.mod == 'downfall')
            .filter(item => ['card', 'relic', 'potion', 'event', 'boss'].includes(item.itemType))
            .filter(item => !['Event', 'Special'].includes(item.rarity))
            .filter(item => item.tier != 'Special')
            .filter(item => !['???', 'Strike', 'Defend'].includes(item.name))
            .map(item => item.searchId)
            .filter(item => !data.past.includes(item));

        let voteItems = [];
        for (let i = 0; i < Math.min(possibleItems.length, 3); i++) {
            let possVote;
            do {
                possVote = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            } while (voteItems.includes(possVote))
            voteItems.push(possVote);
        }

        let prevMessage = await thread.send(`Previous Daily Discussion: <#${oldThread.id}>`);
        let voteMessage;
        voteMessage = await thread.send({
            content: voteItems.length > 0 ? `Vote for tomorrow's Daily Discussion here!` : 'No items left to vote on!',
            embeds: await Promise.all(voteItems.map(v => embed({...fn.find(v).item, score: 1, query: fn.unPunctuate(v)}))),
            components: [new ActionRowBuilder().addComponents(voteItems.map((v, i) => new ButtonBuilder().setCustomId(i.toString()).setLabel(itemTitle(fn.find(v).item)).setStyle(ButtonStyle.Secondary)))]
        });
        voteMessage.pin().catch(e => {});
        
        let itemMessage = await thread.send({embeds: [
            await commands.prefix['i~'](null, itemId),
            await embed({...item.item, score: item.score, query: itemId}),
        ]}).catch(e => {});
        itemMessage.pin().catch(e => {});

        if (data.hasOwnProperty('lastVote'))
            await (await oldThread.messages.fetch(data.lastVote)).edit({
                content: `Next Daily Discussion: <#${thread.id}>\n\n__Votes__:\n${data.options.map((e,i) => `${itemTitle(fn.find(e).item)}: ${data.votes[i].length}`).join('\n')}`,
                embeds: [],
                components: []
            }).catch(e => {});
        await oldThread.setArchived(true).catch(e => {});
        
        data.options = voteItems;
        data.votes = voteItems.map(v => []);
        data.next += 24 * 60 * 60 * 1000;
        data.voteChannel = thread.id;
        data.lastVote = (voteMessage == undefined ? prevMessage : voteMessage).id;
        data.past.push(itemId);
        saveData();
    }
}

export default start;