/**
 * Module built to webscrape pokemon data
 */
const Pokemon = require('./pokemonScripts/pokemon.js');
const Move = require('./pokemonScripts/moves');
const axios = require("axios");
const cheerio = require("cheerio");
const math = require("math");

/**
 * Retrives all moves a given pokemon can learn
 * @param pokemon a Pokemon object
 * @param learnable array to be populated with learnable moveset
 * @returns {*[]} List of moves the pokemon can learn
 */

function getMoves(pokemon,learnable){
    // URL to scrape
    const URL = encodeURI('https://pokemon.fandom.com/wiki/'+pokemon.name);
    let lvl, name, power, accuracy, PP, type, category;

    axios.get(URL).then((response) => {
        const $ = cheerio.load(response.data);
        let moves = $('td').text().split("\n");
        for (let i = 92; i < moves.length;){
            lvl = moves[i];
            name = moves[i+1];
            power = moves[i+2];
            accuracy = moves[i+3];
            PP = moves[i+4];
            type = moves[i+5];
            category = moves[i+6];

            let newMove = new Move(lvl, name, power, accuracy, PP, type, category);
            if (newMove.level.length > 3){
                return;
            }
            else
                learnable.push(newMove);
            i+=7;
        }
    })
}

/**
 * Populates given array with pokemon data
 * @param URL URL for pokedex info, use bulpabedia page
 * @param pokedex Array to push pokemon objects into
 */

function fillDex(URL, pokedex){
    axios.get(URL).then((response) => {
        const $ = cheerio.load(response.data);
        let title = $('td');
        const pokeArr = title.text().split('\n');
        let dexNumb,name,type1,type2;
        let mon;

        // Loop over the length of the Pokemon data received from axios request

        for (let i = 14; i < pokeArr.length; i++){

            dexNumb = pokeArr[i];
            name = pokeArr[i+2];
            type1 = pokeArr[i+3];
            type2 = pokeArr[i+4];
            mon = new Pokemon(name,type1,type2,dexNumb);
            pokedex.push(mon);
            i+=6;
        }
    });

}

function pullPokemon(pokedex){
     let selection = Math.floor(Math.random() * pokedex.length-1);
     while (selection < 0)
         selection = Math.floor(Math.random() * pokedex.length-1);
     return pokedex[selection];
}

/**
 * Returns an int to represent the generation the pokemon is from
 * @param pokemon Pokemon object
 * @returns {number} Number representing generation the pokemon is from
 */
function pickGeneration(dexNumb){
    console.log(dexNumb);
    if (dexNumb > 0 && dexNumb <= 151)
        return 1;
    else if (dexNumb > 151 && dexNumb < 252)
        return 2;
    else if (dexNumb > 252 && dexNumb < 386)
        return 3;
    else if (dexNumb > 386 && dexNumb < 493)
        return 4;
    else if (dexNumb > 493 && dexNumb < 649)
        return 5;
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


exports.pullPokemon = pullPokemon;
exports.fillDex = fillDex;
exports.findPokemon = findPokemon;
exports.pickGeneration = pickGeneration;
