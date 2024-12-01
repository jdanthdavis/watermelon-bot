const { Events, Client, GatewayIntentBits, Partials } = require('discord.js');
const submitHanlder = require('./events/submitHandler');
const { reactionHandler } = require('./events/reactionHandler');
const { boardBuilder } = require('./utils/boardBuilder');
const { getAllTimes } = require('./utils/db/getAllTimes');
require('dotenv').config();
const { BOT_TOKEN, GUILD_ID } = process.env;

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

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    submitHanlder(interaction);
  }

  if (interaction.isAutocomplete()) {
    const { commandName } = interaction;

    if (commandName === 'submit') {
      require('./commands/submitCommand').autocomplete(interaction);
    }
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  reactionHandler(reaction, user);
});

const channelId = '1267621876432375879'; // mocks channel

client.once('ready', async () => {
  const channel = await client.channels.fetch(channelId);
  setInterval(async () => {
    try {
      // let messages = await channel.messages.fetch({ limit: 10 });
      // await channel.bulkDelete(messages);
      const allTimes = await getAllTimes();

      allTimes?.forEach(async (x) => {
        const embed = await boardBuilder(x);
        if (channel) {
          await channel.send({ embeds: [embed] });
          console.log('Embed refreshed and sent successfully!');
        } else {
          console.log('Channel not found!');
        }
      });
    } catch (error) {
      console.error('Error refreshing embed:', error);
    }
  }, 5000);
});

console.log(`Logged in to ${GUILD_ID}`);
