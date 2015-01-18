
function importBookmarks(){
	var currentList = [];
	list = " ";
	chrome.bookmarks.getTree(function(itemTree){
	    itemTree.forEach(function(item){
	        processNode(item);
	    });
		alert(list);
	});

	function processNode(node) {
	    // recursively process child nodes
	    if(node.children) {
	        node.children.forEach(function(child) { processNode(child); });
	    }

	    if(node.url){
			chrome.storage.sync.get("max_id",function(result){
				id = result['max_id']
				currentNode = {'id':id, 'url':node.url, 'Name':node.title, "tags":['a','b','c']};
				chrome.storage.sync.set({"max_id":id+1},function(){});
			});

		}
	}
}

function addBookmark(){
	tagString = $("#newTags").val();

	tags = tagString.split(",");
	tags = tags.map(function(s) { return s.trim() });

	chrome.tabs.getSelected(null,function(tab){
		myURL=tab.url;
		myTitle = tab.title;
		chrome.storage.sync.get('bookmarks',function(test){
			if(test['bookmarks']!=null){
				chrome.storage.sync.set({'bookmarks': test['bookmarks'] + JSON.stringify({'id':1,'url':myURL, 'Name':myTitle, "tags":tags})}, function(result) {
					alert("Bookmark added");
				});
			} else {
				chrome.storage.sync.set({'bookmarks': JSON.stringify({'id':1, 'url':myURL, 'Name':myTitle, "tags":tags})}, function(result) {
					alert("Bookmark added");
				});
			}
		});

	});
}

function getBookmarks(){
	var retValue;
	alert(chrome.storage.sync.get('bookmarks',function(test){
		alert(test['bookmarks']);
		return "EHW";
	}));
}

function clearBookmarks(){
	chrome.storage.sync.remove('bookmarks',function(){alert("Bookmarks Cleared");})
}


document.getElementById("addBookmark").addEventListener("click",function(){addBookmark();});


document.getElementById("viewBookmarks").addEventListener("click",function(){
	chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + "/tagview.html"});
});
document.getElementById("clearBookmarks").addEventListener("click",function(){clearBookmarks();});
