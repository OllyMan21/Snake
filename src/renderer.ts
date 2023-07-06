import * as PIXI from 'pixi.js';

import { Snake } from './snake';
import { Coord } from './coord';
import { over } from 'lodash';

const defaultCellPixelSize = 64;

// class to handle everything that gets drawn
export class Renderer {
    app: PIXI.Application<HTMLCanvasElement>;
    snakeGraphic: PIXI.Container;
    appleGraphic: PIXI.Container;
    gridGraphic: PIXI.Container;

    gridSizeX: number;
    gridSizeY: number;

    cellPixelSize: number;
    viewWidth: number;
    viewHeight: number;


    constructor(gridSizeX: number, gridSizeY: number) {
        //create dimensions of the view port and set the pixel size for the cells within the grid
        this.cellPixelSize = Math.min(defaultCellPixelSize, window.innerWidth / gridSizeX, window.innerHeight / gridSizeY);
        this.viewWidth = gridSizeX * this.cellPixelSize;
        this.viewHeight = gridSizeY * this.cellPixelSize;

        this.gridSizeX = gridSizeX;
        this.gridSizeY = gridSizeY;

        // create a PixiJS app
        this.app = new PIXI.Application<HTMLCanvasElement>({ width: this.viewWidth, height: this.viewHeight });
        document.body.appendChild(this.app.view);

        this.snakeGraphic = new PIXI.Container();
        this.appleGraphic = new PIXI.Container();
        this.gridGraphic = new PIXI.Container();

        this.app.stage.addChildAt(this.gridGraphic, 0);
        this.app.stage.addChildAt(this.appleGraphic, 1);
        this.app.stage.addChildAt(this.snakeGraphic, 2);
    }

    drawCell(fillColour: number, borderColour: number, borderThickness: number, posX: number, posY: number) {
        let cell = new PIXI.Graphics();
        cell.beginFill(fillColour);
        cell.lineStyle({ color: borderColour, width: borderThickness, alignment: 0 });
        cell.drawRect(posX, posY, this.cellPixelSize, this.cellPixelSize);

        return cell;
    }

    drawSnake(snake: Snake) {
        this.snakeGraphic.removeChildren();

        let cell = snake.tail;

        while (cell.next != null) {
            this.snakeGraphic.addChild(this.drawCell(0x00ff00, 0x00cc00, this.cellPixelSize * 0.1, cell.coord.x * this.cellPixelSize, cell.coord.y * this.cellPixelSize));

            cell = cell.next;
        }

        // give snake's head a different colour
        this.snakeGraphic.addChild(this.drawCell(0x0055cc, 0x005588, this.cellPixelSize * 0.1, snake.head.coord.x * this.cellPixelSize, snake.head.coord.y * this.cellPixelSize));
    }

    drawApple(apple: Coord) {
        this.appleGraphic.removeChildren();

        this.appleGraphic.addChild(this.drawCell(0xff0000, 0x550000, this.cellPixelSize * 0.1, apple.x * this.cellPixelSize, apple.y * this.cellPixelSize));
    }

    drawGrid() {
        let lineWidth = this.cellPixelSize * 0.1;

        // draw the grid
        for (let i = 0; i <= this.gridSizeX; ++i) {
            let gridLine = new PIXI.Graphics();
            const stepSize = (this.viewWidth - lineWidth) / (this.gridSizeX);

            gridLine.lineStyle({ color: 0x555555, width: lineWidth });
            gridLine.moveTo(i * stepSize + lineWidth * 0.5, this.viewHeight);
            gridLine.lineTo(i * stepSize + lineWidth * 0.5, 0);

            this.gridGraphic.addChild(gridLine);
        }

        for (let i = 0; i <= this.gridSizeY; ++i) {
            let gridLine = new PIXI.Graphics();
            const stepSize = (this.viewHeight - lineWidth) / (this.gridSizeY);

            gridLine.lineStyle({ color: 0x555555, width: lineWidth });
            gridLine.moveTo(this.viewWidth, i * stepSize + lineWidth * 0.5);
            gridLine.lineTo(0, i * stepSize + lineWidth * 0.5);

            this.gridGraphic.addChild(gridLine);
        }
    }

    drawGameOverOverlay(playAgainFunc: Function, returnToMenu: Function, score: number) {
        // create a pale overlay

        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x444444);
        overlay.alpha = 0.3;
        overlay.drawRect(0, 0, this.app.view.width, this.app.view.height);

        this.app.stage.addChild(overlay);

        // create game over text

        const gameOverStyle = new PIXI.TextStyle({
            fill: "#ff0000",
            fontFamily: "Bruce Forever",
            fontSize: 70,
            strokeThickness: 10
        });
        const gameOverText = new PIXI.Text('GAME OVER', gameOverStyle);

        let gameOverScale = 0.7 * Math.min(this.app.view.width, this.app.view.height) / gameOverText.width;

        gameOverText.scale.x = gameOverScale;
        gameOverText.scale.y = gameOverScale;

        gameOverText.anchor.set(0.5);

        gameOverText.x = this.app.view.width * 0.5;
        gameOverText.y = this.app.view.height * 0.25;

        this.app.stage.addChild(gameOverText);

        // create score text

        const scoreStyle = new PIXI.TextStyle({
            fill: "#38c9fa",
            fontFamily: "Bruce Forever",
            fontVariant: "small-caps",
            fontSize: 70,
        });
        const scoreText = new PIXI.Text('score: ' + score, scoreStyle);

        let scoreScale = 0.3 * Math.min(this.app.view.width, this.app.view.height) / scoreText.width;

        scoreText.scale.x = scoreScale;
        scoreText.scale.y = scoreScale;

        scoreText.anchor.set(0.5);

        scoreText.x = this.app.view.width * 0.5;
        scoreText.y = this.app.view.height * 0.325 + scoreText.height * 0.5;

        this.app.stage.addChild(scoreText);

        // create a container for buttons
        let buttonGraphic = new PIXI.Container();

        this.app.stage.addChild(buttonGraphic);

        // create a play again button

        buttonGraphic.addChild(this.createButton(playAgainFunc, this.app.view.width / 2, this.app.view.height * 0.5, "PLAY AGAIN", buttonGraphic));

        // create a return to menu button

        buttonGraphic.addChild(this.createButton(returnToMenu, this.app.view.width / 2, this.app.view.height * 0.75, "RETURN TO MENU", buttonGraphic));
    }

    createButton(callBack: Function, x: number, y: number, text: string, container: PIXI.Container) {
        let buttonContainer = new PIXI.Container();

        const style = new PIXI.TextStyle({
            fill: "#ff0000",
            fontFamily: "Bruce Forever",
            fontSize: 50,
            strokeThickness: 10
        });
        let t = new PIXI.Text(text, style);

        let scale = 0.5 * Math.min(this.app.view.width, this.app.view.height) / t.width;

        t.scale.x = scale;
        t.scale.y = scale;

        buttonContainer.x = x;
        buttonContainer.y = y;

        buttonContainer.width = t.width;
        buttonContainer.height = t.height;

        t.anchor.set(0.5);

        let button = new PIXI.Graphics();
        button.interactive = true;

        button.on('pointerdown', (e) => {
            callBack();
        });

        button.beginFill(0x444444);
        button.lineStyle({width: 5, color: 0x000000, alignment: 1});
        button.drawRoundedRect(-t.width / 2, -t.height / 2, t.width, t.height, 10);

        console.log(buttonContainer.toGlobal(button.position));
        console.log(button.width, button.height);

        buttonContainer.addChild(button);
        buttonContainer.addChild(t);

        return buttonContainer;
    }

    destroy() {
        document.body.removeChild(this.app.view);
        this.app.destroy();
    }
}