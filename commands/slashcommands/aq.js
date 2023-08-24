module.exports = {
  handleAqCommand: async (interaction, EmbedBuilder, config) => {
const axios = require('axios');
main();
async function main(){
try {
      const timestamp = Date.now();
      const startTime = Date.now();
      const loc = interaction.options.getString('loc').toString();
      const response = await axios.get(`https://api.api-ninjas.com/v1/airquality?city=${loc}`, {
 headers: {
   'X-Api-Key' : config.thekey
 }
})




const coConcentration = response.data.CO.concentration;
const coAqi = response.data.CO.aqi || "Not Found";
const no2Concentration = response.data.NO2.concentration || "Not Found";
const no2Aqi = response.data.NO2.aqi || "Not Found";
const o3concentration = response.data.O3.concentration || "Not Found";
const o3Aqi = response.data.O3.aqi || "Not Found";
const so2Concentration = response.data.SO2.concentration || "Not Found";
const so2Aqi = response.data.SO2.aqi || "Not Found";
const pm25Concentration = response.data.PM10.concentration || "Not Found";
const pm25Aqi = response.data.PM10.aqi || "Not Found";
const generalAqi = response.data.overall_aqi;



      
      


      const endTime = Date.now();
      const duration = endTime - startTime;

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(`Air Quality in ${loc}`)
        .setDescription(`Overall AQI = ${generalAqi} (Lower is better)`)

        .addFields(
		{ name: 'CO', value: `Con : ${coConcentration} | AQI : ${coAqi}`, inline: false  },
		{ name: 'NO2', value: `Con : ${no2Concentration} | AQI : ${no2Aqi}`, inline: true },
		{ name: 'O3', value: `Con : ${o3concentration} | AQI : ${o3Aqi}`, inline: false },
		{ name: 'SO2', value: `Con : ${so2Concentration} | AQI : ${so2Aqi}`, inline: true },
		{ name: 'PM10', value: `Con : ${pm25Concentration} | AQI : ${pm25Aqi}`, inline: false },
	)
        .setFooter({
          text: `mmmm.... wether`,
          iconURL: 'https://tenor.com/view/twitter-furries-silly-cat-silly-cat-gif-27601790.gif'
        });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'oopsie' });

    }
    }
    
    }}
