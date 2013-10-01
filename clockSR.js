function ClockSR(){

	this.clockId = "clock_id";
	this.version = "0.1";
	this.name = "ClockSR";
	
	var options = {
		scale:{
			x:0.4,
			y:0.4
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
			time.s = that.now.getSeconds();
			time.m = that.now.getMinutes();
			time.h = that.now.getHours();
			position.sec.x = options.center.x + Math.cos( Math.PI/30*time.s - Math.PI/2 ) * options.radius * 0.9;
			position.sec.y = options.center.y + Math.sin( Math.PI/30*time.s - Math.PI/2 ) * options.radius * 0.9;
			position.min.x = options.center.x + Math.cos( Math.PI/30*time.m - Math.PI/2 ) * options.radius * 0.66;
			position.min.y = options.center.y + Math.sin( Math.PI/30*time.m - Math.PI/2 ) * options.radius * 0.66;
			position.hrs.x = options.center.x + Math.cos( Math.PI/12*time.h + Math.PI ) * options.radius * 0.33;
			position.hrs.y = options.center.y + Math.sin( Math.PI/12*time.h + Math.PI ) * options.radius * 0.33;
		}
	};//*/	

	var canvas = document.getElementById(this.clockId);
	canvas.width = options.canvas.width;
	canvas.height = options.canvas.height;

	var ctx = canvas.getContext('2d');
	ctx.transform(options.scale.x,0,0,options.scale.y,0,0);
	var bufferClearClock = null;
	var	buffer = null;

	var drawMainTicks = function () {
		ctx.save();
		var xTick, yTick;
		ctx.lineWidth = 3;
		
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

	var drawClock = function () {
		ctx.fillStyle = "#000";
		ctx.arc(options.center.x,options.center.y,options.radius,360,0);
		ctx.stroke();
		ctx.closePath();
		drawMainTicks();
		bufferClearClock = ctx.getImageData(0,0,canvas.width,canvas.height);
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
		ctx.moveTo(options.center.x,options.center.y);
		ctx.lineTo(position.min.x,position.min.y);
		ctx.scale(3,3);
		ctx.stroke();
		ctx.restore();
	};

	var drawHours = function () {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(options.center.x,options.center.y);
		ctx.lineTo(position.hrs.x,position.hrs.y);
		ctx.scale(options.scale.x * 6, options.scale.y * 6);
		ctx.stroke();
		ctx.restore();
	};

	var update = function() {
		if(buffer)
			ctx.putImageData(buffer,0,0);
		position.update();
	  if(time.s == 0){
	  	ctx.putImageData(bufferClearClock,0,0);
	  	drawMinutes();
	  	drawHours();
	  	buffer = ctx.getImageData(0,0,canvas.width,canvas.height);
	  }
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
		setInterval(update,1000);
	};

	//public methods
	this.init = initialize;
}