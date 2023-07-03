// grid to store the state of the board (which cells are empty or contain snake)
export class Grid {
    sizeX: number;
    sizeY: number;

    state: Array<Array<Boolean>>;

    constructor(sizeX: number, sizeY: number) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.state = new Array(sizeX);

        for (let i = 0; i < this.state.length; ++i) {
            this.state[i] = new Array(sizeY);
            this.state[i].fill(false);
        }
    }
}