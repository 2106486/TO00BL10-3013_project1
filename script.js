//Initial References
const newitemInput = document.querySelector(`#new-item input`);
const itemsDiv = document.querySelector(`#items`);
const delimiter = `_`;
let items;
let deleteitems
let itemCount = 0;
let completedItemCount = 0;
let firstValidation = true;

// display items
displayItems = () => {
  if (Object.keys(localStorage).length = 0)
    itemsDiv.style.display = `none`;
  else
    itemsDiv.style.display = `inline-block`;
  let items = Object.keys(localStorage);
  items = items.sort();
  completedItemCount = 0;
  itemsDiv.innerHTML = ``;
  for (let key of items) {
    let value = localStorage.getItem(key);
    if (value == `true`) { completedItemCount += 1; }
    let itemInnerDiv = document.createElement(`div`);
    itemInnerDiv.classList.add(`item`);
    itemInnerDiv.setAttribute(`id`, key);
    itemInnerDiv.innerHTML = `<span id="itemname">${key.split(delimiter)[1]}</span>`;
    let deleteButton = document.createElement("button");
    deleteButton.classList.add(`delete`);
    deleteButton.innerHTML = `<p class="trash"></p>`;
    if (!JSON.parse(value))
      deleteButton.style.visibility = `visible`;
    else {
      deleteButton.style.visibility = `hidden`;
      itemInnerDiv.classList.add(`completed`);
    }
    itemInnerDiv.appendChild(deleteButton);
    itemsDiv.appendChild(itemInnerDiv);
  }
  // item stats
  let itemCountDiv = document.createElement(`div`);
  itemCountDiv.classList.add(`item-count`);
  itemCountDiv.setAttribute(`id`, `count`);
  itemCountDiv.textContent = itemCount == 0 ? `no items` : `${completedItemCount} out of ${itemCount} item${(itemCount > 1) ? `s` : ``} ${(completedItemCount > 1) ? `are` : `is`} completed.${itemCount == completedItemCount ? ` Great! All done!` : ``}`;
  itemsDiv.appendChild(itemCountDiv);
  items = document.querySelectorAll(`.item`);
  items.forEach((element, index) => {
    element.onclick = () => {
      if (element.classList.contains(`completed`))
        upsertItem(element.id.split(delimiter)[0], element.innerText, false);
      else
        upsertItem(element.id.split(delimiter)[0], element.innerText, true);
    };
  });

  // event listeners
  deleteitems = document.getElementsByClassName(`delete`);
  Array.from(deleteitems).forEach((element, i) => {
    element.addEventListener(`click`, (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeItem(parent.id);
      parent.remove();
      itemCount -= 1;
    });
  });
};

// input validation
validateInput = () => {
  isValidInput = newitemInput.value.length >= 2 && /^([a-zA-Z].*)$/.test(newitemInput.value);
  document.getElementById(`add`).disabled = !isValidInput;
  if (firstValidation)
    document.getElementById(`new-item-validation`).textContent = ``;
  else
    if (isValidInput)
      document.getElementById(`new-item-validation`).textContent = `It looks better :)`;
    else
      document.getElementById(`new-item-validation`).textContent = `Please use at least 3 characters and start with a letter`;
  document.getElementById(`add`).disabled = !isValidInput;
};

// upsert item
upsertItem = (timeStamp, itemValue, completed) => {
  localStorage.setItem(`${timeStamp}${delimiter}${itemValue}`, completed);
  displayItems();
};

// remove existing item
removeItem = (itemValue) => {
  localStorage.removeItem(itemValue);
  displayItems();
};

// event listeners
document.querySelector(`#add`).addEventListener(`click`, () => {
  upsertItem(new Date().getTime(), newitemInput.value, false);
  itemCount += 1;
  newitemInput.value = ``;
  document.getElementById(`new-item-validation`).textContent = ""
});

document.querySelector(`input`).addEventListener(`input`, () => {
  validateInput();
});

document.querySelector(`input`).addEventListener(`keypress`, function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById(`add`).click();
  }
});

document.querySelector(`#clearall`).addEventListener(`click`, () => {
  let ansewer = prompt(`Type "yes" if you would like to clear the item list`, `no way!`);
  if (ansewer.toLowerCase() == `yes`) {
    localStorage.clear();
    itemCount = 0;
    displayItems();
  }
});

// onload
window.onload = () => {
  itemCount = Object.keys(localStorage).length;
  displayItems();
  validateInput();
  firstValidation = false;
};