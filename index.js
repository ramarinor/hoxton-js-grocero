/*

This is how an item object should look like

{
  id: 1, // <- the item id matches the icon name in the assets/icons folder
  name: "beetroot",
  price: 0.35 // <- You can come up with your own prices
}

*/
const storeItemList = document.querySelector(".store--item-list");

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
	cart: {}
};

//derived state

//actions

//render

//helper functions
function addZeros(number) {
	const str = "" + number;
	const pad = "000";
	return pad.substring(0, pad.length - str.length) + str;
}

{
	/* <li>
      <div class="store--item-icon">
        <img src="assets/icons/001-beetroot.svg" alt="beetroot" />
      </div>
      <button>Add to cart</button>
    </li> */
}

function renderStoreItems() {
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

		liEl.append(divEl, buttonEl);

		storeItemList.append(liEl);
	}
}

function render() {
	renderStoreItems();
}

//

render();
