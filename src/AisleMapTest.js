var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

context.beginPath();
context.moveTo(500 + testMap.path[0].x * 40, 500 + testMap.path[0].y * 40);

//finds the next point at which the direction changes
var findDirectionChange = function() {
}
	
var drawPath = function() {
	var counter = 0;

	context.beginPath();
	context.moveTo(500 + testMap.path[0].x * 40, 500 + testMap.path[0].y * 40);
	var animate = function() {
	  	context.lineTo(testMap.path[counter].x*40+500, -testMap.path[counter].y*40+500);

		context.lineWidth = 5;
		context.strokeStyle = 'blue';
		context.stroke();
		counter++;
		if (counter < testMap.path.length) {
			setTimeout(animate, 100);
		}
	}
	animate();	
}	

var drawAisles = function() {
	for (var i = 0; i < testMap.numAisles; i++) {
		context.beginPath();
		context.moveTo(480+40*i, 500);
		context.lineTo(480+40*i, 100);
		context.lineWidth = 2;
		context.strokeStyle = 'black';
		context.stroke();
	}
} 

var drawItems = function() {
	for (var i = 0; i < testMap.items.length; i++) {
		context.beginPath();
		context.arc(500 + 40*testMap.items[i].x, 500 - 40*testMap.items[i].y, 4, 0, 2 * Math.PI);
		context.stroke();
		// context.fillRect(500 + 40*testMap.items[i].x, 500 - 40*testMap.items[i].y,10,10)
	}
}

drawAisles();
drawItems();
drawPath();