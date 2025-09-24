import React, { useEffect, useState } from 'react'

function Grid() {
    const cells = Array.from({ length: 100 }, (_, i) => i);
    const [revealedCells, setRevealedCells] = useState(Array(100).fill(false));
    const [minedCells, setMinedCells] = useState(Array(100).fill(false));
    const [neighborCounts, setNeighborCounts] = useState(Array(100).fill(0));
    const [flaggedCells, setFlaggedCells] = useState(Array(100).fill(false));
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        const newMines = randomMines();
        setMinedCells(newMines);

        const counts = calculateNeighborCounts(newMines);
        setNeighborCounts(counts);
    }, []);

    const randomMines = () => {
        const newMines = Array(100).fill(false);
        const totalMines = 10;
        let minesPlaced = 0;

        while (minesPlaced < totalMines) {
            const index = Math.floor(Math.random() * newMines.length);
            if (!newMines[index]) {
                newMines[index] = true;
                minesPlaced++;
            }
        }
        return newMines;
    };

    const calculateNeighborCounts = (minedCells, gridSize = 10) => {
        const neighborCounts = Array(minedCells.length).fill(0);

        minedCells.forEach((hasMine, index) => {
            if (hasMine) {
                neighborCounts[index] = -1;
            } else {
                const neighbors = getNeighborIndexes(index, gridSize);
                neighborCounts[index] = neighbors.filter(n => minedCells[n]).length;
            }
        });
        return neighborCounts;
    }

    const getNeighborIndexes = (index, gridSize = 10) => {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        directions.forEach(([rowOffset, colOffset]) => {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;

            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                neighbors.push(newRow * gridSize + newCol);
            }
        });
        return neighbors;
    }

    const revealEmptyCells = (startIndex, revealedCellsCopy, neighborCounts, gridSize = 10) => {
        const queue = [startIndex];

        while (queue.length > 0) {
            const current = queue.shift();

            if (revealedCellsCopy[current]) {
                continue;
            }

            revealedCellsCopy[current] = true;

            if (neighborCounts[current] === 0) {
                const neighbors = getNeighborIndexes(current, gridSize);
                neighbors.forEach(n => {
                    if (!revealedCellsCopy[n] && neighborCounts[n] !== -1) {
                        queue.push(n);
                    }
                });
            }
        }
    }

    const handleRightClick = (e, index) => {
        e.preventDefault();

        if (revealedCells[index]) return;

        const newFlags = [...flaggedCells];
        newFlags[index] = !newFlags[index];
        setFlaggedCells(newFlags);
    }

    const handleClick = (index) => {
        if (gameOver || gameWon) {
            return;
        }
        if (flaggedCells[index]) {
            return;
        }

        const newRevealed = [...revealedCells];

        if (minedCells[index]) {
            console.log("Mine clicked");

            const newRevealed = [...revealedCells];
            minedCells.forEach((hasMine, i) => {
                if (hasMine) {
                    newRevealed[i] = true;
                }
            });

            setRevealedCells(newRevealed);
            setGameOver(true);
            console.log("Game Over");
            return;
        }

        if (neighborCounts[index] === 0) {
            revealEmptyCells(index, newRevealed, neighborCounts);
        } else {
            newRevealed[index] = true;
        }

        setRevealedCells(newRevealed);

        const totalSafeCells = cells.length - minedCells.filter(Boolean).length;
        const revealedSafeCells = newRevealed.filter((isRevealed, i) => isRevealed && !minedCells[i]).length;

        if (revealedSafeCells === totalSafeCells) {
            setGameWon(true);

            const newFlags = [...flaggedCells];
            minedCells.forEach((hasMine, i) => {
                if (hasMine) {
                    newFlags[i] = true;
                }
            });
            setFlaggedCells(newFlags);

            console.log("You Win!");
        }
    }

    const resetGame = () => {
        const newMines = randomMines();
        setMinedCells(newMines);

        const counts = calculateNeighborCounts(newMines);
        setNeighborCounts(counts);

        setRevealedCells(Array(100).fill(false));
        setFlaggedCells(Array(100).fill(false));
        setGameOver(false);
        setGameWon(false);
    }

    return (
        <div className="relative border-4 border-green-800 p-4 rounded-md">
            <div className="grid grid-cols-10">
                {cells.map((cell, index) => (
                    <div
                        key={cell}
                        onClick={() => handleClick(index)}
                        onContextMenu={(e) => handleRightClick(e, index)}
                        className={`w-8 h-8 border border-green-800 
                            ${!revealedCells[index] ? 'bg-green-500' : minedCells[index] ? 'bg-red-500' : 'bg-gray-300'}`}
                    >
                        {flaggedCells[index] && !revealedCells[index] ? "🚩" : revealedCells[index] ? minedCells[index] ? "💣" : neighborCounts[index] : ""}
                    </div>
                ))}
            </div>
            {(gameOver || gameWon) && (
                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className="p-8 rounded-lg bg-green-800 max-w-sm text-center ">
                        <h2 className='text-white text-xl sm:text-2xl font-bold mb-4'>
                            {gameOver ? "Game Over" : "You Win!"}
                        </h2>
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                            onClick={resetGame}
                        >
                            Restart
                        </button>
                    </div>

                </div>
            )}
        </div>

    )
}

export default Grid
