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
            style={{ width: `${props.size}px`, background: 'transparent' }}
        >
            {props.value}
        </button>
    );

}

const Board = (props) => {

    console.log('Board render', props.board)
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
            {utils.range(0, 8).map(j => {
                // const isActiveBoard = props.board === 'All' ? true : j === props.board;
                const isActiveBoard = props.board.includes(j);

                return (
                    <div className="board-list" id={j} key={j} style={{ maxWidth: `${props.maxWidth}px`, background: isActiveBoard ? 'white' : 'grey' }}>
                        {utils.range(0 + (9 * j), 8 + (9 * j)).map(i =>
                            renderSquare(i, props.maxWidth, j)
                        )}
                    </div>
                )
            }
            )}

        </>
    );
}

const Game = () => {
    const [boards, setBoards] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    console.log('Game render')
    const [history, setHistory] = useState([{
        outerBoards: Array(9).fill(null),
        innerBoards: Array(9).fill(Array(9).fill(null)),
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [playableBoard, setPlayableBoard] = useState(boards);
    const [gameOver, setGameOver] = useState(false);
    const myRef = useRef();

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }


    /*     useEffect(() => {
            setPlayableBoard(boards);
        }, []) */

    console.log(playableBoard, '000000')
    const handleClick = (i, currentBoard) => {

        if (gameOver) return
        if (!playableBoard.includes(currentBoard)) return

        const squareIndex = i - (9 * currentBoard);

        console.log(squareIndex, currentBoard)
        const prevHistory = history.slice(stepNumber)[0];
        const prevHistoryInnerBoards = prevHistory.innerBoards;

        // Game rule set 1
        if (calculateWinner(prevHistoryInnerBoards[currentBoard])) return;

        const newHistoryInnerBoards = prevHistoryInnerBoards.slice();
        const newEntry = prevHistoryInnerBoards[currentBoard].slice();

        if (newEntry[squareIndex] !== null) return

        newEntry[squareIndex] = xIsNext ? 'X' : 'O';

        newHistoryInnerBoards[currentBoard] = newEntry;

        setHistory((prev) => [
            ...prev, {
                innerBoards: newHistoryInnerBoards,
                outerBoards: prev[prev.length - 1].outerBoards,

            }
        ])

        setStepNumber(history.length);
        setXIsNext(!xIsNext);

        // Game rule set 
        if (boards.includes(squareIndex)) {
            setPlayableBoard([squareIndex]);
        }


        if (calculateWinner(newHistoryInnerBoards[currentBoard])) {

            const newHistoryOuterBoards = prevHistory.outerBoards;

            newHistoryOuterBoards[currentBoard] = newEntry[squareIndex];

            console.log(newHistoryOuterBoards)
            setHistory(history.concat([{
                innerBoards: newHistoryInnerBoards,
                outerBoards: newHistoryOuterBoards,
            }]));;

            // Game rule set 2
            // setPlayableBoard(currentBoard)

            // Game rule set 1
            setBoards((prev) => prev.filter(x => x !== currentBoard))
            console.log(boards, 'adasdasw')
            setPlayableBoard(boards.filter(x => x !== currentBoard))
        }

        const winner = calculateWinner(current.outerBoards);
        if (winner) setGameOver(true)
    }

    console.log(history)
    const newHistory = history.slice();
    const current = newHistory[stepNumber];
    const winner = calculateWinner(current.outerBoards);
    const maxWidth = 220;

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
                    maxWidth={maxWidth}
                    board={playableBoard}
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
