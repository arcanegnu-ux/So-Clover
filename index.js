'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve all files in /public (index.html, client.js, CSS, etc.)
app.use(express.static('public'));

// Simple shared game state (in-memory, resets if server restarts)
let game = {
  isActive: false,
  gameState: "menu",
  players: {}
};

io.emit('gameState', game); // broadcast to all players

const WORD_POOL = ['Dead', 'Major', 'Reptile', 'Radar', 'Fairy', 'Cuddle', 'New', 'Violin', 'Swing', 'Bottom', 'Leaf', 'Career', 'Cold', 'Advocate', 'Fur', 'Chain', 'Library', 'Bomb', 'Food', 'Gift', 'Covered', 'Furniture', 'Comforter', 'Brown', 'Tobacco', 'Clown', 'Feline', 'Garage', 'Tea', 'Room', 'Life', 'Heavy', 'Siren', 'Apron', 'Cube', 'Degree', 'Rose', 'Volume', 'Ammo', 'Vacation', 'Vampire', 'Cushion', 'Necklace', 'Oil', 'Tomato', 'Grey', 'Forecast', 'Screw', 'Cream', 'Laser', 'Arm', 'Work', 'Shell', 'Flea', 'Cookie', 'Craft', 'Head', 'Device', 'Beach', 'Morning', 'Red', 'Line', 'Umbrella', 'Adventure', 'Porcelain', 'Pump', 'Season', 'Card', 'Large', 'Pine', 'Spicy', 'Hat', 'Fox', 'Mountain', 'Dictator', 'Ambulance', 'Rat', 'Gate', 'Ray', 'Boot', 'Fly', 'Calendar', 'Skull', 'Award', 'Bouquet', 'Box', 'Eye', 'Sea', 'Well', 'Rooster', 'Alcohol', 'Nude', 'Tail', 'Menu', 'Child', 'Shirt', 'Bridge', 'Defence', 'Piano', 'Sense', 'Comedy', 'Pocket', 'Suite', 'Missile', 'Explore', 'Giant', 'Bucket', 'Barn', 'Lighthouse', 'Hero', 'Emergency', 'Metal', 'Walk', 'Chick', 'Fountain', 'Ice', 'String', 'Blood', 'Microscope', 'Report', 'Bath', 'Nerve', 'Plane', 'Nut', 'Wool', 'Dungeon', 'Ring', 'Cane', 'Virgin', 'Mug', 'Park', 'Donkey', 'Accessory', 'Brain', 'Alarm', 'Space', 'Bowl', 'Mouth', 'Blade', 'Peace', 'Permanent', 'Cannon', 'Potato', 'Champion', 'Photo', 'Orchard', 'Scene', 'Mass', 'Winter', 'Island', 'High', 'Foot', 'Bottle', 'Group', 'Beard', 'North', 'Bar', 'Strong', 'Knife', 'Operation', 'Speaker', 'Ladybug', 'Restaurant', 'Painting', 'Circle', 'Sock', 'Door', 'Cow', 'Match', 'Mother', 'Rope', 'Paradise', 'Trash', 'Claw', 'Mud', 'Grenade', 'Inside', 'Astronaut', 'Fish', 'Padlock', 'Guardian', 'Moist', 'Sunday', 'Wolf', 'Jewel', 'Summit', 'Bug', 'Genius', 'Fire', 'Sister', 'Hotel', 'Drum', 'Snail', 'Dynamite', 'Pliers', 'Slide', 'Detergent', 'Castle', 'Frost', 'Plastic', 'Uniform', 'Whip', 'Human', 'Window', 'Poetry', 'Sweet', 'Nest', 'Bubble', 'Crossroads', 'Instrument', 'Limit', 'Pirate', 'Past', 'Flash', 'Capital', 'Doll', 'Dream', 'Cinema', 'Cup', 'Jump', 'Cantina', 'Lightning', 'Phone', 'Music', 'Universe', 'Chameleon', 'Wheel', 'Balance', 'Star', 'Handicap', 'Lion', 'Rich', 'Revenge', 'Watch', 'Motor', 'Heel', 'Fair', 'Dirty', 'Medal', 'Wave', 'Wild', 'Bell', 'Fruit', 'Whale', 'Light', 'Case', 'Pepper', 'Fast', 'Color', 'Rifle', 'Post', 'Boss', 'Utensil', 'Middle', 'Grape', 'Shower', 'Dresser', 'Suitcase', 'Judge', 'Herbs', 'Soldier', 'Ghost', 'Storm', 'Pad', 'Toy', 'Basket', 'Weak', 'Knight', 'Thunder', 'Straw', 'Religion', 'Promotion', 'March', 'Wood', 'Skeleton', 'Hole', 'Band', 'Bone', 'Marine', 'Spring', 'Ink', 'Stitches', 'Garden', 'Spear', 'Oak', 'Raft', 'Suspect', 'Mobile', 'Coffee', 'Puzzle', 'Cougar', 'Stone', 'Chocolate', 'Office', 'Pair', 'Protect', 'Right', 'Forest', 'Display', 'Octopus', 'Forbidden', 'Hammer', 'Drawing', 'Bin', 'Column', 'Cloud', 'Cheese', 'Illness', 'Bay', 'Pipe', 'Magic', 'Slow', 'Game', 'Canvas', 'Punch', 'Soup', 'Vegetable', 'Foam', 'Handle', 'Talent', 'Entry', 'Round', 'Sand', 'Oven', 'Sight', 'Base', 'Subway', 'Baby', 'Series', 'Glass', 'Turn', 'Hobbies', 'Actor', 'Lock', 'Schedule', 'Guitar', 'Magician', 'Studio', 'Cave', 'Mosquito', 'Loop', 'Stylist', 'Pyramid', 'Club', 'Milk', 'Taste', 'Hell', 'Track', 'Cereal', 'Evening', 'Plank', 'Oasis', 'Smoke', 'Needle', 'Knot', 'Butcher', 'Challenge', 'Friend', 'Bill', 'Tank', 'Grave', 'Train', 'Bear', 'Solitary', 'Dance', 'Prison', 'Matter', 'Crown', 'Song', 'Station', 'Throat', 'Delivery', 'Sun', 'Concert', 'Cable', 'Basement', 'Stunt', 'Month', 'Stroke', 'Cabbage', 'Ladder', 'Pilot', 'Skate', 'Circus', 'Europe', 'Repair', 'Victory', 'Dragon', 'Blond', 'Trailer', 'Decor', 'Recipe', 'Glasses', 'Syrup', 'King', 'Place', 'Mark', 'Chair', 'Beef', 'Doctor', 'Bird', 'Treasure', 'Nurse', 'Sticky', 'Mind', 'Moon', 'Hide', 'Casino', 'Egg', 'Nail', 'Newspaper', 'Bus', 'Story', 'Jar', 'Chimney', 'Clean', 'Chest', 'Pit', 'Paintbrush', 'Nightmare', 'Rake', 'Tongue', 'Wizard', 'Attraction', 'Show', 'Diet', 'Explosion', 'Top', 'Front', 'Plush', 'Archeology', 'Cork', 'Dessert', 'God', 'Bank', 'Lava', 'Magnet', 'Tennis', 'Shop', 'File', 'Hot', 'Dwarf', 'Science', 'Cross', 'Record', 'Monster', 'Body', 'Cat', 'Camouflage', 'Salad', 'Young', 'Ocean', 'Technology', 'Edge', 'Beer', 'Marker', 'Vision', 'Blue', 'Tunnel', 'Dress', 'Market', 'Arrow', 'Shadow', 'Picture', 'Log', 'Master', 'Skin', 'Border', 'Camera', 'Bench', 'Patron', 'Stud', 'Target', 'Leak', 'Flask', 'Marriage', 'Throne', 'Spy', 'Tube', 'Berry', 'Sheep', 'Climbing', 'Pond', 'Firefight', 'Internet', 'Snack', 'Captain', 'Father', 'Summer', 'Species', 'Temple', 'Suit', 'Demon', 'Revolver', 'Jelly', 'Computer', 'Strength', 'Couch', 'Farm', 'Helmet', 'Yellow', 'Toilet', 'Earth', 'Mouse', 'Shed', 'Turtle', 'Statue', 'Grain', 'Ear', 'Cavern', 'Shark', 'Feed', 'Devil', 'Mint', 'Recent', 'Layer', 'Finger', 'Note', 'Hard', 'Kitchen', 'Fry', 'Ruler', 'Mail', 'Revolution', 'Garbage', 'Car', 'Small', 'Humor', 'Radio', 'Crow', 'Hand', 'River', 'Bed', 'Zoo', 'Angel', 'Key', 'Whirlwind', 'Wine', 'Boat', 'Iron', 'Air', 'Police', 'Double', 'Silence', 'War', 'Heart', 'Gas', 'Appetite', 'Currency', 'Mirage', 'Airport', 'Sport', 'Crescent', 'Outlet', 'Size', 'Camp', 'Letter', 'Safari', 'Sewer', 'Engine', 'Blanket', 'Pearl', 'Carrot', 'Lady', 'Flour', 'Sail', 'Charm', 'Tame', 'Cigarette', 'Stick', 'Country', 'Secret', 'Chef', 'Square', 'Salt', 'Cotton', 'Paper', 'Virus', 'Honey', 'Desert', 'Military', 'Dinosaur', 'Birthday', 'Press', 'Heritage', 'Bedroom', 'Mustard', 'Apprentice', 'Orange', 'Tiny', 'Feather', 'Pan', 'Museum', 'Roof', 'Canal', 'Wheat', 'Exit', 'Plant', 'Candle', 'Antiquity', 'Kiss', 'Duck', 'Trim', 'Barracks', 'Board', 'Button', 'Union', 'Axe', 'Commerce', 'Trophy', 'Shovel', 'End', 'Screen', 'Beast', 'Volcano', 'Root', 'Television', 'Lemon', 'Dog', 'Ramp', 'Grass', 'Candy', 'Court', 'Danger', 'Deep', 'Region', 'Cemetery', 'Bracelet', 'Hearth', 'Stage', 'Hearing', 'Ladle', 'Flute', 'Crab', 'Passion', 'Field', 'Shape', 'Ground', 'Asia', 'Glove', 'Race', 'Closet', 'Rain', 'Asset', 'Road', 'Cocktail', 'Face', 'Butterfly', 'Map', 'Waiter', 'Fool', 'Animal', 'Building', 'Boxing', 'First', 'Fever', 'Shield', 'Inspection', 'History', 'Day', 'Frame', 'Weight', 'Pumpkin', 'Jungle', 'Canada', 'Cockroach', 'Landscape', 'Champagne', 'Drink', 'Horse', 'Polar', 'Short', 'Armor', 'Curtain', 'Charge', 'Antarctica', 'Wish', 'Buckle', 'Sword', 'Grease', 'Weather', 'Order', 'Elastic', 'Triangle', 'Business', 'Dish', 'Myth', 'Big', 'Bread', 'Chess', 'Mummy', 'Flight', 'Melon', 'Lake', 'Sound', 'Gold', 'Saber', 'Broom', 'Tradition', 'Bronze', 'Bike', 'Mirror', 'Ballroom', 'Hen', 'Ireland', 'Medusa', 'Lighter', 'Shelter', 'Console', 'Voice', 'Recipient', 'Cell', 'House', 'Hood', 'Pear', 'Lamp', 'Curry', 'Manual', 'Autumn', 'Machine', 'Ball', 'Night', 'Tree', 'School', 'Tent', 'Noodle', 'Weapon', 'Bakery', 'Cactus', 'Bulb', 'Cake', 'Princess', 'Twins', 'Patio', 'Africa', 'Liquid', 'Scissors', 'Palace', 'Wing', 'Snow', 'Crane', 'District', 'Lazy', 'Stocks', 'Envelop', 'Turnip', 'Brother', 'Grate', 'Hardware', 'Ticket', 'Witness', 'Sausage', 'Tiger', 'Alliance', 'Cabin', 'Old', 'Surgeon', 'Silver', 'Pizza', 'Moustache', 'Sleeve', 'Parrot', 'Family', 'Flame', 'Roll', 'Hook', 'Fuel', 'Luck', 'Memory', 'Down', 'Guide', 'Love', 'Doe', 'Clothing', 'Banana', 'Tattoo', 'Napkin', 'Perfume', 'Chariot', 'Limb', 'Tile', 'Bite', 'Fashion', 'Movie', 'Pig', 'Sage', 'Trade', 'Rail', 'Quilt', 'Soap', 'Full', 'Branch', 'Dough', 'Queen', 'Water', 'Attic', 'Rabbit', 'Fault', 'France', 'Physical', 'Spider', 'Transport', 'Shelf', 'Tornado', 'Smell', 'Oar', 'Thief', 'Theatre', 'Bag', 'Thin', 'Rice', 'Balcony', 'Belt', 'Bark', 'Wind', 'China', 'Soft', 'Poison', 'Diamond', 'Book', 'Bump', 'Green', 'Pie', 'Cage', 'Sky', 'Spice', 'Detective', 'Town', 'Mask', 'Sugar', 'Port', 'Gamble', 'Mushroom', 'Truck', 'Church', 'Table', 'Ruin', 'Stamp', 'Bang', 'Owl', 'Sponge', 'Black', 'Hunt', 'Thread', 'Robot', 'America', 'Wand', 'Pigeon', 'Hospital', 'Roast', 'Essence', 'Joke', 'Hair', 'Tool', 'Hall', 'Heroine', 'Party', 'Assassin', 'Powder', 'Labyrinth', 'Flower', 'Fishing', 'Brush', 'Travel', 'Luxury', 'Battery', 'Carpet', 'Laugh', 'Belgium', 'Sharp', 'Carton', 'Snake', 'Apple', 'Common', 'Exhibition', 'Ship', 'White', 'Fable', 'Cavalry', 'Minor'];

function generateBoard(size = 4) {
  // Pick random words (can refine later)
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => shuffled[r * size + c])
  );
}

function randomWords(count) {
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Handle new socket connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // When a new player joins
  socket.on('setNickname', (nickname) => {
    game.players[socket.id] = { id: socket.id, name: nickname || 'Anonymous' };
    io.emit('playerListUpdate', Object.values(game.players));
  });

  // When a client clicks "Start Game"
  socket.on('startGame', () => {
    game.isActive = true;
    game.gameState = "setup";
  

    // Assign each player a unique board
    for (let id in game.players) {
      game.players[id].board = generateBoard(4);
      game.players[id].ready = false; // for setup completion
    }

    // Each player gets their own board privately
    for (let id in game.players) {
      io.to(id).emit('yourBoard', game.players[id].board);
    }

    console.log(`Game started by ${socket.id}`);
    io.emit('gameState', game); // broadcast to all players
  });

  // When a player submits a word
  // socket.on('playerMove', (data) => {
  //   const word = data.word?.trim();
  //   if (!word) return;

  //   game.lastWord = word;
  //   game.round++;

  //   console.log(`Player ${socket.id} submitted: ${word}`);
  //   io.emit('gameState', game); // broadcast new state
  // });

  socket.on('playerReady', () => {
    if (game.players[socket.id]) {
      game.players[socket.id].ready = true;

      // Broadcast updated ready states
      io.emit('playerListUpdate', Object.values(game.players));

      // Check if all players are ready
      const allReady = Object.values(game.players).every(p => p.ready);
      if (allReady) {
        // // Advance to next stage
        game.phase = "collaborative"; // track stage
        io.emit('phaseChange', game.phase);
        game.gameState = "chooseBoard";
        io.emit('gameState', game); // broadcast to all players
      }
    }


  });

  socket.on('shareBoard', (data) => {
      // Broadcast the shared board and the player's name to all clients
      const player = game.players[socket.id];
      console.log(data.clues)
      let board = data.board;
      board.push({ id: `${socket.id}-5`, x: 940, y: 195, words: randomWords(4), rotation: 0, placed: false, slot: null });
      for (let card of board) {
        card.rotation = Math.floor(Math.random() * 4); // random rotation
      }
      board.sort(() => Math.random() - 0.5); // shuffle cards
     io.emit('boardShared', { name: player?.name || 'Anonymous', board: data.board, clues: data.clues });

     game.gameState = "sharing";
     io.emit('gameState', game); // broadcast to all players
  });

  socket.on("rotateCard", (data) => {
    // broadcast to all players
    io.emit("rotateCard", data);
  });

  socket.on("placeCard", (data) => {
    io.emit("placeCard", data);
  });



  // When a player disconnects
  socket.on('disconnect', () => {
    delete game.players[socket.id];
    io.emit('playerListUpdate', Object.values(game.players));
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


