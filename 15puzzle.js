"use strict";

var tiles = [];
const MOVES_PER_LEVEL = 50;

function init() {
    let table = document.getElementById("table");
    for (let i = 0; i < 4; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 4; j++) {
            let td = document.createElement("td");
            let index = i * 4 + j;
            td.className = "tile";
            if (index === 0) {
                td.classList.add("empty");
            }
            td.index = index;
            td.value = index;
            td.textContent = index === 0 ? "" : index;  // 0の場合は空文字、それ以外はインデックスをそのまま表示
            td.onclick = click;
            tr.appendChild(td);
            tiles.push(td);
        }

        table.appendChild(tr);
    }

    updateTileColors();
    document.getElementById("startButton").addEventListener("click", startGame);
}

function startGame() {
    document.getElementById("startMessage").classList.add("hidden");
    document.getElementById("message").classList.add("hidden");
    let level = parseInt(document.querySelector('input[name="level"]:checked').value);
    let moveCount = level * MOVES_PER_LEVEL;
    inverseShuffleTiles(moveCount);
}

function inverseShuffleTiles(moveCount) {
    resetToSolvedState();
    
    for (let i = 0; i < moveCount; i++) {
        let validMoves = getValidMoves();
        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        applyMove(randomMove);
    }
    
    updateTileColors();
    checkIfSolved();
}

function resetToSolvedState() {
    tiles.forEach((tile, index) => {
        tile.textContent = index === 0 ? "" : index;
        tile.value = index;
        tile.classList.toggle('empty', index === 0);
    });
}

function getValidMoves() {
    let emptyIndex = tiles.findIndex(tile => tile.value === 0);
    let validMoves = [];
    
    if (emptyIndex >= 4) validMoves.push('up');
    if (emptyIndex < 12) validMoves.push('down');
    if (emptyIndex % 4 !== 0) validMoves.push('left');
    if (emptyIndex % 4 !== 3) validMoves.push('right');
    
    return validMoves;
}

function applyMove(move) {
    let emptyIndex = tiles.findIndex(tile => tile.value === 0);
    let targetIndex;
    
    switch(move) {
        case 'up': targetIndex = emptyIndex - 4; break;
        case 'down': targetIndex = emptyIndex + 4; break;
        case 'left': targetIndex = emptyIndex - 1; break;
        case 'right': targetIndex = emptyIndex + 1; break;
    }
    
    if (targetIndex >= 0 && targetIndex < 16) {
        swap(emptyIndex, targetIndex);
    }
}

function click(e) {
    var i = e.target.index;
    if (i - 4 >= 0 && tiles[i - 4].value == 0) {
        swap(i, i - 4);
    } else if (i + 4 < 16 && tiles[i + 4].value == 0) {
        swap(i, i + 4);
    } else if (i % 4 != 0 && tiles[i - 1].value == 0) {
        swap(i, i - 1);
    } else if (i % 4 != 3 && tiles[i + 1].value == 0) {
        swap(i, i + 1);
    }
    updateTileColors();
    checkIfSolved();
}

function swap(i, j) {
    let tmp = tiles[i].value;
    let tmpText = tiles[i].textContent;

    tiles[i].textContent = tiles[j].textContent;
    tiles[i].value = tiles[j].value;
    tiles[i].classList.toggle('empty');
    tiles[j].classList.toggle('empty');

    tiles[j].textContent = tmpText;
    tiles[j].value = tmp;

    updateTileColors();
}

function updateTileColors() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].value === i) {
            tiles[i].classList.add('correct');
        } else {
            tiles[i].classList.remove('correct');
        }
    }
}

function checkIfSolved() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].value !== i) {
            document.getElementById("message").classList.add("hidden");
            return false;
        }
    }
    document.getElementById("message").classList.remove("hidden");
    return true;
}

window.onload = init;