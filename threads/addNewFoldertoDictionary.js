import { showToast } from "./css-using-js.js";
import { createFolderSectionDisplayNone } from "./css-using-js.js";
function addNewFoldertoDictionary() {
    let newFolderName = document.getElementById("new-folder-input");
    let chooseDirectorySpace = document.getElementById("choose-directory");
    let folderName = newFolderName.value;
    if (folderName) {
        const newDict = {};
        newDict[folderName] = {};
        chrome.storage.sync.set(newDict, function () {
            // Callback function to handle saving success or error
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
            else {
                console.log(`New empty dictionary: '${folderName}' saved to Chrome Storage Sync.`);
                showToast(`'${folderName}' as a directory created`);
                let newOption = document.createElement("option");
                newOption.text = folderName;
                chooseDirectorySpace.add(newOption);
                newOption.selected = true;
                // toggleCreateFolderSection();
                createFolderSectionDisplayNone();
            }
        });
        // Reset the input field
        newFolderName.value = "";
    }
    else {
        showToast("Folder name empty!");
    }
}
export { addNewFoldertoDictionary };