/**
 * Created by tomokokawase on 17-4-27.
 */
function getWeatherData() {
    return {
        locations:[
            {
                name:'Portland',
                forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather:'Overcast',
                temp:'54.1F(12.3C)',
            },
            {
                name:'Bend',
                forecastUrl:'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather:'Partly Cloudy',
                temp:'55.0F(12.8C)',
            },
            {
                name:'Manzanita',
                forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl:'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather:'Light Rain',
                temp:'55.0F(12.8C)',
            },
        ],
    };
}

module.exports = getWeatherData;