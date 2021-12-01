const storeItemList = document.querySelector(".store--item-list");
const cartItemList = document.querySelector(".cart--item-list");
const totalNumberSpan = document.querySelector(".total-number");
state = {
	storeItems: [
		{ id: 1, name: "beetroot", price: 0.4 },
		{ id: 2, name: "carrot", price: 0.3 },
		{ id: 3, name: "apple", price: 0.7 },
		{ id: 4, name: "apricot", price: 0.9 },
		{ id: 5, name: "avocado", price: 3.5 },
		{ id: 6, name: "bananas", price: 1.0 },
		{ id: 7, name: "bell-pepper", price: 0.5 },
		{ id: 8, name: "berry", price: 1.4 },
		{ id: 9, name: "blueberry", price: 1.5 },
		{ id: 10, name: "eggplant", price: 0.5 }
	],
	cart: []
};

//derived state
function calculateTotal() {
	let total = 0;
	if (state.cart.length > 0) {
		for (const item of state.cart) {
			total = total + item.price * item.quantity;
		}
	}
	return total.toFixed(2);
}

//helper functions
function addZeros(number) {
	const str = "" + number;
	const pad = "000";
	return pad.substring(0, pad.length - str.length) + str;
}

//actions
function addToCart(item) {
	const itemFound = state.cart.find(function (cartItem) {
		return cartItem.name === item.name;
	});
	if (itemFound === undefined) {
		const newCartItem = {
			id: item.id,
			name: item.name,
			price: item.price,
			quantity: 1
		};
		state.cart.push(newCartItem);
	} else {
		itemFound.quantity++;
	}
}

//render
function renderStoreItems() {
	storeItemList.innerHTML = "";
	for (const item of state.storeItems) {
		const liEl = document.createElement("li");

		const divEl = document.createElement("div");
		divEl.className = "store--item-icon";

		const imgEl = document.createElement("img");
		imgEl.alt = item.name;
		imgEl.src = `assets/icons/${addZeros(item.id)}-${item.name}.svg`;

		divEl.append(imgEl);

		const buttonEl = document.createElement("button");
		buttonEl.innerText = "Add to cart";
		buttonEl.addEventListener("click", function () {
			addToCart(item);
			render();
		});

		liEl.append(divEl, buttonEl);

		storeItemList.append(liEl);
	}
}

function renderCartItems() {
	cartItemList.innerHTML = "";
	for (const item of state.cart) {
		const liEl = document.createElement("li");

		const imgEl = document.createElement("img");
		imgEl.className = "cart--item-icon";
		imgEl.src = `assets/icons/${addZeros(item.id)}-${item.name}.svg`;
		imgEl.alt = item.name;

		const pEl = document.createElement("p");
		pEl.innerText = item.name;

		const minusBtnEl = document.createElement("button");
		minusBtnEl.className = "quantity-btn remove-btn center";
		minusBtnEl.innerText = "-";

		const spanEl = document.createElement("span");
		spanEl.className = "quantity-text center";
		spanEl.innerText = item.quantity;

		const plusBtnEl = document.createElement("button");
		plusBtnEl.className = "quantity-btn add-btn center";
		plusBtnEl.innerText = "+";

		liEl.append(imgEl, pEl, minusBtnEl, spanEl, plusBtnEl);

		cartItemList.append(liEl);
	}
}

function renderTotal() {
	totalNumberSpan.innerText = `£${calculateTotal()}`;
}

function render() {
	renderStoreItems();
	renderCartItems();
	renderTotal();
}

//

render();
