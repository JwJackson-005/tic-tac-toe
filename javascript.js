"use strict";

const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', ''];
    let winnerFound = false;

    const markCell = function(index, symbol) {
        board[index] = symbol;
    }

    const isWinnerFound = function() {return winnerFound;}

    const isWinner = function() {
        const winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        for (let combination of winningCombinations) {
            let winner = true;
            for (let index of combination) {
                if (board[index] !== gameController.getCurrentPlayer().getSymbol()) {
                    winner = false;
                }
            }
            if (winner) {
                winnerFound = true;
                return true;
            }

        }
        return false;
    }

    const getBoard = function() {
        return board;
    }

    const resetBoard = function() {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
        winnerFound = false;
    }



    return {markCell, isWinner, isWinnerFound, resetBoard, getBoard};
})();

const displayController = (() => {
    const gameMessage = document.querySelector('#gameMessage');

    const displayMessage = function (message) { 
        gameMessage.textContent = message;

    }

    const clearCells = function (cells) {
        cells.forEach(cell => {
            cell.textContent = '';
        })
    }

    const draw = function (event, symbol) {
        let num = event.target.dataset.number;
        event.target.textContent = symbol;
        gameBoard.markCell(num, symbol);
    }

    return {displayMessage, draw, clearCells};
})();

const createPlayer = function(playerType, symbol) {

    const getPlayerType = function () {return this.playerType;}
    const getSymbol = function () {return this.symbol;}

    return {playerType, symbol, getPlayerType, getSymbol};
}

const gameController = (() => {
    const cells = document.querySelectorAll('.cell');
    const playAgainButton = document.querySelector('#playAgainButton');
    let round = 1;   
    const player1 = createPlayer('player','X');
    const player2 = createPlayer('player','O');

    const addListeners = function() {
        for (let cell of cells) {
            cell.addEventListener('click', (event) => {
                if (!gameBoard.isWinnerFound() && cell.textContent === '') {
                    playRound(event);
                }
            });
        }

        playAgainButton.addEventListener('click', playAgain);
    }

    const getRound = function () {return round;}

    const getCurrentPlayer = function() {
        return (round % 2 === 1 ? player1 : player2);
    }

    const playAgain = function() {
        displayController.clearCells(cells);
        gameBoard.resetBoard();
        round = 1;
        startGame();
    }

    const playRound = function(event) {
        if (round <= 9) {
            displayController.draw(event, getCurrentPlayer().getSymbol());
            if (gameBoard.isWinner()) {
                displayController.displayMessage(`Player ${getCurrentPlayer().getSymbol()} has won!`);
                playAgainButton.disabled = false;
                playAgainButton.hidden = false;
                return;
            }
            else {
                round++;
            }
        }
        if (round > 9) {
            displayController.displayMessage('It\'s a draw!');
        }
        else {
            displayController.displayMessage(`Player ${getCurrentPlayer().getSymbol()}'s Turn!`);
        }
    }

    const startGame = function() {
        addListeners();
        playAgainButton.disabled = true;
        playAgainButton.hidden = true;
        displayController.displayMessage(`Player ${getCurrentPlayer().getSymbol()}'s Turn!`);
    }
    
    return {getRound, getCurrentPlayer, startGame, playRound};
})();

gameController.startGame();