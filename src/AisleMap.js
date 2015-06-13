var AisleMap = function(options) {
  var options = options || {};
  var numAisles = options.numAisles || 10;
	this.numAisles = numAisles;
	var items = []

  //test data
	if (!options.items) {
		for (var i = 0; i < 15; i++) {
			items.push({x: Math.floor((Math.random()*numAisles)), y: Math.floor((Math.random()*10))})
		}
	}
	//actual data
	else {
		for (var i = 0; i < options.items.length; i++) {
			if (options.items[i].aisle) {
				items.push(
					{x: options.items[i].aisle-1, y: Math.floor((Math.random()*10))}
				);
			}
		}
	}
	this.items = items;
	this.grid = [];
	this.path = [];
	this.aislesWithItems = [];
	this.currentAisle = 0;
	this.currentPosition = 0;
	this.nextAisle = 0;
	this.nextItem = 0;
	this.direction;
	this.aisleLength = options.aisleLength || 10;
}

AisleMap.prototype.constructGrid = function() {
	for (var i = 0; i < this.numAisles; i++) {
	//array initializer makes array one size smaller than parameter
		this.grid.push(new Array(this.aisleLength+1)
		//fun way to initialize array values
			.join('0').split('').map(function(e) {return parseInt(e, 10);})
		);
	}
}

AisleMap.prototype.placeItems = function() {
	for (var i = 0; i < this.items.length; i++) {
		this.grid[this.items[i].x][this.items[i].y] = 1;
	}
}

AisleMap.prototype.findAislesWithItems = function() {
	var aislesWithItems = new Array(this.numAisles)
		.join('0').split('').map(function(e) {return parseInt(e, 10);});

	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].x) {
			aislesWithItems[this.items[i].x] = 1;
		}
	}

	this.aislesWithItems = aislesWithItems;
}

//checks if the aisle has more items
AisleMap.prototype.checkAisle = function(direction) {
	// console.log("in check aisle this.currentAisle is:", this.currentAisle);
	var currentAisle = this.currentAisle;
	var currentPosition = this.currentPosition;
	// console.log("in check aisle before loop, current position is:", currentPosition);
	// console.log("in check aisle before loop, current aisle is:", currentAisle)
	// console.log("in check aisle before loop, direction is:", this.direction)
	while (currentPosition < this.aisleLength && currentPosition >= 0) {
		// this.direction === 1 ? currentPosition++ : currentPosition --;
		if (this.direction === 1) {
			currentPosition++;
		}
		else {
			currentPosition--;
		}
			// console.log("in check aisle current aisle and position:", currentAisle, currentPosition);
		if (this.grid[currentAisle][currentPosition]) {
			return true;
		}
	}	
	// console.log("false");
	// console.log(currentAisle, currentPosition);

	return false;
}

AisleMap.prototype.moveToItem = function(direction) {
	while (this.currentPosition < this.aisleLength && this.currentPosition >= 0) {
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		if (this.direction === 1) {
			this.currentPosition++;
		}
		else {
			this.currentPosition--;
		}
		if (this.grid[this.currentAisle][this.currentPosition]) {
			// console.log("moved to", this.currentAisle, this.currentPosition);
			break;
		}
	}
	// console.log("moved to", this.currentAisle, this.currentPosition);
}

//path to end of aisle
AisleMap.prototype.moveToEnd = function(direction) {
	// console.log("in move to end, current aisle is:", this.currentAisle);
	// console.log("in move to end, next aisle is:", this.nextAisle);
	// console.log("in move to end, direction is:", this.direction);

	//if last aisle, head back to entrance
	if (this.currentAisle === this.nextAisle) {
		this.direction = -1;
	}
	if (this.direction === 1) {
		this.currentPosition++;
		for (var i = this.currentPosition; i < this.aisleLength; i++) {
			this.path.push({x: this.currentAisle, y:i});
		}
		this.currentPosition = this.aisleLength - 1;
		//simulates walking out into the walkway
		this.path.push({x: this.currentAisle, y: this.currentPosition+1});
		for (var i = 0; i < (this.nextAisle - this.currentAisle); i++) {
			this.path.push({x: this.currentAisle+i+1, y: this.currentPosition+1});
		}
	}
	else if (this.direction === -1) {
		this.currentPosition--;
		for (var i = this.currentPosition; i >= 0; i--) {
			this.path.push({x: this.currentAisle, y:i});
		}
		this.currentPosition = 0;
		//simulates walking out into the walkway
		this.path.push({x: this.currentAisle, y: this.currentPosition-1});
		for (var i = 0; i < this.nextAisle - this.currentAisle; i++) {
			this.path.push({x: this.currentAisle+i+1, y: this.currentPosition-1});
		}
	}
}

AisleMap.prototype.chooseNextAisle = function() {
	for (var i = this.currentAisle+1; i < this.aislesWithItems.length; i++) {
		if (this.aislesWithItems[i]) {
			this.nextAisle = i;
			return i;
		}
	}
}

AisleMap.prototype.chooseDirection = function(direction) {
	//if no more aisles to visit, just keep going in the same direction
	if (this.currentAisle === this.nextAisle) {
		return;
	}

	//correponds to direction, 1 is top half of aisle, -1 is bottom half of aisle
	var side;
	var hasItem = false;
	//figure out what side the current position is on
	if (this.currentPosition < (this.aisleLength-1)/2) {
		side = -1;
	}
	else if (this.currentPosition > (this.aisleLength-1)/2) {
		side = 1;
	}
	else {
		side = this.direction;
	}

	//check if there are any items on that side
	if (side === 1) {
		for (var i = this.aisleLength-1; i > (this.aisleLength-1)/2; i--) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
		}
	}
	else if (side === -1) {
		for (var i = 0; i < (this.aisleLength-1)/2; i++) {
			if (this.grid[this.nextAisle][i]) {
				hasItem = true;
				break;
			}
		}
	}

	//optimmization for last aisle
	if (this.nextAisle === this.aislesWithItems.length-1 && this.side === -1) {
		var topItem = false;
		for (var i = this.aisleLength-1; i > (this.aisleLength-1)/2; i--) {
			if (this.grid[this.nextAisle][i]) {
				topItem = true;
				break;
			}
		}
		if (topItem) {
			this.direction = 1;
			return;
		}
	}
	//if there is an item on the same side, head in that direction, otherwise continue in same direction
	if (hasItem) {
		this.direction = side;
	}
	// else {
	// 	this.direction = -side;
	// }
}

AisleMap.prototype.createPath = function() {
	var path = [];

	for (var i = 0; i < this.aislesWithItems.length; i++) {
		//choose an initial direction
		if (this.currentPosition === 0) {
			this.direction = 1;
		}
		else {
			this.direction = -1;
		}
		//moves down the aisle until there are no more items
		while(this.checkAisle(this.direction)) {
			this.moveToItem(this.direction);
		}
		//if no more items in aisle, add current location to path
		this.path.push({x: this.currentAisle, y:this.currentPosition});
		//figure out which aisle to move to next
		this.chooseNextAisle();
		//determine new direction
		this.chooseDirection();
		//move to end of current aisle in selected direction
		this.moveToEnd(this.direction);
		// //switch to next aisle
		// for (var i = 0; i < (this.nextAisle - this.currentAisle); i++) {
		// 	this.path.push({x: this.currentAisle+i, y: this.currentPosition});
		// }
		console.log("loop number ",i, "current aisle is: ", this.currentAisle, " and nextAisle is: ", this.nextAisle);
		if (this.currentAisle === this.nextAisle) {
			break;
		}
		//move to next aisle
		this.currentAisle = this.nextAisle;
		//rise and repeat until complete
	}
}

module.exports = AisleMap;

//tests
// var testMap = new AisleMap();
// testMap.constructGrid(5);
// testMap.placeItems();
// testMap.findAislesWithItems();
// testMap.createPath();
