const delSearchLimit = 25;

export default {
    help: () => ({
        title: 'DownfallBot',
        description: `Search for an item with <item name>.
If the result isn\'t what you were looking for, you can also include the following in your search query: character, item type (e.g. card, relic, potion), type (e.g. skill, elite), or text from its description.

Anything highlighted in **bold** is a searchable keyword.

__Commands:__
<del> deletes your last search in this channel.
`,
    }),

    del: async msg => {
        let messages = await msg.channel.messages.fetch();
        messages = messages.filter(i => i.author.id == msg.client.user.id && i.reference != null);
        let i = 0;
        for (let m of messages) {
            i++;
            m = m[1];
            let found = true;
            let repliedTo = await msg.channel.messages.fetch(m.reference.messageId).catch(e => found = false);
            if (!found) continue
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
};