function addBookmark(){
    tagString = $("#newTags").val();

    tags = tagString.split(",");
    tags = tags.map(function(s) { return s.trim() });

    chrome.tabs.getSelected(null,function(tab){
        myURL=tab.url;
        myTitle = tab.title;
        chrome.storage.local.get("max_id",function(result){
            id = result['max_id'];
            if(id==null){
                id = 1;
            }
            chrome.storage.local.get('bookmarks',function(test){
                if(test['bookmarks']!=null){
                    chrome.storage.local.set({'bookmarks': test['bookmarks'] + JSON.stringify({'id':id,'url':myURL, 'Name':myTitle, "tags":tags})}, function(result) {
                        alert("Bookmark added");
                    });
                } else {
                    chrome.storage.local.set({'bookmarks': JSON.stringify({'id':id, 'url':myURL, 'Name':myTitle, "tags":tags})}, function(result) {
                        alert("Bookmark added");
                    });
                }
            });

            chrome.storage.local.set({"max_id":id+1},function(){});
        });

    });
}


document.getElementById("addBookmark").addEventListener("click",function(){addBookmark();});


document.getElementById("viewBookmarks").addEventListener("click",function(){
	chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + "/tagview.html"});
});
