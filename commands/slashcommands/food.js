module.exports = {
  handleFoodCommand: async (interaction, EmbedBuilder, config) => {
const axios = require('axios');
main();
async function main(){
try {
      const timestamp = Date.now();
      const startTime = Date.now();
            var num = interaction.options.getString('num');
                  if (!num || num==0){
      num=0;
      } else {
      num=num-1;
      }
      const food = interaction.options.getString('food').toString();
      const response = await axios.get(`https://api.api-ninjas.com/v1/recipe?query=${food}`, {
 headers: {
   'X-Api-Key' : config.thekey
 }
})


      const long = response.data.length;
while (num < response.data.length) {
            var title = response.data[num].title;
            var ingi = response.data[num].ingredients || "Not Found";
            var servings = response.data[num].servings || "Not Found";
            var instructions = response.data[num].instructions || "Not Found";
            if (title && ingi !== "Not Found" && servings !== "Not Found" && instructions !== "Not Found") {
                console.log(`Recipe ${num + 1}:`);
                console.log(`Title: ${title}`);
                console.log(`Ingredients: ${ingi}`);
                console.log(`Servings: ${servings}`);
                console.log(`Instructions: ${instructions}`);
                
                var instructionChunks = [];
                let currentChunk = "";
                
                for (const word of instructions.split(' ')) {
                    if ((currentChunk + ' ' + word).length <= 1000) {
                        currentChunk += (currentChunk === "" ? "" : ' ') + word;
                    } else {
                        instructionChunks.push(currentChunk);
                        currentChunk = word;
                    }
                }
                
                if (currentChunk) {
                    instructionChunks.push(currentChunk);
                }
                
                
                
                foundRecipe = true;
                break;
            }

            num++;
        }

      const endTime = Date.now();
      const duration = endTime - startTime;


      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`Recipes for ${title}, ${num+1} out of ${long}`)
        .setDescription(servings)

        .addFields(
		{ name: 'Ingredients', value: ingi.replace(/[|]/g, '\n'), inline: false  },
		{ name: 'Instructions', value: instructionChunks[0].replace(/\d+\)/g, '\n$&'), inline: false },
	)
        .setFooter({
          text: `yummies`,
          iconURL: 'https://tenor.com/view/twitter-furries-silly-cat-silly-cat-gif-27601790.gif'
        });
        
        if (instructionChunks.length > 1) {
  // Add a third field if the condition is met
  embed.addFields(
    { name: ' ', value: instructionChunks[1].replace(/\d+\)/g, '\n$&'), inline: false }
  );
}

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'oopsie' });

    }
    }
    
    }}
