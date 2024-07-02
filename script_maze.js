const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let player = { x: 0, y: 0 };

const maze = createMaze(rows, cols);

function createMaze(rows, cols) {
    let maze = new Array(rows).fill().map(() => new Array(cols).fill(1));

    for (let row = 1; row < rows - 1; row += 2) {
        for (let col = 1; col < cols - 1; col += 2) {
            maze[row][col] = 0;
            let directions = shuffle([{x: -2, y: 0}, {x: 2, y: 0}, {x: 0, y: -2}, {x: 0, y: 2}]);

            for (let direction of directions) {
                let newRow = row + direction.y;
                let newCol = col + direction.x;

                if (newRow > 0 && newRow < rows - 1 && newCol > 0 && newCol < cols - 1 && maze[newRow][newCol] === 1) {
                    maze[row + direction.y / 2][col + direction.x / 2] = 0;
                    maze[newRow][newCol] = 0;
                    break;
                }
            }
        }
    }

    return maze;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }

    if (player.x === cols - 1 && player.y === rows - 1) {
        document.getElementById('message').innerText = 'Congratulations! You\'ve reached the exit!';
    }

    drawMaze();
}

document.getElementById('up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(1, 0));

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

drawMaze();
