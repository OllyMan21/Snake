import { create, toNumber } from 'lodash';
import { Engine } from './engine';

export class Menu {
    game: Engine;
    menu: HTMLDivElement;
    visible: boolean = true;

    constructor() {
        this.menu = document.createElement('div');
        this.menu.id = 'Menu';

        document.body.appendChild(this.menu);

        let b16x16 = document.createElement('BUTTON');
        let t16x16 = document.createTextNode("CREATE 16x16");

        let b32x32 = document.createElement('BUTTON');
        let t32x32 = document.createTextNode("CREATE 32x32");

        let bCustom = document.createElement('BUTTON');
        let tCustom = document.createTextNode("CREATE CUSTOM");

        let bGridSizeX = <HTMLInputElement>document.createElement('INPUT');
        let bGridSizeY = <HTMLInputElement>document.createElement('INPUT');

        bGridSizeX.id = 'customX';
        bGridSizeY.id = 'customY';

        b16x16.addEventListener('click', this.createGame.bind(this, 16, 16));
        b32x32.addEventListener('click', this.createGame.bind(this, 32, 32));
        bCustom.addEventListener('click', this.createCustomGame.bind(this));

        b16x16.appendChild(t16x16);
        b32x32.appendChild(t32x32);
        bCustom.appendChild(tCustom);

        this.menu.appendChild(b16x16);
        this.menu.appendChild(b32x32);
        this.menu.appendChild(bCustom);

        this.menu.appendChild(bGridSizeX);
        this.menu.appendChild(bGridSizeY);
    }

    toggleVisible() {
        this.visible = !this.visible;

        this.menu.style.visibility = this.visible ? 'visible' : 'hidden';
    }

    createCustomGame() {
        let customX = (<HTMLInputElement>document.getElementById('customX')).value;
        let customY = (<HTMLInputElement>document.getElementById('customY')).value;

        let x = toNumber(customX);
        let y = toNumber(customY);

        this.createGame(x, y);
    }

    createGame(gridSizeX: number, gridSizeY: number) {
        this.toggleVisible();

        this.game = new Engine(gridSizeX, gridSizeY, this);
        this.game.gameInit();
    }

    destroyGame() {
        delete this.game;
    }
}