!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t():"function"==typeof define&&define.amd?define(t):t()}(0,function(){"use strict";function e(e){let t=0,n=1,r=1;return{curr:(n=0)=>e[t+n],end:()=>e.length<=t,info:()=>({index:t,col:n,line:r}),index:e=>void 0===e?t:t=e,next(){let s=e[t++];return"\n"==s?(r++,n=0):n++,s}}}function t(t){t=t.trim();let n=[];if(!/^var\(/.test(t))return n;let r=e(t);try{n=function(e){let t="",n=[],r=[],s={};for(;!e.end();){let i=e.curr();if("("==i)n.push(i),t="";else if(")"==i||","==i){if(/^\-\-.+/.test(t)&&(s.name?(s.alternative||(s.alternative=[]),s.alternative.push({name:t})):s.name=t),")"==i){if("("!=n[n.length-1])throw new Error("bad match");n.pop()}","==i&&(n.length||(r.push(s),s={})),t=""}else/\s/.test(i)||(t+=i);e.next()}return n.length?[]:(s.name&&r.push(s),r)}(r)}catch(e){console.error(e&&e.message||"Bad variables.")}return n}function n(e){let t=String(e).trim();if(!t)return"";let n=t.match(/\d(\D+)$/);return n?n[1]:""}function r(e){return Number(String(e).replace(/\D+$/g,""))}function s(e,...t){return t.reduce((e,t)=>e[Array.isArray(t)?"apply":"call"](null,t),e)}function i(e){return(e||[]).join("\n")}function l(e,t,n){return Math.max(t,Math.min(n,e))}const u={};function o(e,t){return(...n)=>{let r=e+n.join("-");return u[r]?u[r]:u[r]=t.apply(null,n)}}function a(...e){let t=e.reduce((e,t)=>e.concat(t),[]);return t[~~(Math.random()*t.length)]}function c(e,t,n){let r=0,s=e,i=e=>e>0&&e<1?.1:1,l=arguments.length;1==l&&([e,t]=[i(e),e]),l<3&&(n=i(e));let u=[];for(;(n>=0&&e<=t||n<0&&e>t)&&(u.push(e),e+=n,!(r++>=1e3)););return u.length||u.push(s),u}function p(e){return(...t)=>{let s=n(t[0])||n(t[1]);return function(e,t){return(...n)=>{n=n.map(r);let s=e.apply(null,n);return t&&(s=s.map(e=>e+t)),s}}(e,s).apply(null,t)}}function h(e){return(...t)=>{let n=t.map(e=>String(e).charCodeAt(0));return e.apply(null,n).map(e=>String.fromCharCode(e))}}function f(e){return e[e.length-1]}function d(e){return e[0]}const g=(()=>{let e;return t=>{if(!e){let t=new Set;for(let e in document.head.style)e.startsWith("-")||t.add(e.replace(/[A-Z]/g,"-$&").toLowerCase());t.has("grid-gap")||t.add("grid-gap"),e=Array.from(t)}return t&&t.test?e.filter(e=>t.test(e)):e}})();function m(e,t){return Array.prototype.flatMap?e.flatMap(t):e.reduce((e,n)=>e.concat(t(n)),[])}const y={func:(e="")=>({type:"func",name:e,arguments:[]}),argument:()=>({type:"argument",value:[]}),text:(e="")=>({type:"text",value:e}),pseudo:(e="")=>({type:"pseudo",selector:e,styles:[]}),cond:(e="")=>({type:"cond",name:e,styles:[],arguments:[]}),rule:(e="")=>({type:"rule",property:e,value:[]}),keyframes:(e="")=>({type:"keyframes",name:e,steps:[]}),step:(e="")=>({type:"step",name:e,styles:[]})},x={white_space:e=>/[\s\n\t]/.test(e),line_break:e=>/\n/.test(e),number:e=>!isNaN(e),pair:e=>['"',"(",")","'"].includes(e),pair_of:(e,t)=>({'"':'"',"'":"'","(":")"})[e]==t};function _(e,{col:t,line:n}){console.error(`(at line ${n}, column ${t}) ${e}`)}function v(e){return function(t,n){let r=t.index(),s="";for(;!t.end();){let n=t.next();if(e(n))break;s+=n}return n&&t.index(r),s}}function b(e,t){return v(e=>/[^\w@]/.test(e))(e,t)}function $(e){return v(e=>/[\s\{]/.test(e))(e)}function k(e,t){return v(e=>x.line_break(e)||"{"==e)(e,t)}function w(e,t){let n,r=y.step();for(;!e.end()&&"}"!=(n=e.curr());)if(x.white_space(n))e.next();else{if(r.name.length){if(r.styles.push(N(e,t)),"}"==e.curr())break}else r.name=C(e);e.next()}return r}function z(e,t){const n=[];let r;for(;!e.end()&&"}"!=(r=e.curr());)x.white_space(r)?e.next():(n.push(w(e,t)),e.next());return n}function j(e,t){let n,r=y.keyframes();for(;!e.end()&&"}"!=(n=e.curr());)if(r.name.length){if("{"==n){e.next(),r.steps=z(e,t);break}e.next()}else if(b(e),r.name=$(e),!r.name.length){_("missing keyframes name",e.info());break}return r}function A(e,t={}){for(e.next();!e.end();){let n=e.curr();if(t.inline){if("\n"==n)break}else if("*"==(n=e.curr())&&"/"==e.curr(1))break;e.next()}t.inline||(e.next(),e.next())}function M(e){let t,n="";for(;!e.end()&&":"!=(t=e.curr());)x.white_space(t)||(n+=t),e.next();return n}function S(e){let t,n=[],r=[],s=[],i="";for(;!e.end();){if(t=e.curr(),/[\('"`]/.test(t)&&"\\"!==e.curr(-1))s.length&&"("!=t&&t===f(s)?s.pop():s.push(t),i+=t;else if("@"==t)r.length||(i=i.trimLeft()),i.length&&(r.push(y.text(i)),i=""),r.push(O(e));else if(/[,)]/.test(t)){if(s.length)")"==t&&s.pop(),i+=t;else if(i.length&&(r.length?i.length&&r.push(y.text(i)):r.push(y.text((l=i).trim().length?x.number(+l)?+l:l.trim():l))),n.push(E(r)),[r,i]=[[],""],")"==t)break}else i+=t;e.next()}var l;return n}function E(e){let t=e.map(e=>{if("text"==e.type&&"string"==typeof e.value){let t=String(e.value);t.includes("`")&&(e.value=t=t.replace(/`/g,'"')),e.value=t.replace(/\n+|\s+/g," ")}return e}),n=d(t)||{},r=f(t)||{};if("text"==n.type&&"text"==r.type){let e=d(n.value),t=f(r.value);"string"==typeof n.value&&"string"==typeof r.value&&x.pair(e)&&x.pair_of(e,t)&&(n.value=n.value.slice(1),r.value=r.value.slice(0,r.value.length-1))}return t}function O(e){let t,n=y.func(),r="";for(;!e.end()&&")"!=(t=e.curr());){if("("==t){e.next(),n.name=r,n.arguments=S(e),n.position=e.info().index;break}r+=t,e.next()}return n}function L(e){let t,n=y.text(),r=0,s=!0;const i=[],l=[];for(i[r]=[];!e.end();)if(t=e.curr(),s&&x.white_space(t))e.next();else{if(s=!1,"\n"!=t||x.white_space(e.curr(-1)))if(","!=t||l.length){if(/[;}]/.test(t)){n.value.length&&(i[r].push(n),n=y.text());break}"@"==t?(n.value.length&&(i[r].push(n),n=y.text()),i[r].push(O(e))):x.white_space(t)&&x.white_space(e.curr(-1))||("("==t&&l.push(t),")"==t&&l.pop(),n.value+=t)}else n.value.length&&(i[r].push(n),n=y.text()),i[++r]=[],s=!0;else n.value+=" ";e.next()}return n.value.length&&i[r].push(n),i}function C(e){let t,n="";for(;!e.end()&&"{"!=(t=e.curr());)x.white_space(t)||(n+=t),e.next();return n}function T(e){let t,n={name:"",arguments:[]};for(;!e.end();){if("("==(t=e.curr()))e.next(),n.arguments=S(e);else{if(/[){]/.test(t))break;x.white_space(t)||(n.name+=t)}e.next()}return n}function H(e,t){let n,r=y.pseudo();for(;!e.end()&&"}"!=(n=e.curr());)if(x.white_space(n))e.next();else{if(r.selector){let n=N(e,t);if("@use"==n.property?r.styles=r.styles.concat(n.value):r.styles.push(n),"}"==e.curr())break}else r.selector=C(e);e.next()}return r}function N(e,t){let n,r=y.rule();for(;!e.end()&&";"!=(n=e.curr());){if(r.property.length){r.value=L(e);break}if(r.property=M(e),"@use"==r.property){r.value=P(e,t);break}e.next()}return r}function W(e,t){let n,r=y.cond();for(;!e.end()&&"}"!=(n=e.curr());){if(r.name.length)if(":"==n){let t=H(e);t.selector&&r.styles.push(t)}else if("@"!=n||k(e,!0).includes(":")){if(!x.white_space(n)){let n=N(e,t);if(n.property&&r.styles.push(n),"}"==e.curr())break}}else r.styles.push(W(e));else Object.assign(r,T(e));e.next()}return r}function R(e,t){let n="";return e&&e.get_custom_property_value&&(n=e.get_custom_property_value(t)),n}function P(e,n){return e.next(),(L(e)||[]).reduce((e,r)=>{!function e(n,r){n.forEach&&n.forEach(n=>{if("text"==n.type&&n.value){let e=t(n.value);n.value=e.reduce((e,t)=>{let n,s="",i="";!(s=R(r,t.name))&&t.alternative&&t.alternative.every(e=>{if(i=R(r,e.name))return s=i,!1});try{n=U(s,r)}catch(e){}return n&&e.push.apply(e,n),e},[])}"func"==n.type&&n.arguments&&n.arguments.forEach(t=>{e(t,r)})})}(r,n);let[s]=r;return s.value&&s.value.length&&e.push(...s.value),e},[])}function U(t,n){const r=e(t),s=[];for(;!r.end();){let e=r.curr();if(x.white_space(e))r.next();else{if("/"==e&&"*"==r.curr(1))A(r);else if("/"==e&&"/"==r.curr(1))A(r,{inline:!0});else if(":"==e){let e=H(r,n);e.selector&&s.push(e)}else if("@"==e&&"@keyframes"===b(r,!0)){let e=j(r,n);s.push(e)}else if("@"!=e||k(r,!0).includes(":")){if(!x.white_space(e)){let e=N(r,n);e.property&&s.push(e)}}else{let e=W(r,n);e.name.length&&s.push(e)}r.next()}}return s}const[Z,q,B]=[1,32,1024];function D(e){let[t,n]=(e+"").replace(/\s+/g,"").replace(/[,ï¼ŒxX]+/,"x").split("x").map(Number);const r=1==t||1==n?B:q,s={x:l(t||Z,1,r),y:l(n||t||Z,1,r)};return Object.assign({},s,{count:s.x*s.y})}const I={"*":3,"/":3,"%":3,"+":2,"-":2,"(":1,")":1};function V(e){let t=function(e){let t=String(e),n=[],r="";for(let e=0;e<t.length;++e){let s=t[e];if(I[s])if("-"==s&&"e"==t[e-1])r+=s;else if(n.length||r.length||!/[+-]/.test(s)){let{type:e,value:t}=f(n)||{};"operator"==e&&!r.length&&/[^()]/.test(s)&&/[^()]/.test(t)?r+=s:(r.length&&(n.push({type:"number",value:r}),r=""),n.push({type:"operator",value:s}))}else r+=s;else/\S/.test(s)&&(r+=s)}return r.length&&n.push({type:"number",value:r}),n}(e);const n=[],r=[];for(let e=0;e<t.length;++e){let{type:s,value:i}=t[e];if("number"==s)r.push(i);else if("operator"==s)if("("==i)n.push(i);else if(")"==i){for(;n.length&&"("!=f(n);)r.push(n.pop());n.pop()}else{for(;n.length&&I[f(n)]>=I[i];){let e=n.pop();/[()]/.test(e)||r.push(e)}n.push(i)}}for(;n.length;)r.push(n.pop());return r}function X(e,t,n){switch(e){case"+":return t+n;case"-":return t-n;case"*":return t*n;case"/":return t/n;case"%":return t%n}}function F(e){const t=V(e),n=[];for(;t.length;){let e=t.shift();if(/\d+/.test(e))n.push(e);else{let t=n.pop(),r=n.pop();n.push(X(e,Number(r),Number(t)))}}return n[0]}function G(e,t){if(t){let n=new Blob([e],{type:"image/svg+xml"});return`url(${URL.createObjectURL(n)}#${t})`}return`url("data:image/svg+xml;utf8,${encodeURIComponent(e)}")`}function J(e){const t='xmlns="http://www.w3.org/2000/svg"';return e.includes("<svg")||(e=`<svg ${t}>${e}</svg>`),e.includes("xmlns")||(e=e.replace(/<svg([\s>])/,`<svg ${t}$1`)),e}function K(e,t){return{type:e,value:t}}const Q=o("build_range",e=>{return m(function(e){let t=String(e),n=[],r=[];if(!t.startsWith("[")||!t.endsWith("]"))return n;for(let e=1;e<t.length-1;++e){let s=t[e];if("-"!=s||"-"!=t[e-1])if("-"!=s)if("-"!=f(r))r.length&&n.push(K("char",r.pop())),r.push(s);else{r.pop();let e=r.pop();n.push(e?K("range",[e,s]):K("char",s))}else r.push(s)}return r.length&&n.push(K("char",r.pop())),n}(e),({type:e,value:t})=>{if("char"==e)return t;let[n,r]=t,s=!1;n>r&&([n,r]=[r,n],s=!0);let i=h(c)(n,r);return s&&i.reverse(),i})});function Y(e){return(...t)=>e.apply(null,m(t,e=>String(e).startsWith("[")?Q(e):e))}function ee(e){let t=()=>e;return t.lazy=!0,t}const te={pick:"",rand:""},ne={index:({count:e})=>t=>e,row:({x:e})=>t=>e,col:({y:e})=>t=>e,size:({grid:e})=>t=>e.count,"size-row":({grid:e})=>t=>e.x,"size-col":({grid:e})=>t=>e.y,n:({idx:e})=>t=>e||0,pick:()=>Y((...e)=>te.pick=a(e)),"pick-n":({count:e,idx:t})=>Y((...n)=>{let r=n.length,s=((null==t?e:t)-1)%r;return te.pick=n[s]}),"pick-d"({count:e,idx:t,context:n,position:r}){let s="pd-"+r;return Y((...r)=>{n[s]||(n[s]=function(e){let t=Array.from?Array.from(e):e.slice(),n=e.length;for(;n--;){let e=~~(Math.random()*n),r=t[n];t[n]=t[e],t[e]=r}return t}(r));let i=r.length,l=((null==t?e:t)-1)%i;return te.pick=n[s][l]})},"last-pick":()=>()=>te.pick,multiple:ee((e,t)=>{let n=[];if(!t||!e)return n;let r=l(e(),1,65536);for(let e=0;e<r;++e)n.push(t(e+1));return n.join(",")}),repeat:ee((e,t)=>{let n="";if(!t||!e)return n;let r=l(e(),1,65536);for(let e=0;e<r;++e)n+=t(e+1);return n}),rand:()=>(...e)=>{let[t,n]=e,r=p;return/^[a-zA-Z]$/.test(t)&&/^[a-zA-Z]$/.test(n)&&(r=h),te.rand=a(o("range",r(c)).apply(null,e))},"last-rand":()=>()=>te.rand,calc:()=>e=>F(e),hex:()=>e=>Number(e).toString(16),svg:ee(e=>{if(void 0===e)return"";return G(J(e().trim()))}),"svg-filter":ee(e=>{if(void 0===e)return"";let t=function(e=""){return e+Math.random().toString(32).substr(2)}("filter-");return G(J(e().trim()).replace(/<filter([\s>])/,`<filter id="${t}"$1`),t)}),var:()=>e=>`var(${e})`};var re,se,ie=(re=ne,se={multi:"multiple",m:"multiple",pn:"pick-n",pd:"pick-d",r:"rand",p:"pick",lp:"last-pick",lr:"last-rand",i:"index","pick-by-turn":"pick-n","max-row":"size-row","max-col":"size-col"},Object.keys(se).forEach(e=>{re[e]=re[se[e]]}),re);const le=e=>/[,ï¼Œ\s]/.test(e);function ue(e){for(;!e.end()&&le(e.curr(1));)e.next()}function oe(t){const n=e(t),r=[],s=[];let i="";for(;!n.end();){let e=n.curr();"("==e?(i+=e,s.push(e)):")"==e?(i+=e,s.length&&s.pop()):s.length?i+=e:le(e)?(r.push(i),i="",ue(n)):i+=e,n.next()}return i&&r.push(i),r}const{cos:ae,sin:ce,sqrt:pe,pow:he,PI:fe}=Math,de=fe/180;function ge(e,t){"function"==typeof arguments[0]&&(t=e,e={}),t||(t=(e=>[ae(e),ce(e)]));let n=e.split||120,r=e.scale||1,s=de*(e.start||0),i=e.deg?e.deg*de:fe/(n/2),l=[];for(let e=0;e<n;++e){let n=s+i*e,[u,o]=t(n);l.push(50*u*r+50+"% "+(50*o*r+50)+"%")}return e.type?`polygon(${e.type}, ${l.join(",")})`:`polygon(${l.join(",")})`}function me(e,t,n){let r=de*n;return[e*ae(r)-t*ce(r),t*ae(r)+e*ce(r)]}const ye={circle:()=>"circle(49%)",triangle:()=>ge({split:3,start:-90},e=>[1.1*ae(e),1.1*ce(e)+.2]),rhombus:()=>ge({split:4}),pentagon:()=>ge({split:5,start:54}),hexgon:()=>ge({split:6,start:30}),hexagon:()=>ge({split:6,start:30}),heptagon:()=>ge({split:7,start:-90}),octagon:()=>ge({split:8,start:22.5}),star:()=>ge({split:5,start:54,deg:144}),diamond:()=>"polygon(50% 5%, 80% 50%, 50% 95%, 20% 50%)",cross:()=>"polygon(\n 5% 35%, 35% 35%, 35% 5%, 65% 5%,\n 65% 35%, 95% 35%, 95% 65%, 65% 65%,\n 65% 95%, 35% 95%, 35% 65%, 5% 65%\n )",clover:(e=3)=>(4==(e=l(e,3,5))&&(e=2),ge({split:240},t=>{let n=ae(e*t)*ae(t),r=ae(e*t)*ce(t);return 3==e&&(n-=.2),2==e&&(n/=1.1,r/=1.1),[n,r]})),hypocycloid(e=3){let t=1-(e=l(e,3,6));return ge({scale:1/e},n=>{let r=t*ae(n)+ae(t*(n-fe)),s=t*ce(n)+ce(t*(n-fe));return 3==e&&(r=1.1*r-.6,s*=1.1),[r,s]})},astroid:()=>ye.hypocycloid(4),infinity:()=>ge(e=>{let t=.7*pe(2)*ae(e),n=he(ce(e),2)+1;return[t/n,t*ce(e)/n]}),heart:()=>ge(e=>{return me(1.2*(.75*he(ce(e),3)),1.1*(ae(1*e)*(13/18)-ae(2*e)*(5/18)-ae(3*e)/18-ae(4*e)/18+.2),180)}),bean:()=>ge(e=>{let[t,n]=[he(ce(e),3),he(ae(e),3)];return me((t+n)*ae(e)*1.3-.45,(t+n)*ce(e)*1.3-.45,-90)}),bicorn:()=>ge(e=>me(ae(e),he(ce(e),2)/(2+ce(e))-.5,180)),pear:()=>ge(e=>[ce(e),(1+ce(e))*ae(e)/1.4]),fish:()=>ge(e=>[ae(e)-he(ce(e),2)/pe(2),ce(2*e)/2]),whale:()=>ge({split:240},e=>{let t=3.4*(he(ce(e),2)-.5)*ae(e);return me(ae(e)*t+.75,ce(e)*t*1.2,180)}),bud:(e=3)=>(e=l(e,3,10),ge({split:240},t=>[(1+.2*ae(e*t))*ae(t)*.8,(1+.2*ae(e*t))*ce(t)*.8])),alien(...e){let[t=1,n=1,r=1,s=1,i=1]=e.map(e=>l(e,1,9));return ge({split:480,type:"evenodd"},e=>[.31*(ae(e*t)+ae(e*r)+ae(e*i)),.31*(ce(e*n)+ce(e*s)+ce(e))])}};function xe(e){let t=new RegExp(`\\-?${e}\\-?`);return g(t).map(e=>e.replace(t,"")).reduce((e,t)=>(e[t]=t,e),{})}const _e=xe("webkit"),ve=xe("moz");function be(e,t){return _e[e]?`-webkit-${t}${t}`:ve[e]?`-moz-${t}${t}`:t}var $e={"@size"(e,{is_special_selector:t}){let[n,r=n]=oe(e);return`\n width:${n};height:${r};${t?"":`\n --internal-cell-width:${n};--internal-cell-height:${r};`}`},"@min-size"(e){let[t,n=t]=oe(e);return`min-width:${t};min-height:${n};`},"@max-size"(e){let[t,n=t]=oe(e);return`max-width:${t};max-height:${n};`},"@place-cell":(()=>{let e={center:"50%",0:"0%",left:"0%",right:"100%",top:"50%",bottom:"50%"},t={center:"50%",0:"0%",top:"0%",bottom:"100%",left:"50%",right:"50%"};return n=>{let[r,s="50%"]=oe(n);const i="var(--internal-cell-width, 25%)",l="var(--internal-cell-height, 25%)";return`\n position:absolute;left:${r=e[r]||r};top:${s=t[s]||s};width:${i};height:${l};margin-left:calc(${i}/ -2) !important;margin-top:calc(${l}/ -2) !important;grid-area:unset !important;`}})(),"@grid"(e,t){let[n,r]=e.split("/").map(e=>e.trim());return{grid:D(n),size:r?this["@size"](r,t):""}},"@shape":o("shape-property",e=>{let[t,...n]=oe(e);return ye[t]?be("clip-path",`clip-path:${ye[t].apply(null,n)};`)+"overflow:hidden;":""}),"@use"(e){if(e.length>2)return e}};function ke(e,t,n){let r=function(e){return t=>String(e).replace(/(\d+)(n)/g,"$1*"+t).replace(/n/g,t)}(e);for(let e=0;e<=n;++e)if(F(r(e))==t)return!0}const we={even:e=>!!(e%2),odd:e=>!(e%2)};function ze(e){return/^(even|odd)$/.test(e)}var je={at:({x:e,y:t})=>(n,r)=>e==n&&t==r,nth:({count:e,grid:t})=>n=>ze(n)?we[n](e-1):ke(n,e,t.count),row:({x:e,grid:t})=>n=>ze(n)?we[n](e-1):ke(n,e,t.x),col:({y:e,grid:t})=>n=>ze(n)?we[n](e-1):ke(n,e,t.y),even:({count:e})=>t=>we.even(e-1),odd:({count:e})=>t=>we.odd(e-1),random:()=>(e=.5)=>(e>=1&&e<=0&&(e=.5),Math.random()<e)};var Ae=Object.getOwnPropertyNames(Math).reduce((e,t)=>(e[t]=(()=>(...e)=>"number"==typeof Math[t]?Math[t]:Math[t].apply(null,e.map(F))),e),{});function Me(e){return/^\:(host|doodle)/.test(e)}function Se(e){return/^\:(container|parent)/.test(e)}function Ee(e){return Me(e)||Se(e)}class Oe{constructor(e){this.tokens=e,this.rules={},this.props={},this.keyframes={},this.grid=null,this.coords=[],this.reset()}reset(){this.styles={host:"",container:"",cells:"",keyframes:""},this.coords=[];for(let e in this.rules)e.startsWith(".cell")&&delete this.rules[e]}add_rule(e,t){let n=this.rules[e];var r;n||(n=this.rules[e]=[]),n.push.apply(n,(r=t,Array.isArray(r)?r:[r]))}pick_func(e){return ie[e]||Ae[e]}compose_aname(...e){return e.join("-")}compose_selector(e,t=""){return`.cell:nth-of-type(${e})${t}`}compose_argument(e,t,n){let r=e.map(e=>{if("text"==e.type)return e.value;if("func"==e.type){let r=this.pick_func(e.name.substr(1));if(r){t.idx=n,t.position=e.position;let i=e.arguments.map(e=>r.lazy?n=>this.compose_argument(e,t,n):this.compose_argument(e,t,n));return s(r,t,i)}}});return r.length>=2?r.join(""):r[0]}compose_value(e,t){return e&&e.reduce?e.reduce((e,n)=>{switch(n.type){case"text":e+=n.value;break;case"func":{let r=n.name.substr(1),i=this.pick_func(r);if(i){t.position=n.position;let r=n.arguments.map(e=>i.lazy?n=>this.compose_argument(e,t,n):this.compose_argument(e,t));e+=s(i,t,r)}}}return e},""):""}compose_rule(e,t,n){let r=Object.assign({},t),s=e.property,i=e.value.map(e=>this.compose_value(e,r)),l=i.join(", ");if(/^animation(\-name)?$/.test(s)&&(this.props.has_animation=!0,r.count>1)){let{count:e}=r;switch(s){case"animation-name":l=i.map(t=>this.compose_aname(t,e)).join(", ");break;case"animation":l=i.map(t=>{let n=(t||"").split(/\s+/);return n[0]=this.compose_aname(n[0],e),n.join(" ")}).join(", ")}}"content"==s&&(/["']|^(var|counter|attr)\(/.test(l)||(l=`'${l}'`)),"transition"==s&&(this.props.has_transition=!0);let u=`${s}:${l};`;if(u=be(s,u),"clip-path"==s&&(u+=";overflow:hidden;"),"width"!=s&&"height"!=s||Ee(n)||(u+=`--internal-cell-${s}:${l};`),$e[s]){let t=$e[s](l,{is_special_selector:Ee(n)});switch(s){case"@grid":Me(n)&&(this.grid=t.grid,u=t.size||"");break;case"@place-cell":Me(n)||(u=t);case"@use":e.value.length&&this.compose(r,e.value),u=$e[s](e.value);default:u=t}}return u}compose(e,t){this.coords.push(e),(t||this.tokens).forEach((t,n)=>{if(t.skip)return!1;switch(t.type){case"rule":this.add_rule(this.compose_selector(e.count),this.compose_rule(t,e));break;case"pseudo":{t.selector.startsWith(":doodle")&&(t.selector=t.selector.replace(/^\:+doodle/,":host"));let n=Ee(t.selector);n&&(t.skip=!0),t.selector.split(",").forEach(r=>{let s=t.styles.map(t=>this.compose_rule(t,e,r)),i=n?r:this.compose_selector(e.count,r);this.add_rule(i,s)});break}case"cond":{let n=je[t.name.substr(1)];if(n){let r=t.arguments.map(t=>this.compose_argument(t,e));s(n,e,r)&&this.compose(e,t.styles)}break}case"keyframes":this.keyframes[t.name]||(this.keyframes[t.name]=(e=>`\n ${i(t.steps.map(t=>`\n ${t.name}{${i(t.styles.map(t=>this.compose_rule(t,e)))}}`))}`))}})}output(){Object.keys(this.rules).forEach((e,t)=>{if(Se(e))this.styles.container+=`\n .container{${i(this.rules[e])}}`;else{let t=Me(e)?"host":"cells";this.styles[t]+=`\n ${e}{${i(this.rules[e])}}`}});let e=Object.keys(this.keyframes);return this.coords.forEach((t,n)=>{e.forEach(e=>{let r=this.compose_aname(e,t.count);this.styles.keyframes+=`\n ${function(e,t){return e?t:""}(0==n,`@keyframes ${e}{${this.keyframes[e](t)}}`)}@keyframes ${r}{${this.keyframes[e](t)}}`})}),{props:this.props,styles:this.styles,grid:this.grid}}}function Le(e,t){let n=new Oe(e),r={};n.compose({x:1,y:1,count:1,context:r,grid:{x:1,y:1,count:1}});let{grid:s}=n.output();s&&(t=s),n.reset();for(let e=1,s=0;e<=t.x;++e)for(let i=1;i<=t.y;++i)n.compose({x:e,y:i,count:++s,grid:t,context:r});return n.output()}customElements.define("css-doodle",class extends HTMLElement{constructor(){super(),this.doodle=this.attachShadow({mode:"open"}),this.extra={get_custom_property_value:this.get_custom_property_value.bind(this)}}connectedCallback(){setTimeout(()=>{let e,t=this.getAttribute("use")||"";if(t&&(t=`@use:${t};`),!this.innerHTML.trim()&&!t)return!1;try{let n=U(t+this.innerHTML,this.extra);this.grid_size=D(this.getAttribute("grid")),(e=Le(n,this.grid_size)).grid&&(this.grid_size=e.grid),this.build_grid(e)}catch(e){this.innerHTML="",console.error(e&&e.message||"Error in css-doodle.")}})}get_custom_property_value(e){return getComputedStyle(this).getPropertyValue(e).trim().replace(/^\(|\)$/g,"")}build_grid(e){const{has_transition:t,has_animation:n}=e.props,{keyframes:r,host:s,container:i,cells:l}=e.styles;this.doodle.innerHTML=`\n<style>${this.style_basic()}</style><style class="style-keyframes">${r}</style><style class="style-container">${this.style_size()}${s}${i}</style><style class="style-cells">${t||n?"":l}</style><div class="container">${this.html_cells()}</div>`,(t||n)&&setTimeout(()=>{this.set_style(".style-cells",l)},50)}inherit_props(e){return g(/grid/).map(e=>`${e}:inherit;`).join("")}style_basic(){return`\n:host{display:block;visibility:visible;width:1em;height:1em;}.container{position:relative;width:100%;height:100%;display:grid;${this.inherit_props()}}.cell{position:relative;line-height:1;box-sizing:border-box;display:flex;justify-content:center;align-items:center;}`}style_size(){let{x:e,y:t}=this.grid_size;return`\n .container{grid-template-rows:repeat(${e}, 1fr);grid-template-columns:repeat(${t}, 1fr);}`}html_cells(){return'<div class="cell"></div>'.repeat(this.grid_size.count)}set_style(e,t){const n=this.shadowRoot.querySelector(e);n&&(n.styleSheet?n.styleSheet.cssText=t:n.innerHTML=t)}update(e){let t=this.getAttribute("use")||"";t&&(t=`@use:${t};`),e||(e=this.innerHTML),this.innerHTML=e,this.grid_size||(this.grid_size=D(this.getAttribute("grid")));const n=Le(U(t+e,this.extra),this.grid_size);if(n.grid){let{x:e,y:t}=n.grid;if(this.grid_size.x!==e||this.grid_size.y!==t)return Object.assign(this.grid_size,n.grid),this.build_grid(n);Object.assign(this.grid_size,n.grid)}else{let n=D(this.getAttribute("grid")),{x:r,y:s}=n;if(this.grid_size.x!==r||this.grid_size.y!==s)return Object.assign(this.grid_size,n),this.build_grid(Le(U(t+e,this.extra),this.grid_size))}this.set_style(".style-keyframes",n.styles.keyframes),this.set_style(".style-container",this.style_size()+n.styles.host+n.styles.container),this.set_style(".style-cells",n.styles.cells)}get grid(){return Object.assign({},this.grid_size)}set grid(e){this.setAttribute("grid",e),this.connectedCallback()}get use(){return this.getAttribute("use")}set use(e){this.setAttribute("use",e),this.connectedCallback()}static get observedAttributes(){return["grid","use"]}attributeChangedCallback(e,t,n){if(t==n)return!1;"grid"==e&&t&&(this.grid_size=n),"use"==e&&t&&(this.use=n)}})});