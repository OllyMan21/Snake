import * as PIXI from 'pixi.js';

import { Snake } from './snake';
import { Coord } from './coord';

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
        this.cellPixelSize = Math.min(defaultCellPixelSize, window.innerWidth / gridSizeX, window.innerHeight / gridSizeY);
        this.viewWidth = gridSizeX * this.cellPixelSize;
        this.viewHeight = gridSizeY * this.cellPixelSize;

        this.gridSizeX = gridSizeX;
        this.gridSizeY = gridSizeY;

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

        this.snakeGraphic.addChild(this.drawCell(0x0055cc, 0x005588, this.cellPixelSize * 0.1, snake.head.coord.x * this.cellPixelSize, snake.head.coord.y * this.cellPixelSize));
    }

    drawApple(apple: Coord) {
        this.appleGraphic.removeChildren();

        let appleCell = new PIXI.Graphics();
        appleCell.beginFill(0xff0000);
        appleCell.lineStyle({ color: 0x550000, width: this.cellPixelSize * 0.1, alignment: 0 });
        appleCell.drawRect(apple.x * this.cellPixelSize, apple.y * this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);

        this.appleGraphic.addChild(appleCell);
    }

    drawGrid() {
        let lineWidth = this.cellPixelSize * 0.1;

        // draw the grid
        for (let i = 0; i <= this.gridSizeX; ++i) {
            let gridLine = new PIXI.Graphics();
            const stepSize = (this.viewWidth - lineWidth) / (this.gridSizeX);

            gridLine.lineStyle({ color: 0x555555, width: lineWidth });
            gridLine.moveTo(i * stepSize + lineWidth * 0.5, this.viewWidth);
            gridLine.lineTo(i * stepSize + lineWidth * 0.5, 0);

            this.gridGraphic.addChild(gridLine);
        }

        for (let i = 0; i <= this.gridSizeX; ++i) {
            let gridLine = new PIXI.Graphics();

            gridLine.lineStyle({ color: 0x555555, width: lineWidth });
            const stepSize = (this.viewHeight - lineWidth) / (this.gridSizeY);
            gridLine.moveTo(this.viewHeight, i * stepSize + lineWidth * 0.5);
            gridLine.lineTo(0, i * stepSize + lineWidth * 0.5);

            this.gridGraphic.addChild(gridLine);
        }
    }
}