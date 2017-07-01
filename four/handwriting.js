var canvasWidth = Math.min(800,$(window).width() - 20);
var canvasHeight = canvasWidth ;

var strokeColor = "black";
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var isMousedown = false;
var lastloc = {x:0,y:0};
var lastTime = 0;
var lastLineWidth = -1;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width",canvasWidth+"px");

drawGrid();
$("#clear_btn").click(
	function(e) {
	context.clearRect(0,0,canvasWidth,canvasHeight);
	drawGrid();
    }
);
$(".color-btn").click(
	function(e) {
	$(".color-btn").removeClass('color-btn-selected');
	$(this).addClass('color-btn-selected');
	strokeColor = $(this).css("background-color");
    }
);

function beginstroke(point){

	isMousedown = true;
	lastloc = WindowToCanvas(point.x,point.y);
	lastTime = new Date().getTime();
}

function endstroke(){
	isMousedown = false;
}

function movestroke(point){
	var curloc = WindowToCanvas(point.x,point.y);
		var curTime = new Date().getTime();
		var s = calcDistance(curloc,lastloc);
		var t = curTime - lastTime;

		//draw
				
		context.beginPath();
        
        var lineWidth = calcLineWidth(t,s);

		context.moveTo(lastloc.x,lastloc.y);
		context.lineTo(curloc.x,curloc.y);

		context.strokeStyle = strokeColor;
		context.lineWidth = lineWidth;
		context.lineCap = "round";
		context.linejoin = "round";

		context.stroke();

		lastloc = curloc;
		lastTime = curTime;
		lastLineWidth = lineWidth;
}

canvas.onmousedown = function(e){
	e.preventDefault();
	beginstroke({x:e.clientX,y:e.clientY});
}

canvas.onmouseup = function(e){
	e.preventDefault();
	endstroke();
}

canvas.onmouseout = function(e){
	e.preventDefault();
	endstroke();
}

canvas.onmousemove = function(e){
	e.preventDefault();
	if(isMousedown){
        movestroke({x:e.clientX,y:e.clientY});		
	}
}

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch = e.touches[0];
	beginstroke({x:touch.pageX,y:touch.pageY});
})
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if(isMousedown){
		touch = e.touches[0];
        movestroke({x:e.clientX,y:e.clientY});		
	}
})
canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	endstroke();
})

function calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
}

function calcLineWidth(t,s){

	var v = s/t;

	var resultLineWidth;
	if(v<0.1)
	    {resultLineWidth = 30;}
	else if(v>10)
		{resultLineWidth = 1;}
	else 
		{resultLineWidth = 30 - (v - 0.1)/(10 - 0.1)*(30 - 1);}
    
    if(lastLineWidth == -1)
	    {return resultLineWidth}
	else
		{return lastLineWidth*2/3 + resultLineWidth*1/3}

}

function WindowToCanvas(x,y) {

    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x - bbox.left),y:Math.round(y - bbox.top)};
}

function drawGrid() {

	context.save();

	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth - 3,3);
	context.lineTo(canvasWidth -3,canvasHeight -3 );
	context.lineTo(3,canvasHeight -3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(canvasWidth ,canvasHeight );

	context.moveTo(0,canvasHeight );
	context.lineTo(canvasWidth ,0);

	context.moveTo(canvasWidth/2,0);
	context.lineTo(canvasWidth/2 ,canvasHeight);

	context.moveTo(0,canvasHeight/2);
	context.lineTo(canvasWidth ,canvasHeight/2);

	context.lineWidth = 1;
	context.stroke();

	context.restore();
}


