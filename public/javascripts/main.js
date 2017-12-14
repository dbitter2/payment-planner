var app = angular.module("main", []);

app.controller("main", function ($scope) {
	$scope.cards = [];
	$scope.budget = 1;
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			var userId = user.uid;
			var database = firebase.database();
			var budget = 1;
			var cards = [];
			database.ref("users/" + userId).once("value").then(function(snapshot) {
				if(snapshot.val()) {
					if(snapshot.val().cards) {
						$scope.cards = snapshot.val().cards;
					}
					if(snapshot.val().budget) {
						$scope.budget = snapshot.val().budget;
					}
					$scope.$apply();
				}
			});
		}
	});

	$scope.newCard = function () {
		card = {
			name: "",
			balance: undefined,
			interest: undefined,
			minimum: undefined,
			monthly: undefined,
			paidBy: undefined
		};
		$scope.cards.push(card);
	};

	$scope.update = function() {
		update($scope);
	};
});

app.directive("creditcard", function () {
	return {
		scope: {
			card: "=",
			cards: "=",
			budget: "="
		},
		restrict: "E",
		replace: "true",
		template: (
			"<div>" +
				"<div class='label-input-pair'>" +
					"<label for='name'>Name</label>" +
					"<input ng-model='card.name' ng-change='update()' ng-model-options='{debounce:800}' type='text' name='name' id='name'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='balance'>Balance</label>" +
					"<input ng-model='card.balance' ng-change='update()' ng-model-options='{debounce:800}' min='1' type='number' name='balance' id='balance'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='interest'>Interest Rate</label>" +
					"<input ng-model='card.interest' ng-change='update()' ng-model-options='{debounce:800}' min='0' type='number' name='interest' id='interest'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='minimum'>Minimum Payment</label>" +
					"<input ng-model='card.minimum' ng-change='update()' ng-model-options='{debounce:800}' min='0' type='number' name='minimum' id='minimum'>" +
				"</div>" +
				"<br class='break'/>" +
				"<div class='label-input-pair'>" +
					"<label for='payment'>Monthly Payment</label>" +
					"<input ng-model='card.monthly' type='number' name='payment' id='payment'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='paid'>Paid Off By</label>" +
					"<input ng-model='card.paidBy' type='text' name='paid' id='paid'><br>" +
				"</div>" +
				"<img ng-click='delete(card)' src='assets/delete.png' class='delete'/>" +
				"<br class='break'/>" +
			"</div>"
  		),
  		link: link
	};

	function link(scope) {
		scope.delete = function (card) {
			var index = scope.cards.indexOf(card);
			if(index > -1) {
				scope.cards.splice(index, 1);
			}
			scope.update();
		};

		scope.update = function() {
			update(scope);
		};
	}
});

function update(scope) {
	if(validateCards(scope)) {
		if(scope.cards.length > 0) {
			sortCards(scope);
			updateMonthlies(scope);
			updatePayoffs(scope);
		}
		updateDatabase(scope);
	}
}

function sortCards(scope) {
	scope.cards.sort(function (a, b) {
		return b.interest - a.interest;
	});
}

function updateMonthlies(scope) {
	var tempBudget = scope.budget;
	scope.cards.forEach(function (card){
		if(tempBudget >= card.minimum) {
			card.monthly = card.minimum;
		} else if(tempBudget > 0) {
			card.monthly = tempBudget;
		} else {
			card.monthly = 0;
		}
		tempBudget -= card.monthly;
	});
	var first = scope.cards[0];
	first.monthly += tempBudget;
}

function updatePayoffs(scope) {
	var prevMonths = 0;
	var additionalMonthly = 0;
	console.log(prevMonths);
	console.log(additionalMonthly);
	scope.cards.forEach(function (card) {
		var tempBalance = balanceAfter(card, prevMonths);
		console.log(tempBalance);
		var tempMonthly = card.monthly + additionalMonthly;
		console.log(tempMonthly);
		var monthsToGo = monthsLeft(tempBalance, card.interest * 0.01, tempMonthly);
		console.log(monthsToGo);
		var paidOff = (prevMonths + monthsToGo).months().fromNow();
		card.paidBy = paidOff.toString("M/yyyy");
		prevMonths += monthsToGo;
		additionalMonthly += tempMonthly;
	});
}

function balanceAfter(card, prevMonths) {
	var tempBalance = card.balance;
	var interest = card.interest * 0.01;
	for(var i = 0; i < prevMonths; i++) {
		console.log(tempBalance);
		tempBalance = (tempBalance - card.monthly) * (1.0 + interest);
	}
	return tempBalance;
}

function monthsLeft(balance, interest, monthly) {
	var numerator = -1.0 * Math.log10(1.0 - ((interest * balance) / monthly));
	console.log(numerator);
	console.log(numerator);
	var denominator = Math.log10(1.0 + interest);
	var months = Math.ceil(numerator / denominator);
	return months;
}

function updateDatabase(scope) {
	var userId = firebase.auth().currentUser.uid;
	var database = firebase.database().ref("users/" + userId).set({
		cards: angular.copy(scope.cards),
		budget: scope.budget
	});
}

function validateCards(scope) {
	var valid = true;
	scope.cards.forEach(function (card) {
		if(!validateCard(card)) {
			valid = false;
		}
	});
	return valid;
}

function validateCard(card) {
	return card.balance !== undefined && card.interest !== undefined && card.minimum !== undefined;
}