const storeItemList = document.querySelector(".store--item-list");
const cartItemList = document.querySelector(".cart--item-list");
const totalNumberSpan = document.querySelector(".total-number");
const storeForm = document.querySelector(".store--form");
state = {
	storeItems: [
		{ id: 1, name: "beetroot", price: 0.4, type: "vegetable" },
		{ id: 2, name: "carrot", price: 0.3, type: "vegetable" },
		{ id: 3, name: "apple", price: 0.7, type: "fruit" },
		{ id: 4, name: "apricot", price: 0.9, type: "fruit" },
		{ id: 5, name: "avocado", price: 3.5, type: "fruit" },
		{ id: 6, name: "bananas", price: 1.0, type: "fruit" },
		{ id: 7, name: "bell-pepper", price: 0.5, type: "vegetable" },
		{ id: 8, name: "berry", price: 1.4, type: "fruit" },
		{ id: 9, name: "blueberry", price: 1.5, type: "fruit" },
		{ id: 10, name: "eggplant", price: 0.5, type: "vegetable" }
	],
	cart: [],
	filter: "all"
};

//derived state
function calculateTotal() {
	let total = 0;
	for (const item of state.cart) {
		total = total + item.price * item.quantity;
	}
	return total.toFixed(2);
}

function getSelecetedStoreItems() {
	if (state.filter === "all") {
		return state.storeItems;
	} else {
		return state.storeItems.filter(function (storeItem) {
			return storeItem.type === state.filter;
		});
	}
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

function removeFromCart(item) {
	const itemFound = state.cart.find(function (cartItem) {
		return cartItem.name === item.name;
	});
	itemFound.quantity--;
	if (itemFound.quantity === 0) {
		state.cart = state.cart.filter(function (cartItem) {
			return cartItem.quantity > 0;
		});
	}
}

//render
function renderStoreItems() {
	storeItemList.innerHTML = "";
	const selectedStoreItems = getSelecetedStoreItems();
	for (const item of selectedStoreItems) {
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
		minusBtnEl.addEventListener("click", function () {
			removeFromCart(item);
			render();
		});

		const spanEl = document.createElement("span");
		spanEl.className = "quantity-text center";
		spanEl.innerText = item.quantity;

		const plusBtnEl = document.createElement("button");
		plusBtnEl.className = "quantity-btn add-btn center";
		plusBtnEl.innerText = "+";
		plusBtnEl.addEventListener("click", function () {
			addToCart(item), render();
		});

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
storeForm.filter.addEventListener("change", function () {
	state.filter = storeForm.filter.value;
	render();
});
