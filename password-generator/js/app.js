/* =============================================
   Password Generator — rooteddreams.net
   JavaScript
   Live tool: rooteddreams.net/tools/password-generator
   ============================================= */

(function () {
  'use strict';

  var CHARS = {
    Upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    Lower: 'abcdefghijklmnopqrstuvwxyz',
    Nums:  '0123456789',
    Syms:  '!@#$%^&*()-_=+[]{}|;:,.<>?'
  };

  var activeSet = { Upper: true, Lower: true, Nums: true, Syms: true };

  function getPool() {
    return Object.keys(activeSet)
      .filter(function (k) { return activeSet[k]; })
      .map(function (k) { return CHARS[k]; })
      .join('');
  }

  function randomPassword(len, pool) {
    if (!pool) return '';
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(function (n) { return pool[n % pool.length]; }).join('');
  }

  function calcStrength(len, poolSize) {
    var entropy = len * Math.log2(poolSize || 1);
    if (entropy < 30) return { label: 'Very Weak',   pct: 10,  color: '#c0392b' };
    if (entropy < 50) return { label: 'Weak',        pct: 30,  color: '#e67e22' };
    if (entropy < 70) return { label: 'Fair',        pct: 55,  color: '#f1c40f' };
    if (entropy < 90) return { label: 'Strong',      pct: 78,  color: '#7a9e6e' };
    return                   { label: 'Very Strong', pct: 100, color: '#2d6a4f' };
  }

  function showToast(msg) {
    var t = document.getElementById('rdpwToast');
    t.textContent = msg || '✓ Copied!';
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* Public functions */

  window.rdpwGen = function () {
    var len  = parseInt(document.getElementById('rdpwLen').value, 10);
    var pool = getPool();
    if (!pool) {
      document.getElementById('rdpwDisplay').textContent = 'Select at least one character type';
      return;
    }
    var pw = randomPassword(len, pool);
    document.getElementById('rdpwDisplay').textContent = pw;
    var entropy = len * Math.log2(pool.length);
    var s = calcStrength(len, pool.length);
    document.getElementById('rdpwFill').style.width      = s.pct + '%';
    document.getElementById('rdpwFill').style.background = s.color;
    document.getElementById('rdpwStrTxt').textContent    = s.label;
    document.getElementById('rdpwStrTxt').style.color    = s.color;
    document.getElementById('rdpwEntr').textContent      = '~' + Math.round(entropy) + ' bits entropy';
  };

  window.rdpwToggle = function (key, el) {
    activeSet[key] = !activeSet[key];
    el.classList.toggle('active', activeSet[key]);
    rdpwGen();
  };

  window.rdpwBulkGen = function (n) {
    var len  = parseInt(document.getElementById('rdpwLen').value, 10);
    var pool = getPool();
    if (!pool) return;
    document.getElementById('rdpwBulk').textContent =
      Array.from({ length: n }, function () { return randomPassword(len, pool); }).join('\n');
  };

  window.rdpwCopy = function (id) {
    var text = document.getElementById(id).textContent;
    if (!text || text === '—' || text.includes('Select') || text.includes('Click')) return;
    navigator.clipboard.writeText(text).then(function () { showToast('✓ Copied!'); });
  };

  // Initialise on load
  rdpwGen();

})();
