const axios = require('axios');
const cheerio = require('cheerio');
const Move = require('../pokemonScripts/moves');

/**
 * Returns a list of move objects created from webscraped data
 * @param name Name of pokemon to search moves
 */
function getMoves(arr,name){
    const URI = 'https://pokemon.fandom.com/wiki/' + name;
    axios.get(URI).then((response) => {
        const $ = cheerio.load(response.data);
        let moves = $('td').text().split('\n');

        // For filtering response data
        let start = 0;
        let flag = 0;
        let terminate = "Bold indicates this Pokémon receives STAB from this move.Italic indicates an evolved or alternate form of this Pokémon receives STAB from this move.";
        //----------------------

        // Variables to store move information in
        let lvl,name,pwr,acc,pp,type,cat

        // Loop over received data from axios
        for (let i = 0; i < moves.length;){
            if (start === 1){
                lvl = moves[i];
                name = moves[i+1];
                pwr = moves[i+2];
                acc = moves[i+3];
                pp = moves[i+4];
                type = moves[i+5];
                cat = moves[i+6];

                // Populate move data into objects then pump into array
                let move = new Move(lvl,name,pwr,acc,pp,type,cat);
                arr.push(move);
                // Move to next set of move data
                i+=7;
            }else
                i++;
            if (moves[i] === 'Category' && flag == 0){
                start = 1;
                flag = 1;
                i++;
            }
            else if (moves[i] === terminate)
                start = 0;
        }
    })
}

exports.getMoves = getMoves;