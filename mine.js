const form = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const list = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filterInput = document.querySelector('#filter');
const addBtn = document.querySelector('.form-control .btn');

let sendSituation = false;
function onSubmit(e) {
  e.preventDefault();
  let inputValue = itemInput.value;

  if (inputValue === '') {
    alert('Input is empty');
    return;
  }

  let updating = wannaUpdate() ? true : false;

  if (updating) {
    document.querySelectorAll('.item').forEach((item) => {
      if (item.style.color === 'rgb(204, 204, 204)') {
        removeFromStorage(item.innerText);
        item.remove();
        sendSituation = false;

        addBtn.style.backgroundColor = '#333';
        addBtn.style.color = '#fff';
        addBtn.innerHTML = `
    <i class="fa-solid fa-plus"></i> Add Item
    `;
      }
    });
  }

  if (!updating) {
    let alreadyExist = false;
    document.querySelectorAll('li').forEach((li) => {
      li.innerText.toLowerCase() === inputValue.toLowerCase()
        ? (alreadyExist = true)
        : null;
    });

    if (alreadyExist) {
      alert('That item already exists!');
      alreadyExist = false;

      return;
    }
  }

  saveToStorage(inputValue);
  showItemsToDOM(inputValue);
  itemInput.value = '';
}

function showItemsToDOM(item) {
  const li = document.createElement('li');
  li.classList.add('item');

  const button = createButton('remove-item btn-link text-red');

  li.append(item, button);

  list.append(li);
  anyItem();
}

function createButton(btnClass) {
  const button = document.createElement('button');
  button.className = btnClass;

  const icon = createIcon('fa-solid fa-xmark');

  button.append(icon);

  return button;
}

function createIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = iconClass;

  return icon;
}

// remove Item
function removeItem(e) {
  if (e.target.classList.contains('fa-solid')) {
    if (confirm('Are You Sure?')) {
      removeFromStorage(e.target.closest('.item').innerText);
      e.target.closest('.item').remove();
      anyItem();
    }
  }
}

// remove All
function removeAll() {
  if (confirm('Are You Sure?')) {
    while (list.firstChild) {
      list.firstChild.remove();
    }

    localStorage.removeItem('items');

    anyItem();
  }
}

// Filter
function filterItem(e) {
  const filterText = filterInput.value.toLowerCase();
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    if (item.innerText.toLowerCase().includes(filterText)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Storage
function saveToStorage(itemName) {
  const itemsArr = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : [];
  itemsArr.push(itemName);

  localStorage.setItem('items', JSON.stringify(itemsArr));
}

function removeFromStorage(removeThis) {
  const items = JSON.parse(localStorage.getItem('items'));

  items.forEach((item, index) => {
    item === removeThis ? items.splice(index, 1) : null;
  });

  if (items.length === 0) {
    localStorage.removeItem('items');
    return;
  }

  localStorage.setItem('items', JSON.stringify(items));
}

function updateItem(e) {
  if (e.target.tagName === 'LI') {
    document
      .querySelectorAll('.item')
      .forEach((item) => (item.style.color = '#333'));

    e.target.style.color = '#ccc';

    itemInput.value = e.target.innerText;

    sendSituation = true;

    // Button Styling

    addBtn.style.backgroundColor = '#228b22';
    addBtn.style.color = 'white';
    addBtn.innerHTML = `
    <i class="fa-solid fa-pen"></i> Update Item
    `;
  }
}

function wannaUpdate() {
  return sendSituation;
}

function checkStorage() {
  if (localStorage.getItem('items')) {
    const savedItems = JSON.parse(localStorage.getItem('items'));

    savedItems.forEach((item) => showItemsToDOM(item));
  }
}

checkStorage();
function anyItem() {
  list.firstElementChild ? display('show') : display('hidden');
}

anyItem();

function display(reciveClass) {
  clearBtn.classList.remove('hidden', 'show');
  filterInput.classList.remove('hidden', 'show');
  clearBtn.classList.add(reciveClass);
  filterInput.classList.add(reciveClass);
}

form.addEventListener('submit', onSubmit);
list.addEventListener('click', removeItem);
list.addEventListener('click', updateItem);
clearBtn.addEventListener('click', removeAll);
filterInput.addEventListener('input', filterItem);
