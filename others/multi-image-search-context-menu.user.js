/*
    Multi Image Search Context Menu
    Add 'Search by Image' in browser context menu when you
    right click on image to search a few sites with that image.
    Copyright (C) 2012 LouCypher, 2017 mfaizsyahmi

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>
*/

// ==UserScript==
// @name            Multi Image Search Context Menu
// @namespace       https://github.com/mfaizsyahmi
// @description     Add 'Search by Image' in browser context menu when you right click on image to search a few sites with that image.
// @version         2.0.1
// @license         GPL
// @resource        license https://raw.github.com/LouCypher/userscripts/master/licenses/GPL/LICENSE.txt
// @updateURL       https://github.com/mfaizsyahmi/userscripts/raw/master/others/multi-image-search-context-menu.user.js
// @include         *
// @exclude         file://*
// @grant           GM_openInTab
// ==/UserScript==

if (!("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)) return;

var menuItems = [
	{
		id: 'google',
		label: 'Google Image Search',
		icon: 'data:image/png;base64,\
		iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz\
		AAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAEl\
		SURBVDiNY/z//z8DJYCRkIKsthv/kRX9Z2BgmFalARdiIcaGKZXqcH5O+01U+ay2G3MYGBiSiXUm\
		mofnsBDSjEUTMkiBe2Eq1JnZ7TcZBHhZGNythBl0lLkZODmYGX7++sdw/sZnhl3H3zF8+voHwwsY\
		FkR5ijNICLMzTF31hOHnr38MHGxMDJlhMgwv3vxkWL7jJYpaJmzu0lTigWtmYGBg+PHrH8P0VU8Y\
		tJV5MNRiNYCfmxmuGQZ+/PrHwMmOqRyrAX///WfgYEOV4mBjwjAUpwHHL31iyA6XgRvCwcbEkBUm\
		w3DuxmcMtVgDkYONicHLVoTBSJOXgYONieHHz38Ml+98Ydh88DXDtx//CBtACmBiYGCYS4H+OYyU\
		5kasgUgKAADN8WLFzlj9rgAAAABJRU5ErkJggg==',
		search: function searchGI(imageURL) {
			if (imageURL.indexOf("data:") == 0) {
				var base64Offset = imageURL.indexOf(",");
				if (base64Offset != -1) {
					var inlineImage = imageURL.substring(base64Offset + 1)
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/\./g, "=");
					
					var form = prepareForm({action: '//www.google.com/searchbyimage/upload'});
					addParamsToForm(form, "image_content", inlineImage);
					addParamsToForm(form, "filename", "");
					addParamsToForm(form, "image_url", "");
					body.appendChild(form);
					form.submit();
					body.removeChild(form);
				}
			} else {
				GM_openInTab("https://www.google.com/searchbyimage?image_url=" +
				encodeURIComponent(imageURL));
			}
		}
	}, {
		id: 'iqdb',
		label: 'iqdb search',
		icon: 'data:image/jpeg;base64,\
		/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQECAgMCAgICAgQDAwIDBQQFBQUE\
		BAQFBgcGBQUHBgQEBgkGBwgICAgIBQYJCgkICgcICAj/2wBDAQEBAQICAgQCAgQIBQQFCAgICAgI\
		CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/wgARCAAQABADASIA\
		AhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwUHCf/EABQBAQAAAAAAAAAAAAAAAAAAAAf/2gAM\
		AwEAAhADEAAAARqozpseI/8A/8QAGBABAQEBAQAAAAAAAAAAAAAABQYDBAL/2gAIAQEAAQUCyM8r\
		dWSi5Z2vZXzmgFzN3av/xAAdEQABAgcAAAAAAAAAAAAAAAABAAIDBBESISJx/9oACAEDAQE/AZWH\
		sQ029pkL/8QAIBEAAQEIAwAAAAAAAAAAAAAAAQIAAwQREyEiMUFRgf/aAAgBAgEBPwGIUl4gVM5H\
		gmx8103/xAAlEAACAQMCBQUAAAAAAAAAAAABAwIEBREAIQYSMTJBFCNykcH/2gAIAQEABj8CtlDC\
		sAvVaC4ZliO+eWHylgn61aH3uwOXw8uvktLoQnBiXQz3L5okeT1GRvqi4hp1RM1SgISavnCguQ7x\
		1G0DpVqofU3FxUHthj2ly36Z8/mNf//EABoQAQEBAQEBAQAAAAAAAAAAAAERMSFBAGH/2gAIAQEA\
		AT8hC7ZnNYO6GwE+sVClOC5OPOgCu2GZoqDyLgl5i2/Okgiz1VgL+4d8/9oADAMBAAIAAwAAABAr\
		/8QAGREBAQEAAwAAAAAAAAAAAAAAIQERAFFx/9oACAEDAQE/EKzIchCPaidx5//EABkRAQEBAAMA\
		AAAAAAAAAAAAAAERIQAxQf/aAAgBAgEBPxBkhI3BqQdQvbwaKvP/xAAYEAEBAQEBAAAAAAAAAAAA\
		AAABESEAMf/aAAgBAQABPxBQi8gk6bDMSBW5McJVwp4NNWS4P4qshDoLgAKLB/MjhfhrzdUBTz//2Q==',
		search: function searchIqdb(imageURL) {
			var form = prepareForm({action: '//www.iqdb.org/'});
			if (imageURL.indexOf("data:") == 0) {
				var base64Offset = imageURL.indexOf(",");
				if (base64Offset != -1) {
					var inlineImage = imageURL.substring(base64Offset + 1)
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/\./g, "=");
					addParamsToForm(form, "file", inlineImage);
					addParamsToForm(form, "url", "");
				}
			} else {
				addParamsToForm(form, "url", imageURL);
			}
			body.appendChild(form);
			form.submit();
			body.removeChild(form);
		}
	}, {
		id: 'iqdb',
		label: 'iqdb search',
		icon: ' data:image/bmp;base64,\
		Qk02AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAADAADEDgAAxA4AAAAAAAAAAAAAAAAAAA\
		AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////\
		////////////////////////////////////////AAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAA\
		AAAAAAAAAAAAAAAAAAAAAA////AAAAAAAA////AAAA////////AAAAAAAAAAAAAAAAAAAAAAAA////\
		////AAAA////AAAAAAAAAAAAAAAA////////////AAAAAAAAAAAAAAAA////////////AAAAAAAAAA\
		AAAAAAAAAAAAAAAAAA////////////AAAAAAAA////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAA\
		AAAAAAAA////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//\
		//////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////\
		AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////AAAAAAAAAA\
		AAAAAAAAAAAAAAAAAAAAAAAAAA////////////AAAAAAAA////////////AAAAAAAAAAAAAAAAAAAA\
		AAAAAAAA////////////AAAAAAAAAAAAAAAA////////////AAAAAAAAAAAAAAAA////AAAA//////\
		//AAAAAAAAAAAAAAAAAAAAAAAA////////AAAA////AAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAA\
		AAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAA//////////////////////////////////////////\
		//////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
		search: function searchSauceNao(imageURL) {
			if (imageURL.indexOf("data:") == 0) {
				var base64Offset = imageURL.indexOf(",");
				if (base64Offset != -1) {
					var inlineImage = imageURL.substring(base64Offset + 1)
					.replace(/\+/g, "-")
					.replace(/\//g, "_")
					.replace(/\./g, "=");
					
					var form = prepareForm({action: 'https://saucenao.com/search.php'});
					addParamsToForm(form, "file", inlineImage);
					body.appendChild(form);
					form.submit();
					body.removeChild(form);
				}
			} else {
				GM_openInTab("https://saucenao.com/search.php?url=" +
				encodeURIComponent(imageURL));
			}
		}
	}
];

function populateMenu() {
	menu = body.appendChild(document.createElement("menu"));
	for (var i = 0; i < menuItems.length; i++) {
		var item = document.createElement('menuitem');
		item.id = menuItems[i].id;
		item.label = menuItems[i].label;
		item.icon = menuItems[i].icon;
		item.addEventListener('click', function(aEvent) {
			// Executed when user click on menuitem
			// aEvent.target is the <menuitem> element
			var imageURL = aEvent.target.dataset.imageURL;
			menuItems[i].search(imageURL);
		});
		menu.appendChild(item);
	}
}
populateMenu();

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

/*document.querySelectorAll("#userscript-search-by-image menuitem")
        .forEach( function (el,k,o) {
	        el.addEventListener("click", searchImage, false);
});*/

function initMenu(aEvent) {
	// Executed when user right click on web page body
	// aEvent.target is the element you right click on
	var node = aEvent.target;
	var items = document.querySelectorAll("#userscript-search-by-image menuitem");
	if (node.localName == "img") {
		body.contextmenu = 'userscript-search-by-image';
		items.forEach(function (el, k, o) {
			el.dataset.imageURL = node.src;
			console.log(el.dataset.imageURL)
		});
	} else {
		body.removeAttribute("contextmenu");
		items.forEach(function (el, k, o, arg) {
			el.dataset.imageURL = undefined
		});
	}
}

function prepareForm(options) {
	var form = document.createElement('form');
	form.method = options.method || 'POST';
	form.action = options.action || '//www.google.com/searchbyimage/upload';
	form.enctype = options.enctype || 'multipart/form-data';
	form.target = options.target || '_blank';
	return form;
}
function addParamsToForm(aForm, aKey, aValue, aType) {
  var hiddenField = document.createElement("input");
  hiddenField.type = aType || "hidden";
  hiddenField.name = aKey;
  hiddenField.value = aValue;
  aForm.appendChild(hiddenField);
}
