import { bot, search } from './index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionResponse } from 'discord.js';
import { Op } from 'sequelize';
import commands from './commands.js';
import embed from './embed.js';
import fn from './fn.js';
import db from './models/index.js';

const timeBetweenDiscussions = 24 * 60 * 60 * 1000;
const itemsPerVote = 3;

const itemTitle = item => `${item.name} (${item.itemType == 'boss' || item.character[0] == 'All' ? '' : item.character[0].replace('The ', '')+' '}${item.itemType})`;

var off = {off: false};

function checkForDiscussions() {
    startThread();
    setInterval(startThread, 60000);

    bot.on('interactionCreate', async interaction => {
        try {
            if (interaction.isButton()) {
                let num = Number(interaction.customId);
                if (Number.isInteger(num) && num >= 0 && num < interaction.message.components[0].components.length) {
                    let discussion = await db.DailyDiscussion.findOne({where: {channel: interaction.channelId}});
                    if (discussion == null) return;
                    await db.DiscussionVote.destroy({where: {user: interaction.user.id, discussion: discussion.id}});
                    await db.DiscussionVote.create({user: interaction.user.id, discussion: discussion.id, vote: num});
                    await interaction.update({embeds: await Promise.all(interaction.message.embeds.map(async (e, i) => {
                        let votes = await db.DiscussionVote.count({where: {discussion: discussion.id, vote: i}});
                        return {...e.data, footer: votes > 0 ? {text: `${votes} vote${votes == 1 ? '' : 's'}`} : {}};
                    }))});
                }
            }
        } catch(e) {
            console.error(e);
        }
    });
};

async function getItems(serverSettings, exclude=[]) {
    await db.DailyDiscussion.destroy({where: {item: null}});
    let previousItems = (await db.DailyDiscussion.findAll({
        attributes: ['item'],
        where: {guild: serverSettings.guild}
    })).map(i => i.item);

    let possibleItems = search._docslist.filter(item =>
        JSON.parse(serverSettings.mod).includes(item.mod)
        && ['card', 'relic', 'potion', 'event', 'boss'].includes(item.itemType)
        && !['Event', 'Special'].includes(item.rarity)
        && item.tier != 'Special'
        && !['???', 'Strike', 'Defend'].includes(item.name)
        && item.color != "The_collector" && item.color != "Collectible" && item.pool != "The_collector" //remove this line when collector is fully released
    )
        .map(item => item.searchId)
        .filter(item => !previousItems.includes(item) && !exclude.includes(item));
    
    let items = Array(Math.min(possibleItems.length, itemsPerVote)).fill().map(_ => possibleItems.splice(Math.floor(Math.random() * possibleItems.length), 1)[0]);

    return {
        items,
        embeds: await Promise.all(items.map(i => embed({...search._docslist.find(e => e.searchId == i), score: 1, query: fn.unPunctuate(i)}))),
        components: items.length == 0 ? [] : [new ActionRowBuilder().addComponents(items.map((v, i) => new ButtonBuilder().setCustomId(i.toString()).setLabel(itemTitle(search._docslist.find(e => e.searchId == v))).setStyle(ButtonStyle.Secondary)))],
        discussionNum: previousItems.length+1,
        total: previousItems.length+possibleItems.length+items.length+exclude.length,
    };
}

async function firstDiscussion(serverSettings) {
    let next = Date.now() + timeBetweenDiscussions;
    let channel = await bot.channels.fetch(serverSettings.discussionChannel);
    let thread = await channel.threads.create({name: `Daily Discussion Meta Thread`}).catch(e => {});
    let { items, embeds, components, total } = await getItems(serverSettings);
    if (thread == null) return;
    let voteMessage = await thread.send({
        content: items.length > 0 ? `Vote for the first Daily Discussion here! (Starting <t:${~~(next/1000)}:R> - ${total} items to discuss in total)` : 'Error: couldn\'t find any valid items to discuss!',
        embeds,
        components,
    });
    voteMessage.pin().catch(e => {});
            
    db.DailyDiscussion.create({
        guild: serverSettings.guild,
        channel: thread.id,
        item: null,
        next,
        voteMessage: voteMessage.id,
        voteOptions: JSON.stringify(items)
    });
};

async function startThread() {
    await Promise.all((await db.ServerSettings.findAll()).map(async serverSettings => {
        if (serverSettings.discussionChannel == null) return;
        let lastDiscussion = await db.DailyDiscussion.findOne({where: {guild: serverSettings.guild}, order: [['createdAt', 'DESC']]});
        if (lastDiscussion != null && lastDiscussion.next < Date.now()) {
            let oldThread = await bot.channels.fetch(lastDiscussion.channel);
            let options = JSON.parse(lastDiscussion.voteOptions);

            let votes = {};
            let itemId;
            if (options.length > 0) {
                let winner = 0;
                for (let i of (await db.DiscussionVote.findAll({attributes: ['vote'], where: {discussion: lastDiscussion.id}})).map(v => v.vote))
                    votes[i] = votes.hasOwnProperty(i) ? votes[i] + 1 : 1;
                if (Object.keys(votes).length > 0) {
                    let highest = Object.keys(votes).filter(v => votes[v] == Math.max(...Object.values(votes)));
                    winner = Number(highest[Math.floor(Math.random() * highest.length)]);
                }
        
                itemId = options[winner];
            } else {
                let availableItems = (await getItems(serverSettings)).items;
                if (availableItems.length == 0) {
                    lastDiscussion.update({next: lastDiscussion.next + timeBetweenDiscussions});
                    return;
                };
                itemId = availableItems[0];
            }

            let item = fn.find(itemId);
            let channel = await bot.channels.fetch(serverSettings.discussionChannel);
            if (channel == null) return;
    
            let { items, embeds, components, discussionNum, total } = await getItems(serverSettings, [itemId]);
    
            let thread = await oldThread.parent.threads.create({name: `${itemTitle(item.item)} - Daily Discussion ${(new Date()).getDate()} ${(new Date()).toLocaleString('default', {month: 'long'}).slice(0, 3)}`}).catch(e => {});
            if (thread == null) return;
            await thread.send(`Previous Daily Discussion: <#${oldThread.id}>`);
            let voteMessage = await thread.send({
                content: items.length > 0 ? `Vote for tomorrow's Daily Discussion (<t:${~~((lastDiscussion.next + timeBetweenDiscussions)/1000)}:R>) here!` : 'No items left to vote on!',
                embeds,
                components,
            });
            voteMessage.pin().catch(e => {});
            
            let daEmbed = await embed({...item.item, score: item.score, query: itemId});
            let itemMessage = await thread.send({
                content: `Daily Discussion ${discussionNum}/${total}`,
                embeds: [
                    EmbedBuilder.from({...daEmbed.data, thumbnail: {}, image: daEmbed.data.thumbnail}),
                ]
            }).catch(e => {});
            itemMessage.pin().catch(e => {});
            
            let time = lastDiscussion.next;
            while (time <= Date.now())
                time += timeBetweenDiscussions;

            await db.DailyDiscussion.create({
                guild: serverSettings.guild,
                channel: thread.id,
                item: itemId,
                next: time,
                voteMessage: voteMessage.id,
                voteOptions: JSON.stringify(items),
            });
    
            if (lastDiscussion.voteMessage != null)
                await (await oldThread.messages.fetch(lastDiscussion.voteMessage).catch(e => {}))?.edit({
                    content: `Next Daily Discussion: <#${thread.id}>\n\n__Votes__:\n${options.map((e,i) => `${itemTitle(fn.find(e).item)}: ${votes.hasOwnProperty(i) ? votes[i] : 0}`).join('\n')}`,
                    embeds: [],
                    components: []
                }).catch(e => {});
            await oldThread.setArchived(true).catch(e => {});

            let silentAddMessage = await thread.send('Adding subscribed users...');
            for (let subscriber of await db.Subscription.findAll({where: {guild: serverSettings.guild}}))
                await silentAddMessage.edit(`Adding subscribed users...\n<@${subscriber.user}>`);
            await silentAddMessage.delete();
            return;
        }
    }));

    await Promise.all((await db.Reminder.findAll({where: {at: {[Op.lt]: Date.now()}}})).map(async reminder => {
        let user = await bot.users.fetch(reminder.user);
        if (user)
            await user.send({embeds: [EmbedBuilder.from({title: reminder.contents, description: reminder.message})]});
        reminder.destroy();
    }));

    if (off.off) {
        bot.destroy();
        process.exit();
    }
}

export {checkForDiscussions, firstDiscussion, off};