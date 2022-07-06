
let discs = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
];
let rows, columns;
const cellSize = 60;
const gap = 2;
let blackBackground;
let discLayer;
let scoreLabel;
let gameOver;
let canMoveLayer;

window.onload = function(){
    blackBackground = document.getElementById('blackBackground');
    blackBackground.setAttribute('style',`width:${cellSize*8 + gap*9}px; height:${cellSize*8+gap*9}px;`);
    discLayer = document.querySelector('.piece');
    drawGreenSquares();
    
    canMoveLayer = document.getElementById("canMoveLayer");
    scoreLabel = document.getElementById('score');
    drawDiscs();
    drawCanMoveLayer();
};

function drawGreenSquares(){
    for(rows = 0; rows < 8; rows++){
        for(columns = 0; columns < 8; columns++){
            let greenSquare = document.createElement("div");
            greenSquare.setAttribute('style', `position: absolute; background: green; height: ${cellSize}px; width: ${cellSize}px; top: ${(cellSize+gap)*rows+gap}px; left:${(cellSize+gap)*columns+gap}px`);
            blackBackground.appendChild(greenSquare);
            greenSquare.setAttribute("onclick","clickedSquare("+rows+","+columns+")");
        }
    }
    
};

//----------VALIDACIONES----------//


function canClickSpot(id,row,column){
    /*indica si el lugar donde se realizo el click es uno permitido*/
        let affectedDiscs = getAffectedDiscs(id,row,column);
        if(affectedDiscs.length == 0){
            return false;
        }else{
            return true;
        }
}

function getAffectedDiscs(id,row,column){
    /**obtiene las fichas afectadas por la nueva ficha ingresada en el tablero */
    let affectedDiscs = [];
    
    //to the right
    let couldBeAffected = [];
    let columnIterator = column;
    while(columnIterator < 7){
        columnIterator++;
        let valueAtSpot = discs[row][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: row, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    }

    //to the left
    couldBeAffected = [];
    columnIterator = column;
    while(columnIterator > 0){
        columnIterator--;
        let valueAtSpot = discs[row][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: row, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    };

    //above
    couldBeAffected = [];
    rowIterator = row;
    while(rowIterator > 0){
        rowIterator--;
        let valueAtSpot = discs[rowIterator][column];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: column};
            couldBeAffected.push(discLocation)
        }
    };

    //below
    couldBeAffected = [];
    rowIterator = row;
    while(rowIterator < 7){
        rowIterator++;
        let valueAtSpot = discs[rowIterator][column];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: column};
            couldBeAffected.push(discLocation)
        }
    };

    //diagonals
    //down right
    couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;
    while(rowIterator < 7 && columnIterator < 7){
        rowIterator++;
        columnIterator++;
        let valueAtSpot = discs[rowIterator][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    };

    //down left
    couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;
    while(rowIterator < 7 && columnIterator > 0){
        rowIterator++;
        columnIterator--;
        let valueAtSpot = discs[rowIterator][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    };

    //up left
    couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;
    while(rowIterator > 0 && columnIterator > 0){
        rowIterator--;
        columnIterator--;
        let valueAtSpot = discs[rowIterator][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    };

    //up right
    couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;
    while(rowIterator > 0 && columnIterator < 7){
        rowIterator--;
        columnIterator++;
        let valueAtSpot = discs[rowIterator][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == id){
            if(valueAtSpot == id){
                affectedDiscs = affectedDiscs.concat(couldBeAffected);
            }
            break;
        }else{
            let discLocation = {row: rowIterator, column: columnIterator};
            couldBeAffected.push(discLocation)
        }
    };


    return affectedDiscs;
}

//----------FICHAS----------//

let turn = 1;
function drawDiscs(){
    discLayer.innerHTML = "";
    for(rows = 0; rows < 8; rows++){
        for(columns = 0; columns < 8; columns++){
            let disc = document.createElement("div");
            let value = discs[rows][columns];
            if(value == 0){

            }else{
                disc.setAttribute('style', `position: absolute; height: ${cellSize-8}px; width: ${cellSize-8}px; 
                top: ${(cellSize+gap)*rows+gap+2}px; left:${(cellSize+gap)*columns+gap+2}px; border-radius: 50%;`);

                if(value == 1){
                    disc.style.backgroundImage = "radial-gradient(#333333 30%, black 70%)";
                }else if(value == 2){
                    disc.style.backgroundImage = "radial-gradient(white 30%, #cccccc 70%)";
                }
            }
            discLayer.appendChild(disc);
        }
    }
}

function flipDiscs(affectedDiscs){
    /**voltea las fichas que fueron afectadas por la nueva ficha */
    for(let i = 0; i < affectedDiscs.length; i++){
        let spot = affectedDiscs[i];
        if(discs[spot.row][spot.column] == 1){
            discs[spot.row][spot.column] = 2;
        }else{
            discs[spot.row][spot.column] = 1;
        }
    }
}

//----------MARCADOR----------//
function redrawScore(){
    let player1 = 0;
    let player2 = 0;
    for (let row = 0; row < 8; row++){
        for(let column = 0; column < 8; column++){
            let value = discs[row][column];
            if(value == 1){
                player1++;
            }else if(value == 2){
                player2++;
            }
        }
    }
    scoreLabel.innerHTML = "Black: "+player1+" White: "+player2;
}

//----------HELPER---------//
//toma el cuadro donde se produjo un click, se asegura que alli no haya una ficha
//y luego coloca la ficha del color que le corresponda.
function clickedSquare(row, column){
    if(gameOver){
        console.log('Game Over:'+gameOver);
        return;       
    }//controla que el juego no se haya terminado

    if(discs[row][column] != 0){
        return;
    }
    //console.log("el lugar esta libre")
    if(canClickSpot(turn,row,column) == true && !gameOver){
        let affectedDiscs = getAffectedDiscs(turn,row,column);
        flipDiscs(affectedDiscs);
        discs[row][column] = turn;
        if(turn == 1 && canMove(2)){
            turn = 2;
        }else if (turn == 2 && canMove(1)){
            turn = 1;
        }

        if(!canMove(1)  && !canMove(2)){
            alert("Game Over");
            gameOver = true;
        }else{
            gameOver = false;
        }
        drawDiscs();
        drawCanMoveLayer();
        redrawScore();
    }else{
        return;
    }
}

function drawCanMoveLayer(){
    canMoveLayer.innerHTML = "";
    for(rows = 0; rows < 8; rows++){
        for(columns = 0; columns < 8; columns++){
            let shadow = document.createElement("div");
            let value = discs[rows][columns];
            if(value == 0 && canClickSpot(turn, rows,columns)){

                shadow.setAttribute('style', `position: absolute; height: ${cellSize-8}px; width: ${cellSize-8}px; 
                top: ${(cellSize+gap)*rows+gap+2}px; left:${(cellSize+gap)*columns+gap+2}px; 
                border-radius: 50%; z-index: 2;`);

                shadow.setAttribute("onclick","clickedSquare("+rows+","+columns+")")
                if(turn == 1){
                    shadow.style.border = "2px solid black";
                }else if(turn == 2){
                    shadow.style.border = "2px solid white";
                }
                canMoveLayer.appendChild(shadow);
            }
        }
    }
}

//controla que alguno de los dos jugadores tenga movimientos posibles,
//en caso de que no haya movimientos posibles, se termina el juego
function canMove(id){
    for(var row = 0; row < 8; row++){
        for(var column = 0; column < 8; column++){
            if(canClickSpot(id,row,column)){
                return true;
            }
        }
    }
    return false;
}