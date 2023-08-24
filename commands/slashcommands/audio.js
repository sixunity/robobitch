module.exports = {
  handlePlayCommand: async (interaction) => {
  const ytdl = require('ytdl-core');
  const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require('@discordjs/voice');

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



}}


