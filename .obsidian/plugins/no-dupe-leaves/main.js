/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var w=Object.create;var u=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var P=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var g=e=>u(e,"__esModule",{value:!0});var m=(e,t)=>{g(e);for(var r in t)u(e,r,{get:t[r],enumerable:!0})},O=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of k(t))!v.call(e,n)&&n!=="default"&&u(e,n,{get:()=>t[n],enumerable:!(r=y(t,n))||r.enumerable});return e},b=e=>O(g(u(e!=null?w(P(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);m(exports,{default:()=>l});var s=b(require("obsidian"));function d(e,t){let r=Object.keys(t).map(n=>C(e,n,t[n]));return r.length===1?r[0]:function(){r.forEach(n=>n())}}function C(e,t,r){let n=e[t],o=e.hasOwnProperty(t),i=r(n);return n&&Object.setPrototypeOf(i,n),Object.setPrototypeOf(a,i),e[t]=a,c;function a(...p){return i===n&&e[t]===a&&c(),i.apply(this,p)}function c(){e[t]===a&&(o?e[t]=n:delete e[t]),i!==n&&(i=n,Object.setPrototypeOf(a,n||Function))}}var h,l=class extends s.Plugin{async onload(){h=d(s.Workspace.prototype,{openLinkText(t){return function(r,n,o,i){if(o)return t&&t.apply(this,[r,n,o,i]);let a=F(r),c=!1;return app.workspace.iterateAllLeaves(p=>{let f=p.getViewState();f.type==="markdown"&&f.state?.file===a.path&&(app.workspace.setActiveLeaf(p,{focus:!0}),c=!0)}),c||(c=t&&t.apply(this,[r,n,o,i])),A(a),c}}})}onunload(){h()}};function A(e){let t=app.metadataCache.getCache(e.path),r=app.workspace.getActiveViewOfType(s.MarkdownView);if(e.heading){let n=t.headings.find(o=>o.heading===e.heading);n&&r.editor.setCursor(n.position.start.line)}else if(e.block){let n=t.blocks[e.block];n&&r.editor.setCursor(n.position.start.line)}}function F(e){let t=e.match(/\^(.*)$/),r=t?t[1]:void 0;e=e.replace(/(\^.*)$/,"");let n=e.match(/#(.*)$/),o=n?n[1]:void 0;e=e.replace(/(#.*)$/,"");let i;try{i=app.metadataCache.getFirstLinkpathDest((0,s.getLinkpath)(e),app.workspace.getActiveFile()?.path)}catch{i=null}return{path:i?.path??e,heading:o,block:r}}