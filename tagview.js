var onTags = [];
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
		for(tag in data[bookmark].tags) {
			if(tagCounts[data[bookmark].tags[tag]]) {
				tagCounts[data[bookmark].tags[tag]].push(bookmark);
			} else {
				tagCounts[data[bookmark].tags[tag]] = [bookmark];
			}

		}
	}
	for(tag in tagCounts) {
		console.log(tagCounts);
		var styleLine = "display: inline; padding: 5px 5px 5px 5px;";
		//sizes tags to account for popularity
		if (tagCounts[tag].length >= 100) {
			styleLine += "font-size: 4em";
		} else if (tagCounts[tag].length >= 10) {
			styleLine += "font-size: 2em";
		} else if (tagCounts[tag].length >= 5) {
			styleLine += "font-size: 1.5em";;
		}  else if (tagCounts[tag].length >= 5) {
			styleLine += "font-size: 1.25em";
		}
		$('#tagmap').append('<div id="'+ tag +'" style="'+ styleLine+'">#'+tag+'</div>');
		$("#"+tag).click(function(){toggleTag(this.id)});
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

var gibWebpage = function gibWebpage() {
	var webpages = [];
	for (tag in onTags) {
		webpages = webpages.concat(tagCounts[onTags[tag]]);
	}
	//pick a random element from webpages
	var ele = webpages[Math.floor((Math.random() * webpages.length))];
	var site = data[ele].url;
	chrome.tabs.create({ url: site });
}


$('document').ready(function() {

	document.getElementById("feelingLucky").addEventListener("click",function(){
		gibWebpage();
	});

	populateTags();

});