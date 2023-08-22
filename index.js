let mySaves = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteAllBtn = document.getElementById("delete-all-btn")
const SavesFromLocalStorage = JSON.parse( localStorage.getItem("mySaves") )
const tabBtn = document.getElementById("tab-btn")

if (SavesFromLocalStorage) {
    mySaves = SavesFromLocalStorage
    render(mySaves)
    deleteFunctions()
}
inputBtn.addEventListener("click", function() {
    if (inputEl.value === null || inputEl.value.match(/^ *$/) !== null) {
        alert("Please Enter Something As a Note in the input field")
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            let save = {
                note: inputEl.value,
                url : tabs[0].url,
                id : generateRandomID()
            }
            inputEl.value = ""
            addSavestoLocalStorage(save)
            render(mySaves)
            deleteFunctions()
        })
    }

    
})
tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        let save = {
            note: shortenURL(tabs[0].title,60),
            url : tabs[0].url,
            id : generateRandomID()
        }
        addSavestoLocalStorage(save)
        render(mySaves)
        deleteFunctions()
    })
})



deleteAllBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    mySaves = []
    render(mySaves)
})



function render(Saves) {
    let listBtns = ""
    for (let i = 0; i < Saves.length; i++) {
        listBtns += `
            <li id=${Saves[i].id}>
                <a target='_blank' href='${Saves[i].url}' title='${Saves[i].url}'>
                    ${Saves[i].note }
                </a>
                <div class="confirmation-buttons">
                <button class="delete-btn" title="Delete this saved tab">✖</button>
                </div>
            </li>
        `
    }
    ulEl.innerHTML = listBtns
}

function addSavestoLocalStorage(obj) {
    let Obj = {note: obj.note, url: obj.url , id: obj.id}
    mySaves.push(Obj)
    localStorage.setItem("mySaves", JSON.stringify(mySaves) ) 
}

function deleteFunctions(){
    let deleteButtons = document.querySelectorAll('.delete-btn');

deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const listBtns = button.closest('div');
        const list = button.closest('li');
        const deleteConfirm = document.createElement('button');
        const deleteCancel = document.createElement('button');
        let Saves = JSON.parse(localStorage.getItem("mySaves"));

        deleteConfirm.classList.add('confirmation-btn');
        deleteConfirm.textContent = '✔';
        deleteConfirm.title = "Yes Delete it"
        deleteCancel.classList.add('confirmation-btn');
        deleteCancel.textContent = '✖';
        deleteCancel.title = "No I changed my mind"


        deleteConfirm.addEventListener('click', () => {
            listBtns.remove();
            list.remove();
            mySaves = removeObjectWithValue(mySaves, list.id);
            localStorage.setItem("mySaves", JSON.stringify(mySaves) ) 
        });

        deleteCancel.addEventListener('click', () => {
            deleteConfirm.remove();
            deleteCancel.remove();
            button.style.display = 'block';
        });

        listBtns.appendChild(deleteCancel);
        listBtns.appendChild(deleteConfirm);


        button.style.display = 'none';
        console.log(mySaves)
    });
});
}

function shortenURL(url, maxLength) {
    if (url.length <= maxLength) {
      return url;
    }
    
    const ellipsis = '....';
    const maxVisibleLength = maxLength - ellipsis.length;
    
    const start = url.substring(0, Math.floor(maxVisibleLength / 2));
    const end = url.substring(url.length - Math.floor(maxVisibleLength / 2));
    
    return start + ellipsis + end;
  }
  
function removeObjectWithValue(array, valueToRemove) {
    return array.filter(obj => {
        for (const key in obj) {
            if (obj[key] === valueToRemove) {
                return false; // Exclude this object from the filtered array
            }
        }
        return true; // Include all other objects
    });
}
function generateRandomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomID = '';
    
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    
    return randomID;
}