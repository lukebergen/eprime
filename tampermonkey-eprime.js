// ==UserScript==
// @name         E-Prime Input Checker
// @namespace    http://your.homepage/
// @version      0.1
// @description  Will put a red border around any input in which violates the e-prime rules
// @author       Luke Bergen
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function() {
  DISALLOWED = / be | being | been | am | is | isn't | are | aren't | was | wasn't | were | weren't |'m |'re |'s | ain't | hain't | whatcha | yer /
 
  watchedEls = [];
  originalBorders = {};
  highlighted = {}
  var register = function() {
    els = []
    nl = document.getElementsByTagName("input");
    for(var i = nl.length; i--; els.unshift(nl[i]));
   
    nl = document.querySelectorAll("[contenteditable=true]");
    for(var i = nl.length; i--; els.unshift(nl[i]));
    
    matched = function matched(el) {
          if (el.tagName == "INPUT") {
            text = el.value;
          } else {
            text = el.textContent;
          }
          return (text.match(DISALLOWED) !== null)
    };
    window.matched = matched;
      
    for (var i = 0 ; i < els.length ; i++) {
      if (watchedEls.indexOf(els[i]) === -1) {
        if (matched(els[i])) {
          originalBorders[els[i].DOCUMENT_NODE] = els[i].style.border;
        }
        els[i].addEventListener("keyup", function(e) {
          if (matched(e.target)) {
            e.target.style.border = "2px solid RED";
          } else {
            e.target.style.border = originalBorders[e.target.DOCUMENT_NODE];
          }
        });
      }
    }
  }

  var observer = new MutationObserver(register);
  observer.observe(document, {childList: true, subtree: true});
})();
