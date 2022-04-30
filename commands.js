import { bot, search } from './index.js';
import embed from './embed.js';

const delSearchLimit = 25;

export default {
    help: () => ({
        title: 'DownfallBot',
        description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

If you edit or delete your message containing your searches, I will edit or delete my reply to it, according to your changes.

__Commands:__
<del> deletes your last search in this channel.
<? [search query]> shows the 10 most likely results for a search query.
`,
        thumbnail: {url: bot.user.avatarURL()},
    }),

    del: async msg => {
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

    '?': async (msg, arg) => {
        let results = search.search(arg).slice(0, 10);
        let resultText = results.map((i, index) => `${index+1}: ${i.item.itemType == 'card' ? i.item.character[0].replace('The ', '').toLowerCase() : ''} ${i.item.itemType} **${i.item.name}** - ${String(Math.round((1 - i.score) * 100))}% sure`).join('\n');
        let firstEmbed = results.length > 0 ? await embed(results[0].item, msg) : {thumbnail: null};
        return {
            title: `Searched for "${arg}"`,
            description: results.length == 0 ? 'No results.' : resultText,
            thumbnail: firstEmbed.thumbnail,
            //footer: {text: `${results.length} results`},
            color: 14598591,
        };
    },
};