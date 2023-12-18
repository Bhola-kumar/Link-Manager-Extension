import { fillFormWithCurrentLink } from './threads/fillFormWithCurrentLink.js';
import { addNewFoldertoDictionary } from './threads/addNewFoldertoDictionary.js';//goButton
import { saveLinktoFolder } from './threads/saveLinktoFolder.js';
import { showAllLinksintheirFolder } from './threads/showAllLinksintheirFolder.js';
import { hideinputContainerSection } from './threads/css-using-js.js';
import { backtoinputContainer } from './threads/css-using-js.js';
import {createFolderSectionDisplayNone} from './threads/css-using-js.js';
import { toggleCreateFolderSection } from './threads/css-using-js.js';
import { exportListToPDF } from './threads/exportToPdf.js'; 
import { showMatchingLinksintheirFolder } from './threads/search.js';
window.addEventListener('load', fillFormWithCurrentLink);

const createFolderButton = document.querySelector('.create-folder-btn');
createFolderButton.addEventListener('click', toggleCreateFolderSection);

let onChoosingDirectoryfromOptions = document.getElementById("choose-directory");
onChoosingDirectoryfromOptions.addEventListener("change", createFolderSectionDisplayNone);

let goButton = document.getElementById("create-newFolder-in-dict-btn");
goButton.addEventListener("click", addNewFoldertoDictionary);

let saveButton = document.getElementById("submit-form");
saveButton.addEventListener("click", saveLinktoFolder);


let showAllLinksBtn = document.getElementById("show-all-links");
if (showAllLinksBtn) {
  showAllLinksBtn.addEventListener("click", () => {
    hideinputContainerSection()
    showAllLinksintheirFolder();
  });
}

let exportToPdfBtn = document.getElementById("export-to-pdf");
let createFolderSection = document.getElementById('create-folder-section');
exportToPdfBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ message: "exportToPdf" });
  createFolderSection.style.display = 'none';
  exportListToPDF();
});

let backbtn = document.getElementsByClassName('back-btn')[0];
backbtn.addEventListener('click', backtoinputContainer);

const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  showMatchingLinksintheirFolder(value);
});