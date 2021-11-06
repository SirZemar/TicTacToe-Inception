import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import utils from './math-utils';

class Square extends React.Component {
    render() {
        return (
            <button className="square" style={{ width: `${this.props.size}px` }}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {


    renderSquare(i) {
        return <Square value={i} />;
    }

    render() {
        const status = 'Next player: X';
        const maxWidth = 220

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-list" style={{ maxWidth: `${maxWidth}px` }}>
                    {utils.range(1, 9).map(nr =>
                        <Square key={nr} value={nr} size={maxWidth / 3} />
                    )}
                </div>

            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
