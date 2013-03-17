/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

// ==UserScript==
// @name              Kaskus - Hide Deleted VM
// @id                kaskus.vm@loucypher
// @namespace         http://userscripts.org/users/12
// @description       Hide deleted VM on your profile page.
// @version           6.0
// @author            LouCypher
// @license           WTFPL http://www.wtfpl.net/
// @icon              http://loucypher.github.com/userscripts/kaskus/kaskus-48.png
// @icon64URL         http://loucypher.github.com/userscripts/kaskus/kaskus-64.png
// @contributionURL   http://loucypher.github.com/userscripts/donate.html?Kaskus+-+Hide+Deleted+VM
// @homepageURL       https://github.com/LouCypher/userscripts/tree/master/kaskus
// @supportURL        https://github.com/LouCypher/userscripts/issues
// @downloadURL       https://raw.github.com/LouCypher/userscripts/master/kaskus/kaskus-hide-deleted-vm.user.js
// @updateURL         https://raw.github.com/LouCypher/userscripts/master/kaskus/kaskus-hide-deleted-vm.user.js
// @resource          LICENSE https://raw.github.com/LouCypher/userscripts/master/licenses/WTFPL/LICENSE.txt
// @include           /^https?:\/\/www\.kaskus\.co\.id\/profile\/[0-9]+$/
// @run-at            document-start
// @grant             unsafeWindow
// ==/UserScript==

/*
Changelog:
6.0 - Add button to toggle show/hide deleted VM.
5.0 - Hide immediately if a post has been deleted.
4.0 - Don't run if user is not logged in or the page is not own profile page.
3.0 - Use afterscriptexecute event.
2.0 - Refactored.
1.0 - Initial release.
*/

var msg = "Kaskus:";
if (isMyProfile(getUserId())) start();
console.log(msg);

function getUserId() {
  var userid = "";
  document.cookie.split(";").forEach(function(cookie) {
    if (/userid/.test(cookie)) {
      userid = cookie.match(/\d+/).toString();
    }
  })
  msg += (userid ? "\n* You have " : " You're NOT ") + "logged in.";
  return userid;
}

function isMyProfile(aUserId) {
  var mine = false;
  if (location.href.match(/\d+$/) == aUserId) {
    mine = true;
  }
  if (aUserId) {
    msg += "\n* This is" + (mine ? " " : " NOT ") + "your profile page.";
  }
  return mine;
}

function start() {
  unsafeWindow.hideDeleted = true;
  window.addEventListener("afterscriptexecute", process, true);
  document.addEventListener("DOMContentLoaded", contentLoad, false);
}

function process(aEvent) {
  if (/profile.js$/.test(aEvent.target.src)) {
    window.removeEventListener(aEvent.type, arguments.callee, true);
    var $ = unsafeWindow.$;

    unsafeWindow.getVM = unsafeWindow.see_more_vm = function getVM(b) {
      b && $("#do-see-more-updates").remove();
      var profile = $("#profile-content");
      profile.append('<div class="item" style="text-align:center"' +
                     ' id="ajax_loader_html"><img src="http://kkcdn' +
                     '-static.kaskus.co.id/img/ajax-loader.gif"/></div>');
      $.getJSON("/profile/stream_activity_vm/all/" + (b ? b : "0") + "/" +
                $("#userid").val(), function(c) {
        $("#ajax_loader_html").remove("");
        $.each(c.stream_activity, function(e, f) {
          var deleted = /deleted\-vm/.test(f.content);
          var hideDeleted = unsafeWindow.hideDeleted;
          var html = '<div class="item' +
                     (deleted ? ' deleted' : '') +
                     (deleted && hideDeleted ? ' hide' : '') +
                     '" id="vm_' + f.vmid + '"><div class="item-content">' +
                     '<a href="#vm_' + f.vmid + '" class="entry-head">' +
                     '<i class="icon-star"></i></a>' + f.profilepic +
                     '<div class="message"><div class="vcard">' + f.username +
                     f.date + '</div>' + f.content + '</div></div>';
          if (f.button_action != "") {
            html += '<div class="m-meta">' + f.button_action + "</div>"
          }
          html += "</div>";
          profile.append(html);
          if (c.stream_activity.length - 1 == e && f.username != "") {
            profile.append('<div class="load-more"><a href="javascript:void(0);' +
                           '" id="do-see-more-updates" onclick="see_more_vm(\'' +
                           c.oldest_id + '\'); return false;" class="button' +
                           ' small white">Load More updates</a></div>')
          }
        })
      })
    }

    unsafeWindow.moderate_vm = function moderate_vm(a, c) {
      var b = confirm("Are you sure to " + c + " this message?");
      if (b) {
        $.get("/visitormessage/moderate/" + a + "/" + c, function(d) {
          if (c == "delete") {
            $("#vm_" + a + " .vcard").after("<b>This message has been" +
                                            " deleted.</b><br>");
            $("#vm_" + a + " .m-meta").html('<a href="javascript:void(0);"' +
                                            ' onclick="moderate_vm(' + a +
                                            ',\'undelete\');return false;"' +
                                            ' class="delete"><i class="icon-' +
                                            'trash"></i>Undelete</a>')
            $("#vm_" + a).addClass("deleted");
            unsafeWindow.hideDeleted && $("#vm_" + a).addClass("hide");
          } else {
            $("#vm_" + a).html(d);
            $("#vm_" + a).removeClass("deleted hide");
          }
        })
      }
    }
  }
}

function contentLoad(aEvent) {
  var doc = aEvent.target;
  var $ = unsafeWindow.$;

  $("#say-what .act input").after('<input type="button"' +
                                  ' value="Show deleted VM"' +
                                  ' class="button small white"' +
                                  ' style="float:left"/>');
  $("#say-what .act input[type='button']").click(function(e) {
    if ($(".deleted").hasClass("hide")) {
      e.target.value = e.target.value.replace(/^Show/, "Hide");
      $(".deleted").removeClass("hide");
      unsafeWindow.hideDeleted = false;
    } else {
      e.target.value = e.target.value.replace(/^Hide/, "Show");
      $(".deleted").addClass("hide");
      unsafeWindow.hideDeleted = true;
    }
  });
}