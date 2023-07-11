import { create, toNumber } from 'lodash';
import { Engine } from './engine';

export class Menu {
    game: Engine;
    menu: HTMLDivElement;
    visible: boolean = true;

    constructor() {
        this.menu = <HTMLDivElement>document.getElementById("menu");

        let b16x16 = <HTMLButtonElement>document.getElementById("create16x16");
        let b32x32 = <HTMLButtonElement>document.getElementById("create32x32");
        let bCustom = <HTMLButtonElement>document.getElementById("createCustom");

        b16x16.addEventListener('click', this.createGame.bind(this, 16, 16));
        b32x32.addEventListener('click', this.createGame.bind(this, 32, 32));
        bCustom.addEventListener('click', this.createCustomGame.bind(this));
    }

    toggleVisible() {
        this.visible = !this.visible;

        this.menu.style.display = this.visible ? 'flex' : 'none';
    }

    createCustomGame() {
        let customX = (<HTMLInputElement>document.getElementById('customX')).value;
        let customY = (<HTMLInputElement>document.getElementById('customY')).value;

        let x = toNumber(customX);
        let y = toNumber(customY);

        this.createGame(x, y, true);
    }

    createGame(gridSizeX: number, gridSizeY: number, toggle: boolean) {
        this.game = null;

        if (toggle) {
            this.toggleVisible();
        }

        this.game = new Engine(gridSizeX, gridSizeY, this);
        this.game.gameInit();
    }

    destroyGame() {
        delete this.game;
    }
}