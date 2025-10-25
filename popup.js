import { getActiveTabURL } from './utils.js';

const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    bookmarksElement.appendChild(newBookmarkElement);
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