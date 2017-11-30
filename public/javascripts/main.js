$(document).ready(function(){
	$("#new-card").click(newCard);
	$(".delete").click(function () {
		$(this).parent().remove();
	});
});

function newCard() {
	var lastCard = $("#cards").children().last();
	var lastId = -1;
	try {
		lastId = parseInt(lastCard.attr("id").match(/\d+/)[0]);
	} catch (e) {}
	var newId = "card" + (lastId + 1);
	var sectionHtml = $.parseHTML(
		'<section id="' + newId + '">\
			<div class="label-input-pair">\
				<label for="name">Card Name</label>\
				<input type="text" name="name" id="name">\
			</div>\
			<div class="label-input-pair">\
				<label for="interest">Interest Percentage</label>\
				<input type="text" name="interest" id="interest">\
			</div>\
			<div class="label-input-pair">\
				<label for="ammount">Amount Due</label>\
				<input type="text" name="ammount" id="ammount">\
			</div>\
			<br class="break"/>\
			<div class="label-input-pair">\
				<label for="payment">Monthly Payment</label>\
				<input type="text" name="payment" id="payment">\
			</div>\
			<div class="label-input-pair">\
				<label for="paid">Paid Off By</label>\
				<input type="text" name="paid" id="paid"><br>\
			</div>\
			<img src="../assets/delete.png" class="delete"/>\
			<br class="break"/>\
		</section>'
	)[0];
	$("#cards").append(sectionHtml);
	$(".delete").click(function () {
		console.log("clicked");
		$(this).parent().remove();
	});
}