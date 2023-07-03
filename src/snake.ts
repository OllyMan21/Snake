import {Direction, oppositeDirection} from './directionEnum';
import {Coord} from './coord'

// an individual cell within the snake's linked list
// the list travels from snake's tail to snake's head (opposite to what one might expect)
class SnakeNode {
    coord: Coord;
    next: SnakeNode;

    constructor(coord: Coord, next: SnakeNode) {
        this.coord = coord;
        this.next = next;
    }
}

// stores relevant information about snake like where its head and tail is and where it's currently travelling
export class Snake {
    head: SnakeNode;
    tail: SnakeNode;

    dir: Direction = null;
    lastDir: Direction = Direction.Right;

    constructor(spawnX: number, spawnY: number) {
        this.head = new SnakeNode(new Coord(spawnX, spawnY), null);
        this.tail = new SnakeNode(new Coord(spawnX - 1, spawnY), this.head);
    }

    // set the direction snake will travel next tick but not allowing it to travel back on itself
    setDir(dir: Direction) {
        if (dir == oppositeDirection(this.lastDir)) {
            return;
        }
        else {
            this.dir = dir;
        }
    }

    // Tell the snake to move one cell
    step() {
        switch (this.dir) {
            case Direction.Up:
                this.lastDir = Direction.Up;
                this.head.next = new SnakeNode(new Coord(this.head.coord.x, this.head.coord.y - 1), null);
                break;
            case Direction.Down:
                this.lastDir = Direction.Down;
                this.head.next = new SnakeNode(new Coord(this.head.coord.x, this.head.coord.y + 1), null);
                break;
            case Direction.Left:
                this.lastDir = Direction.Left;
                this.head.next = new SnakeNode(new Coord(this.head.coord.x - 1, this.head.coord.y), null);
                break;
            case Direction.Right:
                this.lastDir = Direction.Right;
                this.head.next = new SnakeNode(new Coord(this.head.coord.x + 1, this.head.coord.y), null);
                break;
        }

        this.head = this.head.next;
    }
}