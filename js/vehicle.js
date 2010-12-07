function Vehicle(ctx, xx, yy)
{
	var context = ctx;
	var x = xx;
	var y = yy;
	var rotation = -90;
	var desiredRot = -90;
	
	this.velocity = {x : 0, y : 0};
	this.vr = 0;
	this.speed = 0;
	this.thrust = 0;
	this.speed = 0;
	
	this.draw = function()
	{
		// Set the style properties;
		desiredRot += this.vr;
		var r = (desiredRot - rotation) * .1;
		rotation += r;

		//debug('rot : ' + rotation)
		
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
		
		context.fillStyle   = 'rgba(255, 255, 255, 1)';
		/*context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur    = 5;
		context.shadowColor   = 'rgba(255, 255, 255, .5)';*/
		
		context.beginPath();

		// Start from the top-left point.
		//TRIANGLE SHIP
		/*var p1x = x + Math.cos(angle) * 12;
		var p1y = y + Math.sin(angle) * 12;
		var p2x = x + Math.cos(angle + 2.6) * 18;
		var p2y = y + Math.sin(angle + 2.6) * 18;
		var p3x = x + Math.cos(angle + 3.7) * 18;
		var p3y = y + Math.sin(angle + 3.7) * 18;
		context.moveTo(p1x, p1y);
		context.lineTo(p2x, p2y);
		context.lineTo(p3x, p3y);
		context.lineTo(p1x, p1y);*/

		//SPACE SHUTTLE
		var p1 = {x : x + Math.cos(getAngle(0)) * 40, y : y + Math.sin(getAngle(0)) * 40};
		var p2 = {x : x + Math.cos(getAngle(13.2)) * 34, y : y + Math.sin(getAngle(13.2)) * 34};
		var p3 = {x : x + Math.cos(getAngle(29.7)) * 16.12, y : y + Math.sin(getAngle(29.7)) * 16.12};
		var p4 = {x : x + Math.cos(getAngle(121.6)) * 30.53, y : y + Math.sin(getAngle(121.6)) * 30.53};
		var p5 = {x : x + Math.cos(getAngle(153.4)) * 17.89, y : y + Math.sin(getAngle(153.4)) * 17.89};
		var p6 = {x : x + Math.cos(getAngle(160.8)) * 24.35, y : y + Math.sin(getAngle(160.8)) * 24.35};
		var p7 = {x : x + Math.cos(getAngle(199.2)) * 24.35, y : y + Math.sin(getAngle(199.2)) * 24.35};
		var p8 = {x : x + Math.cos(getAngle(206.6)) * 17.89, y : y + Math.sin(getAngle(206.6)) * 17.89};
		var p9 = {x : x + Math.cos(getAngle(238.4)) * 30.53, y : y + Math.sin(getAngle(238.4)) * 30.53};
		var p10 = {x : x + Math.cos(getAngle(330.3)) * 16.12, y : y + Math.sin(getAngle(330.3)) * 16.12};
		var p11 = {x : x + Math.cos(getAngle(346.8)) * 34, y : y + Math.sin(getAngle(346.8)) * 34};
		
		function getAngle(rot)
		{
			return (rot * Math.PI / 180) + angle;
		}
		
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		context.lineTo(p3.x, p3.y);
		context.lineTo(p4.x, p4.y);
		context.lineTo(p5.x, p5.y);
		context.lineTo(p6.x, p6.y);
		context.lineTo(p7.x, p7.y);
		context.lineTo(p8.x, p8.y);
		context.lineTo(p9.x, p9.y);
		context.lineTo(p10.x, p10.y);
		context.lineTo(p11.x, p11.y);
		context.lineTo(p1.x, p1.y);
		
		// Done! Now fill the shape, and draw the stroke.
		// Note: your shape will not be visible until you call any of the two methods.
		context.fill();
		context.closePath();
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
		var p1x = x + Math.cos(getAngle(90)) * 18;
		var p1y = y + Math.sin(getAngle(90)) * 18;
		var p2x = x + Math.cos(getAngle(270)) * 18;
		var p2y = y + Math.sin(getAngle(270)) * 18;
		
		return {startX : p1x, startY : p1y, startX2 : p2x, startY2: p2y, endX : px, endY : py};
	}
}
