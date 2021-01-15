var model;
cocoSsd.load().then(
function(res){
model = res;
alert("Model is ready");
},
function(){
console.log("model did not load");
}

);

function invoke_upload_image()
{
    document.getElementById("upload-btn").click();
}


function upload_image(){

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var input_elem = document.querySelector("input[type=file]");
var file = input_elem.files[0];
const image = document.getElementById('img');
var reader = new FileReader();
reader.addEventListener(
"load",
function(){
    image.src = reader.result;
    setTimeout(function(){
        if(image.height > 500){
            image.width = image.height * (500/image.height);
            image.height = 500;
        }

       model.detect(image).then(function(predictions){
         
        draw_res(canvas, ctx, image, predictions);
       });
    },1000);
    
},false
);

if(file){
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    reader.readAsDataURL(file);
}

}

function draw_res(canvas, ctx, image, predictions){
canvas.height = image.height;
const font = "16px sans-serif";
canvas.width = image.width;
ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
ctx.drawImage(image,0,0,ctx.canvas.width, ctx.canvas.height);
ctx.font = font;
ctx.textBaseline = "top";
ctx.strokeStyle = "#00FFFF";
ctx.lineWidth = 3;
ctx.fillStyle = "#00FFFF";
draw_box(ctx, predictions, font);
draw_label(ctx, predictions);

}
// predictions = [{bbox: [10,20,300,500]}]
function draw_box(ctx, predictions, font) {
	console.log(predictions);
	predictions.forEach((prediction) => {
		// predictions = [{bbox: [10,20,300,500]}]
		const x = prediction.bbox[0];
		const y = prediction.bbox[1];
		const width = prediction.bbox[2];
		const height = prediction.bbox[3];
		ctx.strokeRect(x, y, width, height);
		const textWidth = ctx.measureText(prediction.class).width;
		const textHeight = parseInt(font, 10); // base 10
		ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
	});
}

function draw_label(ctx, predictions) {
	predictions.forEach((prediction) => {
		const x = prediction.bbox[0];
		const y = prediction.bbox[1];

		ctx.fillStyle = "#000000";
		ctx.fillText(prediction.class, x, y);
	});
}



