var onTags = [];
var stringPopulatedTags = [];
var webpages = [];
//tagcounts is an array of arrays.  the arrays hold the ids of images with a tag
//the array size is the weight of the tag.
var tagCounts = [];
var data = {
	'0001': {
		'id': '0001',
		'name': 'Google',
		'url': 'http://google.com',
		'tags': ['awesome', 'search', 'bookmark']
	},
	'0002': {
		'id': '0002',
		'name': 'Steam',
		'url': 'http://store.steampowered.com',
		'tags': ['money', 'pls', 'bookmark']
	},
	'0003': {
		'id': '0003',
		'name': 'DotA',
		'url': 'www.dota2.com',
		'tags': ['halp', 'bookmark']
	},
	'0004': {
		'id': '0004',
		'name': 'Reddit',
		'url': 'http://www.reddit.com',
		'tags': ['bongo', 'bookmark']
	},
	'0005': {
		'id': '0005',
		'name': 'Netflix',
		'url': 'http://www.netflix.com',
		'tags': ['bookmark']
	}

};

var populateTags = function populateTags() {

	for(bookmark in data) {
		if(data[bookmark]!=null){
			var tag;
			for(tag in data[bookmark].tags) {
				if(tagCounts[data[bookmark].tags[tag]]) {
					tagCounts[data[bookmark].tags[tag]].push(bookmark);
				} else {
					tagCounts[data[bookmark].tags[tag]] = [bookmark];
				}

			}
		}
	}
	var tag;
	for(tag in tagCounts) {
		var styleLine = "display: inline-block; padding: 5px 0px 0px 5px;";
		//sizes tags to account for popularity
		if (tagCounts[tag]	.length >= 100) {
			styleLine += "font-size: 4em";
		} else if (tagCounts[tag].length >= 10) {
			styleLine += "font-size: 2em";
		} else if (tagCounts[tag].length >= 5) {
			styleLine += "font-size: 1.5em";;
		}  else if (tagCounts[tag].length >= 5) {
			styleLine += "font-size: 1.25em";
		}
        if(tag !== "") {
            $('#tagmap').append('<div id="'+ tag +'" style="'+ styleLine+'">#'+tag+'</div>');
            $("#"+tag).click(function(){toggleTag(this.id)});
        }
	}
};

var toggleTag = function toggleTag(tag) {
	if(onTags.indexOf(tag) == -1) {
		onTags.push(tag);
		$('#'+tag).css('background-color','lightgreen');
	} else {
		onTags.splice(onTags.indexOf(tag), 1);
		$('#'+tag).css('background-color','white');
	}
};

var processString = function processString() {
	if(stringPopulatedTags) {
		for (loc in stringPopulatedTags) {
			toggleTag(stringPopulatedTags[loc]);
		}
	}
	stringPopulatedTags = [];
	//console.log('wiped');
	var strings = $('#bar').val().split(' ');
	for (loc in strings) {
		if (tagCounts[strings[loc]] && (onTags.indexOf(strings[loc]) == -1)) {
			stringPopulatedTags.push(strings[loc]);
			onTags.push(strings[loc]);
			$('#'+strings[loc]).css('background-color','lightgreen');
		}
	}
}

var gibWebpage = function gibWebpage() {
	var tag;
	webpages = [];
	//at this point the processtring listener will have taken care of teh url bar
    if(onTags.length > 0) {
        for (tag in onTags) {
            console.log(tag);
            webpages = webpages.concat(tagCounts[onTags[tag]]);
        }
    } else {
        for (tag in tagCounts) {
            webpages = webpages.concat(tagCounts[tag]);
        }
    }

	//pick a random element from webpages
	var rand = Math.floor((Math.random() * webpages.length));
	console.log(rand);
	var ele = webpages[rand];
	console.log(ele);
	var site = data[ele].url;
	window.location = site;
}




$('document').ready(function() {
	chrome.storage.local.get('bookmarks',function(result){
		console.log(data);
		olddata = data;
		data = result['bookmarks'];
		populateTags();
		document.getElementById("feelingLucky").addEventListener("click",function(){gibWebpage();});

document.getElementById("clearTags").addEventListener("click",function(){clearBookmarks();});

document.getElementById("importTags").addEventListener("click",function(){importBookmarks();});
		$('#bar').on('keyup', function(){
			processString();
		});
	});

});


function importBookmarks(){
    var currentList = [];
    var allNodes = [];
    list = " ";
    chrome.storage.local.get("max_id",function(result){
        id = result['max_id'];
        if(id==null){
            id = 0;
        }
        chrome.bookmarks.getTree(function(itemTree){
            itemTree.forEach(function(item){
                processNode(item,[]);
            });
            chrome.storage.local.set({"max_id":id+1,"bookmarks":allNodes},function(){
                    location.reload();
            });
        });
    });

    function processNode(node, inputTags) {
        var test  = JSON.parse(JSON.stringify(inputTags));
        // recursively process child nodes
        if(node.children) {
            test.push(node.title);
            node.children.forEach(function(child) { processNode(child,test); });
        }
        else if(node.url){
            currentNode = {'id':id, 'url':node.url, 'Name':node.title, "tags":tagify(test, node.title, node.url, id)};
            if(currentNode!=null){
                allNodes[id]=currentNode;
            }
            id = id + 1;
        }
    }


}

function tagify(tagArray, title, url, id){
    output = [];
    for(tag in tagArray) {
        output[tag] = tagArray[tag].replace(/\s+/g, '').replace(/[\[\]\/._]/g,'');
    }

    //learn from cloud
    if(id < 10) {
         xmlhttp=new XMLHttpRequest();
        urlstring = "https://www.wolframcloud.com/app/objects/ac8443b0-bfbd-4f0c-a58b-53330b24db43";
        urlstring = urlstring+'?url='+url;
        urlstring = urlstring+'&desc='+title.replace(/\s+/g, '+');

        xmlhttp.onreadystatechange=function()
          {
          if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                console.log(xmlhttp.responseText);
                allNodes[id].tags.push(xmlhttp.responseText);
                chrome.storage.local.set({"bookmarks":allNodes},function(){
                        //location.reload();
                });
                //return output;
            //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            }
          }

        xmlhttp.open("GET",urlstring,true);
        xmlhttp.send();
       
    }


    return output;
}

function clearBookmarks(){
    chrome.storage.local.remove(['bookmarks','max_id'],function(){location.reload();})

}

$('body').keyup(function(event){
    console.log("key");
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        gibWebpage();  
    }
 
});
