var context;
var shape = new Object();
var monsters = [];
var monsters_images = [];
var moving_score = new Object();
var board;
var score = 0;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var database = [];
var active_user = "";
var life = 5;
var enemy_move_counter = 1;
var audio = new Audio('extensions/audio/sound.mp3');
var keypress;
// settings
var monsters_amount = 4; // 1-4
var game_time = 10; // minimum 60
var prize_amount = 10; // 50-90
var move_up = [38, "UpArrow"];
var move_down = [40, "DownArrow"];
var move_left = [37, "LeftArrow"];
var move_right = [39, "RightArrow"];
var prize_5 = "white"
var prize_15 = "green"
var prize_25 = "purple"
var direction = "right"


$(document).ready(function() {	
	var k = {username: "k", password:"k"}
	database.push(k)
	$("#signInButton").click(function(){
		document.getElementById("signInDiv").style.display = "initial"
		document.getElementById("signUpDiv").style.display = "none"
		$("#aboutDiv").hide();

	});
	$("#signUpButton").click(function(){
		document.getElementById("signUpDiv").style.display = "initial"
		document.getElementById("signInDiv").style.display = "none"
		$("#aboutDiv").hide();
	});
	$("#buttonOnSignIn").click(function(){
		SignInFunc();
	})
	$("#buttonOnSignUp").click(function(){
		SignUpFunc();
	})
	$("#playButton").click(function(){
		//$('#settingsDiv	').hide();
		ResetGame();
		$("#aboutDiv").hide();
		StartGame();
	})
	$("#signOutButton").click(function(){
		ResetGame();
		$('#settingsDiv	').hide();
		$("#aboutDiv").hide();
		audio.pause();
		audio.currentTime = 0;
		SignOutFunc();
	})
	$("#aboutButton").click(function(){
		ResetGame();
		$("#aboutDiv").show();
		$("#signUpDiv").hide();
		$("#signInDiv").hide();
		$('#settingsDiv	').hide();
		audio.pause();
		audio.currentTime = 0;
		$("#gameScope").hide();		
		$('#settingsDiv	').hide();

	})
	$("#settingsButton").click(function(){
		ResetGame();
		$("#aboutDiv").hide();
		document.body.style.setProperty("zoom", "100%");		
		audio.pause();
		audio.currentTime = 0;
		$("#gameScope").hide();
		$('#settingsDiv	').hide();

		$('#settingsDiv	').show();
	})

	$( "#upDirectionChoice" ).val(move_up[1].toString())
	$( "#downDirectionChoice" ).val(move_down[1].toString())
	$( "#leftDirectionChoice" ).val(move_left[1].toString())
	$( "#rightDirectionChoice" ).val(move_right[1].toString())

	$( "#upDirectionChoice" ).on( "keydown", function( event ) {
		$( "#upDirectionChoice" ).val(event.key)
		move_up = [event.keyCode, event.key]
    });

	$( "#downDirectionChoice" ).on( "keydown", function( event ) {
		$( "#downDirectionChoice" ).val(event.key)
		move_down = [event.keyCode, event.key]
    });

	$( "#leftDirectionChoice" ).on( "keydown", function( event ) {
		$( "#leftDirectionChoice" ).val(event.key)
		move_left = [event.keyCode, event.key]
    });

	$( "#rightDirectionChoice" ).on( "keydown", function( event ) {
		$( "#rightDirectionChoice" ).val(event.key)
		move_right = [event.keyCode, event.key]
    });

	$("#randomSettings").click(function(){
		RandomSettings();
	});
});


function SignOutFunc(){
	//location.reload();
	active_user = ""
	document.body.style.setProperty("zoom", "100%");
	$("#helloLabel").text('')	
	$('#signInButton').show();
	$('#signUpButton').show();
	$('#signOutButton').hide();
	$('#settingsButton').hide();
	$('#gameScope').hide()

	$('#playButton').hide();
}

function SignInFunc(){	
	let username = $("#userNameOnSignIn").val();
	let passwd = $("#passwdOnSignIn").val();
	if (database.find(db => db.username==username && db.password==passwd) != null){
		active_user = username
		$("#helloLabel").text('Hello ' + active_user + '!')	
		$("#userNameOnSignIn").val('')
		$("#passwdOnSignIn").val('')
		$("#signInDiv").hide();
		$('#signInButton').hide();
		$('#signUpButton').hide();
		$('#signOutButton').show();
		$('#settingsButton').show();
		$('#playButton').show();
		//StartGame();
	}
	else{
		alert("wrong password or username, please try again")
		$("#userNameOnSignIn").val('')
		$("#passwdOnSignIn").val('')		
	}
}

function SignUpFunc(){
	function isEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}
	let valid = $("#userNameOnSignUp").val() != '' 
		&& $("#passwdOnSignUp").val().length >= 6
		&& (/\d/.test($("#passwdOnSignUp").val())) 
		&& /[a-zA-Z]/g.test($("#passwdOnSignUp").val())
		&& !(/\d/.test($("#fullNameOnSignUp").val())) 
		&& isEmail($("#emailOnSignUp").val());
	if(!valid){
		alert("please check your details");		
	}
	else{
		database.push({username: $("#userNameOnSignUp").val(), password:$("#passwdOnSignUp").val()})		
		$("#signUpDiv").hide();		
		$("#signInDiv").show();		
		
	}

}

function RandomSettings(){
	(Math.random() *(6) + 1)
	$("#prizeAmountChoice").val((Math.round(Math.random() *(40) + 50)).toString())
	$("#timeAmountChoice").val((Math.round(Math.random() *(40) + 60)).toString())
	$("#monsterChoice").val((Math.round(Math.random() *(3) + 1)).toString())
	arr = ["white", "yellow", "orange", "blue", "purple", "green", "red"]
	first = Math.round(Math.random() *(6))
	$("#simplePriceChoice").val(arr[first])
	arr.splice(first, 1)

	second = Math.round(Math.random() *(5))
	$("#mediumPriceChoice").val(arr[second])
	arr.splice(second, 1)
	
	third = Math.round(Math.random() *(4))
	$("#bestPriceChoice").val(arr[third])		
}


function StartGame(){	
	if(active_user == null || active_user == '') {
		alert("you need to sign in first!");
		return;
	}
	$("#gameScope").show();
	$('#settingsDiv	').show();

	context = canvas.getContext("2d");
	Start();
}

function ResetMonsters(){		
	monsters = []
	// random monsters
	for (var k=0;k<monsters_amount;k++){
		let monster = new Object();
		let random = Math.random();
		if(random<0.25){
			monster.i = 0;
			monster.j = 0;
		}
		else if(random<0.5){
			monster.i = 0;
			monster.j = 9;
		}
		else if(random<0.75){
			monster.i = 9;
			monster.j = 0;
		}
		else {
			monster.i = 9;
			monster.j = 9;	
		}
		monsters.push(monster);
	}
}

function remap(){
	board = new Array();
	monsters = []	
	var cnt = 100;
	//var food_remain = 50;
	// food<price> = <amount>
	var food25 = Math.round(0.1 * prize_amount);
	var food15 = Math.round(0.3 * prize_amount);
	var food5 = Math.round(0.6 * prize_amount);
	var pacman_remain = 1;
	var wall1i = Math.round(Math.random() *(6) + 1)
	var wall1j = Math.round(Math.random() *(6) + 1)
	var wall2i = Math.round(Math.random() *(6) + 1)
	var wall2j = Math.round(Math.random() *(6) + 1)
	var wall3i = Math.round(Math.random() *(6) + 1)
	var wall3j = Math.round(Math.random() *(6) + 1)
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == wall1i && j == wall1j) ||				
				(i == wall1i+1 && j == wall1j) ||
				(i == wall1i+2 && j == wall1j) ||
				(i == wall2i && j == wall2j) ||
				(i == wall2i && j == wall2j+1) ||
				(i == wall3i && j == wall3j) ||
				(i == wall3i && j == wall3j+1) ||
				(i == wall3i && j == wall3j+2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * (food25+food15+food5)) / cnt) {
					var randomforfood = Math.random();
					if(randomforfood < (1.0 * (food25)) / (food25+food15+food5)){
						food25 -= 1
						board[i][j] = 25;
					}
					else if(randomforfood < (1.0 * (food25 + food15)) / (food25+food15+food5)){
						food15 -= 1
						board[i][j] = 15;
					}
					else{
						food5 -= 1
						board[i][j] = 5;
					}					
				} else if (randomNum < (1.0 * (pacman_remain + food25+food15+food5)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}		
	}
	// random monsters
	for (var k=0;k<monsters_amount;k++){
		let monster = new Object();
		let random = Math.random();
		if(random<0.25){
			monster.i = 0;
			monster.j = 0;
		}
		else if(random<0.5){
			monster.i = 0;
			monster.j = 9;
		}
		else if(random<0.75){
			monster.i = 9;
			monster.j = 0;
		}
		else {
			monster.i = 9;
			monster.j = 9;	
		}
		monsters.push(monster);
	}
	// random moving target
	var moving_cell = findRandomEmptyCell(board);
	moving_score.i = moving_cell[0];
	moving_score.j = moving_cell[1];
	// random place
	while (food25+food15+food5 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		var randomforfood = Math.random();
		if(randomforfood < (1.0 * (food25)) / (food25+food15+food5)){
			food25 -= 1
			board[emptyCell[0]][emptyCell[1]] = 25;
		}
		else if(randomforfood < (1.0 * (food25 + food15)) / (food25+food15+food5)){
			food15 -= 1
			board[emptyCell[0]][emptyCell[1]] = 15;
		}
		else{
			food5 -= 1
			board[emptyCell[0]][emptyCell[1]] = 5;
		}		
	}
	// medicine and clock
	var emptyMed = findRandomNotWallCell(board);
	var emptyClock = findRandomNotWallCell(board);
	board[emptyMed[0]][emptyMed[1]] = 100;
	board[emptyClock[0]][emptyClock[1]] = 200;

	keysDown = {};
}



function ApplySettings(){
	if(isNaN($("#prizeAmountChoice").val())){
		alert("Please insert a number for prize amount in settings!"); 
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	prize_amount = parseInt($("#prizeAmountChoice").val())
	if(prize_amount<50 || prize_amount>95){
		alert("Please check prize amount in settings, must be 50<amount<95.");
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	if(isNaN($("#timeAmountChoice").val())){
		alert("Please insert a number for time amount in settings!"); 
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	game_time = parseInt($("#timeAmountChoice").val())
	if(game_time<60){
		alert("Please insert a minimum of 60 as game time");
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	if(isNaN($("#monsterChoice").val())){
		alert("Please insert a number for monster amount in settings!"); 
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	monsters_amount = parseInt($("#monsterChoice").val())
	if(monsters_amount<1 || monsters_amount>4){
		alert("Please insert a valid monster amount (0<amount<5).");
		$("#gameScope").hide();
		$('#settingsDiv	').show();
		return false;
	}
	prize_5 = $("#simplePriceChoice").val();	
	prize_15 = $("#mediumPriceChoice").val();
	prize_25 = $("#bestPriceChoice").val();
	return true;
}

function Start() {	
	if(!ApplySettings()) return;
	document.body.style.setProperty("zoom", "65%");
	audio.play();
	moving_score = new Object();
	monsters_images = [];
	for(let l=0;l<monsters_amount;l++){
		let randomint = Math.round(Math.random() *(8) + 1);
		monsters_images.push("extensions/gamefigures/enemy"+ randomint.toString() + ".png");
	}
	remap();
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	try{clearInterval(interval);}catch{}
	interval = setInterval(UpdatePosition, 85);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function findRandomNotWallCell(){
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0 && board[i][j] != 5 && board[i][j] != 15 && board[i][j] != 25) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[move_up[0]]) { //up
		return 1; 
	}
	if (keysDown[move_down[0]]) { // down
		return 2;
	}
	if (keysDown[move_left[0]]) { //left
		return 3;
	}
	if (keysDown[move_right[0]]) { // right
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLife.value = life.toString() + " life left";
	// draw board	
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {			
				var img = new Image();
				img.src = "extensions/gamefigures/pacman" + direction +".png";					
				context.drawImage(img, center.x - 30, center.y-30)				
			} else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = prize_5; //color
				context.fill();
			}else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = prize_15; //color
				context.fill();
			}else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = prize_25; //color
				context.fill();			
			} else if (board[i][j] == 4) {
				var imgwall = new Image();
				imgwall.src = "extensions/wall.jpg";
				context.drawImage(imgwall, center.x - 30, center.y-30)				
				/*context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "white"; //color
				context.fill();*/
			}else if (board[i][j] == 100) {
				var imgwall = new Image();
				imgwall.src = "extensions/med.jpg";
				context.drawImage(imgwall, center.x - 30, center.y-30)				
				/*context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "white"; //color
				context.fill();*/
			}else if (board[i][j] == 200) {
				var imgwall = new Image();
				imgwall.src = "extensions/clock.jpg";
				context.drawImage(imgwall, center.x - 30, center.y-30)				
				/*context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "white"; //color
				context.fill();*/
			}
		}
	}
	// draw monsters
	for (let k=0;k<monsters_amount;k++){
		centerx = monsters[k].i * 60 + 30;
		centery = monsters[k].j * 60 + 30;
		var img2 = new Image();		
		img2.src = monsters_images[k];
		context.drawImage(img2, centerx - 30, centery-30)
	}
	// draw moving score
	if(moving_score!=null){
		let centerxmoving = moving_score.i *60 +30;
		let centerymoving = moving_score.j *60 +30;
		var img3 = new Image();
		img3.src = "extensions/gamefigures/moving.png"
		context.drawImage(img3, centerxmoving-30, centerymoving-30);
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			direction = "up"
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			direction = "down"
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			direction = "left"
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			direction = "right"
		}
	}
	if (board[shape.i][shape.j] == 5 || board[shape.i][shape.j] == 15 || board[shape.i][shape.j] == 25) {
		score+=board[shape.i][shape.j];
	}
	if (board[shape.i][shape.j] == 100) {
		life += 1;
		board[shape.i][shape.j] = 0;
	}
	if (board[shape.i][shape.j] == 200) {	
		start_time.setSeconds(start_time.getSeconds()+10)	;	
		board[shape.i][shape.j] = 0;
	}
	if(moving_score!=null && shape.i == moving_score.i && shape.j == moving_score.j){
		score+=50
		moving_score = null;
	}
	if(moving_score!=null){
		let random_move = Math.random();
		if(random_move<0.25 && board[moving_score.i+1][moving_score.j]!=4 && moving_score.i<9) 
			moving_score.i +=1;
		else if(random_move<0.5 && board[moving_score.i-1][moving_score.j]!=4 && moving_score.i>0) 
			moving_score.i -=1;
		else if(random_move<0.75 && board[moving_score.i][moving_score.j+1]!=4 && moving_score.j<9) 
			moving_score.j +=1;
		else if(board[moving_score.i][moving_score.j-1]!=4 && moving_score.j>1) 
			moving_score.j -=1;
	}

	for(let k=0;k<monsters_amount;k++){
		if(shape.i == monsters[k].i && shape.j == monsters[k].j){
			score -= 10;
			life -= 1;
			if (life == 0){
				ResetGame();
				window.alert("Loser!");												
			}
			ResetMonsters();
			return;		
		}
		if(enemy_move_counter > 0){
			 enemy_move_counter-=1;
			 continue;
		}
		enemy_move_counter = 8;
		if(shape.i > monsters[k].i && board[monsters[k].i+1][monsters[k].j] != 4){
			monsters[k].i+=1;
		}
		else if(shape.i < monsters[k].i && board[monsters[k].i-1][monsters[k].j] != 4){
			monsters[k].i-=1;
		}
		else if(shape.j > monsters[k].j && board[monsters[k].i][monsters[k].j+1] != 4){
			monsters[k].j+=1;
		}
		else if(shape.j < monsters[k].j && board[monsters[k].i][monsters[k].j-1] != 4){
			monsters[k].j-=1;
		}
	}	
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;	
	
	if(time_elapsed>=game_time){
		window.alert("You are better than " + score.toString() + " points!");
		ResetGame();
		return;
	}
	if (score >= 100) {
		ResetGame();
		window.alert("Winner!!!");
		return;
	} else {
		Draw();
	}
}
function ResetGame(){
	try{window.clearInterval(interval);} catch{}
	score = 0;
	life = 5;
	audio.pause();
	audio.currentTime = 0;
	document.getElementById("gameScope").style.display = "none"	
	$('#settingsDiv	').hide();

	document.body.style.setProperty("zoom", "100%");
	
}