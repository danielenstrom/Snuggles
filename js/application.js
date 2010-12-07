var Application = new function(){
	
	var FRAMRATE = 40;
	
	var canvas;
	var context;
	
	var mouse = {x: 0, y: 0, isDown: false};
	var particles = [];
	var lastX = 0;
	var vehicle;
	var isLeftDown = false;
	var isUpDown = false;
	var isRightDown = false;
	
	var KEY_LEFT = 37;
	var KEY_UP = 38;
	var KEY_RIGHT = 39;
	var KEY_SPACE = 32;
	var shipBitmapsArr;
	var loadIndex = 0;
	/**
	* INIT
	*/
	
	var socket;
	
	var stats;// = new Stats();
	
	this.initialize = function()
	{
		canvas = document.getElementById('canvas');
			
		if(canvas && canvas.getContext)
		{
			context = canvas.getContext('2d');
			
			resizeCanvas();
			loadBitmaps();
			//createcreateVehicle();
			stats = new Stats();
			document.getElementById('wrapper').appendChild( stats.domElement );
			//setup Listeners
			
			//setInterval(onUpdate, 1000 / FRAMRATE);
			$(window).resize(resizeCanvas);
			//$(document.documentElement).keydown(onKeyDownHandler);
			//$(document.documentElement).keyup(onKeyUpHandler);

		}
		
		socket = new io.Socket('localhost', {port : 9090});
		socket.on('connect', socketConnect);
		socket.on('disconnect', socketDisconnect);
		socket.on('message', socketMessage);
		socket.connect();
	}
	
	function socketMessage(m) {
		debug("Message Recived");
		var response = JSON.parse(m);
		debug(response);
		if(response.command == "iphone") {
			switch(response.direction) {
				case 'up':
					isUpDown = isUpDown ? false : true;
					if(!isUpDown) {
						vehicle.thrust = 0;
					}
					break;
				
				case 'left':
					break;
					
				case 'right':
					break;
			}
		}
	}
	
	function socketDisconnect(e) {
		debug("Disconnected from server");
	}
	
	function socketConnect(e) {
		debug("Connected To Socket Server");
	}
	
	function loadBitmaps()
	{
		shipBitmapsArr = [];
		loadNextBitmap();
	}
	
	function loadNextBitmap()
	{
		loadIndex++;
		
		var img = new Image();
		var file = loadIndex;
		
		shipBitmapsArr[shipBitmapsArr.length] = img;
		
		if(loadIndex < 10)
		{
			file = '00' + loadIndex;
		}
		else if(loadIndex < 100)
		{
			file = '0' + loadIndex;
		}
		
		var url = './img/render2/spaceship_' + file + '.png'; 
		
		$(img).load(function ()
		{
			if(loadIndex >= 360)
			{
				debug('Loading done....');
				setupStage();
			}
			else
			{
				loadNextBitmap();
			}

		}).error(function () {
		            // notify the user that the image could not be loaded
		}).attr('src', url);
		
	}
	
	function setupStage()
	{
		createVehicle();
		setInterval(onUpdate, 1000 / FRAMRATE);
		$(document.documentElement).keydown(onKeyDownHandler);
		$(document.documentElement).keyup(onKeyUpHandler);
	}
	
	function createVehicle()
	{
		vehicle = new Vehicle(context, canvas.width *.5, canvas.height *.5, shipBitmapsArr);
	}
	
	/**
	* EVENT HANDLERS
	*/
	/*function onMouseMoveHandler(e)
	{
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	
		//addParticles(mouse.x, mouse.y);
		
		e.preventDefault();
		
		lastX = mouse.x;
	}*/
	
	function onKeyDownHandler(e)
	{
	//	debug('Key Down : ' + e.keyCode);
		if(e.keyCode == KEY_LEFT)isLeftDown = true;
		if(e.keyCode == KEY_UP)isUpDown = true;
		if(e.keyCode == KEY_RIGHT)isRightDown = true;
	}
	
	function onKeyUpHandler(e)
	{
		//debug('Key Up : ' + e.keyCode);
		
		if(e.keyCode == KEY_SPACE)
		{
			shoot();
		}
		
		if(e.keyCode == KEY_LEFT)
		{
			isLeftDown = false;
			vehicle.vr = 0;
		}
		
		if(e.keyCode == KEY_UP)
		{
			isUpDown = false;
			//vehicle.velocity = {x: 0, y: 0};
			vehicle.thrust = 0;
		}
		
		if(e.keyCode == KEY_RIGHT)
		{
			isRightDown = false;
			vehicle.vr = 0;
		}
	}
	
	/**
	* RUNTIME IMPLEMENTATION
	*/
	
	function shoot()
	{
		//debug('SHOOT');
		
		addParticles();
	}
	
	function addParticles()
	{
		for(var i = 0; i < 4; ++i)
		{
			var points = vehicle.getTargetPoint(); 
			if(i < 2)
			{
				var p = new Particle(points.startX, points.startY);
			}
			else
			{
				var p = new Particle(points.startX2, points.startY2);
			}
			
			p.targetPoint = {x : points.endX + (Math.random() * 100) - 50, y : points.endY + (Math.random () * 100) - 50};
						
			particles[particles.length] = p;
		}
	}
	
	var resizeCanvas = function() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
	};
		
	/**
	* ENTER FRAME
	*/
	function onUpdate()
	{
		stats.update();
		
		context.fillStyle = "rgba(0,0,0,1)";
		context.fillRect( 0, 0, canvas.width, canvas.height);
		
		if(isLeftDown)
		{
			vehicle.vr = -3;
		}
		if(isRightDown)
		{
			vehicle.vr = 3;
		}
		if(isUpDown)
		{
			vehicle.thrust = .02;
			vehicle.speed = 1;
			//debug('isdown');
		}
		
		updateParticles();
		vehicle.draw();
	
		
		//end drawing
		
		context.restore();
		
		if(socket) {
			socket.send(JSON.stringify(vehicle));
		}
	}
	
	function updateParticles()
	{
		var l = particles.length;
		
		for(var i = 0; i < l; ++i)
		{
			var p = particles[i];
			
			context.beginPath();
			context.arc( p.x , p.y , p.radius, 0 , Math.PI*2 , false );
			context.fillStyle = "rgba("+ p.color +", " + p.alpha +")";
			context.fill();
			context.closePath();
			
			p.alpha *= .995;
			p.radius *= .99;
			
			/*p.x += p.vector.x;
			p.y += p.vector.y;
			
			p.vector.x *= p.friction;
			p.gravity += .005;
			p.vector.y += p.gravity;*/
			
			var px = (p.targetPoint.x - p.x) *.01;
			var py = (p.targetPoint.y - p.y) *.01;
			
			//debug('partX : ' + p.x);
			//debug('partY : ' + p.y);
			
			p.x += px;
			p.y += py; 
		}
		
		for(var i = 0; i < l; ++i)
		{
			var p = particles[i];
			if(p.radius < .1)
			{
				particles.shift();
				l -= 1;
				
				delete p;
			}
		}
	}
}

/**
* PARTICLE
*/

function Particle(x, y)
{
		this.x = x;
		this.y = y;
		this.targetPoint = {x: 0, y: 0};
		this.velocity = {x : 0, y : 0};
		this.gravity = 0//(Math.random() * .2) - .2;
		this.friction = 0;
		this.vector = {x : 0, y : 0};
		this.radius = 2;//.5 + (Math.random() * 1);
		this.alpha = 1;
		this.color = '255, 255, 255';//Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 ) + "," + Math.floor( Math.random()*255 );
}

function Vehicle(ctx, xx, yy, bmps)
{
	var bitmapsArr = bmps;
	var context = ctx;
	var x = xx;
	var y = yy;
	var rotation = -90;
	var desiredRot = -90;
	var fakeRot = 0;
	
	this.velocity = {x : 0, y : 0};
	this.vr = 0;
	this.speed = 0;
	this.thrust = 0;
	this.speed = 0;
	
	this.draw = function()
	{
		desiredRot += this.vr;
		var r = (desiredRot - rotation) * .1;
		rotation += r;
		fakeRot += r;
		
		var angle = rotation * Math.PI / 180;
		var ax = Math.cos(angle) * this.thrust;
		var ay = Math.sin(angle) * this.thrust;
	    
		this.velocity.x += ax;
		this.velocity.y += ay;
		
		x += this.velocity.x;
		y += this.velocity.y; //* this.speed;
		
		if(this.speed > .02)this.speed *= .9999;
		
		this.velocity.x *= this.speed;
		this.velocity.y *= this.speed; 
		
		if(fakeRot > 359)fakeRot-= 359;
		if(fakeRot < 0)fakeRot += 359;
		
		var imgIndex = Math.round(fakeRot);
		var imgObj = bitmapsArr[imgIndex];
		
		context.drawImage(imgObj, x, y);
	}
	
	this.getTargetPoint = function()
	{
		var angle = rotation * Math.PI / 180;
		var dist = Math.max(window.innerWidth, window.innerHeight);
		dist = dist * .75;
		var px = x + Math.cos(angle) * dist;
		var py = y + Math.sin(angle) * dist;
		
		function getAngle(rot)
		{
			return (rot * Math.PI / 180) + angle;
		}
		
		//startPoints
		var p1x = (x + 15) + Math.cos(getAngle(-90)) * 8;
		var p1y = (y + 15) + Math.sin(getAngle(-90)) * 8;
		var p2x = (x + 15) + Math.cos(getAngle(90)) * 8;
		var p2y = (y + 15) + Math.sin(getAngle(90)) * 8;
		
		return {startX : p1x, startY : p1y, startX2 : p2x, startY2: p2y, endX : px, endY : py};
	}
}


var debug = function(txt) {
	if(window.console && console.log) {
		console.log(txt);
	}
}

Application.initialize();