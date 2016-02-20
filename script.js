
var player = {}; //stores player reserves //used to change players, check if <=6
var playerTurn = 1;

setPlayers();  //calls setPlayers() function
startPlay(); //added to test jquery
// $('.h1').html(countryData.currentCountry.army) //this is how we'll change CSS to reflect json
// var blah = $.getJSON('countries.js').countries //variable to get data from json, doesn't seem necessary
function changePlay(){ //changes player, checks for player.length, calls initPop()
	playerTurn++;
	if (playerTurn > Object.keys(player).length) {
		playerTurn = 1;
	}
	console.log(playerTurn);
	startPlay();
}
// set number of players (2-6), distributes armies to players which allows initpop to work
function setPlayers() {
    var playNum = prompt("Please select number of players (2-6)");
	if (playNum == '2') {
		for (var i = 1; i <= parseInt(playNum); i++) {
			var playerName = 'player' + i;
			player[playerName] = {};
			player[playerName].reserve = 25;
			player[playerName].owner = [];
		}
	} else if (playNum === '3') {
		for (var i = 1; i <= parseInt(playNum); i++) {
			var playerName = 'player' + i;
			player[playerName] = {};
			player[playerName].reserve = 20;
			player[playerName].owner = [];
		}
	} else if (playNum === '4') {
		for (var i = 1; i <= parseInt(playNum); i++) {
			var playerName = 'player' + i;
			player[playerName] = {};
			player[playerName].reserve = 15;
			player[playerName].owner = [];
		}
	} else if (playNum === '5') {
		for (var i = 1; i <= parseInt(playNum); i++) {
			var playerName = 'player' + i;
			player[playerName] = {};
			player[playerName].reserve = 10;
			player[playerName].owner = [];
		}
	} else if (playNum === '6') {
		for (var i = 1; i <= parseInt(playNum); i++) {
			var playerName = 'player' + i;
			player[playerName] = {};
			player[playerName].reserve = 15;
			player[playerName].owner = [];
		}
	} else {
		setPlayers();
	}
}
function startPlay(){
	$('#status').html("Player" + playerTurn + " place an army on an open country!");
	initPop();
}


function initPop(){ //populate empty countries, declare winner
	var fullCountries = false;
	var oneIsEmpty = false;
	$('.countries').each(function(index, value){
		if ($(value).text() == '0'){ //if i want to compare to text, parseInt function call
			fullCountries = false;
			oneIsEmpty = true;
		} else {
			fullCountries = true;
		}
	});

	if (oneIsEmpty) {
		checkPlayReserveFree();
	}

	if (fullCountries) {
		console.log('Shawn said so')
		$('#status').text("Player" + playerTurn + " place your remaining armies!");
		regPop();
	}
}

function checkPlayReserveFree()	{
	$('.countries').unbind();
	if (player['player' + playerTurn].reserve > 0) { //current player has reserve
		$('.countries').each(function(index, value){
			if ($(value).text() == '0') {
				$(value).click(function() {
					addArmyFree($(value))
				}); //add click event listener to +armies
			} //do nothing if value isn't 0
		});
	} else {
		$('#status').text("Player" + playerTurn + " place your remaining armies!")
		changePlay();//if Player doesn't have reserves, others must, change player
	} 
} 

function playColor(countrycol){
	if (player['player' + playerTurn] == player['player1']) {
		countrycol.css('background-color', '#00ff00'); //neon green
	} else if (player['player' + playerTurn] == player['player2']) {
		countrycol.css('background-color', '#FF00FF '); //neon pink
	} else if (player['player' + playerTurn] == player['player3']) {
		countrycol.css('background-color', '#993CF3'); //neon purple
	} else if (player['player' + playerTurn] == player['player4']) {
		countrycol.css('background-color', '#4D4DFF'); //neon blue
	} else if (player['player' + playerTurn] == player['player5']) {
		countrycol.css('background-color', '#FF4105 '); //neon orange
	} else if (player['player' + playerTurn] == player['player6']) {
		countrycol.css('background-color', '#FE0001'); //neon red
	}
}

function addArmyFree(country) {
	var armyAmount = parseInt(country.text());
	armyAmount += 1;
	country.text(armyAmount); //clicked country adds one army
	// functioncountry.css(background-color)
	player['player' + playerTurn].reserve-- //remove one from reserve
	console.log('Player' + playerTurn, player['player' + playerTurn].reserve);
	player['player' + playerTurn].owner.push(country.attr('id')); //sets owner to current player
	// country.css('background-color', 'red'); //this worksworks
	playColor(country);
	if (player['player' + playerTurn].owner.length == 42) { //checks for winner
		alert (player[playerName] + "wins!") //sam's fancy alerts
	} 
	changePlay();
}
			
function regPop() {	//all countries have >0 armies, moving on to regular population
	var reserveSum = 0
	for(var person in player){
		reserveSum += player[person].reserve
	}
	if (reserveSum > 0) { //looping through player armies
			checkPlayReserveTaken();
	} else { //all reserves played, start attack phase
		$('.countries').unbind();
		$('#status').text('Player' + playerTurn + " choose country to attack from, or end your turn")
		declareAtt();
	}
}

function checkPlayReserveTaken() {	
	$('.countries').unbind();
	player['player' + playerTurn].owner.forEach(function(country){
		$('#' + country).click(function(){
			addArmyTaken($(this)[0]);
		});
	});
	$('#status').text("Player" + playerTurn + " place your remaining armies!") //wrong player
} 

function addArmyTaken(country) {
	var armyAmount = parseInt(country.innerHTML);
	armyAmount += 1;
	country.innerHTML = armyAmount; //clicked country adds one army
	player['player' + playerTurn].reserve--
	changePlay();
}



//ATTACKPHASE

var attackerCountry; //var for country offense

var defenserCountry; //variable for defense country

function declareAtt(){ //player clicks one of his own countries
	player['player' + playerTurn].owner.forEach(function(country) { //checks if player owns country
			$('#' + country).click(function(){
				attackCountry(country);
			});
	});
	//else do nothing (do i need to call the function again?)
}

function attackCountry(country) {
	if (attackerCountry === null && parseInt($('#' + country).text()) > 1) { //attacker country must have >1 army
		attackerCountry = country; //sets attackCountry to country clicked
		declareDefense(country);
	} else {
		attackerCountry = country;
		declareDefense(country);
	}
}

function declareDefense(country) {
	// if (country === attackerCountry) { //clears attack if it is own country
	// 	attackerCountry = null;
	// 	initPop();
	// if { // declares defense if it's null
		countries[country].borders.forEach(function(country) { //search json file,checks if clicked is within attackerCountry borders
			// blah.attackerCountry?
			//or just attackerCountry.borders?
			$('#' + country).click(function() {
				defendCountry(country);
			});
		});
	}
// }

function defendCountry(country) {
	defenserCountry = country; //sets defenseCountry to country clicked
	dice();
}

var attackRoll = []; //attack and defense roll to an array
var defenseRoll = [];
var attackDice = 0
var defenseDice = 0
//how many dice to roll
function dice() {
	attackDice = parseInt($('#' + attackerCountry).text() - 1);

	if (attackDice > 3) {
		attackDice = 3;
		} //assigns rolls equal to attacker armies - 1
	defenseDice = parseInt($('#' + defenserCountry).text()); //assigns rolls equal to defense armies
	if (defenseDice > 2) {
		defenseDice = 2;
	}
	console.log("success!");
	rollDice();
}

function rollDice() {
	console.log(attackDice)
	attackRoll = [];
	defenseRoll = [];
	for(var i = 0; i < attackDice; i++){
		diceRoll(attackRoll);
	}
	console.log(defenseDice)
	for(var z = 0; z < defenseDice; z++){
		diceRoll(defenseRoll);
	}
	sortRolls();
	compareRolls1();
	compareRolls2();
	checkDefense();
	clearAttack();
	initPop();
	//initpop?
}
// diceroll - need to push to attack/defense array
function diceRoll(playerRoll){
	playerRoll.push(Math.floor(Math.random()*6)+1);
}
function sortRolls(){
	attackRoll.sort(function(a, b){return b-a});
	defenseRoll.sort(function(a, b){return b-a});
	console.log(attackRoll);
	console.log(defenseRoll);
}

function compareRolls1(){
	if ((attackRoll[0] - defenseRoll[0]) > 0){ //attack dice win
		var defenseLoss = parseInt($('#' + defenserCountry).text()) - 1;
		$('#' + defenserCountry).text(defenseLoss); //remove defense army
		console.log(attackerCountry)
	} else { //defense dice win
		var attackerLoss = parseInt($('#' + attackerCountry).text()) - 1;
		$('#' + attackerCountry).text(attackerLoss);//remove attack army
	}
}

function compareRolls2(){
	if (defenseRoll[1]){
		if ((attackRoll[1] - defenseRoll[1]) > 0){ //attack dice win
			var defenseLoss = parseInt($('#' + defenserCountry).text()) - 1;
			$('#' + defenserCountry).text(defenseLoss); //remove defense army
			console.log(attackerCountry)
		} else { //defense dice win
			var attackerLoss = parseInt($('#' + attackerCountry).text()) - 1;
			$('#' + attackerCountry).text(attackerLoss);//remove attack army
		}
	}
}

function removeCountryFromOwner(country){
	var countryIndex;
	$.each(player, function(playerName, val){ //val is looping country array
		// if(val === 'owner'){ //searching for the player which owns the country
		if(val === country) {
			console.log(val.indexOf(country));
			// if(val.indexOf(country) > -1){ //find the index of the country
			countryIndex = val.indexOf(country); //store the index
			console.log(countryIndex);
			player.playerName.owner.splice(countryIndex, 1); //remove country after it's found
			return true;
		}
	});
}

function checkDefense(){
	var countryArmy = parseInt($('#' + defenserCountry).text());
	if (countryArmy <= 0) {//update numbers on map
		removeCountryFromOwner(defenserCountry);
		var addReserve = parseInt($('#' + attackerCountry).text());
		player['player' + playerTurn].reserve = addReserve;
		console.log(player['player' + playerTurn].reserve);
		$('#' + defenserCountry).text(0);
		$('#' + attackerCountry).text(0);
		removeCountryFromOwner(attackerCountry);
	} //should go back to initpop for place
}

function clearAttack(){
	attackerCountry = null;
	defenserCountry = null;
	$('.countries').unbind();
}
$('#button1').click(function(){
	if (player['player' + playerTurn].reserve == 0) {
		changePlay();
	}
});
//$('.countries').trigger('click');  POPULATES THE GAME QUICKLY
// not necessary TODOS:

// 
// show dice rolls

// somehow check if player countrols continent? //save for last



