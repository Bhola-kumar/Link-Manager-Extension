import { showToast } from './css-using-js.js';

// auto matically fill the input fields(link-title and link-url) of form
function fillFormWithCurrentLink() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        let activeTab = tabs[0];
        document.getElementById('link-title').value = activeTab.title;
        document.getElementById('link-url').value = activeTab.url;
      }
      else {
        showToast('No active tab found.');
      }
    });
    //choose directory automatically selected as default folder and all the folders names also gets loaded as options
    populateFolderNamesinChooseDirectory();
  }
  
  function populateFolderNamesinChooseDirectory() {
    let chooseDirectory = document.getElementById("choose-directory");
    chrome.storage.sync.get(null, function (result) {
      console.log("Existing Folders: ");
      // let allfolderNames = [];
      Object.keys(result).forEach(function (key) {
        let option = document.createElement("option");
        if (result.hasOwnProperty(key) && typeof result[key] === 'object') {
          // allfolderNames.push(key);
          console.log(key + ": ");
          console.log(result[key]);
          option.value = key;
          option.text = key;
          chooseDirectory.add(option);
        }
      });
    });
  }
  export { fillFormWithCurrentLink };