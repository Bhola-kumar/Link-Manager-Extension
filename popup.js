// auto matically fill the input fields of form
function fillFormWithCurrentLink() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      let activeTab = tabs[0];
      document.getElementById('link-name').value = activeTab.title;
      document.getElementById('link-url').value = activeTab.url;
    } else {
      alert('No active tab found.');
    }
  });

  let folderSelect = document.getElementById("folder-select");
  chrome.storage.sync.get(null, function (result) {
    Object.keys(result).forEach(function (key) {
      let option = document.createElement("option");
      if (result.hasOwnProperty(key) && typeof result[key] === 'object') {
        console.log(key + ": ");
        console.log(result[key]);
        option.value = key;
        option.text = key;
        folderSelect.add(option);
      }
    });
  });

  // deleteObjectFromStorage('custom');
}


window.addEventListener('load', fillFormWithCurrentLink);

// new folder banane ka css hai
// Get references to the necessary elements
const newButton = document.querySelector('.create-dir-btn');
const newFolderSection = document.getElementById('all-folder');

// Add event listener to the "New" button
newButton.addEventListener('click', toggleNewFolderSection);

// Set the initial state of the "New Folder" section
let isSectionVisible = false;

// Function to toggle the visibility of the "New Folder" section
function toggleNewFolderSection() {
  // Toggle the visibility state of the section
  isSectionVisible = !isSectionVisible;

  // Update the display property based on the visibility state
  newFolderSection.style.display = isSectionVisible ? 'block' : 'none';
}


let selectElement = document.getElementById("folder-select");
let inputElement = document.getElementById("new-folder-input");
let createButton = document.getElementById("create-dict");
let allFolder = document.getElementById("all-folder");
selectElement.addEventListener("change",function(){
  // if(selectElement.value === 'custom'){
  //   allFolder.style.display = "block";
  // }
  // else{
  //   allFolder.style.display = "none";
  // }
  if(isSectionVisible){
    toggleNewFolderSection();
  }
});
createButton.addEventListener("click", function() {
  let folderName = inputElement.value;
  if (folderName) {
    const newDict = {};
    newDict[folderName] = {};
    chrome.storage.sync.set(newDict, function() {
      // Callback function to handle saving success or error
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(`New empty dictionary '${folderName}' saved to Chrome Storage Sync.`);
        showToast(`'${folderName}' as a directory created`);
        let newOption = document.createElement("option");
        newOption.text = folderName;
        selectElement.add(newOption);
        newOption.selected = true;
        // allFolder.style.display = "none";
        toggleNewFolderSection();
      }
    });
    // Reset the input field
    inputElement.value = "";
  } else {
    showToast("Folder name empty!");
  }
});



// currently most updated version to save data
document.getElementById("submit-form").onclick = function () {
  let linkName = document.getElementById('link-name').value;
  let urlName = document.getElementById('link-url').value;
  let folderSelect = document.getElementById('folder-select');
  let folderName = folderSelect.value;
  
  if (!linkName || !urlName ) {  //if (!linkName || !urlName || folderName==='Default-Folder') {
    if(!linkName)showToast("Enter title of your Link");
    else if(!urlName)showToast("Enter url of your Link");
    // else if(!folderName)showToast("Choose a directory to save your link");
    // else if(folderName==='Default-Folder') showToast("Reserved default folder");
    return;
  }

  chrome.storage.sync.get([folderName], function (result) {
    if (result[folderName] && (result[folderName][linkName] ||result[folderName][linkName] === urlName)) {
      if(result[folderName][linkName] && result[folderName][linkName] === urlName)showToast(`This title and url already exists in '${folderName}' directory`);
      else if(result[folderName][linkName])showToast(`This title already exists in '${folderName}' directory`);
      else if(result[folderName][linkName] === urlName)showToast(`This url already exists in '${folderName}' directory`);
    } else {
      let dict = {};
      dict[linkName] = urlName;
      chrome.storage.sync.get([folderName], function (result) {
        if (result[folderName]) {
          result[folderName][linkName] = urlName;
          chrome.storage.sync.set(result, function () {
            showToast(`Link added to your folder '${folderName}' successfully!`);
          });
          // document.getElementById('link-name').value = "";
          // document.getElementById('link-url').value = "";
        } else {
          let folderDict = {};
          folderDict[linkName] = urlName;
          dict[folderName] = folderDict;
          chrome.storage.sync.set(dict, function () {
            showToast(`${folderName} created to save url`);
          });
          // showToast("choose your folder or else Create a new folder");
        }
      });
      
    }
  });
};




function appendLinks() {
  const myList = document.getElementById("myList");
  if (myList) {
    myList.innerHTML = "";
  }
  let urlNames = [];
  let urlLinks = [];
  chrome.storage.sync.get(null, function (dict) {
    for (let key in dict) {
      if (typeof dict[key] !== "string") {
        // If value is not a string, it is assumed to be a folder
        const folderName = key;
        const folderList = dict[key];
        const folderElem = document.createElement("div");
        folderElem.className="folder-itself";  //c3
        const folderElemHeader = document.createElement("h2");
        folderElemHeader.className="folder-heading"; //c4
        folderElemHeader.textContent = folderName;
        folderElem.appendChild(folderElemHeader);


        if(folderName!=="Default-Folder"){
        const folderDeleteButton = document.createElement("button");
        // folderDeleteButton.innerText = "Delete Folder";
        folderDeleteButton.className="folder-delete-btn"; //c9
        const deletefolderIcon = document.createElement("i");
        deletefolderIcon.className = "fa fa-trash-o";
        folderDeleteButton.appendChild(deletefolderIcon);
        folderDeleteButton.addEventListener("click", () => {
          deleteFolder(folderName, folderElem);
        });
        folderElem.appendChild(folderDeleteButton);
        }







        for (let folderKey in folderList) {
          urlNames.push(folderKey);
          urlLinks.push(folderList[folderKey]);

          const listItemElem = document.createElement("div");
          listItemElem.className="item-in-folder"; //c5
          const linkElem = document.createElement("a");
          linkElem.className="item-ka-link"; //c6
          linkElem.href = folderList[folderKey];
          linkElem.textContent = folderKey;
          listItemElem.appendChild(linkElem);

          const copyButton = document.createElement("button");
          // copyButton.innerText = "Copy Link";
          copyButton.className="copy-link-btn"; //c7
          const copyIcon = document.createElement("i");
          copyIcon.className = "fa fa-copy";
          copyButton.appendChild(copyIcon);
          copyButton.addEventListener("click", () => {
            copyLink(folderList[folderKey]);
          });

          const deleteButton = document.createElement("button");
          // deleteButton.innerText = "Delete";
          deleteButton.className="link-delete-btn"; //c8
          const deletefileIcon = document.createElement("i");
          deletefileIcon.className = "fa fa-trash";
          deleteButton.appendChild(deletefileIcon);
          deleteButton.addEventListener("click", () => {
            deleteLink(folderKey, folderList[folderKey], folderElem, listItemElem);
          });
          
          listItemElem.appendChild(copyButton);
          listItemElem.appendChild(deleteButton);
          folderElem.appendChild(listItemElem);
        }

        
        // const folderDiv=document.createElement('div');
        // folderDiv.className="folder-div";
        // folderDiv.appendChild(folderElem);
        myList.appendChild(folderElem);
        // myList.appendChild(folderElem);
      } 
      // else {
      //   //  jo kisi folder me nahi hai
      //   urlNames.push(key);
      //   urlLinks.push(dict[key]);

      //   const listItemElem = document.createElement("li");
      //   const linkElem = document.createElement("a");
      //   linkElem.href = dict[key];
      //   linkElem.textContent = key;
      //   listItemElem.appendChild(linkElem);

      //   const copyButton = document.createElement("button");
      //   copyButton.innerText = "Copy Link";
      //   copyButton.addEventListener("click", () => {
      //     copyLink(dict[key]);
      //   });

      //   const deleteButton = document.createElement("button");
      //   deleteButton.innerText = "Delete";
      //   deleteButton.addEventListener("click", () => {
      //     deleteLink(key, dict[key], myList, listItemElem);
      //   });

      //   listItemElem.appendChild(copyButton);
      //   listItemElem.appendChild(deleteButton);
      //   myList.appendChild(listItemElem);
      // }
    }
// under Construction
//     const searchInput = document.createElement("input");
//     searchInput.type = "text";
//     searchInput.placeholder = "Search (Under Construction)";
//     searchInput.className="search-input"; //  C14
//     // Add an event listener to the search input field to detect changes in the input
//     searchInput.addEventListener("input", function () {
//     const searchText = searchInput.value.toLowerCase();
      
//     // Filter the urlNames and urlLinks arrays based on the search text
//     const filteredNames = urlNames.filter(name => name.toLowerCase().includes(searchText));
//     const filteredLinks = urlLinks.filter(link => link.toLowerCase().includes(searchText));
      
//     // Get the list items and folders from the DOM
//     const listItems = document.getElementsByTagName("div");
//     const folders = document.getElementsByTagName("ul");
      
//     // Hide all list items and folders
//     for (let i = 0; i < listItems.length; i++) {
//       listItems[i].style.display = "none";
//     }
//     for (let i = 0; i < folders.length; i++) {
//       folders[i].style.display = "none";
//     }
  
//     // Show the list items that match the search text and the folders that contain them
//     for (let i = 0; i < filteredNames.length; i++) {
//       for (let j = 0; j < listItems.length; j++) {
//         const link = listItems[j].getElementsByTagName("a")[0];
//         if (link && link.textContent.toLowerCase() === filteredNames[i].toLowerCase()) {
//           listItems[j].style.display = "";
//           // Show the folder that contains the matching link
//           const folder = listItems[j].parentNode;
//           folder.style.display = "";
//         }
//       }
//     }
  
//     for (let i = 0; i < filteredLinks.length; i++) {
//       for (let j = 0; j < listItems.length; j++) {
//         const link = listItems[j].getElementsByTagName("a")[0];
//         if (link && link.href.toLowerCase() === filteredLinks[i].toLowerCase()) {
//           listItems[j].style.display = "";
//           // Show the folder that contains the matching link
//           const folder = listItems[j].parentNode;
//           folder.style.display = "";
//         }
//       }
//     }
  
//     // Hide the folders that have no matching links inside them
//     for (let i = 0; i < folders.length; i++) {
//       const folderLinks = folders[i].getElementsByTagName("a");
//       let folderHasMatchingLink = false;
//       for (let j = 0; j < folderLinks.length; j++) {
//         if (filteredNames.includes(folderLinks[j].textContent.toLowerCase()) || filteredLinks.includes(folderLinks[j].href.toLowerCase())) {
//           folderHasMatchingLink = true;
//           break;
//         }
//       }
//       if (!folderHasMatchingLink) {
//         folders[i].style.display = "none";
//       }
//     }
// });


//     myList.insertBefore(searchInput, myList.firstChild);
  });
}
// under Construction

function deleteFolder(folderName, folderElem) {
  // Show confirmation message to the user before deleting
  if (confirm(`Are you sure to delete the '${folderName}' folder?`)) {
    // Remove the folder from Chrome Storage Sync
    chrome.storage.sync.remove(folderName, function() {
      // Callback function to handle deletion success or error
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(`Folder '${folderName}' deleted from Chrome Storage Sync.`);
        showToast(`${folderName}' folder Deleted`);
      }
    });

    // Remove the folder element from the DOM
    folderElem.remove();
  }
}


function copyLink(url) {
  navigator.clipboard.writeText(url).then(function () {
    showToast(`Link copied`);
  }, function () {
    showToast(`Failed to copy link`);
  });
}

function deleteLink(name, url, box, listItemElem) {
  if (confirm(`Are you sure to delete this url?`)) {
  chrome.storage.sync.remove(name, function () {
    box.removeChild(listItemElem);
    showToast('This url deleted');
  });
  }
}

// function deleteObjectFromStorage(key) {
//   chrome.storage.sync.remove(key, function() {
//     console.log('Object with key ' + key + ' removed from storage.');
//   });
// }


// Fuzzy search function
// function fuzzySearch(query, text) {
//   const queryTerms = query.toLowerCase().split(' ');
//   const textTerms = text.toLowerCase().split(' ');

//   let score = 0;
//   for (let i = 0; i < queryTerms.length; i++) {
//     let termScore = 0;
//     for (let j = 0; j < textTerms.length; j++) {
//       if (textTerms[j].startsWith(queryTerms[i])) {
//         termScore += queryTerms[i].length;
//       }
//     }
//     if (termScore === 0) {
//       return 0;
//     }
//     score += termScore / textTerms.length;
//   }
//   return score / queryTerms.length;
// }



let inputContainer=document.getElementsByClassName("input-container")[0];
let outputLinkContainer=document.getElementsByClassName("output-link-container")[0];
let backbtn=document.getElementsByClassName('back-btn')[0];
const showAllLinksBtn = document.getElementById("show-all-links");
if (showAllLinksBtn) {
  showAllLinksBtn.addEventListener("click", ()=>{
    toggleinputContainerSection()
    appendLinks();
  });
}


function toggleinputContainerSection() {
  showAllLinksBtn.disabled=true;
  showAllLinksBtn.style.cursor='not-allowed';
  // inputContainer.style.height='0';
  inputContainer.style.display = 'none';
    setTimeout(() => {
      outputLinkContainer.style.display = 'block' ;
      backbtn.style.display =  'block';
    }, 500);
}

backbtn.addEventListener('click',()=>{
  showAllLinksBtn.disabled=false;
  showAllLinksBtn.style.cursor='pointer';
  backbtn.style.display = 'none';
  outputLinkContainer.style.display='none';
  inputContainer.style.display='block';
  inputContainer.style.height='auto';
});






function showToast(message) {
  let toast = document.getElementById('toast');
  toast.style.opacity = '1';
  toast.textContent=message;
  setTimeout(function() {
    toast.style.opacity = '0';
  }, 2000); // Hide the toast after 3 seconds
}



