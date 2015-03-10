var $ = require('./jquery-1.11.0.min.js');



$(document).ready(function() {
	var xMark = '<div class="token"><div class="x-1"></div><div class="x-2"></div></div>';
	var oMark = '<div class="token"><div class="o"></div></div>';
	var turn = xMark; /* x goes first */
	var turnString = 'x'; /* string of length of representing whose turn it is */
	var winner = '_';
	var winCounts = {
		x: 0,
		o: 0,
		t: 0
	};

	var cpuString;
	if ($('#cpu-checkbox').is(':checked')) {
		cpuString = 'o';
	}
	else {
		cpuString = '-';
	}

	var grid = new Array(); /* stores where players go */

	var resetGrid = function() {
		for (var i = 0; i < 3; i++) {
			grid[i] = new Array();

			for (var j = 0; j < 3; j++) {
				grid[i][j] = i * 3 + j;
			}
		}
	};

	resetGrid();

	console.log('initial print of grid: ' + grid);
	console.log('Computer is playing ' + cpuString);

	var toggleTurn = function() {
		if (turn == xMark) {
			turn = oMark;
			turnString = 'o';
		}
		else {
			turn = xMark;
			turnString = 'x';
		}
	};

	var showTurn = function() {
		$('#turn-or-win').empty();
		$('#turn-or-win').append(turnString.toUpperCase() + '\'s turn<br>');
	};

	var setButtons = function(info) {
		$('#turn-or-win').empty();
		$('#x-count').empty();
		$('#o-count').empty();
		$('#t-count').empty();

		winCounts[info[0].toLowerCase()] += 1;
		if (info != 'Tie!') {
			info = info.toUpperCase() + ' wins!';
		}

		$('body').append('<div class="modal" style="opacity: 0; transform: translate(-50%, -50%) scale(0.8, 0.8)">' + info + '</div>');

		// Must be a timeout so that the opacity transition will happen
		setTimeout(function() {
			$('.modal').css('opacity', 1);
			$('.modal').css('transform', 'translate(-50%, -50%) scale(1, 1)');
		}, 50);

		$('.modal').on('click', function() {
			newGame();

			// $(this).css('opacity', 0);
			//
			// setTimeout(function() {
			// 	$(this).remove();
			//
			// 	newGame();
			// }, 900);
		});

		$('#turn-or-win').append(info + '<br>');
		$('#x-count').append(winCounts["x"]);
		$('#o-count').append(winCounts["o"]);
		$('#t-count').append(winCounts["t"]);
	};

	var checkForWinner = function() {
		for (var i = 0; i < 3; i++) {
			if (grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
				winner = grid[i][0];
				setButtons(winner);
				return;
			}

			if (grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]) {
				winner = grid[0][i];
				setButtons(winner);
				return;
			}
		}

		if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) {/* check diagonal that starts in top left */
			winner = grid[0][0];
			setButtons(winner);
			return;
		}

		if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) {/* check other diagonal */
			winner = grid[0][2];
			setButtons(winner);
			return;
		}

		var playedTiles = 0;/* will store how many tiles  have been played on */
		$('.board .tile').each(function() {
			if ($(this).children().length > 0) {
				playedTiles += 1;
			}
		});

		if (playedTiles == 9) {
			setButtons('Tie!');
		}
	};

	$('.board .tile').on('click', function() {
		if ($(this).children().length == 0 && winner == '_') {
			var num = $(this).attr('id'); /* stores the id of what is clicked */
			num = parseInt(num.substring(num.length - 1)); /* parses last character into int */

			var x = num % 3;
			var y = Math.floor(num / 3);

			grid[y][x] = turnString;
			$(this).append(turn);

			console.log(turnString + '\'s turn. clicked ' + num + '. grid: ' + grid);

			toggleTurn();
			showTurn();

			checkForWinner();

			goComputer();
		}
	});

	var newGame = function() {
		$('.modal').unbind('click');

		$('.modal').css('opacity', 0);
		$('.modal').css('transform', 'translate(-50%, -50%) scale(0.8, 0.8)');

		setTimeout(function() {
			$('.modal').remove();
		}, 500);

		$('.board .tile').empty();
		showTurn();
		winner = '_';
		resetGrid();

		goComputer();
	};

	$('#new-game').on('click', newGame);
	//$('.board .tile').on('dblclick', newGame);
	// ^ not needed, now there is new game from click modal

	var goComputer = function() {
		if (winner == "_" && cpuString == turnString) {
			var emptySpots = new Array();
			var x, y;
			var gridNum;

			for (var i = 0; i < 3; i++) {/* generate array of empty spots on grid */
				for (var j = 0; j < 3; j++) {
					if (grid[i][j] != 'x' && grid[i][j] != 'o') {
						emptySpots.push(new Array(j, i));/* x, y */
					}
				}
			}

			if (emptySpots.length > 8) {
				x = 2 * Math.round(Math.random());
				y = 2 * Math.round(Math.random());
			}
			else if (emptySpots.length > 7) {
				if (grid[1][1] != 'x' && grid[1][1] != 'o') {
					x = 1;
					y = 1;
				}
				else {
					x = 2 * Math.round(Math.random());
					y = 2 * Math.round(Math.random());
				}
			}
			else {
				var rand = Math.floor(Math.random() * emptySpots.length);

				x = emptySpots[rand][0];
				y = emptySpots[rand][1];
			}

			gridNum = x + 3 * y;

			grid[y][x] = turnString;
			// $('#tile' + gridNum).append(turn);

			setTimeout(function() {
				$('#tile' + gridNum).append(turn);

				console.log(turnString + '\'s turn (computer). picked ' + gridNum + '. grid: ' + grid);

				toggleTurn();
				showTurn();

				checkForWinner();
			}, 130);

			// console.log(turnString + '\'s turn (computer). picked ' + gridNum + '. grid: ' + grid);
			//
			// toggleTurn();
			// showTurn();
			//
			// checkForWinner();
		}
	};

	$('#cpu-checkbox').on('click', function() {
		if ($(this).is(':checked')) {
			cpuString = turnString;
			console.log('Computer is playing ' + cpuString);
			goComputer();
		}
		else {
			cpuString = "-";
			console.log('Computer player disabled');
		}
	});

	$(window).on('scroll', function() {
		//console.log($( window ).scrollTop());

		var scrollTop = $(window).scrollTop();

		var bottomText = document.getElementById('bottom-text');

		if (scrollTop > 0) {
			bottomText.style.opacity = 1;
		}
		else {
			bottomText.style.opacity = 0;
		}
	});

	// If there is no scroll bar, show the bottom text
	$(window).on('resize', function() {
		if ($(document).height() > $(window).height()) {
			document.getElementById('bottom-text').style.opacity = 1;
		}
	});
});
