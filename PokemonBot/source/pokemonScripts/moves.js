class Move {
    constructor(lvl, name, power, accuracy, PP, type, category) {
        this.level = lvl;
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
        this.PP = PP;
        this.type = type;
        this.category = category;
    };
}

module.exports = Move;