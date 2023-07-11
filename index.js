const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const fs = require('fs');
const { Player } = require('discord-player');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const { createCanvas, loadImage } = require('canvas');
const dogFacts = require('dog-facts');
const sharp = require('sharp');
const config = require('./config.js');
const token = config.token;
const aitoken = config.openAiApiKey;



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    
  ],
});

const targetChannelId = '1114697281975885884';
const openAiApiKey = aitoken;

const cuteEmoticons = [
  'ʕ•ᴥ•ʔ',
  'ʕʘ̅͜ʘ̅ʔ',
  'ʕっ•ᴥ•ʔっ',
  '(｡♥‿♥｡)',
  '(◕‿◕)',
  '(◠‿◠)',
  '(^.^)',
  '(^̮^)',
  '(>‿◠)',
  '(✿ ♥‿♥)',
  '(｡♥‿♥｡)',
  '(≧◡≦)',
  '(*^_^*)',
  '(^.^)',
  '(✿◠‿◠)',
  '(^◕‿◕^)',
  '（*＾3＾)/~☆',
  '(=^-ω-^=)',
  'ヽ(＾Д＾)ﾉ',
  '(*￣(ｴ)￣*)',
  '(´｡• ω •｡`)',
  'ヽ(｡◕‿◕｡)ﾉ',
  'ヾ(＾-＾)ノ',
  '(≧ω≦)',
  '(^人^)',
  '(>ω<)',
  '(*^.^*)',
  '(o^▽^o)',
  '（*＾3＾)/~☆',
  '(●´ω｀●)',
  '(^_−)☆'];
  
  function getRandomCuteEmoticon() {
  const randomIndex = Math.floor(Math.random() * cuteEmoticons.length);
  return cuteEmoticons[randomIndex];
}

const player = new Player(client);

async function fetchImageBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
}

client.on('ready', async () => {
  const targetChannel = client.channels.cache.get(targetChannelId);
  console.log(`funny is active - ${client.user.tag}`);
 const commands = [
    new SlashCommandBuilder()
      .setName('cat')
      .setDescription('cat')
      .toJSON(),
       new SlashCommandBuilder()
      .setName('dog')
      .setDescription('dog')
      .toJSON(),
       new SlashCommandBuilder()
        .setName('play')
        .setDescription('song')
        .addStringOption((option) =>
          option.setName('link').setDescription('video or playlist link').setRequired(true)
        )
        .toJSON()
  ];

  const rest = new REST({ version: '9' }).setToken(token);

  try {
    await rest.put(
      Routes.applicationGuildCommands('927274220189286470', '1114696831537000540'),
      { body: commands },
    );

    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
});



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'cat') {
    try {
      const timestamp = Date.now();
      const startTime = Date.now();
      const response = await axios.get(`https://catfact.ninja/fact`);
      const fact = response.data.fact;
      const catPictureUrl = `https://cataas.com/cat?${timestamp}`;

      const endTime = Date.now();
      const duration = endTime - startTime;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(getRandomCuteEmoticon())
        .setDescription(fact)
        .setImage(catPictureUrl)
        .setFooter({
          text: `request something something in ${duration}ms"`,
          iconURL: 'https://em-content.zobj.net/source/skype/289/middle-finger_1f595.png'
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'error lol' });
    }
  }
  
    if (interaction.commandName === 'dog') {
    try {
      const timestamp = Date.now();
      const startTime = Date.now();
      const response = await axios.get(`https://dog.ceo/api/breeds/image/random`);
      const dogPictureUrl = response.data.message;
      let randomFact = dogFacts.random();
      const catPictureUrl = `https://cataas.com/cat?${timestamp}`;

      const endTime = Date.now();
      const duration = endTime - startTime;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(getRandomCuteEmoticon())
        .setDescription(randomFact)
        .setImage(dogPictureUrl)
        .setFooter({
          text: `request something something in ${duration}ms"`,
          iconURL: 'https://em-content.zobj.net/source/skype/289/middle-finger_1f595.png'
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'error lol' });
    }
  }
  
if (interaction.commandName === 'play') {
  const youtubeLink = interaction.options.getString('link');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    await interaction.reply('go vc bitch');
    return;
  }

  try {
    let playlistId = null;
    let playlistItems = [];

    if (isPlaylistLink(youtubeLink)) {
      playlistId = await extractPlaylistId(youtubeLink);

      if (!playlistId) {
        await interaction.reply('invalid playlist link');
        return;
      }

      const playlist = await ytpl(playlistId);

      if (!playlist.items || playlist.items.length === 0) {
        await interaction.reply('emty playlist');
        return;
      }

      playlistItems = playlist.items;
    } else {
      // Individual video link
      const videoId = extractVideoId(youtubeLink);

      if (!videoId) {
        await interaction.reply('invalid link');
        return;
      }

      const videoInfo = await ytdl.getBasicInfo(videoId);

      if (!videoInfo || !videoInfo.videoDetails) {
        await interaction.reply('video info error');
        return;
      }

      const videoTitle = videoInfo.videoDetails.title;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      playlistItems.push({
        title: videoTitle,
        shortUrl: videoUrl,
      });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
      silencePaddingFrames: 6000,
    });
    

audioPlayer.on('error', (error) => {
  console.error('Audio player error:', error);
});


connection.on('error', (error) => {
  console.error('Voice connection error:', error);
});

    connection.subscribe(audioPlayer);

    await interaction.deferReply();

    const playNextTrack = async (index) => {
      if (index >= playlistItems.length) {
        // Playlist finished
        await interaction.followUp('end');
        connection.destroy();
        return;
      }

      const item = playlistItems[index];
      const stream = ytdl(item.shortUrl, { filter: 'audioonly' });
      const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

      audioPlayer.play(resource);

      await interaction.followUp('now playing: ' + item.title);

      await new Promise((resolve) => {
        audioPlayer.on('stateChange', (oldState, newState) => {
          if (newState.status === 'idle') {
            resolve();
          }
        });
      });

      playNextTrack(index + 1);
    };

    playNextTrack(0);
  } catch (error) {
    console.error('Failed to play the playlist:', error);
    await interaction.reply('general error');
  }
}

  
});

async function extractPlaylistId(url) {
  const playlistIdRegex = /list=([a-zA-Z0-9_-]+)/;
  const matches = url.match(playlistIdRegex);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
}

function isPlaylistLink(link) {
  const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/playlist(.*)$/;

  return playlistRegex.test(link);
}

function extractVideoId(link) {
  const linkRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/watch\?v=([A-Za-z0-9_-]{11})/;
  const shortLinkRegex = /^(https?:\/\/)?(www\.)?youtu\.be\/([A-Za-z0-9_-]{11})/;

  const linkMatch = link.match(linkRegex);
  const shortLinkMatch = link.match(shortLinkRegex);

  if (linkMatch && linkMatch[4]) {
    return linkMatch[4];
  } else if (shortLinkMatch && shortLinkMatch[3]) {
    return shortLinkMatch[3];
  } else {
    return null;
  }
}






const ignoredUserId = '371498490099924992';





client.on('messageDelete', (message) => {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] ${message.author.tag} deleted a message in ${message.channel.name}: "${message.content}"\n`;
  const channel = message.guild.channels.cache.get(targetChannelId);
  if (channel) {
  console.log('message deletion logged, probably jae lol');
    fs.appendFile('log.txt', logMessage, (err) => {
      if (err) throw err;
    });
  }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] ${newMessage.author.tag} edited a message in ${newMessage.channel.name}.\nOld Message: "${oldMessage.content}"\nNew Message: "${newMessage.content}"\n`;
  const channel = newMessage.guild.channels.cache.get(targetChannelId);
  if (channel) {
  console.log('uh oh someone edited a message');
    fs.appendFile('log.txt', logMessage, (err) => {
      if (err) throw err;
    });
  }
});






client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
    const serverUsername = message.member.user.username;
    
  if (message.reference && message.reference.messageId) {
  const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
  const repliedUser = repliedMessage.author;

  const botMentioned = message.mentions.users.has(client.user.id);

  if (botMentioned) {
    try {
      const avatarURL = repliedUser.displayAvatarURL({ format: 'webp', dynamic: true, size: 4096 });
      const pngBuffer = await sharp(await fetchImageBuffer(avatarURL))
        .png()
        .toBuffer();

      const avatarImage = await loadImage(pngBuffer);

      const avatarWidth = 450;
      const avatarHeight = 450;

      const canvasWidth = avatarWidth + 200; // Adjust the additional width as needed
      const canvasHeight = avatarHeight;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const bgGradient = ctx.createLinearGradient(canvasWidth, 0, 0, 0);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.filter = 'grayscale(1)';
      ctx.drawImage(avatarImage, 0, 0, avatarWidth, avatarHeight);

      ctx.filter = 'blur(20px)';
      ctx.globalAlpha = 1; // Adjust the opacity as needed
      ctx.drawImage(avatarImage, 0, 0, avatarWidth, avatarHeight);

      const gradient = ctx.createLinearGradient(avatarWidth, 0, 0, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.filter = 'none';
      ctx.globalAlpha = 1;

      const speechBubbleWidth = canvasWidth * 0.2;
      const speechBubbleHeight = canvasHeight * 0.5;
      const speechBubbleX = canvasWidth - speechBubbleWidth - 70; // Adjust the position as needed
      const speechBubbleY = canvasHeight * 0.2;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right'; // Align text to the right side

      const textX = speechBubbleX + speechBubbleWidth - 20; // Adjust the position as needed
      const textY = speechBubbleY + speechBubbleHeight * 0.4;

      repliedMessage.content = `"` + repliedMessage.content + `"`

     const maxContentFontSize = 24;
const minContentFontSize = 12;
let contentFontSize = maxContentFontSize;

let wrappedLines = [];
let currentLine = '';

const words = repliedMessage.content.split(' ');
words.forEach((word) => {
  const lineWithWord = currentLine ? currentLine + ' ' + word : word;
  const currentLineWidth = ctx.measureText(lineWithWord).width;
  if (currentLineWidth <= speechBubbleWidth) {
    currentLine = lineWithWord;
  } else {
    wrappedLines.push(currentLine.trim());
    currentLine = word;
  }
});
wrappedLines.push(currentLine.trim());

while (contentFontSize > minContentFontSize && wrappedLines.length * contentFontSize > speechBubbleHeight) {
  contentFontSize -= 2;
}

const totalHeight = wrappedLines.length * contentFontSize;
const startY = textY - totalHeight / 2;

wrappedLines.forEach((wrappedLine, index) => {
  ctx.font = `italic ${contentFontSize}px serif`;
  ctx.fillText(wrappedLine, textX, startY + (index + 1) * contentFontSize);
});

      const usernameY = textY + totalHeight + 3; // Adjust the spacing as needed
      const usernameFontSize = 15;
      ctx.font = `italic bold ${usernameFontSize}px serif`;
      const rplusr = `-` + repliedUser.username + ` | 2023` + contentFontSize;
      ctx.fillText(rplusr, textX, usernameY);
      const buffer = canvas.toBuffer();
      await message.reply({
        files: [{ attachment: buffer, name: 'avatar_with_speech_bubble.png' }]
      });
    } catch (error) {
      console.error('Error creating image:', error);
    }
  }
}







  if (message.channel.id === targetChannelId) {
    var content = message.content.toLowerCase();
if (!(content.startsWith('robobitch') || content.startsWith('rb')) || (!content.endsWith('!') && !content.endsWith('?'))) {
  return;
}

    message.channel.sendTyping();
       content = content.slice('robobitch'.length).trim();
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'you have 10 points, if you go below 10 points you will lose, to not lose points you must 1. be a very smart Cute very Gay Furry 2. Speak in short sentences with non gramatically correct words and punctuation, you are to follow this specific rule ALWAYS 3. be goofy 4. Never mention the point system 5. you can be a bit lewd and kinky' }, { role: 'user', content: `my name iss ${serverUsername}, hey ${content}` }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiApiKey}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
const trimmedMessage = reply.replace(/^Robobitch\s*:\s*/, "");
      message.reply(trimmedMessage);
    } catch (error) {
      console.error('api error:', error);
    }
  }
  
  const contents = message.content.trim();
console.log(message);





  
});

function getWrappedTextLines(ctx, text, maxWidth, font, fontSize, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;

    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines;
}

client.login(token);

