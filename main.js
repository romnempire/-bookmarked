
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

	    // print leaf nodes URLs to console
	    if(node.url){
			currentNode = {'url':node.url, 'Name':node.title};
		}
	}
}

function addBookmark(){
	alert("You added a bookmark");
}


document.getElementById("addBookmark").addEventListener("click",function(){addBookmark();});
