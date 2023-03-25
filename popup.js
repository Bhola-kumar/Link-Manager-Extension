
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
};

window.addEventListener('load', fillFormWithCurrentLink);

// currently most updated version to save data
document.getElementById("sub").onclick = function () {
  let linkName = document.getElementById('link-name').value;
  let urlName = document.getElementById('link-url').value;
  let dict = {};
  dict[linkName] = urlName;
  chrome.storage.sync.set(dict, function () {
    alert('success!');
  });
  document.getElementById('link-name').value = "";
  document.getElementById('link-url').value = "";
};
// fetching data to array Method 1

// for fetching the saved links and keeping them into array
// let urlNames = [];
// let urlLinks = [];
// function fetchLinks() {
//   chrome.storage.sync.get(null, function(dict){
//     for (let key in dict) {
//       let value = dict[key];
//       urlNames.push(key);
//       urlLinks.push(value);
//     }
//   });
// }

//using select as dropdown  Method 2

// function appendLinks() {
//   let selectElement = document.getElementById('mySelect');
//   fetchLinks();
//   for (let i = 0; i < urlNames.length; i++) {
//     let newOption = document.createElement('option');
//     newOption.value = urlLinks[i];
//     newOption.textContent = urlNames[i];
//     selectElement.appendChild(newOption);
//   }
// }


// function appendLinks() {
//   let selectElement = document.getElementById('mySelect');
//   let urlNames = [];
//   let urlLinks = [];
//   chrome.storage.sync.get(null, function(dict){
//     for (let key in dict) {
//       let value = dict[key];
//       urlNames.push(key);
//       urlLinks.push(value);
//     }
//     for (let i = 0; i < urlNames.length; i++) {
//       if (!selectElement.querySelector(`[value="${urlLinks[i]}"]`)) {
//         let newOption = document.createElement('option');
//         newOption.value = urlLinks[i];
//         newOption.textContent = urlNames[i];
//         selectElement.appendChild(newOption);
//       }
//     }
//   });
// }

// document.getElementById("show-all-links").addEventListener("click", appendLinks);

//using dropdown menu in table Method 3
function isDuplicate(table, urlNames, urlLinks) {
  if (!table) {
    return false;
  }
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    let name = row.cells[0].textContent;
    let link = row.cells[0].querySelector('a').href;
    if (name === urlNames || link === urlLinks) {
      return true;
    }
  }
  return false;
}
function appendLinks1() {
  let table = document.getElementById("myTable");
  let urlNames = [];
  let urlLinks = [];
  chrome.storage.sync.get(null, function(dict){
    for (let key in dict) {
      let value = dict[key];
      urlNames.push(key);
      urlLinks.push(value);
    }
    for (let i = 0; i < urlNames.length; i++) {
      let duplicate = isDuplicate(table, urlNames[i], urlLinks[i]);
      if (duplicate === false) {
        let newRow = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.innerHTML = `<a href="${urlLinks[i]}">${urlNames[i]}</a>`;
        newRow.appendChild(cell1);
        table.appendChild(newRow);
      }
    }
  });
  
}

// document.getElementById("show-all-links").addEventListener("click", appendLinks1);


// display the saved links in table form on new window Method 4

let myWindow=null;
function appendLinks2() {
  let table = document.createElement("table");
  chrome.storage.sync.get(null, function(dict){
    let urlNames = [];
    let urlLinks = [];
    for (let key in dict) {
      let value = dict[key];
      urlNames.push(key);
      urlLinks.push(value);
    }
    for (let i = 0; i < urlNames.length; i++) {
        let newRow = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.innerHTML = `<a href="${urlLinks[i]}">${urlNames[i]}</a>`;
        newRow.appendChild(cell1);
        table.appendChild(newRow);
    }
    if(myWindow==null){
      myWindow = window.open("","fetchedLinks", "width=600,height=400");
    }
    else{
        myWindow.document.body.innerHTML="";
    }
    myWindow.document.write("<html><head><title>All Saved Links</title></head><body><div><h1>All the links are here</h1></div></body></html>");
    myWindow.document.body.appendChild(table);
  });
  
}


// document.getElementById("show-all-links").addEventListener("click",appendLinks2);

const showAllLinksBtn = document.getElementById('show-all-links');
const viewSetting = document.getElementById('view-setting');

showAllLinksBtn.addEventListener('click', function() {
  const selectedMode = viewSetting.value;
  if (selectedMode === 'here only') {
      appendLinks1();
  } 
  else if (selectedMode === 'new window') {
      appendLinks2();
  
  }
});

