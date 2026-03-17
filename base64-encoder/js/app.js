/* =============================================
   Base64 Encoder & Decoder — rooteddreams.net
   JavaScript
   Live tool: rooteddreams.net/tools/base64-encoder
   ============================================= */

(function () {
  'use strict';

  /* ── Inject tool HTML into #tool-root ── */
  document.getElementById('tool-root').innerHTML = `
<style>
.b64-tabs{display:inline-flex;background:#e8dfd0;border-radius:9px;padding:4px;margin-bottom:22px}
.b64-tab{font-size:13px;font-weight:500;padding:7px 20px;border-radius:6px;border:none;cursor:pointer;background:transparent;color:#5c4a32;transition:all .2s;font-family:inherit}
.b64-tab.on{background:#4a6741;color:#fff;box-shadow:0 2px 7px rgba(74,103,65,.3)}
.b64-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px}
@media(max-width:640px){.b64-grid{grid-template-columns:1fr}}
.b64-plabel{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#5c4a32;opacity:.7;margin-bottom:6px}
.b64-pact{display:flex;gap:7px;margin-bottom:7px}
.b64-ta{font-family:'SFMono-Regular',Consolas,monospace;font-size:13px;line-height:1.7;border:1.5px solid #e8dfd0;border-radius:8px;padding:14px;width:100%;min-height:250px;resize:vertical;color:#3b2f1e;transition:border-color .2s;outline:none}
.b64-ta:focus{border-color:#4a6741;box-shadow:0 0 0 3px rgba(74,103,65,.1)}
.b64-ta.out{background:#f5f0e8}
.b64-ta.err{border-color:#c0392b !important;background:#fff8f7}
.b64-btn{font-size:13px;font-weight:500;padding:8px 16px;border-radius:7px;border:1.5px solid transparent;cursor:pointer;transition:all .18s;font-family:inherit}
.b64-btn.primary{background:#4a6741;color:#fff;border-color:#4a6741}.b64-btn.primary:hover{background:#3a5534}
.b64-btn.secondary{background:transparent;color:#5c4a32;border-color:#e8dfd0}.b64-btn.secondary:hover{border-color:#4a6741;color:#4a6741}
.b64-acts{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.b64-convert{font-size:14px;font-weight:600;background:#3b2f1e;color:#f5f0e8;border:none;border-radius:9px;padding:11px 28px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .2s;font-family:inherit}
.b64-convert:hover{background:#4a6741;transform:translateY(-1px)}
.b64-drop{background:#f5f0e8;border:2px dashed #e8dfd0;border-radius:11px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:16px}
.b64-drop:hover{border-color:#4a6741;background:rgba(74,103,65,.05)}
.b64-status{display:flex;align-items:center;gap:9px;font-size:12px;padding:9px 13px;background:#e8dfd0;border-radius:7px;color:#5c4a32;margin-bottom:14px}
.b64-dot{width:8px;height:8px;border-radius:50%;background:#c4b89a;flex-shrink:0}
.b64-status.ok .b64-dot{background:#2d6a4f}
.b64-status.err .b64-dot{background:#c0392b}
.b64-chips{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px}
.b64-chip{background:#f5f0e8;border:1px solid #e8dfd0;border-radius:20px;padding:4px 13px;font-size:12px;color:#5c4a32}
.b64-note{font-size:12px;color:#5c4a32;opacity:.65;text-align:center;margin-top:-4px;margin-bottom:14px}
.b64-toast{position:fixed;bottom:28px;right:28px;background:#3b2f1e;color:#f5f0e8;padding:11px 18px;border-radius:9px;font-size:13px;font-weight:500;opacity:0;pointer-events:none;transform:translateY(8px);transition:all .3s;z-index:9999}
.b64-toast.show{opacity:1;transform:translateY(0)}
</style>

<div class="b64-tabs">
  <button class="b64-tab on" onclick="b64Mode('text',this)">📝 Text</button>
  <button class="b64-tab" onclick="b64Mode('file',this)">📁 File / Image</button>
  <button class="b64-tab" onclick="b64Mode('url',this)">🌐 URL-Safe</button>
</div>

<div id="b64Text">
  <div class="b64-grid">
    <div>
      <div class="b64-plabel">Input</div>
      <div class="b64-pact">
        <button class="b64-btn secondary" onclick="b64Clear()">✕ Clear</button>
        <button class="b64-btn secondary" onclick="b64Swap()">⇄ Swap</button>
      </div>
      <textarea class="b64-ta" id="b64In" placeholder="Enter text to encode, or paste Base64 to decode…" spellcheck="false"></textarea>
    </div>
    <div>
      <div class="b64-plabel">Output</div>
      <div class="b64-pact"><button class="b64-btn secondary" onclick="b64Copy('b64Out')">⎘ Copy</button></div>
      <textarea class="b64-ta out" id="b64Out" readonly placeholder="Output will appear here…"></textarea>
    </div>
  </div>
  <div class="b64-acts">
    <button class="b64-convert" onclick="b64Encode()">⬆ Encode to Base64</button>
    <button class="b64-convert" onclick="b64Decode()">⬇ Decode from Base64</button>
  </div>
</div>

<div id="b64File" style="display:none">
  <div class="b64-drop" onclick="document.getElementById('b64FileIn').click()"
       ondragover="event.preventDefault();this.style.borderColor='#4a6741'"
       ondragleave="this.style.borderColor='#e8dfd0'"
       ondrop="b64FileDrop(event)">
    <input type="file" id="b64FileIn" style="display:none" onchange="b64HandleFile(this.files[0])">
    <div style="font-size:26px;margin-bottom:8px">📂</div>
    <div style="font-size:13px;color:#5c4a32">Click or drag a file to encode to Base64</div>
    <div style="font-size:11px;color:#4a6741;font-weight:600;margin-top:5px" id="b64FileName">Any file type · Max ~10MB</div>
  </div>
  <div class="b64-plabel" style="margin-bottom:6px">Base64 Output</div>
  <div class="b64-pact"><button class="b64-btn primary" onclick="b64Copy('b64FileOut')">⎘ Copy Base64</button></div>
  <textarea class="b64-ta out" id="b64FileOut" readonly placeholder="Base64 output…" style="min-height:180px"></textarea>
</div>

<div id="b64Url" style="display:none">
  <div class="b64-grid">
    <div>
      <div class="b64-plabel">Input</div>
      <textarea class="b64-ta" id="b64UrlIn" placeholder="Enter text to URL-safe encode…" spellcheck="false"></textarea>
    </div>
    <div>
      <div class="b64-plabel">URL-Safe Output</div>
      <textarea class="b64-ta out" id="b64UrlOut" readonly placeholder="URL-safe Base64 output…"></textarea>
    </div>
  </div>
  <div class="b64-acts">
    <button class="b64-convert" onclick="b64UrlEnc()">⬆ Encode URL-Safe</button>
    <button class="b64-convert" onclick="b64UrlDec()">⬇ Decode URL-Safe</button>
  </div>
  <p class="b64-note">Replaces <code>+</code>→<code>-</code> and <code>/</code>→<code>_</code> — safe for JWTs &amp; URLs</p>
</div>

<div class="b64-status" id="b64Status"><div class="b64-dot"></div><span id="b64Msg">Ready</span></div>
<div class="b64-chips" id="b64Chips" style="display:none">
  <div class="b64-chip">Input: <b id="b64SI">0</b> chars</div>
  <div class="b64-chip">Output: <b id="b64SO">0</b> chars</div>
  <div class="b64-chip">Size change: <b id="b64SOv">—</b></div>
</div>
<div class="b64-toast" id="b64Toast">✓ Copied!</div>
`;

  function setS(cls, txt) {
    var b = document.getElementById('b64Status');
    b.className = 'b64-status' + (cls ? ' ' + cls : '');
    document.getElementById('b64Msg').textContent = txt;
  }
  function showStats(i, o, dir) {
    document.getElementById('b64Chips').style.display = 'flex';
    document.getElementById('b64SI').textContent = i.length.toLocaleString();
    document.getElementById('b64SO').textContent = o.length.toLocaleString();
    document.getElementById('b64SOv').textContent = dir === 'enc'
      ? '+' + Math.round(((o.length / i.length) - 1) * 100) + '%'
      : '-' + Math.round((1 - (o.length / i.length)) * 100) + '%';
  }
  function toast() {
    var t = document.getElementById('b64Toast');
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  window.b64Mode = function (m, btn) {
    ['Text', 'File', 'Url'].forEach(function (k) {
      document.getElementById('b64' + k).style.display = k.toLowerCase() === m ? '' : 'none';
    });
    document.querySelectorAll('.b64-tab').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    setS('', 'Ready');
  };
  window.b64Encode = function () {
    var v = document.getElementById('b64In').value; if (!v) return;
    try {
      var enc = btoa(unescape(encodeURIComponent(v)));
      document.getElementById('b64Out').value = enc;
      document.getElementById('b64Out').classList.remove('err');
      showStats(v, enc, 'enc'); setS('ok', '✓ Encoded successfully');
    } catch (e) { setS('err', '✕ ' + e.message); }
  };
  window.b64Decode = function () {
    var v = document.getElementById('b64In').value.trim(); if (!v) return;
    try {
      var dec = decodeURIComponent(escape(atob(v)));
      document.getElementById('b64Out').value = dec;
      document.getElementById('b64Out').classList.remove('err');
      showStats(v, dec, 'dec'); setS('ok', '✓ Decoded successfully');
    } catch (e) {
      document.getElementById('b64Out').classList.add('err');
      setS('err', '✕ Invalid Base64 — ' + e.message);
    }
  };
  window.b64Swap = function () {
    var a = document.getElementById('b64In'), b = document.getElementById('b64Out');
    var tmp = a.value; a.value = b.value; b.value = tmp;
    b.classList.remove('err');
  };
  window.b64Clear = function () {
    document.getElementById('b64In').value = '';
    document.getElementById('b64Out').value = '';
    document.getElementById('b64Out').classList.remove('err');
    document.getElementById('b64Chips').style.display = 'none';
    setS('', 'Ready');
  };
  window.b64UrlEnc = function () {
    var v = document.getElementById('b64UrlIn').value; if (!v) return;
    document.getElementById('b64UrlOut').value = btoa(unescape(encodeURIComponent(v))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    setS('ok', '✓ URL-safe encoded');
  };
  window.b64UrlDec = function () {
    var v = document.getElementById('b64UrlIn').value.trim();
    var b = v.replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    try { document.getElementById('b64UrlOut').value = decodeURIComponent(escape(atob(b))); setS('ok', '✓ Decoded'); }
    catch (e) { setS('err', '✕ Invalid URL-safe Base64'); }
  };
  window.b64HandleFile = function (file) {
    if (!file) return;
    document.getElementById('b64FileName').textContent = file.name + ' · ' + (file.size / 1024).toFixed(1) + ' KB';
    var r = new FileReader();
    r.onload = function (e) {
      var b64 = e.target.result.split(',')[1];
      document.getElementById('b64FileOut').value = b64;
      setS('ok', '✓ Encoded — ' + b64.length.toLocaleString() + ' chars');
    };
    r.readAsDataURL(file);
  };
  window.b64FileDrop = function (e) {
    e.preventDefault();
    document.querySelector('.b64-drop').style.borderColor = '#e8dfd0';
    b64HandleFile(e.dataTransfer.files[0]);
  };
  window.b64Copy = function (id) {
    var v = document.getElementById(id).value;
    if (!v) return;
    navigator.clipboard.writeText(v).then(toast);
  };

})();
