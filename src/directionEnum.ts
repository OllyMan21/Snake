// makes the code more readable when dealing with snake's movement logic
export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

// helper function to get the opposite of the passed in direction
export function oppositeDirection(dir: Direction) {
    switch (dir) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Down:
            return Direction.Up;
        case Direction.Left:
            return Direction.Right;
        case Direction.Right:
            return Direction.Left;
    }
}