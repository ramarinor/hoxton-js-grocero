const storeItemList = document.querySelector(".store--item-list");
const cartItemList = document.querySelector(".cart--item-list");
const totalNumberSpan = document.querySelector(".total-number");
const storeForm = document.querySelector(".store--form");
const state = {
	storeItems: [],
	cart: [],
	filter: "all",
	sortBy: "default"
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
async function addToCart(item) {
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
		await fetch("http://localhost:3000/cart", {
			method: "POST",
			body: JSON.stringify(newCartItem),
			headers: { "Content-Type": "application/json" }
		});
	} else {
		itemFound.quantity++;
		await fetch("http://localhost:3000/cart/" + item.id, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				quantity: itemFound.quantity
			})
		});
	}
	updateState();
}

async function removeFromCart(item) {
	const itemFound = state.cart.find(function (cartItem) {
		return cartItem.name === item.name;
	});
	itemFound.quantity--;
	await fetch("http://localhost:3000/cart/" + item.id, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			quantity: itemFound.quantity
		})
	});

	if (itemFound.quantity === 0) {
		await fetch("http://localhost:3000/cart/" + item.id, {
			method: "DELETE"
		});
	}
}

function sortStoreItems() {
	state.sortBy = storeForm.sort.value;
	switch (state.sortBy) {
		case "alphabetAsc":
			sortAlphabetAsc();
			break;
		case "alphabetDesc":
			sortAlphabetDesc();
			break;
		case "priceAsc":
			sortPriceAsc();
			break;
		case "priceDesc":
			sortPriceDesc();
			break;

		default:
			sortDefault();
			break;
	}
}
function sortAlphabetAsc() {
	state.storeItems.sort(function (firstItem, secondItem) {
		if (firstItem.name > secondItem.name) {
			return 1;
		}
		if (firstItem.name < secondItem.name) {
			return -1;
		}
		return 0;
	});
}
function sortAlphabetDesc() {
	state.storeItems.sort(function (firstItem, secondItem) {
		if (firstItem.name > secondItem.name) {
			return -1;
		}
		if (firstItem.name < secondItem.name) {
			return 1;
		}
		return 0;
	});
}

function sortPriceAsc() {
	state.storeItems.sort(function (firstItem, secondItem) {
		return firstItem.price - secondItem.price;
	});
}

function sortPriceDesc() {
	state.storeItems.sort(function (firstItem, secondItem) {
		return secondItem.price - firstItem.price;
	});
}
function sortDefault() {
	state.storeItems.sort(function (firstItem, secondItem) {
		return firstItem.id - secondItem.id;
	});
}

//render
function renderStoreItems() {
	storeItemList.innerHTML = "";
	const selectedStoreItems = getSelecetedStoreItems();
	sortStoreItems();
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
			updateState();
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
			updateState();
		});

		const spanEl = document.createElement("span");
		spanEl.className = "quantity-text center";
		spanEl.innerText = item.quantity;

		const plusBtnEl = document.createElement("button");
		plusBtnEl.className = "quantity-btn add-btn center";
		plusBtnEl.innerText = "+";
		plusBtnEl.addEventListener("click", function () {
			addToCart(item);
			updateState();
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

async function updateState() {
	const storeItemsRes = await fetch("http://localhost:3000/storeItems");
	const storeItems = await storeItemsRes.json();
	state.storeItems = storeItems;
	const cartRes = await fetch("http://localhost:3000/cart");
	const cart = await cartRes.json();
	state.cart = cart;
	render();
}

window.addEventListener("DOMContentLoaded", () => {
	updateState();
});

storeForm.filter.addEventListener("change", function () {
	state.filter = storeForm.filter.value;
	updateState();
});

storeForm.sort.addEventListener("change", function () {
	updateState();
});
