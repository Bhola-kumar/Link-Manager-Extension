
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
document.getElementById("submit-form").onclick = function () {
  let linkName = document.getElementById('link-name').value;
  let urlName = document.getElementById('link-url').value;
  let dict = {};
  dict[linkName] = urlName;
  chrome.storage.sync.set(dict, function () {
    alert('success!');
  });
  document.getElementById('link-name').value = "";
  document.getElementById('link-url').value = "";
};

function appendLinks() {
  const table = document.getElementById("myList");
  if (table) {
    table.innerHTML = "";
  }
  let urlNames = [];
  let urlLinks = [];
  chrome.storage.sync.get(null, function (dict) {
    for (let key in dict) {
      let value = dict[key];
      urlNames.push(key);
      urlLinks.push(value);
    }

    const box = document.createElement("ul");
    for (let i = 0; i < urlNames.length; i++) {
      const listItemElem = document.createElement("li");
      const linkElem = document.createElement("a");
      linkElem.href = urlLinks[i];
      linkElem.textContent = urlNames[i];
      listItemElem.appendChild(linkElem);

      const copyButton = document.createElement("button");
      copyButton.innerText = "Copy Link";
      copyButton.addEventListener("click", () => {
        copyLink(urlLinks[i]);
      });

      listItemElem.appendChild(copyButton);
      box.appendChild(listItemElem);
    }

    table.appendChild(box);
  });
}

function copyLink(url) {
  navigator.clipboard.writeText(url).then(function () {
    alert(`Link copied: ${url}`);
  }, function () {
    alert(`Failed to copy link: ${url}`);
  });
}


const showAllLinksBtn = document.getElementById("show-all-links");
if (showAllLinksBtn) {
  showAllLinksBtn.addEventListener("click", appendLinks);
}
