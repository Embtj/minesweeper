import React, { useEffect, useState } from 'react'

function Grid() {
    const cells = Array.from({ length: 100 }, (_, i) => i);
    const [revealedCells, setRevealedCells] = useState(Array(100).fill(false));
    const [minedCells, setMinedCells] = useState(Array(100).fill(false));
    
    useEffect(() => {
        randomMines();
    }, []);

    const randomMines = () => {
        const newMines = Array(100).fill(false);
        const totalMines = 10;
        let minesPlaced = 0;

        while (minesPlaced < totalMines) {
            const index = Math.floor(Math.random() * newMines.length);
            if (newMines[index] === false) {
                newMines[index] = true;
                minesPlaced++;
            }
        }
        setMinedCells(newMines);
    }

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
                            {revealedCells[index] && minedCells[index] ? "💣" : ""}
                        </div>
                ))}
            </div>
        </div>

    )
}

export default Grid
