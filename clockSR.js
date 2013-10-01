function ClockSR(){

	this.clockId = "clock_id";
	this.version = "0.2";
	this.name = "ClockSR";
	
	var options = {
		scale:{
			x:1,
			y:1
		},
		center:{
			x:250,
			y:250
		},
		radius:200,
		canvas:{
			width:500,
			height:500
		}
	};

	this.now = new Date();
	
	var time = {
		ms:this.now.getMilliseconds(),
		s:this.now.getSeconds(),
		m:this.now.getMinutes(),
		h:this.now.getHours()
	};

	var that = this;

	var position = {
		sec:{x:null,y:null},
		min:{x:null,y:null},
		hrs:{x:null,y:null},
		update : function () {
			that.now = new Date();
			var asec, amin, ahrs;
			time.ms = that.now.getMilliseconds();
			time.s = that.now.getSeconds();
			time.m = that.now.getMinutes();
			time.h = that.now.getHours();
			asec = (time.s + 0.001 * time.ms) * Math.PI * 2 / 60 - Math.PI/2;
			position.sec.x = options.center.x + Math.cos( asec ) * options.radius * 0.9;
			position.sec.y = options.center.y + Math.sin( asec ) * options.radius * 0.9;
			amin = (time.m + (time.s + 0.001 * time.ms)/60) * Math.PI * 2 / 60 - Math.PI/2;
			position.min.x = options.center.x + Math.cos( amin ) * options.radius * 0.66;
			position.min.y = options.center.y + Math.sin( amin ) * options.radius * 0.66;
			ahrs = (time.h + (time.m + time.s/60)/60) * Math.PI * 2 / 12 - Math.PI/2;
			position.hrs.x = options.center.x + Math.cos( ahrs ) * options.radius * 0.33;
			position.hrs.y = options.center.y + Math.sin( ahrs ) * options.radius * 0.33;
		}
	};//*/	

	var canvas = document.getElementById(this.clockId);
	canvas.width = options.canvas.width;
	canvas.height = options.canvas.height;

	var ctx = canvas.getContext('2d');
	ctx.transform(options.scale.x,0,0,options.scale.y,0,0);
	ctx.lineCap = 'round';
	var bufferClearClock = null;
	var	buffer = null;

	var drawMainTicks = function () {
		ctx.save();
		var xTick, yTick;
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#808080"

		ctx.beginPath();
		xTick = options.center.x + Math.cos( - Math.PI/2 ) * options.radius;
		yTick = options.center.x + Math.sin( - Math.PI/2 ) * options.radius;
		ctx.moveTo(xTick, yTick + options.radius * 0.15);
		ctx.lineTo(xTick, yTick + options.radius * 0.05);
		ctx.stroke();

		ctx.beginPath();
		xTick = options.center.x + Math.cos( 0 ) * options.radius;
		yTick = options.center.x + Math.sin( 0 ) * options.radius;
		ctx.moveTo(xTick - options.radius * 0.15, yTick);
		ctx.lineTo(xTick - options.radius * 0.05, yTick);
		ctx.stroke();

		ctx.beginPath();
		xTick = options.center.x + Math.cos( Math.PI/2 ) * options.radius;
		yTick = options.center.x + Math.sin( Math.PI/2 ) * options.radius;
		ctx.moveTo(xTick, yTick - options.radius * 0.15);
		ctx.lineTo(xTick, yTick - options.radius * 0.05);
		ctx.stroke(); 
		
		ctx.beginPath();
		xTick = options.center.x + Math.cos( Math.PI ) * options.radius;
		yTick = options.center.x + Math.sin( Math.PI ) * options.radius;
		ctx.moveTo(xTick + options.radius * 0.15, yTick);
		ctx.lineTo(xTick + options.radius * 0.05, yTick);
		ctx.stroke();

		ctx.restore();
	};

	var drawTicks = function () {
		ctx.save();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000";
		for (var i = 1; i < 61 ; i++){
			var angle = (i - 15) * (Math.PI * 2) / 60;
			dx = options.radius * 0.85 * Math.cos(angle);
			dy = options.radius * 0.85 * Math.sin(angle);
			if(!(i%15)){
				ctx.save();
				ctx.font = '24px Tahoma';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#555';
				ctx.fillText(i/5, options.center.x + dx ,options.center.y + dy);
				ctx.restore();
			}
			else if(!(i%5)){
				ctx.save();
				ctx.beginPath();
        			ctx.fillStyle = "#000";
				ctx.lineWidth = 1;
				ctx.arc(options.center.x + dx, options.center.y + dy, 2, 0,Math.PI*2);
				ctx.stroke();
			        ctx.fill();
        			ctx.closePath();
				ctx.restore();
			}else{
				ctx.beginPath();
				ctx.arc(options.center.x + dx, options.center.y + dy, 0.5, 0,Math.PI*2);
				ctx.stroke();
				ctx.closePath();
			}
		};
		ctx.restore();
	}

	var drawNumbers = function () {
		ctx.save();
		ctx.font = '28px Tahoma';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#555';
		ctx.moveTo(options.center.x, options.center.y);
		ctx.beginPath();
		var angle, dx, dy;
		for (var i = 1; i <= 12; i++){
			angle = (i-3) * (Math.PI * 2) / 12;
			dx = options.radius * 0.75 * Math.cos(angle);
			dy = options.radius * 0.75 * Math.sin(angle);
			ctx.fillText(i, options.center.x + dx ,options.center.y + dy);
		}
		ctx.restore();
	};

	var drawClock = function () {
		ctx.save();
		ctx.strokeStyle = "#3388DE";
		ctx.arc(options.center.x,options.center.y,options.radius,360,0);
		ctx.lineWidth = "23";
		ctx.stroke();
		ctx.closePath();
		// drawMainTicks();
		// drawNumbers();
		drawTicks();
		bufferClearClock = ctx.getImageData(0,0,canvas.width,canvas.height);
		ctx.restore();
	};

	var drawSeconds = function (){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(options.center.x,options.center.y);
		ctx.lineTo(position.sec.x,position.sec.y);
		ctx.stroke();
		ctx.restore();
	};

	var drawMinutes = function () {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.moveTo(options.center.x,options.center.y);
		ctx.lineTo(position.min.x,position.min.y);
		ctx.stroke();
		ctx.restore();
	};

	var drawHours = function () {
		ctx.save();
		ctx.lineWidth = "10"
		ctx.beginPath();
		ctx.moveTo(options.center.x,options.center.y);
		ctx.lineTo(position.hrs.x,position.hrs.y);
		ctx.stroke();
		ctx.restore();
	};

	var update = function() {
		// if(buffer)
			// ctx.putImageData(buffer,0,0);
		position.update();
   	ctx.putImageData(bufferClearClock,0,0);
  	drawHours();
  	drawMinutes();
  	// buffer = ctx.getImageData(0,0,canvas.width,canvas.height);
	  drawSeconds();
	};

	var initialize = function(id){
		if(id){
			that.clockId = id;
		}
		drawClock();
		position.update();
		drawMinutes();
		drawHours();
		buffer = ctx.getImageData(0,0,canvas.width,canvas.height);
		setInterval(update,10);
	};

	//public methods
	this.init = initialize;
}
