/* =============================================
   JSON Formatter — rooteddreams.net
   JavaScript
   Live tool: rooteddreams.net/tools/json-formatter
   ============================================= */

(function () {
  'use strict';

  var inp = document.getElementById('rdFmtInput');
  var out = document.getElementById('rdFmtOutput');
  var bar = document.getElementById('rdFmtStatus');
  var msg = document.getElementById('rdFmtMsg');
  var tst = document.getElementById('rdFmtToast');

  // Auto-format on paste or Ctrl+Enter
  inp.addEventListener('paste', function () { setTimeout(rdFmtFormat, 50); });
  inp.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') rdFmtFormat();
  });

  function getIndent() {
    var v = document.getElementById('rdFmtIndent').value;
    return v === 'tab' ? '\t' : parseInt(v, 10);
  }

  function syntaxHighlight(json) {
    return json
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          var cls = 'json-number';
          if (/^"/.test(match)) cls = /:$/.test(match) ? 'json-key' : 'json-string';
          else if (/true|false/.test(match)) cls = 'json-bool';
          else if (/null/.test(match)) cls = 'json-null';
          return '<span class="' + cls + '">' + match + '</span>';
        }
      );
  }

  function countKeys(obj, n) {
    n = n || 0;
    if (typeof obj !== 'object' || obj === null) return n;
    for (var k in obj) { n++; n = countKeys(obj[k], n); }
    return n;
  }

  function setStatus(type, text) {
    bar.className = 'status-bar' + (type ? ' ' + type : '');
    msg.textContent = text;
  }

  function showToast() {
    tst.classList.add('show');
    setTimeout(function () { tst.classList.remove('show'); }, 2200);
  }

  /* Public functions — called from HTML onclick attributes */

  window.rdFmtFormat = function () {
    var raw = inp.value.trim();
    if (!raw) {
      setStatus('', 'Waiting for input…');
      out.innerHTML = 'Your formatted JSON will appear here…';
      out.className = 'code-output';
      return;
    }
    try {
      var parsed    = JSON.parse(raw);
      var formatted = JSON.stringify(parsed, null, getIndent());
      out.innerHTML  = syntaxHighlight(formatted);
      out.className  = 'code-output state-ok';
      var keys = countKeys(parsed);
      var size = new Blob([formatted]).size;
      setStatus('state-ok', '✓ Valid JSON · ' + keys + ' key' + (keys !== 1 ? 's' : '') + ' · ' + size + ' bytes');
    } catch (e) {
      out.textContent = e.message;
      out.className   = 'code-output state-err';
      setStatus('state-err', '✕ Invalid JSON — ' + e.message);
    }
  };

  window.rdFmtMinify = function () {
    var raw = inp.value.trim();
    if (!raw) return;
    try {
      var minified = JSON.stringify(JSON.parse(raw));
      out.innerHTML = syntaxHighlight(minified);
      out.className = 'code-output state-ok';
      setStatus('state-ok', '✓ Minified · ' + new Blob([minified]).size + ' bytes');
    } catch (e) {
      out.textContent = e.message;
      out.className   = 'code-output state-err';
      setStatus('state-err', '✕ ' + e.message);
    }
  };

  window.rdFmtClear = function () {
    inp.value       = '';
    out.textContent = 'Your formatted JSON will appear here…';
    out.className   = 'code-output';
    setStatus('', 'Waiting for input…');
  };

  window.rdFmtCopy = function () {
    var text = out.innerText || out.textContent;
    if (!text || text.includes('appear here')) return;
    navigator.clipboard.writeText(text).then(showToast);
  };

})();
