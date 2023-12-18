let showAllLinksBtn = document.getElementById("show-all-links");
let inputContainer = document.getElementsByClassName("input-container")[0];
let outputLinkContainer = document.getElementsByClassName("output-link-container")[0];
let backbtn = document.getElementsByClassName('back-btn')[0];
let searchBar=document.getElementById('search-bar-id');
let createFolderSection = document.getElementById('create-folder-section');
function hideinputContainerSection() {
  showAllLinksBtn.disabled = true;
  showAllLinksBtn.style.cursor = 'not-allowed';
  inputContainer.style.display = 'none';
  createFolderSection.style.display = 'none';
  backbtn.style.display = 'block';
  searchBar.style.display='block';
  // setTimeout(() => {
    outputLinkContainer.style.display = 'block';
    
  // }, 1);
}

function backtoinputContainer() {
  outputLinkContainer.style.display = 'none';
  backbtn.style.display = 'none';
  searchBar.style.display='none';
  searchBar.value='';
  inputContainer.style.display = 'block';
  showAllLinksBtn.disabled = false;
  showAllLinksBtn.style.cursor = 'pointer';
}

let isCreateFolderSectionVisible = false;
function toggleCreateFolderSection() {
  isCreateFolderSectionVisible = !isCreateFolderSectionVisible;
  createFolderSection.style.display = isCreateFolderSectionVisible ? 'block' : 'none';
}

function createFolderSectionDisplayNone() {
  createFolderSection.style.display = 'none';
}



function showToast(message) {
  let toast = document.getElementById('toast');
  toast.style.opacity = '1';
  toast.textContent = message;
  setTimeout(function () {
    toast.style.opacity = '0';
  }, 2000); // Hide the toast after 2 seconds
}


export { hideinputContainerSection };
export { backtoinputContainer };
export { toggleCreateFolderSection };
export { createFolderSectionDisplayNone };
export { showToast };