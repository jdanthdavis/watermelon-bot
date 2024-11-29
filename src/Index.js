const { Client, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require('mongoose');
const submitHanlder = require('./events/submitHandler');
const reactionHandler = require('./events/reactionHandler');
const { boardBuilder } = require('./utils/boardBuilder');
require('dotenv').config();
const { BOT_TOKEN, GUILD_ID, MONGO_URI } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

client.login(BOT_TOKEN);

client.on('interactionCreate', submitHanlder);
client.on('messageReactionAdd', reactionHandler);
client.on('messageReactionRemove', reactionHandler);

const channelId = '1267621876432375879'; // mocks channel
let lastMessage = null;

// When the bot is ready, start sending the embed
// client.once('ready', () => {
//   // Set the interval to send the embed every 10 seconds
//   setInterval(async () => {
//     try {
//       const embed = await boardBuilder(); // Generate the embed
//       const channel = await client.channels.fetch(channelId); // Fetch the channel by ID
//       if (channel) {
//         if (lastMessage) {
//           // If a message was sent previously, delete it
//           await lastMessage.delete().catch(console.error);
//         }

//         // Send the new embed to the channel
//         lastMessage = await channel.send({ embeds: [embed] }); // Store the reference of the sent message
//         console.log('Embed refreshed and sent successfully!');
//       } else {
//         console.log('Channel not found!');
//       }
//     } catch (error) {
//       console.error('Error refreshing embed:', error);
//     }
//   }, 10000); // 10000ms = 10 seconds
// });

console.log(`Logged in to ${GUILD_ID}`);
//   const msg = message.content;

//   if (msg.startsWith('!embed')) {
//     const embed = new EmbedBuilder()
//       .setColor(0x0099ff) // Set the embed color
//       .setTitle('Example Embed Title') // Embed title
//       .setDescription(
//         'This is an example of an embed message created with discord.js v14.'
//       ) // Embed description
//       .addFields(
//         { name: 'Field 1', value: 'This is the value of field 1.' },
//         { name: 'Field 2', value: 'This is the value of field 2.' }
//       )
//       .setTimestamp() // Add a timestamp
//       .setFooter({
//         text: 'Your Bot Footer Text',
//         iconURL: client.user.displayAvatarURL(),
//       }); // Footer with bot icon

//     // Send the embed message in the same channel
//     message.channel.send({ embeds: [embed] });
//   }

//   // // Check if the message starts with "!createChannel"
//   // if (message.content.startsWith('!create')) {
//   //   const categoryId = '1311546001450078268'; // Replace with the category ID where channels should be created
//   //   const category = message.guild.channels.cache.get(categoryId);

//   //   // Ensure the category exists
//   //   if (!category) {
//   //     return message.channel.send('Category not found.');
//   //   }

//   //   const channels = [
//   //     'mastery',
//   //     //   'area-unlocks',
//   //     //   'relic-picks',
//   //     //   'league-tasks',
//   //     //   'league-trophies',
//   //     //   'drops',
//   //     //   'collection-logs',
//   //     //   'pets',
//   //     //   'clue-scrolls',
//   //     //   'combat-tasks',
//   //     //   'boss-kc',
//   //     //   'deaths',
//   //   ];

//   //   for (const cName of channels) {
//   //     try {
//   //       const channel = await message.guild.channels.create({
//   //         name: cName,
//   //         type: ChannelType.GuildText,
//   //         parent: category,
//   //       });
//   //       await message.channel.send(`${channel} created!`);

//   //       const webhook = await message.guild.channels.createWebhook({
//   //         avatar: './assets/webhook_icon.png',
//   //         channel: channel.id,
//   //         name: 'the-gardener (but for leagues)',
//   //       });
//   //       await message.channel.send(
//   //         `Here is your webhook URL: ${webhook.url}\n`
//   //       );
//   //     } catch (e) {
//   //       console.log(e);
//   //       await message.channel.send('There was an error creating the webhook.');
//   //     }
//   //   }
//   // }
// });
