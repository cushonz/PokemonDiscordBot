class Move {
    constructor(name, power, accuracy, PP, type, category) {
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
        this.PP = PP;
        this.type = type;
        this.category = category;
    };
}

module.exports = Move;