import { showToast } from "./css-using-js.js";
function currentFoldersList(){
  chrome.storage.sync.get(null, function (result) {
    let allfolderNames = [];
    Object.keys(result).forEach(function (key) {
      if (result.hasOwnProperty(key) && typeof result[key] === 'object') {
        allfolderNames.push(key);
      }
    });
    return allfolderNames;
  });
}
function createDefaultFolder(allfolderNames) {
  let chooseDirectory = document.getElementById("choose-directory");
  let findDefaultFolder = false;
  for (let folders in allfolderNames) {
    if (folders === "Default-Folder") {
      findDefaultFolder = true;
      break;
    }
  }
  if (!findDefaultFolder) {
    let dict = {};
    dict["Default-Folder"] = {};
    chrome.storage.sync.set(dict, function () {
      console.log(`Default-Folder created to save url`);
    });
    let option = document.createElement("option");
    let key = "Default-Folder";
    console.log(key + ": ");
    // console.log(result[key]);
    option.value = key;
    option.text = key;
    chooseDirectory.add(option);
  }
}












function saveLinktoFolder() {
  let linkTitle = document.getElementById('link-title').value;
  let linkUrl = document.getElementById('link-url').value;
  let folderName = document.getElementById('choose-directory').value;

  if (folderName === "") {
    folderName = "Default-Folder";
  }
  if (!linkTitle) {
    showToast("Enter title of your Link");
    return;
  }
  if (!linkUrl) {
    showToast("Enter url of your Link");
    return;
  }
  chrome.storage.sync.get([folderName], function (result) {
    if(!result[folderName]){
      let allfolderNames = currentFoldersList();
      createDefaultFolder(allfolderNames);
    }
    if(result[folderName][linkTitle] && result[folderName][linkTitle]===linkUrl){
      showToast(`This title and url already exists in '${folderName}' directory`);
      return;
    }
    else if(result[folderName][linkTitle]){
      showToast(`This title already exists in '${folderName}' directory`);
      return;
    }
    else{
      result[folderName][linkTitle]=linkUrl;
      chrome.storage.sync.set(result,function(){
        showToast(`Link added to your folder '${folderName}' successfully!`);
      });
      document.getElementById('create-folder-section').style.display = 'none';
      document.getElementById('link-title').value = "";
      document.getElementById('link-url').value="";
      return;
    }
  });
}









export { saveLinktoFolder };
