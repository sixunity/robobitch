module.exports = {
  handleDoxCommand: async (interaction, EmbedBuilder, config) => {
const axios = require('axios');
main();
async function main(){
try {
      const timestamp = Date.now();
      const startTime = Date.now();
      const ip = interaction.options.getString('ip').toString();
      const response = await axios.get(`https://api.api-ninjas.com/v1/iplookup?address=${ip}`, {
 headers: {
   'X-Api-Key' : config.thekey
 }
})




const isValid = response.data.is_valid;
const country = response.data.country || "Not Found";
const ccode = response.data.country_code || "Not Found";
const rcode = response.data.region_code || "Not Found";
const region = response.data.region || "Not Found";
const city = response.data.city || "Not Found";
const zip = response.data.zip || "Not Found";
const lat = response.data.lat || "Not Found";
const lon = response.data.lon || "Not Found";
const isp = response.data.isp || "Not Found";

      
      


      const endTime = Date.now();
      const duration = endTime - startTime;

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(`Info about ${ip} IP address`)
        	.setThumbnail(`https://flagsapi.com/${ccode}/shiny/64.png`)
        		.setImage(`https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${lon}%2C${lat}&zoom=10&marker=lonlat:${lon}%2C${lat}&apiKey=ab4fbd07c89f482c956a6e2f53e6eb11
`)
        .addFields(
		{ name: 'Valid', value: isValid.toString(), inline: true  },
		{ name: 'Country Code', value: ccode, inline: true },
		{ name: 'Country', value: country, inline: true },
		{ name: 'Region Code', value: rcode, inline: true },
		{ name: 'Region', value: region, inline: true },
		{ name: 'City', value: city, inline: true },
		{ name: 'Zip', value: zip, inline: true },
		{ name: 'Latitude', value: lat.toString(), inline: true },
		{ name: 'Longitude', value: lon.toString(), inline: true },
				{ name: 'ISP', value: isp, inline: true },

	)
        .setFooter({
          text: `run...`,
          iconURL: 'https://tenor.com/view/twitter-furries-silly-cat-silly-cat-gif-27601790.gif'
        });

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Failed to fetch cat picture:', error);
      await interaction.reply({ content: 'Invalid IP' });

    }
    }
    
    }}
