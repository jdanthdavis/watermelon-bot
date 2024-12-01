const { submitTime } = require('../utils/db/submitTime');

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
    const noActionReq =
      !totalEmojis.includes('✅') || !totalEmojis.includes('❌');
    const users = (await reaction.users.fetch()).map((user) =>
      user.globalName ? user.globalName : user.username
    );

    //TODO: Update the length >= to > 3
    if (reaction.emoji.name === '👍' && noActionReq) {
      if (totalEmojis?.length >= 1 && !totalEmojis.includes('👎')) {
        submitTime(reaction, user).then((status) => {
          // message.react(status ? '✅' : '❌');
        });
      } else if (totalEmojis?.length >= 1 && totalEmojis.includes('👎')) {
        await reaction.message.reply(
          `This submission cannot be submitted since **${users}** rejected the submission. Have these users re-review the submission if needed.`
        );
      }
    } else {
      console.log(
        'Bot has already approved/denied this submission. No action.'
      );
    }
  },
};
