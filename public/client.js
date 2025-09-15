'use strict';

// const { text } = require("express");

let game = { gameState: "menu" }; // Local default
let sharedBoard = null; // Holds the board data to display when shared
let sharedBoardOwner = "Click below to share your board!"; // Store the name of the player who shared
let selectedCard = null; // Currently dragged card
let selectedClueArea = null; // Currently selected clue area
let sharedClues;

const socket = io();


socket.on('gameState', (state) => {
  game = state; // Update local game object with server state
  // Optionally, trigger UI updates here
});

let cards = [];
let canvas;

function setup(){
  canvas = createCanvas(1120, 570)

  // cards = [
  //   { id: 0, x: 100, y: 100, words: ["apple", "tree", "book", "cat"], rotation: 0, placed: false, slot: null },
  //   { id: 1, x: 290, y: 100, words: ["river", "stone", "dog", "plane"], rotation: 0, placed: false, slot: null },
  //   { id: 2, x: 100, y: 290, words: ["house", "star", "car", "moon"], rotation: 0, placed: false, slot: null },
  //   { id: 3, x: 290, y: 290, words: ["music", "light", "fire", "wind"], rotation: 0, placed: false, slot: null },
  // ];
  
}

function draw() {
  background(244);
  push()
  // for (let area of clueAreas) {
  //   fill(0, 0, 255)
  //   rect(area.x, area.y, area.w, area.h);
  // }

  if (game.gameState == "setup"){
    canvas.parent("boardCanvas")
    push()
    translate(280, 0)
    fill(50, 230, 0)
    strokeWeight(0)
    square(100, 100, 370, 50)

    arc(220, 100, 180, 160, PI, 2*PI)
    arc(350, 100, 180, 160, PI, 2*PI)
    arc(100, 220, 160, 180, PI/2, 3*PI/2)
    arc(100, 350, 160, 180, PI/2, 3*PI/2)
    arc(470, 220, 160, 180, 3*PI/2, PI/2)
    arc(470, 350, 160, 180, 3*PI/2, PI/2)
    arc(220, 470, 180, 160, 0, PI)
    arc(350, 470, 180, 160, 0, PI)
    pop()

    push()
    textAlign(CENTER, CENTER)
    textFont("Calibri")
    textSize(28)
    for (let area of clueAreas) {
      push()
      translate(area.x + area.w/2, area.y + area.h/2)
      rotate(-area.id * HALF_PI)
      text(area.text, 0, 15)
      pop()
    }
    pop()
  }

  if(game.gameState == "setup"){
    push();
    translate(300, 0);
    for (let c of cards) {
      drawCard(c.x, c.y, c.words, c.rotation); // draw each card
    }
    pop();
  }

  if (game.gameState == "sharing" || game.gameState == "chooseBoard"){
    canvas.parent("boardCanvas2");
    if (game.gameState == "chooseBoard"){
      background(244);
    }
    if (game.gameState == "sharing" && sharedBoard){
      push();
      translate(-20, 0)
      fill(60, 215, 15)
      strokeWeight(0)
      square(100, 100, 370, 15)
      
      fill(50, 230, 0)
      arc(220, 100, 180, 160, PI, 2*PI)
      arc(350, 100, 180, 160, PI, 2*PI)
      arc(100, 220, 160, 180, PI/2, 3*PI/2)
      arc(100, 350, 160, 180, PI/2, 3*PI/2)
      arc(470, 220, 160, 180, 3*PI/2, PI/2)
      arc(470, 350, 160, 180, 3*PI/2, PI/2)
      arc(220, 470, 180, 160, 0, PI)
      arc(350, 470, 180, 160, 0, PI)

      push()
      translate(-280, 0)
      fill(0)
      textAlign(CENTER, CENTER)
      textFont("Calibri")
      textSize(28)
      for (let area of sharedClues) {
        push()
        translate(area.x + area.w/2, area.y + area.h/2)
        rotate(-area.id * HALF_PI)
        text(area.text, 0, 15)
        pop()
      }
      pop()


      pop();

      // Draw each card from the shared board
      // let xStart = 260, yStart = 100, xStep = 95, yStep = 95;
      for (let i = 0; i < sharedBoard.length; i++) {
        let card = sharedBoard[i];
        // console.log(card)
        // card.x = xStart + (i % 2) * xStep * 2;
        // card.y = yStart + Math.floor(i / 2) * yStep * 2;

        drawCard(card.x, card.y, card.words, card.rotation);
      }
      // push()
      // translate(0, 0)
      // drawCard(940, 195, ["Extra", "Test", "Card", "hi mom :)"], 0);
      // pop()
    }

  }
  pop()
}

function drawCard(cx, cy, words, rotation = 0) {
  push()
  translate(cx, cy)
  if (game.gameState == "sharing"){
    translate(90, 90)
    rotate(rotation * HALF_PI)
    translate(-90, -90)
  }

  push()
  fill(240)
  square(0, 0, 180, 15)
  pop()

  push()
  fill(50, 230, 0)
  strokeWeight(0)
  square(15, 15, 150)
  pop()

  push()
  fill(240)
  strokeWeight(0)
  arc(90, 1, 160, 80, PI/20, 19*PI/20)
  arc(90, 179, 160, 80, 21*PI/20, 39*PI/20)
  arc(1, 90, 80, 160, 31*PI/20, 9*PI/20)
  arc(179, 90, 80, 160, 11*PI/20, 29*PI/20)
  pop()

  textAlign(CENTER, TOP)
  textFont("Calibri")
  textSize(22)
  text(words[0], 90, 8)

  rotate(HALF_PI)
  text(words[1], 90, -172)

  rotate(HALF_PI)
  text(words[2], -90, -172)

  rotate(HALF_PI)
  text(words[3], -90, 8)

  pop()
}

// function mouseClicked() {
//   if (game.gameState !== "sharing") return; // Only allow interaction in sharing phase
//   if (insideCard(mouseX, mouseY, card)) {
//     card.rotation = (card.rotation + 1) % 4; // 90° clockwise
//     socket.emit("rotateCard", { id: card.id, rotation: card.rotation });

//   }
// }

function mousePressed() {
  startX = mouseX;
  startY = mouseY;
  if (game.gameState !== "sharing") return; // Only allow interaction in sharing phase
  
  for (let slot of slots) {
    if (insideSlot(slot)) {
      slot.filled = false; // Mark slot as unfilled if clicked
    }
  }
  sharedBoard.forEach(card => {
    if (insideCard(mouseX, mouseY, card)) {
      selectedCard = card; // Set the selected card for dragging
    }
  });
}
// adding sommcents


function insideCard(mx, my, card) {
  return mx > card.x && mx < card.x + 180 && my > card.y && my < card.y + 180;
}

let slots = [
  // Board Slots, reading order (left to right, top to bottom)
  { x: 80, y: 100, w: 190, h: 190, filled: false },
  { x: 270, y: 100, w: 190, h: 190, filled: false },
  { x: 80, y: 290, w: 190, h: 190, filled: false },
  { x: 270, y: 290, w: 190, h: 190, filled: false },
  // Bank Slots, top to bottom, left to right
  // { x: 560, y: 100, w: 180, h: 180, filled: false },
  // { x: 560, y: 290, w: 180, h: 180, filled: false },
  // { x: 750, y: 100, w: 180, h: 180, filled: false },
  // { x: 750, y: 290, w: 180, h: 180, filled: false },
  // { x: 940, y: 195, w: 180, h: 180, filled: false },
];

let clueAreas = [
  { id: 0, x: 380, y: 20, w: 370, h: 80, text: "" },
  { id: 1, x: 300, y: 100, w: 80, h: 370, text: "" },
  { id: 2, x: 380, y: 470, w: 370, h: 80, text: "" },
  { id: 3, x: 750, y: 100, w: 80, h: 370, text: "" },
]

let startX, startY;

function mouseDragged() {
  if (selectedCard) {
    let actualCard = sharedBoard.find(c => c.id === selectedCard.id);
    // if (!actualCard.slot) return; // Safety check
    actualCard.x = mouseX - 90; // Center the card under the mouse
    actualCard.y = mouseY - 90;
  }
}


function mouseReleased() {
  if (selectedCard) {
    let placed = false;
    for (let i = 0; i < slots.length; i++) {
    let slot = slots[i];
      if (!slot.filled && insideSlot(slot)) {
        let actualCard = sharedBoard.find(c => c.id === selectedCard.id);
        if (!actualCard) console.log("no cards found"); // Safety check

        actualCard.x = slot.x;
        actualCard.y = slot.y;
        actualCard.slot = i;
        slot.filled = true;
        placed = true;
        socket.emit("placeCard", { id: selectedCard.id, x: selectedCard.x, y: selectedCard.y, slot: i });
      }
    };
    for (let card of sharedBoard) {
      if (insideCard(mouseX, mouseY, card) && mouseX == startX && mouseY == startY) {
        card.rotation = (card.rotation + 1) % 4; // 90° clockwise
        socket.emit("rotateCard", { id: card.id, rotation: card.rotation });
      }
    }
    selectedCard = null;
  }
  for (let area of clueAreas) {
    if (insideClueArea(area)) {
      selectedClueArea = area;
      console.log(selectedClueArea)
      els.clueBox.focus();
      els.clueBox.value = area.text;
    }
  }

}

function insideClueArea(aria) {
  
  if (mouseX > aria.x && mouseX < aria.x + aria.w &&
         mouseY > aria.y && mouseY < aria.y + aria.h) {
          console.log("inside clue area")
          return true;
         }
         return false;
}

function insideSlot(slot) {
  return mouseX > slot.x && mouseX < slot.x + slot.w &&
         mouseY > slot.y && mouseY < slot.y + slot.h;
}


let els;
document.addEventListener('DOMContentLoaded', () => {
  // 1) Grab the DOM elements once (like caching references in Java)
  const screens = {
    menu: document.getElementById('menu'),
    rules: document.getElementById('rules'),
    game: document.getElementById('game'),
    collaborative: document.getElementById('collaborative'),
    sharing: document.getElementById('sharing'),
  };

  els = {
    nicknameInput: document.getElementById('nicknameInput'),
    playerList: document.getElementById('playerList'),
    startBtn: document.getElementById('startBtn'),
    rulesBtn: document.getElementById('rulesBtn'),
    backToMenuBtn: document.getElementById('backToMenuBtn'),
    backToMenuBtn2: document.getElementById('backToMenuBtn2'),
    // wordInput: document.getElementById('wordInput'),
    // submitWord: document.getElementById('submitWord'),
    gameStatus: document.getElementById('gameStatus'),
    readyBtn: document.getElementById('readyBtn'),
    shareBtn: document.getElementById('shareBtn'),
    clueBox: document.getElementById('clueBox'),
    shareBtn2: document.getElementById('shareBtn2'),
  };

  // 2) Screen switching (think: setVisible in Swing)
  function showScreen(id) {
    Object.values(screens).forEach(div => div.classList.remove('active'));
    screens[id].classList.add('active');
  }

  // 3) Connect to your Socket.IO server
  // const socket = io();

  // 4) Wire up the menu buttons
  els.startBtn.addEventListener('click', () => {
    socket.emit('startGame');     // tell server we want to start
    showScreen('game');           // switch to game screen
    // els.wordInput.focus();
  });

  els.rulesBtn.addEventListener('click', () => showScreen('rules'));
  els.backToMenuBtn.addEventListener('click', () => showScreen('menu'));
  els.backToMenuBtn2.addEventListener('click', () => showScreen('menu'));

  socket.on('yourBoard', (board) => {
    // Flatten the 2D array and create card objects with unique IDs
    const flatWords = board.flat();
    cards = [];
    let cardId = 0;
    for (let i = 0; i < 4; i++) {
      cards.push({
        id: `${socket.id}-${cardId++}`, // Unique per player
        x: 80 + (i % 2) * 190,
        y: 100 + Math.floor(i / 2) * 190,
        words: flatWords.slice(i * 4, i * 4 + 4), // 4 words per card
        rotation: 0,
        placed: false,
        slot: null
      });
    }
    // for (let row = 0; row < board.length; row++) {
    //   for (let col = 0; col < board[row].length; col++) {
    //    cards.push({
    //       id: `${socket.id}-${cardId++}`, // Unique per player
    //      x: 100 + col * 190,
    //      y: 100 + row * 190,
    //      words: board[row][col],
    //      rotation: 0,
    //      placed: false,
    //      slot: null
    //    });
    //   }
    // }
  });


  // 5) Submitting a word (button or Enter key)
  // function submitCurrentWord() {
  //   const word = els.wordInput.value.trim();
  //   if (!word) return;            // ignore empty submissions
  //   socket.emit('playerMove', { word });
  //   els.wordInput.value = '';
  //   els.wordInput.focus();
  // }

  // els.submitWord.addEventListener('click', submitCurrentWord);
  // els.wordInput.addEventListener('keydown', (e) => {
  //   if (e.key === 'Enter') submitCurrentWord();
  // });

  // 6) Listen for server updates and reflect them in the UI
  socket.on('gameState', (state) => {
    game = state; // update local copy
    // Switch all players to the game screen when game starts
    if (game.gameState === "setup") {
      showScreen("game");
    }
    else if (game.gameState === "chooseBoard"){
      showScreen("collaborative");
    }
    else if (game.gameState === "menu") {
      showScreen("menu");
    }
    else if(game.gameState === "sharing"){
      showScreen("sharing");
      let xStart = 560, yStart = 100, xStep = 95, yStep = 95;
      for (let i = 0; i < sharedBoard.length - 1; i++) {
        let card = sharedBoard[i];
        card.x = xStart + (i % 2) * xStep * 2;
        card.y = yStart + Math.floor(i / 2) * yStep * 2;
        card.slot = i + 4;
      }
      sharedBoard[sharedBoard.length - 1].x = 940;
      sharedBoard[sharedBoard.length - 1].y = 195;

      // sharedBoard.push( { id: `${socket.id}-${5}`, x: 940, y: 195, words: ["Extra", "Test", "Card", "hi mom :)"], rotation: 0, placed: false, slot: null } );
      // for (let i = 0; i < cards.length; i++){
      //   cards[i].x = 560 + (i % 2) * 190;
      //   cards[i].y = 100 + Math.floor(i / 2) * 190;
      //   cards[i].slot = i + 4;
      // }
    }
  });

  // Send nickname when the input changes
  els.nicknameInput.addEventListener('change', () => {
    const name = els.nicknameInput.value.trim();
    socket.emit('setNickname', name);
  });

  // Render player list
  socket.on('playerListUpdate', (players) => {
    els.playerList.innerHTML = '';
    players.forEach(player => {
      const li = document.createElement('li');
      li.textContent = player.name;
      els.playerList.appendChild(li);
    });
    // Update the count
    document.getElementById('playerCount').textContent = players.length;
  });


  els.readyBtn = document.getElementById("readyBtn");

  els.readyBtn.addEventListener("click", () => {
    socket.emit("playerReady");
    els.readyBtn.disabled = true; // prevent multiple clicks
  });

  els.shareBtn.addEventListener("click", () => {
    socket.emit("shareBoard", { board: cards, clues: clueAreas }); // Send this player's board to server
    screens.sharing.removeChild(els.shareBtn2);
  })

  els.shareBtn2.addEventListener("click", () => {
    socket.emit("shareBoard", { board: cards, clues: clueAreas }); // Send this player's board to server
    screens.sharing.removeChild(els.shareBtn2);

  })

  // When phase changes
  socket.on("phaseChange", (phase) => {
    if (phase === "collaborative") {
      showScreen("collaborative");
    }
  });
  

  socket.on('boardShared', ({ name, board, clues }) => {
    console.log("Board received:", board);
    console.log("Clues received:", clues);
    sharedBoard = board;
    console.log(sharedBoard)
    sharedBoardOwner = name;
    console.log(`Board shared by ${name}`);
    const ownerPara = document.getElementById('sharedBoardOwner');
    if (ownerPara) {
      ownerPara.textContent = `${sharedBoardOwner}'s board:`;
    }
    sharedClues = clues;
    for (let slot of slots) {
      slot.filled = false; // Reset slots
    }
    // Display the shared board for all players
    // For example, show a modal or update a section of the UI
    // You can also render the board visually here
    // Example: draw the shared board in a dedicated canvas or div
   // drawSharedBoard(board);
  });

  els.clueBox.addEventListener("keyup", () => {
    if (selectedClueArea) {
      clueAreas.find(a => a.id === selectedClueArea.id).text = els.clueBox.value;
    }
    console.log("moose")
  });

  socket.on("rotateCard", (data) => {
    console.log(sharedBoard)
    let card = sharedBoard.find(c => c.id === data.id);
   if (card) {
      card.rotation = data.rotation;
    }
  });

  socket.on("placeCard", (data) => {
    let card = sharedBoard.find(c => c.id === data.id);
    if (card) {
      card.x = data.x;
     card.y = data.y;
     card.slot = data.slot;
    }
  });



  // Optional: simple connection logs for debugging
  socket.on('connect', () => console.log('Connected:', socket.id));
  socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
});