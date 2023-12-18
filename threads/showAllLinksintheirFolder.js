import { showToast } from "./css-using-js.js";

function showAllLinksintheirFolder() {
    const myList = document.getElementById("myList");
    if (myList) {
      myList.innerHTML = "";
    }
    chrome.storage.sync.get(null, function (dict) {
      for (let key in dict) {
        if (typeof dict[key] !== "string") {
          // If value is not a string, it is assumed to be a folder
          const folderName = key;
          const folderList = dict[key];
          const folderElem = document.createElement("div");
          folderElem.className = "folder-itself";  //c3
          const folderElemHeader = document.createElement("h2");
          folderElemHeader.className = "folder-heading"; //c4
          folderElemHeader.textContent = folderName;
          folderElem.appendChild(folderElemHeader);
  
  
          if (folderName !== "Default-Folder") {
            const folderDeleteButton = document.createElement("button");
            // folderDeleteButton.innerText = "Delete Folder";
            folderDeleteButton.className = "folder-delete-btn"; //c9
            const deletefolderIcon = document.createElement("i");
            deletefolderIcon.className = "fa fa-trash-o";
            folderDeleteButton.appendChild(deletefolderIcon);
            folderDeleteButton.addEventListener("click", () => {
              deleteFolder(folderName, folderElem);
            });
            folderElem.appendChild(folderDeleteButton);
          }
  
          for (let folderKey in folderList) {
            const listItemElem = document.createElement("div");
            listItemElem.className = "item-in-folder"; //c5
            const linkElem = document.createElement("a");
            linkElem.className = "item-ka-link"; //c6
            linkElem.href = folderList[folderKey];
            linkElem.textContent = folderKey;
            listItemElem.appendChild(linkElem);
  
            const copyButton = document.createElement("button");
            // copyButton.innerText = "Copy Link";
            copyButton.className = "copy-link-btn"; //c7
            const copyIcon = document.createElement("i");
            copyIcon.className = "fa fa-copy";
            copyButton.appendChild(copyIcon);
            copyButton.addEventListener("click", () => {
              copyLink(folderList[folderKey]);
            });
  
            const deleteButton = document.createElement("button");
            // deleteButton.innerText = "Delete";
            deleteButton.className = "link-delete-btn"; //c8
            const deletefileIcon = document.createElement("i");
            deletefileIcon.className = "fa fa-trash";
            deleteButton.appendChild(deletefileIcon);
            deleteButton.addEventListener("click", () => {
              deleteLink(folderName,folderKey,folderElem, listItemElem);
            });
  
            listItemElem.appendChild(copyButton);
            listItemElem.appendChild(deleteButton);
            folderElem.appendChild(listItemElem);
          }
          myList.appendChild(folderElem);
        }
  
      }
  
    });
  }
  
  
  function deleteFolder(folderName, folderElem) {
    if (confirm(`Are you sure to delete the '${folderName}' folder?`)) {
      chrome.storage.sync.remove(folderName, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log(`Folder '${folderName}' deleted from Chrome Storage Sync.`);
          showToast(`${folderName}' folder Deleted`);
        }
      });
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
  
  function deleteLink(folderName,linkTitle, box, listItemElem) {
    if (confirm(`Are you sure to delete this url?`)) {
      chrome.storage.sync.get([folderName], function (result) {
        if (result[folderName] && result[folderName][linkTitle]) {
          delete result[folderName][linkTitle];
          chrome.storage.sync.set(result, function () {
            box.removeChild(listItemElem);
            showToast(`Link '${linkTitle}' in folder '${folderName}' has been deleted`);
          });
        } 
        else {
          showToast(`Error: Folder or link not found`);
        }
      });
    }
  }

  export { showAllLinksintheirFolder };
  export { deleteFolder, copyLink, deleteLink };