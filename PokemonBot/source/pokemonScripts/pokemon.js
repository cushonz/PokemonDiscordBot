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

    get name(){
        return this.pokename;
    };

    moves(moves){
        this.moves = moves;
    }

}

module.exports = Pokemon;