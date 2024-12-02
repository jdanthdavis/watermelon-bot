const { Events, Client, GatewayIntentBits, Partials } = require('discord.js');
const submitHanlder = require('./events/submitHandler');
const { reactionHandler } = require('./events/reactionHandler');
const { buildBoardNow } = require('./buildBoardNow');
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

// force the board to build now. Mostly for developing
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === 'build') {
    buildBoardNow(message);
  }
});

const channelId = '1267621876432375879'; // mocks channel

// client.once('ready', async () => {
//   const channel = await client.channels.fetch(channelId);
//   setInterval(async () => {
//     try {
//       // Step 1: Fetch and delete the last 40 messages
//       // let messages = await channel.messages.fetch({ limit: 40 });
//       // await channel.bulkDelete(messages);

//       // Step 2: Fetch all raid times
//       const getTimes = await getAllTimes();

//       // Step 3: Filter times into raidTimes and bossTimes
//       const bossTimes = getTimes.filter(
//         (boss) => !raidsList.includes(boss.bossName)
//       );
//       const raidTimes = getTimes.filter((boss) =>
//         raidsList.includes(boss.bossName)
//       );

//       // Step 4: Sort raid times
//       const sortedToBTimes = raidSorter(raidTimes, 'Theatre of Blood');
//       const sortedHMTimes = raidSorter(raidTimes, 'HM');
//       const sortedCoXTimes = raidSorter(raidTimes, 'CoX');
//       const sortedCMTimes = raidSorter(raidTimes, 'CM');
//       const sortedToATimes = raidSorter(raidTimes, 'TOA');
//       const sortedExpertTimes = raidSorter(raidTimes, 'Expert');

//       // Step 5: Send the Raids header
//       // await channel.send('# Raids');

//       // Send Theatre of Blood times in order using Promise.all
//       // await Promise.all(
//       //   sortedToBTimes.map(async (tobTimes) => {
//       //     const embed = await boardBuilder(tobTimes);
//       //     return channel.send({ embeds: [embed] });
//       //   })
//       // );

//       // // After all Theatre of Blood times are sent, send the next header
//       // await channel.send('## HM');

//       // await Promise.all(
//       //   sortedHMTimes.map(async (tobTimes) => {
//       //     const embed = await boardBuilder(tobTimes);
//       //     return channel.send({ embeds: [embed] });
//       //   })
//       // );

//       // for (const hmTimes of sortedHMTimes) {
//       //   const embed = await boardBuilder(hmTimes);
//       //   await channel.send({ embeds: [embed] });
//       //   await sleep(1000);
//       // }

//       return;

//       // Step 7: Send the Bosses header after raidTimes are done
//       await channel.send('# Bosses');

//       // Step 8: Send all the bossTimes embeds sequentially
//       for (const raidBoss of bossTimes) {
//         const embed = await boardBuilder(raidBoss);
//         await channel.send({ embeds: [embed] });
//       }
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   }, 10000);
// });

console.log(`Logged in to ${GUILD_ID}`);
