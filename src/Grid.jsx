import React, { useState } from 'react'

function Grid() {
    const cells = Array.from({ length: 100 }, (_, i) => i);
    const [revealedCells, setRevealedCells] = useState(Array(100).fill(false));

    const handleClick = (index) => {
        const newRevealed = [...revealedCells];
        newRevealed[index] = true;
        setRevealedCells(newRevealed);
    }
    
    return (
        <div className="border-4 border-green-800 p-4 rounded-md">
            <div className="grid grid-cols-10 gap-1">
                {cells.map((cell, index) => (
                    <div 
                        key={cell}
                        onClick={() => handleClick(index)}
                        className={`w-8 h-8 bg-green-500 border border-green-800 ${revealedCells[index] ? 'bg-gray-200' : 'bg-green-500'}`}
                        >
                            {revealedCells[index] ? "💣" : ""}
                        </div>
                ))}
            </div>
        </div>

    )
}

export default Grid
