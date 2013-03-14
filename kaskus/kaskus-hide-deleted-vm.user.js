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
// @version           1.0
// @author            LouCypher
// @license           WTFPL http://www.wtfpl.net/
// @icon              http://loucypher.github.com/userscripts/kaskus/kaskus-48.png
// @icon64URL         http://loucypher.github.com/userscripts/kaskus/kaskus-64.png
// @contributionURL   http://loucypher.github.com/userscripts/donate.html?Kaskus+-+Hide+Deleted+VM+userscript
// @homepageURL       https://github.com/LouCypher/userscripts/tree/master/kaskus
// @supportURL        https://github.com/LouCypher/userscripts/issues
// @downloadURL       https://raw.github.com/LouCypher/userscripts/master/kaskus/kaskus-hide-deleted-vm.user.js
// @updateURL         https://raw.github.com/LouCypher/userscripts/master/kaskus/kaskus-hide-deleted-vm.user.js
// @resource          LICENSE https://raw.github.com/LouCypher/userscripts/master/licenses/WTFPL/LICENSE.txt
// @include           http://www.kaskus.co.id/profile/*
// @run-at            document-start
// @grant             unsafeWindow
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e) {
  e.target.removeEventListener(e.type, arguments.callee, true);

  var $ = unsafeWindow.$;
  var profile = $("#profile-content");

  unsafeWindow.getVM =   function getVM() {
    var a = $("#userid").val();
    profile.append('<div class="item" style="text-align:center"' +
                   ' id="ajax_loader_html"><img src="http://kkcdn' +
                   '-static.kaskus.co.id/img/ajax-loader.gif"/></div>');
    $.getJSON("/profile/stream_activity_vm/all/0/" + a, function (b) {
      $("#ajax_loader_html").remove("");
      $.each(b.stream_activity, function (d, e) {
        var deleted = /deleted\-vm/.test(e.content);
        html = '<div class="item' + (deleted ? ' hide' : '') +
               '" id="vm_' + e.vmid + '"><div class="item-content">' +
               '<a href="#vm_' + e.vmid + '" class="entry-head">' +
               '<i class="icon-star"></i></a>' + e.profilepic +
               '<div class="message"><div class="vcard">' + e.username +
               e.date + '</div>' + e.content + '</div></div>';
        if (e.button_action != "") {
          html = html + '<div class="m-meta">' + e.button_action + "</div>"
        }
        html = html + "</div>";
        profile.append(html);
        if (b.stream_activity.length - 1 == d && e.username != "") {
          profile.append('<div class="load-more"><a href="javascript:void(0);' +
                         '" id="do-see-more-updates" onclick="see_more_vm(\'' +
                         b.oldest_id + '\'); return false;" class="button' +
                         ' small white">Load More updates</a></div>')
        }
      })
    })
  }

  unsafeWindow.see_more_vm = function see_more_vm(b) {
    var a = $("#userid").val();
    $("#do-see-more-updates").remove();
    profile.append('<div class="item" style="text-align:center"' +
                   ' id="ajax_loader_html"><img src="http://kkcdn-static' +
                   '.kaskus.co.id/img/ajax-loader.gif"/></div>');
    $.getJSON("/profile/stream_activity_vm/all/" + b + "/" + a, function(c) {
      $("#ajax_loader_html").remove("");
      $.each(c.stream_activity, function(e, f) {
        var deleted = /deleted\-vm/.test(f.content);
        html = '<div class="item' + (deleted ? ' hide' : '') + '" id="vm_' +
               f.vmid + '"><div class="item-content"><a href="#vm_' + f.vmid +
               '" class="entry-head"><i class="icon-star"></i></a>' +
               f.profilepic + '<div class="message"><div class="vcard">' +
               f.username + f.date + '</div>' + f.content + '</div></div>';
        if (f.button_action != "") {
          html = html + '<div class="m-meta">' + f.button_action + "</div>"
        }
        html = html + "</div>";
        profile.append(html);
        if (c.stream_activity.length - 1 == e && f.username != "") {
          profile.append('<div class="load-more"><a href="javascript:void(0);"'+
                         ' id="do-see-more-updates" onclick="see_more_vm(\'' +
                         c.oldest_id + '\'); return false;" class="button'+
                         ' small white">Load More updates</a></div>')
        }
      })
    })
  }
}, true)