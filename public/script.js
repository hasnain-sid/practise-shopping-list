const global = {
  currentPage: window.location.pathname,
  api: {
    // apiKey: '3fd2be6f0c70a2a598f084ddfb75487c',
    apiUrl: 'http://localhost:3000/',
  },
};
const params = window.location.search
// console.log(params);
const id = new URLSearchParams(params).get('id')
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterBtn = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



async function fetchAPIData(endpoint,mode,item,currItem) { 
  // const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  // const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  // showSpinner();
  
  // timeout = setTimeout(hideSpinner, 1000);
  // myFunction();
  

  // function alertFunc() {
  //   alert("Hello!");
  // }
  if(mode === 3)
  {
    // console.log("Hello!");
    var id = null;
    const res = await fetch(`${API_URL}${endpoint}`);
    const data = await res.json();
    // console.log(item);
    data.tasks.forEach((list) =>  {
      if(list.name === item)
      {
        // console.log(list._id); 
        id = list._id;
        // break;
      }
    });
    // console.log(id);
    const response = await fetch(`${API_URL}${endpoint}` + '/' + id, {
      // Adding method type
      method: "DELETE",

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    return;
  }
  else if(mode === 5)
  {
    // console.log("Hello!");
    var id = null;
    const res = await fetch(`${API_URL}${endpoint}`);
    const data = await res.json();
    // console.log(item);
    data.tasks.forEach(async (list) =>  {
       
      id = list._id;
      const response = await fetch(`${API_URL}${endpoint}` + '/' + id, {
      // Adding method type
      method: "DELETE",

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
      });
      
    });
    // console.log(id);
    
    return;
  }
  
  else if(mode === 4)
  {
    var id = null;
    const res = await fetch(`${API_URL}${endpoint}`);
    const data = await res.json();
    // console.log(item);
    data.tasks.forEach((list) =>  {
      if(list.name === item)
      {
        // console.log(list._id); 
        id = list._id;
        // break;
      }
    });
    // console.log(id);
    // id = '65be6222edb4804c6a1fd2c3';
    const response = await fetch(`${API_URL}${endpoint}` + '/' + id, {
      // Adding method type
      method: "PATCH",
      body: JSON.stringify({name:currItem}),
      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    return;
  }
  else if(mode === 2)
  {
    // console.log(item);
    const response = await fetch(`${API_URL}${endpoint}`, {
     
    // Adding method type
    method: "POST",
     
    // Adding body or contents to send
    // body : {name:item},
    body: JSON.stringify({name:item}),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });
    const data = await response.json();
    return;
 
  }
  
  const response = await fetch(`${API_URL}${endpoint}`);
  const data = await response.json();
  // let timeout = setTimeout(hideSpinner, 400);
  return data;
} 


async function  displayItems() {
  // const itemsFromStorage = getItemsFromStorage();
  const itemsFromStorage = await fetchAPIData('api/v1/tasks');
  // console.log(itemsFromStorage.tasks);

  itemsFromStorage.tasks.forEach((item) => addItemToDOM(item.name));
  clearUI();
}
 

function filterItems(e)
{
  const text = e.target.value.toLowerCase(); 
  // console.log(text);
  const items = document.querySelectorAll('li');

  items.forEach(item =>{
    const itemName = item.firstChild.textContent.toLowerCase();
    if(itemName.indexOf(text) !== -1)
    {
      item.style.display = 'flex';
    }
    else{
      item.style.display = 'none';
    }
  });
  


}
function onClick(e)
{
  if(e.target.parentElement.classList.contains('remove-item'))
  {
    removeItem(e.target.parentElement.parentElement);
  }
  else if(e.target.parentElement.id === 'item-list')
  {
    setItemToEdit(e.target);
  }
  
    
}

function setItemToEdit(item){
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => {i.classList.remove('edit-mode');});
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"> </i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

async function removeItem(e)
{
  // console.log(text);
  if(confirm('Are you sure?'))
  {
    const req = e.id;
    e.remove();
    const itemsFromStorage = await fetchAPIData(`api/v1/tasks`,3,req);
    // console.log(text.textContent);

    // const items = document.querySelectorAll('li');

    // items.forEach(item =>{
    // const itemName = item.firstChild.textContent.toLowerCase();
    // const givenName = text.textContent.toLowerCase();
    // if(itemName === givenName)
    // {
    //   const id = el.parentElement.dataset.id
    //   item.remove();
    }
          
    // });
  


    // clearUI();
    // removeItemFromStorage(text.textContent);
    
    // displayItems();

  
  
  
}

function removeItemFromStorage(e)
{
  // console.log(e);
  let itemsFromStorage = getItemsFromStorage();
  
  // Filterout Elemets to be removed
  itemsFromStorage = itemsFromStorage.filter((item) => item.toLowerCase() !== e.toLowerCase());
  // displayItems();
  // Re-Set to local storage
  localStorage.setItem('items',JSON.stringify(itemsFromStorage));

}


function onAddItemSubmit(e) {
  e.preventDefault();
 
  // validate input
  const value = itemInput.value;
  if(value === '')
  {
    alert("Please add an item");
    return;  
  }
  // check for edit mode
  var f = 0,updateTaskName;
  if(isEditMode)
  {
    const itemToEdit = itemList.querySelector('.edit-mode');
    f = 1;
    updateTaskName = itemToEdit.textContent;
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false; 
    // return;

  }
  else
  {
    if(checkItemAlreadyExists(value))
    {
      alert("Item already exists!");
      return;
    }
  }
  console.log(updateTaskName,value);
  addItemToDOM(value);
  if(f == 1)
    updateTask(updateTaskName,value);
  else
    addItemToStorage(value);
  clearUI();
}


function addItemToDOM(val)
{
  // create list of items
  const li = document.createElement("li");
  
  const neww = document.createTextNode(val);
  li.setAttribute("id", val);
  li.appendChild(neww);
  // console.log(li);
  // neww.setAttribute.value = val;
  // console.log(neww);
  const buttons = createButton('remove-item btn-link text-red');

  li.appendChild(buttons);
  itemList.appendChild(li);

  clearUI();

  itemInput.value = '';
}


async function updateTask(prevItem,currItem) {
  const itemsFromStorage = await fetchAPIData('api/v1/tasks',4,prevItem,currItem);
}


async function addItemToStorage(item)
{
  const itemsFromStorage = await fetchAPIData('api/v1/tasks',2,item);
  // const itemsFromStorage = getItemsFromStorage();

  

  // itemsFromStorage.push(item);
  // localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function getItemsFromStorage()
{
  let itemsFromStorage;

  if(localStorage.getItem('items') === null)
  {
    itemsFromStorage = [];
  }
  else
  {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}
function clearUI()
{
  itemInput.value = '';
  const items = document.querySelectorAll('li');
  if(items.length === 0)
  {
    clearBtn.style.display = 'none';
    filterBtn.style.display = 'none';
  }
  else{
    clearBtn.style.display = 'block';
    filterBtn.style.display = 'block';

  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"> </i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;

}
function createButton(classes)
{
  const buttons = document.createElement('button');
  buttons.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  buttons.appendChild(icon);
  return buttons;
}

function createIcon(classes)
{
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function checkItemAlreadyExists(item)
{
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item.toLowerCase());
}

async function clearItems(e)
{
  // itemList.remove();
  fetchAPIData('api/v1/tasks',5)
  while(itemList.firstChild)
  {
    itemList.removeChild(itemList.firstChild);
  }
  clearUI();

  

}

function init()
{
    // EventListener

    itemForm.addEventListener('submit',onAddItemSubmit);
    itemList.addEventListener('click',onClick);
    clearBtn.addEventListener('click',clearItems);
    filterBtn.addEventListener('input',filterItems);
    document.addEventListener('DOMContentLoaded',displayItems);
    clearUI();
}

init();
