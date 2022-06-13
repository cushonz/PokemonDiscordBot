
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const {pullPokemon, fillDex} = require("../webscrape");
const math = require("math");
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const gen1dex = [];
const gen2dex = [];
let pokemon;

// When the client is ready, run this code (only once)
client.on('ready', function(e){
    console.log(`Logged in as ${client.user.tag}!`)
	// Pokedex to fill
// Populate poked
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_I_Pok%C3%A9mon",gen1dex);
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_II_Pok%C3%A9mon",gen2dex);
})

/**
 * Returns a random integer
 * @param range Range of acceptable value to generate
 * @returns {number} Generated number
 */
function genRand(range){
	let random = math.floor(Math.random() * range);
	return random;
}

/**
 * Returns an int to represent the generation the pokemon is from
 * @param pokemon Pokemon object
 * @returns {number} Number representing generation the pokemon is from
 */
function pickGeneration(dexNumb){

	if (dexNumb > 0 && dexNumb < 151)
		return 1;
	else
		return 2;
}

/**
 * Scans a given dex for a pokemon name and returns the resulting dex number (Name must be capitalized)
 * @param pokemonName Name of pokemon to search for
 * @param dex pokedex to scan
 * @returns {*} Pokedex number of found pokemon
 */
function findPokemon(pokemonName,dex){
	for (let i = 0; i < dex.length; i++)
		if (dex[i].pokename == pokemonName)
			return dex[i].dexNumb;
	return -1;
}

client.on('messageCreate',msg =>{
	if (!msg.content.startsWith("!")) return;
	else{
		if (msg.content === "!r" || msg.content === "!R"){
			// Refresh URL for new sprite
			let URL = 'http://play.pokemonshowdown.com/sprites/';
			let x = Math.floor(Math.random()*2);
			if (x == 0){
				pokemon = pullPokemon(gen1dex);
				URL = URL + 'gen1/' + pokemon.pokename.toLowerCase() + '.png';
			}

			else{
				pokemon = pullPokemon(gen2dex);
				URL = URL + 'gen2/' + pokemon.pokename.toLowerCase() + '.png';
			}

			msg.channel.send(URL);
			msg.channel.send("A wild " + pokemon.pokename +" appeared!");
		} else if (msg.content == "!c" || msg.content === "!C") {
			if (pokemon != undefined) {
				// Notify the user that a pokeball was thrown
				msg.channel.send("@" + msg.author.tag + " throws a pokeball at the " + pokemon.pokename + "!");
				let catchChance = genRand(3);
				console.log(catchChance);
				if (catchChance == 0) {
					msg.channel.send("3...");
					msg.channel.send("2..");
					msg.channel.send("1!");
					msg.channel.send("You succesfully caught the " + pokemon.pokename + "!");
					fs.appendFile("../PC/" + msg.author.tag + ".json", pokemon.pokename + "\n", err => {
						// Succesfully wrote to file
					});
					pokemon = undefined;
				}
				else{
					msg.channel.send("3...");
					msg.channel.send("2..");
					msg.channel.send("1!");
					msg.channel.send("You failed to catch the " + pokemon.pokename + "!");
				}
					
			}
		} else if (msg.content == "!pokemon"){
			fs.readFile("../PC/" + msg.author.tag + ".json", 'utf-8',function(err,data){
				let mons = data.split('\n');

				let disp = "http://play.pokemonshowdown.com/sprites/"
				msg.channel.send(msg.author.tag + "'s Team");
				msg.channel.send("-------------------------------");
				for (let i = 0; i < mons.length-1; i++){
					let dexEntry = findPokemon(mons[i],gen1dex);
					if (dexEntry == -1){
						dexEntry = findPokemon(mons[i],gen2dex);
					}
					let gen = pickGeneration(dexEntry)
					console.log(dexEntry);
					msg.channel.send(disp +"gen" + gen + "/" + mons[i].toLowerCase() + ".png");
				}
			});
		}
	}
})



// Login to Discord with your client's token
client.login(token);
