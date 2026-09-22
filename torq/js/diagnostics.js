/* Opt-in, URL-search switches; hash routes remain untouched. */
TQ.diagnostics=(()=>{const q=new URLSearchParams(location.search);return {scene:q.get('scene')||'standard',forcedScene:q.has('scene'),domMotion:q.get('domMotion')!=='off',dpr:Number(q.get('dpr'))||1.5};})();
if(!TQ.diagnostics.domMotion){document.documentElement.classList.add('no-dom-motion');}
