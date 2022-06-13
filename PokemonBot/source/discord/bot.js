
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const {pullPokemon, fillDex, findPokemon, pickGeneration} = require("../data-collection");
const math = require("math");
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// Pokedex by Generation----
const gen1dex = [];
const gen2dex = [];
const gen3dex = [];
const gen4dex = [];
const gen5dex = [];
//-----------------------

const pokedex = [gen1dex,gen2dex,gen3dex,gen4dex, gen5dex];

let chances;
let pokemon;

// When the client is ready, run this code (only once)
client.on('ready', function(e){
    console.log(`Logged in as ${client.user.tag}!`)
	// Pokedex to fill
// Populate pokedi
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_I_Pok%C3%A9mon",pokedex[0]);
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_II_Pok%C3%A9mon",pokedex[1]);
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_III_Pok%C3%A9mon",pokedex[2]);
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_IV_Pok%C3%A9mon",pokedex[3]);
	fillDex("https://pokemon.fandom.com/wiki/List_of_Generation_V_Pok%C3%A9mon",pokedex[4]);



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





client.on('messageCreate',msg =>{
	// ignore all non command messages
	if (!msg.content.startsWith("!")) return;
	else{
		console.log(gen4dex[4]);
		if (msg.content === "!r" || msg.content === "!R"){
			// Refresh URL for new sprite
			let URL = 'http://play.pokemonshowdown.com/sprites/';
			let x = Math.floor(Math.random()*5);
			pokemon = pullPokemon(pokedex[x]);
			let gen = pickGeneration(pokemon.dexNumb);
			URL = URL + 'gen' + (gen) +'/' + pokemon.pokename.toLowerCase() + '.png';

			msg.channel.send(URL);
			msg.channel.send("A wild " + pokemon.pokename +" appeared!");
			chances = 3;
		} else if (msg.content == "!c" || msg.content === "!C") {
			// If out of chances, escape!
			if (chances == 0){
				msg.channel.send("The " + pokemon.pokename + "got away! Roll for a new encounter");
				pokemon = undefined;
			}
			// This covers the event that all chances have been expended or a user attempts to catch
			// a pokemon that hasn't been rolled for
			if (pokemon != undefined) {
				// Notify the user that a pokeball was thrown
				msg.channel.send("@" + msg.author.tag + " throws a pokeball at the " + pokemon.pokename + "!");
				let catchChance = genRand(3);
				if (catchChance == 0) {
					let path = "../PC/" + msg.author.tag + ".json";
					let poke = pokemon.pokename;
					msg.channel.send("3...");
					msg.channel.send("2..");
					msg.channel.send("1!");
					msg.channel.send("You succesfully caught the " + pokemon.pokename + "!");

					// File Modification/Creation--------------------------------------
					fs.stat(path,function(err,stat){
						if (err == null)
							fs.appendFile(path, poke + "\n", err => {
								// Succesfully wrote to file
							});
						else if (err.code === 'ENOENT'){
							fs.writeFile(path, poke + "\n", err => {
								// If file does not exit make a new one and write
								//caught pokemons name
							})
						}
					})
					//-------------------------------------------------------------------------------------------
					// Pokemon caught and added to player inventory!
					pokemon = undefined;
				}
				else{
					msg.channel.send("3...");
					msg.channel.send("2..");
					msg.channel.send("1!");
					msg.channel.send("You failed to catch the " + pokemon.pokename + "!");
					chances--;
				}
					
			}
		} else if (msg.content == "!pokemon"){
			fs.readFile("../PC/" + msg.author.tag + ".json", 'utf-8',function(err,data){
				let mons = data.split('\n');

				let disp = "http://play.pokemonshowdown.com/sprites/"
				msg.channel.send(msg.author.tag + "'s Team");
				msg.channel.send("-------------------------------");
				let dex = 0;
				for (let i = 0; i < mons.length-1; i++){
					let dexEntry = findPokemon(mons[i],pokedex[dex]);
					while (dexEntry < 0){
						dex++;
						dexEntry = findPokemon(mons[i],pokedex[dex]);
					}
					let gen = pickGeneration(dexEntry)
					console.log("generation: "+gen);
					msg.channel.send(disp +"gen" + gen + "/" + mons[i].toLowerCase() + ".png");
				}
			});
		}
	}
})



// Login to Discord with your client's token
client.login(token);
