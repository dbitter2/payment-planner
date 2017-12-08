var app = angular.module("main", []);

app.controller("main", function ($scope) {
	$scope.cards = [];
	$scope.budget = 0;

	$scope.newCard = function () {
		console.log($scope.budget);
		console.log($scope.cards);
		card = {
			name: "New Card",
			balance: undefined,
			interest: undefined,
			minimum: undefined,
			monthly: undefined,
			paidBy: undefined
		};
		$scope.cards.push(card);
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
					"<label for='name'>Card Name</label>" +
					"<input ng-model='card.name' type='text' name='name' id='name'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='balance'>Total Balance</label>" +
					"<input ng-model='card.balance' ng-change='update()' type='number' name='balance' id='balance'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='interest'>Interest Percentage</label>" +
					"<input ng-model='card.interest' ng-change='update()' type='number' name='interest' id='interest'>" +
				"</div>" +
				"<div class='label-input-pair'>" +
					"<label for='minimum'>Minimum Payment</label>" +
					"<input ng-model='card.minimum' ng-change='update()' type='number' name='minimum' id='minimum'>" +
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

		scope.update = function () {
			if(validateCards()) {
				scope.cards.sort(function (a, b) {
					return b.interest - a.interest;
				});
				console.log(scope.cards);
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
				scope.cards[0].monthly += tempBudget;
			} else {
				console.log("invalid cards");
			}
		};

		function validateCards() {
			var valid = true;
			scope.cards.forEach(function (card) {
				console.log(validateCard(card));
				if(!validateCard(card)) {
					valid = false;
				}
			});
			return valid;
		}

		function validateCard(card) {
			console.log(card);
			console.log(card.balance !== undefined && card.interest !== undefined && card.minimum !== undefined);
			return card.balance !== undefined && card.interest !== undefined && card.minimum !== undefined;
		}
	}
});