import React, { useEffect, useState } from 'react'

function Grid() {
    const cells = Array.from({ length: 100 }, (_, i) => i);
    const [revealedCells, setRevealedCells] = useState(Array(100).fill(false));
    const [minedCells, setMinedCells] = useState(Array(100).fill(false));
    const [neighborCounts, setNeighborCounts] = useState(Array(100).fill(0));
    
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

    const handleClick = (index) => {
        const newRevealed = [...revealedCells];
        newRevealed[index] = true;
        setRevealedCells(newRevealed);
        if (minedCells[index]) {
            console.log("Mine clicked")
        } else {
            console.log("Revealed")
        }
    }

    const calculateNeighborCounts = (minedCells) => {
        const neighborCounts = Array(100).fill(0);

        minedCells.forEach((hasMine, index) => {
            const row = Math.floor(index / 10);
            const col = index % 10;

            if (hasMine) {
                neighborCounts[index] = -1;
            } else {
                let count = 0;

                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];

                directions.forEach(([rowOffset, colOffset]) => {
                    const newRow = row + rowOffset;
                    const newCol = col + colOffset;

                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                        const neighborIndex = newRow * 10 + newCol;
                        if (minedCells[neighborIndex]) {
                            count++;
                        }
                    }
                });
                neighborCounts[index] = count;
            }
        });
        return neighborCounts;
    }
    
    return (
        <div className="border-4 border-green-800 p-4 rounded-md">
            <div className="grid grid-cols-10 gap-1">
                {cells.map((cell, index) => (
                    <div 
                        key={cell}
                        onClick={() => handleClick(index)}
                        className={`w-8 h-8 border border-green-800 
                            ${!revealedCells[index] ? 'bg-green-500' : minedCells[index] ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            {revealedCells[index] ? minedCells[index] ? "💣" : neighborCounts[index] : ""}
                        </div>
                ))}
            </div>
        </div>

    )
}

export default Grid
