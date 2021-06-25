const { MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const { weatherapi } = require("../../config.json");
const https = require("https");

module.exports = class WeatherCommands extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            aliases: ['w'],
            group: 'api',
            memberName: 'weather',
            description: 'Get weather information from api',
            args: [
                {
                    key: 'city',
                    prompt: 'Which city do you want to see ?',
                    type: 'string'
                },
                {
                    key: 'day',
                    prompt: 'How many day do you want to see ?',
                    type: 'integer'
                }
            ]
        })
    }

    async run(message, { city, day }) {
        var weather_body = ""

        if (day < 1)
            day = 1
        else if (day > 8)
            day = 8

        https.get("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=" + day + `&appid=${weatherapi}`, (res) => {
            res.on("data", (data) => {
                weather_body += data
            })

            res.on("end", () => {
                const body = JSON.parse(weather_body)
                console.log(body)

                if (body.cod == 404)
                    return message.say("No city found try with another city")

                var embed = new MessageEmbed()
                    .setTitle(`${body.cnt} day past weather information for ${body.city.name}`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("BLUE")
                    .setFooter("Provided by terry94#4694")
                    .setTimestamp(new Date)

                var value = ""
                value += "Longitude: " + body.city.coord.lon + "\n"
                value += "Latitdue: " + body.city.coord.lat + "\n"
                embed.addField("Coordinate:", value)

                for (let i = 0; i < body.cnt; i++) {
                    var temp = parseFloat(body.list[i].main.temp) - 273.15
                    var like = parseFloat(body.list[i].main.feels_like) - 273.15
                    var max = parseFloat(body.list[i].main.temp_max) - 273.15
                    var min = parseFloat(body.list[i].main.temp_min) - 273.15
                    value = ""
                    value += "Temperature: " + temp.toFixed(2) + " °C\n"
                    value += "Feels like: " + like.toFixed(2) + " °C\n"
                    value += "Min temperature: " + min.toFixed(2) + " °C\n"
                    value += "Max temperature: " + max.toFixed(2) + " °C\n"
                    value += "Humidity: " + body.list[i].main.humidity + "%\n"
                    embed.addField(`Main information (day ${i + 1}):`, value, true)

                    var speed = parseFloat(body.list[i].wind.speed) * 1.852
                    value = ""
                    value += "Speed: " + speed.toFixed(2) + " km/h\n"
                    embed.addField(`Wind information (day ${i + 1}):`, value, true)

                    // var icon = url"http://openweathermap.org/img/wn/" + body.list[i].weather[0].icon + "@2x.png";
                    value = ""
                    value += "Description: " + body.list[i].weather[0].description + "\n"
                    value += "Icon: " + "http://openweathermap.org/img/wn/" + body.list[i].weather[0].icon + "@2x.png" + "\n"
                    embed.addField(`${body.list[i].weather[0].main} (day ${i + 1}):`, value, true)
                }

                return message.say(embed);
            })
        })
    }
}