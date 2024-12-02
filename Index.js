const { Events, Client, GatewayIntentBits, Partials } = require('discord.js');
const submitHanlder = require('./events/submitHandler');
const { reactionHandler } = require('./events/reactionHandler');
const { buildBoardNow } = require('./buildBoardNow');
const { refreshBoard } = require('./utils/refreshBoard');
const cron = require('node-cron');
require('dotenv').config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID, MY_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.login(BOT_TOKEN);

const runRefreshJob = () => {
  refreshBoard(client);
};

// cron.schedule('*/1 * * * *', runRefreshJob, {
//   timezone: 'America/New_York',
// });
// Runs once a week at 10PM EST
// cron.schedule('0 22 * * 0', runRefreshJob, {
//   timezone: 'America/New_York',
// });

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const commandName = interaction.commandName;

    switch (commandName) {
      case 'submit':
        const submitCommand = require('./commands/submitCommand');
        await submitCommand.execute(interaction).then(() => {
          submitHanlder(interaction);
        });
        return;
      case 'request':
        const requestCommand = require('./commands/requestCommand');
        await requestCommand.execute(interaction);
        return;
      case 'issue':
        const reportCommand = require('./commands/reportCommand');
        await reportCommand.execute(interaction);
        return;
      default:
        console.log('No such command.');
    }
  }

  if (interaction.isAutocomplete()) {
    const { commandName } = interaction;

    if (commandName === 'submit') {
      const submitCommand = require('./commands/submitCommand');
      await submitCommand.autocomplete(interaction);
    }
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  reactionHandler(reaction, user);
});

// Forces the bot to refresh the board.
client.on('messageCreate', async (message) => {
  if (message.author.id === CLIENT_ID && message.author !== MY_ID) return;
  if (message.content.toLowerCase() === '.buildnow') {
    refreshBoard(client);
  }
});

console.log(`Logged in to ${GUILD_ID}`);
