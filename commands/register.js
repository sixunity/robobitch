const { REST } = require('@discordjs/rest');
const { client, targetChannelId, token, EmbedBuilder, config } = require('../index');
const { getRandomCuteEmoticon } = require('./functionfile')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');

 const commands = [
    new SlashCommandBuilder()
      .setName('cat')
      .setDescription('Random cat fact and picture')
      .toJSON(),
       new SlashCommandBuilder()
      .setName('dog')
      .setDescription('Random dog fact and picture')
      .toJSON(),
       new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a Youtube video in VC')
        .addStringOption((option) =>
          option.setName('link').setDescription('video or playlist link').setRequired(true)
        )
        .toJSON(),
        new SlashCommandBuilder()
        .setName('urbandictionary')
        .setDescription('Search UrbanDictionary definitions')
        .addStringOption((option) =>
          option.setName('word').setDescription('the word u want the definition of').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('num').setDescription('which definition you want').setRequired(false)
        )
        .toJSON(),
         new SlashCommandBuilder()
        .setName('ip')
        .setDescription('IP lookup')
        .addStringOption((option) =>
          option.setName('ip').setDescription('The IP address').setRequired(true)
        )
        .toJSON(),
        new SlashCommandBuilder()
        .setName('aq')
        .setDescription('Air Quality')
        .addStringOption((option) =>
          option.setName('loc').setDescription('City name').setRequired(true)
        )
        .toJSON(),
        new SlashCommandBuilder()
        .setName('food')
        .setDescription('Recipe Lookup')
        .addStringOption((option) =>
          option.setName('food').setDescription('Recipe name').setRequired(true)
        ).addStringOption((option) =>
          option.setName('num').setDescription('which recipe you want').setRequired(false)
        )
        .toJSON()
  ];

client.on('ready', async () => {
  const targetChannel = client.channels.cache.get(targetChannelId);
  console.log(`funny is active - ${client.user.tag}`);
  const rest = new REST({ version: '9' }).setToken(token);

  try {
   await rest.put(
	Routes.applicationCommands("927274220189286470"),
	{ body: commands },
);


    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    if (interaction.commandName === 'cat') {
      const { handleCatCommand } = require('./slashcommands/cat.js');
      await handleCatCommand(interaction, EmbedBuilder, getRandomCuteEmoticon);
    } else if (interaction.commandName === 'dog') {
      const { handleDogCommand } = require('./slashcommands/dog.js');
      await handleDogCommand(interaction, EmbedBuilder, getRandomCuteEmoticon);
    } else if (interaction.commandName === 'play') {
      const { handlePlayCommand } = require('./slashcommands/audio.js');
      await handlePlayCommand(interaction);
    } else if (interaction.commandName === 'urbandictionary') {
      const { handleUrbanCommand } = require('./slashcommands/urban.js');
      await handleUrbanCommand(interaction, EmbedBuilder);
    } else if (interaction.commandName === 'ip') {
      const { handleDoxCommand } = require('./slashcommands/dox.js');
      await handleDoxCommand(interaction, EmbedBuilder, config);
    } else if (interaction.commandName === 'aq') {
      const { handleAqCommand } = require('./slashcommands/aq.js');
      await handleAqCommand(interaction, EmbedBuilder, config);
    } else if (interaction.commandName === 'food') {
      const { handleFoodCommand } = require('./slashcommands/food.js');
      await handleFoodCommand(interaction, EmbedBuilder, config);
    }


  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply({ content: 'An error occurred while processing the command.' });
  }
});
  
  
