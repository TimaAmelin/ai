const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const firstPlayerScore = document.querySelector('#firstScore');
const secondPlayerScore = document.querySelector('#secondScore');
const undoButton = document.querySelector('#undo');
const mainMenuButton = document.querySelector('.mainMenuButton');

let playField = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
]

let lastPieceX = 2;
let lastPieceY = 2;
let yourLastPieceX = 2;
let yourLastPieceY = 2;
let lastPiecePlayer = 1;
let gamestate = 0;

let firstScore = 0;
secondScore = 0;
whoseTurn = 1;

const renderPlayField = (context, playField, cursorX, cursorY) => {
    if (gamestate) {
        updatePlayField(playField, cursorX, cursorY);
        drawPlayField(context, playField);
    }
}

const showMenu = (ctx) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(170, 100, 100, 100);
    ctx.fillRect(370, 100, 100, 100);

    ctx.fillStyle = 'blue';
    ctx.fillRect(170, 300, 300, 100);

    ctx.fillStyle = 'green';
    ctx.fillRect(170, 500, 300, 100);

    ctx.fillStyle = 'black';
    ctx.strokeRect(170, 100, 100, 100);
    ctx.strokeRect(370, 100, 100, 100);
    ctx.strokeRect(170, 300, 300, 100);
    ctx.strokeRect(170, 500, 300, 100);

    ctx.font = "italic 30px Arial";

    ctx.fillText('1 Pl', 190, 155);
    ctx.fillText('1 Pl', 390, 140);
    ctx.fillText('hard', 390, 170);

    ctx.font = "italic 60px Arial";
    ctx.fillText('2 Players', 200, 370);
    ctx.fillText('AI vs AI', 215, 570);
}

const drawPlayField = (ctx, playField) => {
    if (gamestate) {
        showPlayField(ctx, playField);
        showPieces(ctx, playField);
    }
}

const showPlayField = (ctx, field) => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            const x = j * 640 / playField.length;
            const y = i * 640 / playField.length;

            ctx.strokeRect(x, y, 640 / playField.length, 640 / playField.length);
        }
    }
}

const showPieces = (ctx, field) => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            const x = j * 640 / playField.length;
            const y = i * 640 / playField.length;

            if (field[i][j] === 1) {
                ctx.fillStyle = 'red';

                ctx.fillRect(x + 10, y + 10, 640 / playField.length - 20,  640 / playField.length - 20);
            } else if (field[i][j] === -1){
                ctx.fillStyle = 'blue';

                ctx.fillRect(x + 10, y + 10,  640 / playField.length - 20,  640 / playField.length - 20);
            }
        }
    }
}

const updatePlayField = (playField, cursorX, cursorY) => {
    const x = Math.trunc(cursorX /  (640 / playField.length));
    const y = Math.trunc(cursorY /  (640 / playField.length));
    if (playField[y][x] === 0){
        playField[y][x] = whoseTurn;
        lastPiecePlayer = whoseTurn;

        lastPieceX = x;
        lastPieceY = y;

        yourLastPieceX = x;
        yourLastPieceY = y;

        if (gamestate === 2) {
            whoseTurn = changePlayer(whoseTurn);
        } else if (gamestate === 1) {
            computerMove(playField, -1, 2);
        } else if (gamestate === 4) {
            computerMove(playField, -1, 1);
        }
        
    }
}

const updateScore = (playField) => {

    if (gamestate) {
        firstScore = 0;
        secondScore = 0;

        checkHorizontal(playField);
        checkVertical(playField);
        checkUpDiagonal(playField);
        checkDownDiagonal(playField);
        //checkOtherStupidLines(playField);
        
        firstPlayerScore.innerHTML = firstScore;
        
        secondPlayerScore.innerHTML = secondScore;
    }
}

const checkOtherStupidLines = (playField) => {
    part1(playField);
}

const part1 = (playField) => {
    let lineScore = 0;

    for (let i = 0; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; (j < playField.length - i) && (j < 4); j++) {
            const x = j * 2;
            const y = i + j;

            lineScore += playField[y][x];

            if (playField[y][x] === 1) {
                firstCounter++;
            } else if (playField[y][x] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }
}

const checkDownDiagonal = (playField) => {
    let lineScore = 0;

    for (let i = 1; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j < playField.length - i; j++) {
            const x = i + j;
            const y = j;
            
            lineScore += playField[y][x];

            if (playField[y][x] === 1) {
                firstCounter++;
            } else if (playField[y][x] === -1) {
                secondCounter++;
            }
        }

        

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }

    for (let i = 0; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j <= playField.length - i - 1; j++) {
            const x = j;
            const y = i + j;

            lineScore += playField[y][x];

            if (playField[y][x] === 1) {
                firstCounter++;
            } else if (playField[y][x] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }
}

const checkUpDiagonal = (playField) => {
    let lineScore = 0;

    for (let i = 1; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j < playField.length - i; j++) {
            const x = i + j;
            const y = playField.length - j - 1;
            
            lineScore += playField[y][x];

            if (playField[y][x] === 1) {
                firstCounter++;
            } else if (playField[y][x] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }

    for (let i = playField.length - 1; i >= 0; i--) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j <= i; j++) {
            const x = j;
            const y = i - j;

            lineScore += playField[y][x];

            if (playField[y][x] === 1) {
                firstCounter++;
            } else if (playField[y][x] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }
}

const checkVertical = (playField) => {
    let lineScore = 0;

    for (let i = 0; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j < playField[i].length; j++) {
            lineScore += playField[j][i];

            if (playField[j][i] === 1) {
                firstCounter++;
            } else if (playField[j][i] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }
}

const checkHorizontal = (playField) => {
    let lineScore = 0;

    for (let i = 0; i < playField.length; i++) {
        lineScore = 0;
        let firstCounter = 0;
        let secondCounter = 0;

        for (let j = 0; j < playField[i].length; j++) {
            lineScore += playField[i][j];

            if (playField[i][j] === 1) {
                firstCounter++;
            } else if (playField[i][j] === -1) {
                secondCounter++;
            }
        }

        if (lineScore > 0) {
            if (firstCounter > 3){
                firstScore++;
            }
        } else if (lineScore < 0) {
            if (secondCounter > 3){
                secondScore++;
            }
        }
    }
}

const showLastPiece = (context, lastPieceX, lastPieceY, lastPiecePlayer) => {
    if (gamestate) {
        if (lastPiecePlayer === 1) {
            context.fillStyle = '#FFCBDB';
        } else if (lastPiecePlayer === -1) {
            context.fillStyle = '#80A6FF';
        }
        const x = lastPieceX *  640 / playField.length;
        const y = lastPieceY *  640 / playField.length;

        context.fillRect(x + 10, y + 10,  640 / playField.length - 20,  640 / playField.length - 20);
    }
}

const undoLastMove = (context, playField, lastPieceX, lastPieceY) => {
    if (gamestate != 3) {
        if (playField[lastPieceY][lastPieceX]) {
            playField[lastPieceY][lastPieceX] = 0;
            playField[yourLastPieceY][yourLastPieceX] = 0;
            context.clearRect(0, 0, 640, 640)
            drawPlayField(context, playField);
            if (gamestate === 2) {
                whoseTurn = changePlayer(whoseTurn);
            }
        }
    }
    
}

const changePlayer = (whoseTurn) => {
    if (whoseTurn === 1){
        whoseTurn = -1;
    } else if (whoseTurn === -1) {
        whoseTurn = 1;
    }
    return whoseTurn;
}

computerMove = (playField, turn, type) => {
    let m = 4;
    let cellPoints = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]

    if (type === 1) {
        cellPoints = [
            [0,0,0,m,m,0,0,0],
            [0,0,m,2*m,2*m,m,0,0],
            [0,m,2*m,3*m,3*m,2*m,m,0],
            [m,2*m,3*m,4*m,4*m,3*m,2*m,m],
            [m,2*m,3*m,4*m,4*m,3*m,2*m,m],
            [0,m,2*m,3*m,3*m,2*m,m,0],
            [0,0,m,2*m,2*m,m,0,0],
            [0,0,0,m,m,0,0,0]
        ]
    }

    if (type === 1) {
        for (let i = 0; i < playField.length; i++) {
            for (let j = 0; j < playField[i].length; j++) {
                if (!playField[i][j]) {
                    let lineScore = 0;
                    let lineCounter = 0;

                    for (let k = 0; k < playField.length; k++) {
                        lineScore += playField[i][k];
                        if (playField[i][k] === turn) {
                            cellPoints[i][j] +=2;
                            lineCounter++;
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 20;
                        }
                    } else if (lineScore === 0) {
                        cellPoints[i][j] +=10;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 10;
                        }
                    }
                    
                    
                    lineScore = 0;
                    lineCounter = 0;

                    for (let k = 0; k < playField.length; k++) {
                        lineScore += playField[k][j];
                        if (playField[k][j] === turn) {
                            cellPoints[i][j] +=2;
                            lineCounter++;
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 20;
                        }
                    } else if (lineScore === 0) {
                        cellPoints[i][j] +=10;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 10;
                        }
                    }


                    lineScore = 0;
                    lineCounter = 0;

                    if (i - j >= 0) {
                        const starty = 0;
                        const startx = i-j;
                        for (let k = 0; k < playField.length - startx; k++) {
                            lineScore += playField[startx + k][starty + k];
                            if (playField[startx + k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                                lineCounter++;
                            }
                        }
                    } else {
                        const starty = j-i;
                        const startx = 0;

                        for (let k = 0; k < playField.length - starty; k++) {
                            lineScore += playField[startx + k][starty + k];
                            if (playField[startx + k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                                lineCounter++;
                            }
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 20;
                        }
                    } else if (lineScore === 0) {
                        cellPoints[i][j] +=10;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 10;
                        }
                    }


                    lineScore = 0;
                    lineCounter = 0;

                    if (i + j - playField.length >= 0) {
                        const startx = playField.length - 1;
                        const starty = i + j - playField.length + 1;
                        for (let k = 0; k < playField.length - starty; k++) {
                            lineScore += playField[startx - k][starty + k];
                            if (playField[startx - k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                                lineCounter++;
                            }
                        }
                    } else {
                        const startx = i + j;
                        const starty = 0;
                        for (let k = 0; k < startx; k++) {
                            lineScore += playField[startx - k][starty + k];
                            if (playField[startx - k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                                lineCounter++;
                            }
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 20;
                        }
                    } else if (lineScore === 0) {
                        cellPoints[i][j] +=10;
                        if (lineCounter > 2) {
                            cellPoints[i][j] += 10;
                        }
                    }
                }
            }
        }
    } else if (type === 2) {
        for (let i = 0; i < playField.length; i++) {
            for (let j = 0; j < playField[i].length; j++) {
                if (!playField[i][j]) {
                    let lineScore = 0;

                    for (let k = 0; k < playField.length; k++) {
                        lineScore += playField[i][k];
                        if (playField[i][k] === turn) {
                            cellPoints[i][j] +=2;
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                    } else if (lineScore === 0) {
                        cellPoints[i][j] +=10;
                    }
                    
                    
                    lineScore = 0;

                    for (let k = 0; k < playField.length; k++) {
                        lineScore += playField[k][j];
                        if (playField[k][j] === turn) {
                            cellPoints[i][j] +=2;
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                    } else if (lineScore === 0) {
                        cellPoints[i][j] += 10;
                    }


                    lineScore = 0;

                    if (i - j >= 0) {
                        const starty = 0;
                        const startx = i-j;
                        for (let k = 0; k < playField.length - startx; k++) {
                            lineScore += playField[startx + k][starty + k];
                            if (playField[startx + k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                            }
                        }
                    } else {
                        const starty = j-i;
                        const startx = 0;

                        for (let k = 0; k < playField.length - starty; k++) {
                            lineScore += playField[startx + k][starty + k];
                            if (playField[startx + k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                            }
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                    } else if (lineScore === 0) {
                        cellPoints[i][j] += 10;
                    }


                    lineScore = 0;

                    if (i + j - playField.length >= 0) {
                        const startx = playField.length - 1;
                        const starty = i + j - playField.length + 1;
                        for (let k = 0; k < playField.length - starty; k++) {
                            lineScore += playField[startx - k][starty + k];
                            if (playField[startx - k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                            }
                        }
                    } else {
                        const startx = i + j;
                        const starty = 0;
                        for (let k = 0; k < startx; k++) {
                            lineScore += playField[startx - k][starty + k];
                            if (playField[startx - k][starty + k] === turn) {
                                cellPoints[i][j]  +=2;
                            }
                        }
                    }

                    if (lineScore === 1 || lineScore === -1) {
                        cellPoints[i][j] += 20;
                    } else if (lineScore === 0) {
                        cellPoints[i][j] += 10;
                    }
                }
            }
        }
    }
    
    let bestX = [0];
    let bestY = [0];
    let besterX = 0;
    let besterY = 0;
    let bestCounter = 0;

    for (let i = 0; i < playField.length; i++) {
        for (let j = 0; j < playField[i].length; j++) {
            if (0.95 * cellPoints[i][j] > cellPoints[bestY[besterY]][bestX[besterX]]) {
                bestX = [j];
                bestY = [i];
                besterX = 0;
                besterY = 0;
            } else if (cellPoints[i][j] > 0.95 * cellPoints[bestY[besterY]][bestX[besterX]]){
                
                bestX.push(j);
                bestY.push(i);
                if (cellPoints[i][j] > cellPoints[bestY[besterY]][bestX[besterX]]) {
                    besterX = bestX.length - 1;
                    besterY = bestY.length - 1;
                }
                bestCounter++;
            }
        }
    }

    let done = 0;

    for (let counter = 0; counter < bestX.length; counter++) {
        if (done === 0) {
            if (bestX.length - 1 === counter) {
                if (!playField[bestY[counter]][bestX[counter]]){
                    playField[bestY[counter]][bestX[counter]] = turn;
                    done = 1;

                    lastPieceX = bestX[counter];
                    lastPieceY = bestY[counter];

                    lastPiecePlayer = turn;
                }
            } else {
                const probability = Math.random();
                if (probability > 1 - 1 / bestCounter) {
                    if (!playField[bestY[counter]][bestX[counter]]){
                        playField[bestY[counter]][bestX[counter]] = turn;
                        done = 1;

                        lastPieceX = bestX[counter];
                        lastPieceY = bestY[counter];

                        lastPiecePlayer = turn;
                    }
                }
            }
        }
    }

    
}

let game;

showMenu(context);

undoButton.onclick = function() {
    undoLastMove(context, playField, lastPieceX, lastPieceY);
}

mainMenuButton.onclick = function() {
    playField = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];

    gamestate = 0;
    
    context.clearRect(0, 0, 640, 640);
    showMenu(context);

    clearInterval(game);
}

canvas.onclick = function(event) {
    const cursorX = event.offsetX;
    const cursorY = event.offsetY;

    if (gamestate === 0) {
        if ((cursorX > 170 && cursorX < 270) && (cursorY > 100 && cursorY < 200)) {
            gamestate = 1;

            firstTurn = Math.random();

            if (firstTurn > 0.5) {
                computerMove(playField, -1, 2);
            }

            context.clearRect(0, 0, 640, 640);
            drawPlayField(context, playField);
        } else if ((cursorX > 370 && cursorX < 470) && (cursorY > 100 && cursorY < 200)) {
            gamestate = 4;

            firstTurn = Math.random();

            if (firstTurn > 0.5) {
                computerMove(playField, -1, 1);
            }

            context.clearRect(0, 0, 640, 640);
            drawPlayField(context, playField);
        } else if ((cursorX > 170 && cursorX < 470) && (cursorY > 300 && cursorY < 400)) {
            gamestate = 2;

            context.clearRect(0, 0, 640, 640);
            drawPlayField(context, playField);
        } else if ((cursorX > 170 && cursorX < 470) && (cursorY > 500 && cursorY < 600)) {
            gamestate = 3;

            context.clearRect(0, 0, 640, 640);
            drawPlayField(context, playField);

            let firstWin = 0;
            let secondWin = 0;
            let tie = 0;

            let turn = 1;
            let turnNumber = 0;
            let type = 1;

            const statistics = 0;

            if (statistics) {
                game = setInterval(() => {
                    playField = [
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                    ];
                    
                    firstScore = 0;
                    secondScore = 0;
    
                    for (let turns = 0; turns < playField.length * playField.length; turns++) {
                        computerMove(playField, turn, type);
                        drawPlayField(context, playField);
                        turn *= -1;
                        /*if (type === 1) {
                            type = 2;
                        } else if (type === 2) {
                            type = 1;
                        }*/
    
                        turnNumber++;
    
                        updateScore(playField);
                    }
    
                    if (firstScore > secondScore) {
                        firstWin++;
                    } else if (secondScore > firstScore) {
                        secondWin++;
                    } else {
                        tie++
                    }
    
                    console.log(firstWin, tie, secondWin)

            
                }, 1000)
            } else {
                playField = [
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0]
                ];
                
                firstScore = 0;
                secondScore = 0;
    
                game = setInterval(() => {
                    if (turnNumber < playField.length * playField.length) {
                        computerMove(playField, turn, type);
                        drawPlayField(context, playField);
                        turn *= -1;
                        if (type === 1) {
                            type = 2;
                        } else if (type === 2) {
                            type = 1;
                        }
    
                        turnNumber++;
    
                        updateScore(playField);
                    } else {
                        clearInterval(game);
                    }
                },
                300);
            }
            
        }
    } else if (gamestate === 1 || gamestate === 2 || gamestate === 4) {
        context.clearRect(0, 0, 640, 640);
        renderPlayField(context, playField, cursorX, cursorY);

        updateScore(playField);

        showLastPiece(context, lastPieceX, lastPieceY, lastPiecePlayer);
    }
}