const axios = require('axios');
module.exports = {
  handleUrbanCommand: async (interaction, EmbedBuilder, getRandomCuteEmoticon) => {
try {
      const timestamp = Date.now();
      const startTime = Date.now();
      var num = interaction.options.getString('num');
      if (!num || num==0){
      num=0;
      } else {
      num=num-1;
      }
      const term = interaction.options.getString('word');
      const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`);
      const fact = response.data.list[num].definition;
      const thumb = response.data.list[num].thumbs_up;
      const author = response.data.list[num].author;
      const example = response.data.list[num].example;
      const long = response.data.list.length;
      
      


      const endTime = Date.now();
      const duration = endTime - startTime;

      const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle(`${term} - Definition ${num+1} out of ${long}`)
        .setDescription(fact.replace(/\[|\]/g, ''))
        	.addFields({ name: 'Example', value: example.replace(/\[|\]/g, ''), inline: true })
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Urban_Dictionary_logo.svg/512px-Urban_Dictionary_logo.svg.png')
        .setFooter({
          text: `${thumb} upvotes, by ${author}`,
          iconURL: 'https://tenor.com/view/twitter-furries-silly-cat-silly-cat-gif-27601790.gif'
        });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'error lol, the word prolly isnt in urban dictionary' });

    }
    
    }}
