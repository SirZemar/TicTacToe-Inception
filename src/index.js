import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import utils from './math-utils';

const Square = (props) => {

    console.log('Square render')

    return (
        <button
            className="square"
            onClick={props.onClick}
            style={{ width: `${props.size}px` }}
        >
            {props.value}
        </button>
    );

}

const Board = (props) => {

    console.log('Board render')
    const renderSquare = (i, maxWidth, j) => {
        const a = i - (9 * j)
        return <Square
            key={a}
            value={props.squares[j][a]}
            onClick={(x) => {
                const board = parseInt(x.target.closest('.board-list').id);
                props.onClick(board, i);
            }}
            size={maxWidth / 3}

        />
    }

    return (

        <>
            {utils.range(0, 8).map(j =>
                <div className="board-list" id={j} key={j} style={{ maxWidth: `${props.maxWidth}px` }}>
                    {utils.range(0 + (9 * j), 8 + (9 * j)).map(i =>
                        renderSquare(i, props.maxWidth, j)
                    )}
                </div>
            )}

        </>
    );
}

const Game = () => {

    console.log('Game render')
    const [history, setHistory] = useState([{
        outerBoards: Array(9).fill(null),
        innerBoards: Array(9).fill(Array(9).fill(null)),
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    // const [board, setBoard] = useState(0);
    const [playableBoard, setPlayableBoard] = useState(null);
    const myRef = useRef();

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    const handleClick = (i, currentBoard) => {

        const squareIndex = i - (9 * currentBoard);

        const prevHistory = history.slice(stepNumber)[0];
        const prevHistoryInnerBoards = prevHistory.innerBoards;

        // Changeable rule
        if (calculateWinner(prevHistoryInnerBoards[currentBoard])) return;

        const newHistoryInnerBoards = prevHistoryInnerBoards.slice();
        const newEntry = prevHistoryInnerBoards[currentBoard].slice();

        if (newEntry[squareIndex] !== null) return

        newEntry[squareIndex] = xIsNext ? 'X' : 'O';

        newHistoryInnerBoards[currentBoard] = newEntry;


        /*        setHistory(history.concat([{
                   innerBoards: newHistoryInnerBoards,
                   outerBoards: Array(9).fill(null),
               }]));
        */
        setHistory((prev) => [
            ...prev, {
                innerBoards: newHistoryInnerBoards,
                outerBoards: prev[prev.length - 1].outerBoards,

            }
        ])


        setStepNumber(history.length);
        setXIsNext(!xIsNext);
        // setBoard(currentBoard);

        if (calculateWinner(newHistoryInnerBoards[currentBoard])) {

            const newHistoryOuterBoards = prevHistory.outerBoards;

            newHistoryOuterBoards[currentBoard] = newEntry[squareIndex];

            console.log(newHistoryOuterBoards)
            setHistory(history.concat([{
                innerBoards: newHistoryInnerBoards,
                outerBoards: newHistoryOuterBoards,
            }]));;
        }


    }

    console.log(history)
    const newHistory = history.slice();
    const current = newHistory[stepNumber];
    const winner = calculateWinner(current.outerBoards);
    const maxWidth = 220;
    // const boardIndex = board;


    const moves = newHistory.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';

        return (
            <li key={move} ref={myRef}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    })

    /* 
    const x = document.querySelector('.game-info-list li:last-child')*/


    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }


    return (
        <div className="game">
            <div className="game-board" style={{ maxWidth: 10 + maxWidth * 3 }}>
                <Board
                    squares={current.innerBoards}
                    onClick={(board, i) => {
                        handleClick(i, board);
                    }}
                    // bigSquareId={(x, i) => this.teste(x, i)}
                    maxWidth={maxWidth}
                // board={boardIndex}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol className="game-info-list" style={{ height: "620px", overflow: 'scroll' }}>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
