const { submitTime } = require('../utils/db/submitTime');
require('dotenv').config();
const { CLIENT_ID } = process.env;

module.exports = {
  reactionHandler: async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }
    const message = reaction.message;
    const totalEmojis = [];
    message.reactions.cache.forEach((reaction) => {
      totalEmojis.push(reaction.emoji.name);
    });
    const approvals = totalEmojis.filter((x) => x === '👍')?.length;
    const emojiBlockers =
      totalEmojis.includes('✅') || totalEmojis.includes('❌');
    const users = (await reaction.users.fetch()).map((user) =>
      user.globalName ? user.globalName : user.username
    );

    //TODO: Update approvals >= 1 to > 3
    if (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') {
      if (approvals >= 1 && totalEmojis.includes('👎')) {
        await message.reply(
          `This submission cannot be submitted since **${users}** rejected the submission. Have these users re-review the submission if needed.`
        );
      } else if (
        approvals >= 1 &&
        !totalEmojis.includes('👎') &&
        !emojiBlockers
      ) {
        submitTime(reaction, user).then((status) => {
          console.log(`Status: ${status}`);
          message.react(status ? '✅' : '❌');
        });
      } else if (emojiBlockers && user.id !== CLIENT_ID) {
        await message.reply(
          `This submission can no longer be approved/denied.`
        );
      }
    }
  },
};
