/*
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, you can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// ==UserScript==
// @id              extension-list-generator@loucypher
// @name            Extension List Generator
// @description     Generate list of enabled extensions from Add-ons Manager.
// @namespace       http://userscripts.org/users/12
// @version         1.3
// @author          LouCypher
// @license         MPL 2.0
// @screenshot      https://lh3.googleusercontent.com/-IW0AuEgjBIU/UWef1wVIItI/AAAAAAAADeQ/sI8hwf4_GlQ/s0/extension-list-generator.png
// @icon            https://addons.cdn.mozilla.net/media//img/addon-icons/default-32.png
// @icon64URL       https://addons.cdn.mozilla.net/media//img/addon-icons/default-64.png
// @contributionURL http://loucypher.github.io/userscripts/donate.html?Extensions+List+Generator
// @homepageURL     https://github.com/LouCypher/userscripts/tree/master/scriptish/extension-list-generator
// @supportURL      https://github.com/LouCypher/userscripts/issues
// @updateURL       https://raw.github.com/LouCypher/userscripts/master/scriptish/extension-list-generator/extension-list-generator.user.js
// @downloadURL     https://raw.github.com/LouCypher/userscripts/master/scriptish/extension-list-generator/extension-list-generator.user.js
// @resource        CHANGELOG https://raw.github.com/LouCypher/userscripts/master/scriptish/extension-list-generator/changelog.txt
// @resource        LICENSE https://raw.github.com/LouCypher/userscripts/master/licenses/MPL/LICENSE.txt
// @include         about:addons
// ==/UserScript==

var appName = Application.name;

var utilsMenu = document.getElementById("utils-menu");
utilsMenu.appendChild(document.createElement("menuseparator"));

var menu = utilsMenu.appendChild(document.createElement("menu"));
menu.setAttribute("label", "Generate extensions list");

var menupopup = menu.appendChild(document.createElement("menupopup"));

["HTML", "Markdown", "BBCode",
 "BBCode (inside spoiler tag)"].forEach(function(format) {
  var menuitem = menupopup.appendChild(document.createElement("menuitem"));
  menuitem.setAttribute("label", format);
  if (format == "BBCode (inside spoiler tag)") {
    menuitem.setAttribute("tooltiptext", "Not all forums support this tag");
  }
})

menupopup.addEventListener("command", generate, false);

function generate(aEvent) {
  AddonManager.getAddonsByTypes(["theme", "extension"], function(addons) {
    var theme;
    var extArray = [];
    addons.forEach(function(addon) {
      if (addon.isActive) {
        if (addon.type == "theme") theme = addon;
        else extArray.push(addon);
      }
    })
    extArray.sort(function(a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    switch (aEvent.target.getAttribute("label")) {
      case "HTML": generateHTML(theme, extArray); break;
      case "Markdown": generateMarkdown(theme, extArray); break;
      case "BBCode": generateBBCode(theme, extArray); break;
      case "BBCode (inside spoiler tag)": generateBBCodeS(theme, extArray); break;
    }
  })
}

function generateHTML(aTheme, aArray) {
  var extensions = "<h1>" + appName + " info</h1>"
                 + "<h2>User agent</h2><p>" + navigator.userAgent
                 + "</p><h2>Theme</h2><p>"
                 + (!isDefaultTheme(aTheme)
                    ? '<a href="' + getThemeURL(aTheme) + '">' + aTheme.name + '</a>'
                    : aTheme.name)
                 + "</p>"
                 + (!isDefaultTheme(aTheme) && aTheme.screenshots &&
                    !/getpersonas/.test(aTheme.screenshots)
                    ? '<p><img src="' + aTheme.screenshots[0].url +
                      '" alt="' + aTheme.name + '"/></p>'
                    : "")
                 + "<h2>Extensions</h2>"
                 + '<ol style="width:900px">';
  aArray.forEach(function(addon) {
    extensions += '<li style="margin-bottom:1em">'
                + (addon.reviewURL
                   ? '<a href="' + getAMOPage(addon.reviewURL) + '">' +
                     addon.name
                   : addon.homepageURL
                     ? '<a href="' + addon.homepageURL + '">' + addon.name + '</a>'
                     : '<a href="http://www.google.com/search?q="' +
                       encodeURIComponent(addon.name + " extension") +
                       '">' + addon.name)
                + "</a>" + (addon.version ? " " + addon.version : "")
                + "<br/>" + addon.description + "</li>";
  })
  extensions += "</ol>";
  doSomething(extensions, "text/html");
}

function generateMarkdown(aTheme, aArray) {
  var idx = 0;
  var extensions = "# " + appName + " info"
                 + "\n\n## User agent\n\n" + navigator.userAgent
                 + "\n\n## Theme\n\n"
                 + (!isDefaultTheme(aTheme)
                    ? "[" + aTheme.name + "](" + getThemeURL(aTheme) + ")"
                    : aTheme.name)
                 + (!isDefaultTheme(aTheme) && aTheme.screenshots &&
                    !/getpersonas/.test(aTheme.screenshots)
                    ? "\n\n![" + aTheme.name + "](" + aTheme.screenshots[0].url + ")"
                    : "")
                 + "\n\n## Extensions";
  aArray.forEach(function(addon) {
    idx++;
    extensions += "\n\n" + idx + ". "
                + (addon.reviewURL
                   ? "[" + addon.name + "](" + getAMOPage(addon.reviewURL)
                   : addon.homepageURL
                     ? "[" + addon.name + "](" + addon.homepageURL
                     : "[" + addon.name + "](" +
                       "http://www.google.com/search?q=" +
                       encodeURIComponent(addon.name + " extension"))
                + ")" + (addon.version ? " " + addon.version : "")
                + "  \n" + addon.description;
  })
  doSomething(extensions, "text/plain", "%0A%0A.md");
}

function generateBBCode(aTheme, aArray) {
  var extensions = "[b]User agent:[/b] " + navigator.userAgent
                 + "\n\n[b]Theme:[/b] "
                 + (!isDefaultTheme(aTheme)
                    ? "[url=" + getThemeURL(aTheme) + "]" + aTheme.name + "[/url]"
                    : aTheme.name)
                 + (!isDefaultTheme(aTheme) && aTheme.screenshots &&
                    !/getpersonas/.test(aTheme.screenshots)
                    ? "\n[img]" + aTheme.screenshots[0].url + "[/img]"
                    : "")
                 + "\n\n[b]Extensions:[/b]\n[list=1]";
  aArray.forEach(function(addon) {
    extensions += "[*]"
                + (addon.reviewURL
                   ? "[url=" + getAMOPage(addon.reviewURL)
                   : addon.homepageURL
                     ? "[url=" + addon.homepageURL
                     : "[url=http://www.google.com/search?q=" +
                       encodeURIComponent(addon.name + " extension"))
                + "]" + addon.name + "[/url]"
                + (addon.version ? " " + addon.version : "");
  })
  extensions += "[/list]";
  doSomething(extensions, "text/plain");
}

function generateBBCodeS(aTheme, aArray) {
  var extensions = "[spoiler=" + appName + " info]" + navigator.userAgent
                 + "\n\n[b]Theme:[/b] "
                 + (!isDefaultTheme(aTheme)
                    ? "[url=" + getThemeURL(aTheme) + "]" + aTheme.name + "[/url]"
                    : aTheme.name)
                 + (!isDefaultTheme(aTheme) && aTheme.screenshots &&
                    !/getpersonas/.test(aTheme.screenshots)
                    ? "\n[img]" + aTheme.screenshots[0].url + "[/img]"
                    : "")
                 + "\n\n[b]Extensions:[/b]\n[list=1]";
  aArray.forEach(function(addon) {
    extensions += "[*]"
                + (addon.reviewURL
                   ? "[url=" + getAMOPage(addon.reviewURL)
                   : addon.homepageURL
                     ? "[url=" + addon.homepageURL
                     : "[url=http://www.google.com/search?q=" +
                       encodeURIComponent(addon.name + " extension"))
                + "]" + addon.name + "[/url]"
                + (addon.version ? " " + addon.version : "");
  })
  extensions += "[/list][/spoiler]";
  doSomething(extensions, "text/plain");
}

function isDefaultTheme(aTheme) {
  return aTheme.id == "{972ce4c6-7e08-4474-a285-3208198ce6fd}" ||
         aTheme.id == "modern@themes.mozilla.org";
}

function getAMOPage(aReviewURL) {
  var url = aReviewURL.replace(/\/reviews\/.*$/, "/")
                      .replace(/mozilla.org\/.*\/addon\//, "mozilla.org/addon/");
  url += "?src=external-extension-list-generator";
  return url;
}

function getThemeURL(aAddon) {
  var url;
  if (aAddon.reviewURL) {
    return getAMOPage(aAddon.reviewURL);
  } else {
    var id = aAddon.id.match(/\d+/).toString();
    if (/getpersonas/.test(aAddon.screenshots[0].url)) {
      url = "http://www.getpersonas.com/persona/" + id;
    } else {
      url = "http://addons.mozilla.org/addon/" + id;
    }
  }
  url += "/?src=external-extension-list-generator";
  return url;
}

function doSomething(aString, aContentType, aExt) {
  var prompts = Services.prompt;
  var flags = prompts.BUTTON_POS_0 * prompts.BUTTON_TITLE_IS_STRING +
              prompts.BUTTON_POS_1 * prompts.BUTTON_TITLE_CANCEL +
              prompts.BUTTON_POS_2 * prompts.BUTTON_TITLE_IS_STRING;
  var doWhat = prompts.confirmEx(null, "Extension List Generator",
                                 "Extension list has been generated.", flags,
                                 "Copy", "", "View", null, {value:false});
  switch (doWhat) {
    case 0: // Copy
      Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper)
                                                 .copyString(aString);
      Cc["@mozilla.org/alerts-service;1"].getService(Ci.nsIAlertsService).
      showAlertNotification("chrome://mozapps/skin/xpinstall/xpinstallItemGeneric.png",
                            "Extension List Generator", "Copied to clipboard!",
                            false, "", null);
      break;
    case 2: // View
      openOptionsInTab("data:" + aContentType + ";charset=utf-8," +
                       encodeURIComponent(aString) + (aExt ? aExt : ""));
    default: // Cancel
  }
}