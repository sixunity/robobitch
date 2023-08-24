module.exports = {
  handleDogCommand: async (interaction, EmbedBuilder, getRandomCuteEmoticon) => {

const axios = require('axios');
const dogFacts = require('dog-facts');
main();
async function main(){
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
          text: `request something something in ${duration}ms`,
          iconURL: 'https://em-content.zobj.net/source/skype/289/middle-finger_1f595.png'
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'error lol' });
    }
    }
    }}
