
function getBookmarks(){
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
			currentNode = {'id':1, 'url':node.url, 'Name':node.title};
		}
	}
}

function addBookmark(){
	chrome.tabs.getSelected(null,function(tab){
		myURL=tab.url;
		myTitle = tab.title;
		chrome.storage.sync.get('bookmarks',function(test){
			if(test['bookmarks']!=null){
				chrome.storage.sync.set({'bookmarks': test['bookmarks'] + JSON.stringify({'id':1,'url':myURL, 'Name':myTitle})}, function(result) {
				});
			} else {
				chrome.storage.sync.set({'bookmarks': JSON.stringify({'id':1, 'url':myURL, 'Name':myTitle})}, function(result) {
				});
			}
			alert(test['bookmarks']);
		});

	});

}

function clearBookmarks(){
	chrome.storage.sync.remove('bookmarks',function(){alert("REMOVED");})
}


document.getElementById("addBookmark").addEventListener("click",function(){addBookmark();});

document.getElementById("clearBookmarks").addEventListener("click",function(){clearBookmarks();});


window.addEventListener('load', function () {

});
