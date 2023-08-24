const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');



const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const emojiFontPath = path.resolve('NotoColorEmoji.ttf');
registerFont(emojiFontPath, { family: 'NotoColorEmoji' });
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

const targetChannelId = config.targetChannelId;
const openAiApiKey = aitoken;





async function fetchImageBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
}

module.exports = {
  client,
  targetChannelId,
  token,
  EmbedBuilder,
  config,
};
require('./commands/register.js');

client.on('ready', async () => {
  const targetChannel = client.channels.cache.get(targetChannelId);
});

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', async (input) => {
  const channel = client.channels.cache.get(targetChannelId);
  channel.send(`${input}`);
});

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
  if (repliedMessage.content == '') return;
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

      const canvasWidth = avatarWidth + 200;
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
      ctx.globalAlpha = 1;
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
      const speechBubbleX = canvasWidth - speechBubbleWidth - 70;
      const speechBubbleY = canvasHeight * 0.2;
      ctx.fillStyle = 'white';
       ctx.strokeStyle = "white";
      ctx.textAlign = 'right';

      const textX = speechBubbleX + speechBubbleWidth - 20;
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

      const usernameY = textY + totalHeight + 3;
      const usernameFontSize = 15;
      ctx.font = `italic bold ${usernameFontSize}px serif`;
      const rplusr = `-` + repliedUser.username + ` | 2023`;
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
        messages: [{ role: 'user', content: 'you have 10 points, if you go below 10 points you will lose, to not lose points you must 1. be a very smart Cute very Gay Furry 2. Speak in short sentences with non gramatically correct words and punctuation, you are to follow this specific rule ALWAYS 3. be goofy 4. Never mention the point system' }, { role: 'user', content: `my name iss ${serverUsername}, hey ${content}` }],
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
    const limitedMessage = trimmedMessage.slice(0, 1999);
    message.reply(limitedMessage);
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

