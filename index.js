require('dotenv').config();

const axios = require('axios')
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply('Welcome, this bot can be used to find information about Pokemons. Try it by sending /pokeinfo Pikachu')
})
bot.command('/pokeinfo', (ctx) => {
    let parameter = ctx.update.message.text.split(' ')

    if(parameter.length < 2) {
        ctx.reply('You need to insert a parameter. Like /pokeinfo Pikachu, not just /pokeinfo.')
    } else {
        ctx.reply('Loading...')
    
        getPokemonProfile(parameter[1].toLowerCase()).then(response => {
            if (response.status) {
                ctx.reply(response.message)
                ctx.reply(response.image)
            } else {
                ctx.reply(response.message)
            }
        })

    }
})

bot.launch()

async function getPokemonProfile(name) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        let combinedString = `${capitalizeFirstLetter(response.data.name)} is an <${response.data.types[0].type.name}> type Pokemon with ${response.data.weight} weight and ${response.data.height} height, here's a picture of ${capitalizeFirstLetter(response.data.name)}.`
        return {
            status: true,
            message: combinedString,
            image: response.data.sprites.front_default,
        };
    } catch (error) {
        return {
            status: false,
            message: `Sorry we don't have information for <${capitalizeFirstLetter(name)}>\nAn error happened. It was ${error}`,
        };
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}