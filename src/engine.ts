import { Renderer } from './renderer';

import { Snake } from './snake';
import { Grid } from './grid';
import { Direction, oppositeDirection } from './directionEnum';
import { Coord } from './coord';

import { Menu } from './menu';

// handles everything that happens in the game
export class Engine {
    menu: Menu;

    gameOver: boolean = true;
    paused: boolean = true;
    grid: Grid;
    snake: Snake;
    apple: Coord;

    score: number = 0;

    renderer: Renderer;

    elapsedTime: number = 0;
    deltaTick: number = 0;

    constructor(gridSizeX: number, gridSizeY: number, menu: Menu) {
        this.menu = menu;

        // constrain grid dimensions to be at least 4 for fair gameplay and at most 100 to keep well within reasonable graphical and memory requirements
        gridSizeX = Math.min(Math.max(gridSizeX, 4), 100);
        gridSizeY = Math.min(Math.max(gridSizeY, 4), 100);

        this.grid = new Grid(gridSizeX, gridSizeY);

        // make sure that the game board fits on the screen
        this.snake = new Snake(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2));

        let cell = this.snake.tail;

        while (cell != null) {
            this.grid.state[cell.coord.x][cell.coord.y] = true;
            cell = cell.next;
        }

        this.renderer = new Renderer(gridSizeX, gridSizeY);
    }

    createKeyListener() {
        let listener = (e: KeyboardEvent) => {
            let key = e.key;

            switch (key) {
                case " ":
                    // pauses and unpauses the game
                    this.paused = !this.paused;
                    this.gamePause();
                    break;
                case "w":
                    this.snake.setDir(Direction.Up);
                    break;
                case "s":
                    this.snake.setDir(Direction.Down);
                    break;
                case "a":
                    this.snake.setDir(Direction.Left);
                    break;
                case "d":
                    this.snake.setDir(Direction.Right);
                    break;
            }
        }

        document.addEventListener('keydown', listener);

        return listener;
    }

    async gameInit() {
        this.gameOver = false;

        let game = this;

        // draw grid
        this.renderer.drawGrid();

        // draw initial snake
        this.renderer.drawSnake(this.snake);

        // create initial apple
        this.generateApple();

        // draw initial apple
        this.renderer.drawApple(this.apple);



        let snake = this.snake;
        // wait for player to choose direction for snake
        let chooseDir = () => {
            return new Promise((resolve) => {
                document.addEventListener('keydown', onKeyHandler.bind(this));
                function onKeyHandler(e: KeyboardEvent) {
                    let key = e.key;
                    let dir = null;

                    switch (key) {
                        case "w":
                            dir = Direction.Up;
                            break;
                        case "s":
                            dir = Direction.Down;
                            break;
                        case "a":
                            dir = Direction.Left;
                            break;
                        case "d":
                            dir = Direction.Right;
                            break;
                    }

                    if (dir != null && dir != oppositeDirection(snake.lastDir)) {
                        document.removeEventListener('keydown', onKeyHandler);
                        snake.setDir(dir);
                        this.paused = false;
                        resolve(0);
                    }
                }
            });
        }

        await chooseDir();

        this.createKeyListener();

        window.requestAnimationFrame((this.gameLoop.bind(this)));
    }

    gameLoop(timeStamp: number) {
        this.deltaTick += timeStamp - this.elapsedTime;
        this.elapsedTime = timeStamp;

        let tps = 5;
        let frameTime = 1000 / tps;

        if (this.deltaTick > frameTime) {
            this.deltaTick = this.deltaTick % frameTime;


            let snake = this.snake;
            let grid = this.grid;

            snake.step();

            // set the tail cell to be empty in the grid state
            this.grid.state[this.snake.tail.coord.x][this.snake.tail.coord.y] = false;

            // set gameover to true if snake has collided with itself or has gone out the bounds of the grid
            if (
                snake.head.coord.x < 0
                || snake.head.coord.x >= grid.sizeX
                || snake.head.coord.y < 0
                || snake.head.coord.y >= grid.sizeY
                || grid.state[snake.head.coord.x][snake.head.coord.y]
            ) {
                this.gameOver = true;
            }
            // if snake has eaten an apple
            else if (snake.head.coord.x == this.apple.x && snake.head.coord.y == this.apple.y) {
                this.score += 1;

                // register the new occupied cell in the grid state
                this.grid.state[this.snake.head.coord.x][this.snake.head.coord.y] = true;

                // set the tail cell to be occupied since the snake has eaten and should not lose its tail
                this.grid.state[this.snake.tail.coord.x][this.snake.tail.coord.y] = false;

                // create new apple
                this.generateApple();

                // draw new apple
                this.renderer.drawApple(this.apple);

                // draw new snake head
                this.renderer.drawSnake(this.snake);
            }
            else {
                // register the new occupied cell in the grid state
                this.grid.state[this.snake.head.coord.x][this.snake.head.coord.y] = true;

                // delete the tail of the snake
                let tempTail = snake.tail.next;
                delete snake.tail
                snake.tail = tempTail;

                // draw new snake head
                this.renderer.drawSnake(this.snake);
            }
        }

        // only call if the game is not paused
        if (!this.paused && !this.gameOver) {
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }

        if (this.gameOver) {
            this.endGame();
        }
    }

    gamePause() {
        if (!this.paused && !this.gameOver) {
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    endGame() {
        let playAgain = () => {
            this.renderer.destroy();
            this.menu.createGame(this.grid.sizeX, this.grid.sizeY, false);
            this.menu.destroyGame();
        }

        let returnToMenu = () => {
            this.renderer.destroy();
            this.menu.toggleVisible();
            this.menu.destroyGame();
        }

        this.renderer.drawGameOverOverlay(playAgain.bind(this), returnToMenu.bind(this), this.score);
    }

    generateApple() {
        let coord = new Coord(Math.floor(Math.random() * this.grid.sizeX), Math.floor(Math.random() * this.grid.sizeY));

        if (this.grid.state[coord.x][coord.y]) {
            this.generateApple();
        } else {
            this.apple = coord;
        }
    }
}