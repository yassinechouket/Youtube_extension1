import{getActiveTabURL} from './utils.js';













document.addEventListener('DOMContentLoaded', async () => {
    const activeTab  = await getActiveTabURL();
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo  = urlParameters.get("v");


    if(currentVideo && activeTab.url.includes("youtube.com/watch")){

        chroma.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

    viewBookmarks(currentVideoBookmarks);
    });
  }else{
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }
});