import { getActiveTabURL } from './utils.js';

const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";

    setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    bookmarksElement.appendChild(newBookmarkElement);
    newBookmarkElement.appendChild(controlsElement);
};

const viewBookmarks = (currentVideoBookmarks = []) => {
    const bookmarksElement = document.querySelector(".bookmarks");
    if (!bookmarksElement) return;

    bookmarksElement.innerHTML = "";

    if (currentVideoBookmarks.length > 0) {
        for (const bm of currentVideoBookmarks) {
            addNewBookmark(bookmarksElement, bm);
        }
    } else {
        bookmarksElement.innerHTML = '<div class="row">No bookmarks for this video yet.</div>';
    }
};


const onPlay = async e => {
    const bookmarkElement = e.target.closest('.bookmark');
    const bookmarkTime = bookmarkElement.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();

    
    const timeInSeconds = Math.floor(parseFloat(bookmarkTime));

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: timeInSeconds
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.log("Error sending message:", chrome.runtime.lastError);
        }
    });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkElement = e.target.closest('.bookmark');
  const bookmarkTime = bookmarkElement.getAttribute("timestamp");

  
  bookmarkElement.remove();

  
  const queryParameters = activeTab.url.split("?")[1] || "";
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");

  
  chrome.storage.sync.get([currentVideo], (data) => {
    const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
    const updatedBookmarks = currentVideoBookmarks.filter((b) => b.time != bookmarkTime);
    
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(updatedBookmarks)
    }, () => {
      
      viewBookmarks(updatedBookmarks);
    });
  });
};


const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};


document.addEventListener('DOMContentLoaded', async () => {
    const activeTab = await getActiveTabURL();
    if (!activeTab || !activeTab.url) {
        const container = document.querySelector(".container");
        if (container) container.innerHTML = '<div class="title">Could not get active tab.</div>';
        return;
    }

    const queryParameters = (activeTab.url.split("?")[1] || "");
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo = urlParameters.get("v");

    if (currentVideo && activeTab.url.includes("youtube.com/watch")) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            viewBookmarks(currentVideoBookmarks);
        });
    } else {
        const container = document.querySelector(".container");
        if (container) container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});