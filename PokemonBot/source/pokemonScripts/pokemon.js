const math = require("math");

/**
 * Class to store information about pokemon
 */
class Pokemon{
    constructor(name, type1, type2 ,id) {
        this.pokename = name;
        this.type1 = type1;
        this.type2 = type2;
        this.dexNumb = id;
        this.moves = [];
        this.lvl = 1;
        this.learnable = [];
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

    rollStats(){
        this.health = math.floor(Math.random() * 80);
        this.lvl = math.floor(Math.random() * 20);
    }

    generateMoveset(){

    }


    get name(){
        return this.pokename;
    };

    moves(moves){
        this.moves = moves;
    }

}

module.exports = Pokemon;