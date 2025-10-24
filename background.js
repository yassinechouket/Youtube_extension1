chroma.tabs.onUpdated.addListener((tabId,tab)=>{
    if(tab.url && tab.url.includes("youtube.com/watch")){
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        
        chroma.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v")
        });
    }
})


















