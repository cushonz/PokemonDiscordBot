const math = require("math");
const fs = require("fs");
const Move = require("./moves");

/**
 * Class to store information about pokemon
 */

class Pokemon{
    moves =[];
    constructor(name, type1, type2 ,id) {
        this.pokename = name;
        this.type1 = type1;
        this.type2 = type2;
        this.dexNumb = id;
        this.lvl = 1;
        this.randomMove('../data/pokemonMoves.json');


    }

    /**
     * Returns a random integer
     * @param range Range of acceptable value to generate
     * @returns {number} Generated number
     */
    genRand(range){
        let random = math.floor(Math.random() * range);
        return random;
    }

    /**
     * Returns a random move from the dictionary of possible moves
     * @param path path to move file in json format
     */
    randomMove(path){
        fs.readFile(path, 'utf-8',function(err, jsonData){
            if (err){
                console.log("File read failed: ",err)
                return
            }

            // At this point moveData will contain individual moves and their respective data
            let moveData = jsonData.split("\n");

            let name,type,category,pp,acc,power;
            let moves = [];
            for (let i = 0; i < 4; i++){
                let selection = math.floor((math.random()*164));

                let move_ = JSON.parse(moveData[selection]);
                name = move_['name'];
                type = move_['type'];
                category = move_['category'];
                pp = move_['pp'];
                power = move_['power'];
                acc = move_['accuracy'];


                let move = new Move(name,power,acc,pp,type,category);
                moves.push(move);
            }
        });
    }

    addMove(moveArr){
        this.moves = {moveArr};
    }

    rollStats(){
        this.health = math.floor(Math.random() * 80);
        this.lvl = math.floor(Math.random() * 20);
    }



}

module.exports = Pokemon;