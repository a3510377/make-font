var v=Object.defineProperty;var w=(o,t,e)=>t in o?v(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var d=(o,t,e)=>(w(o,typeof t!="symbol"?t+"":t,e),e);import{d as u,c as _,a as l,p as W,b as y,o as p,r as E,e as S,f as I,g as x,h as T,i as k}from"./vendor.f4560c19.js";const O=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerpolicy&&(a.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?a.credentials="include":i.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}};O();const $="modulepreload",m={},b="/make-font/",h=function(t,e){return!e||e.length===0?t():Promise.all(e.map(s=>{if(s=`${b}${s}`,s in m)return;m[s]=!0;const i=s.endsWith(".css"),a=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${a}`))return;const n=document.createElement("link");if(n.rel=i?"stylesheet":$,i||(n.as="script",n.crossOrigin=""),n.href=s,document.head.appendChild(n),i)return new Promise((r,c)=>{n.addEventListener("load",r),n.addEventListener("error",c)})})).then(()=>t())};class C{constructor(t,e=3,s,i,a="zh_TW"){d(this,"drawIng",!1);d(this,"timeout",-1);d(this,"WordInfo");d(this,"img",new Image);this.canvas=t,this.penSize=e,this.canvasSize=s,this.ctx=i,this.language=a,i||(i=t.getContext("2d")),this.init();let n={};Object.keys({"/src/assets/scss/main.scss":()=>h(()=>Promise.resolve({}),["assets/main.036e366e.css"]),"/src/assets/images/font/main.png":()=>h(()=>import("./main.6dfe1d80.js"),[])}).map(r=>n[r]=r),this.img.src=`${n["/src/assets/images/font/main.png"]}`,this.img.onload=()=>{var r;this.img.style.width=`${s}px`,this.img.style.height=`${s}px`,(r=this.ctx)==null||r.drawImage(this.img,0,0,s,s)}}mousedownEvent(t){t.preventDefault();let e=this.canvas.getBoundingClientRect();this.StartWrite(t.clientX-e.left,t.clientY-e.top)}mousemoveEvent(t){t.preventDefault();let e=this.canvas.getBoundingClientRect();this.MoveWrite(t.clientX-e.left,t.clientY-e.top)}touchstartEvent(t){var e;if(clearTimeout(this.timeout),t.preventDefault(),(e=this.WordInfo)==null||e.initXY(),this.ctx){this.ctx.lineWidth=this.penSize;let s=document.documentElement,i=this.canvas.getBoundingClientRect(),a=t.changedTouches[0];this.StartWrite(a.pageX-(i.left+window.pageXOffset-s.clientLeft),a.pageY-(i.top+window.pageYOffset-s.clientTop))}}touchmoveEvent(t){if(clearTimeout(this.timeout),this.drawIng){let e=document.documentElement,s=this.canvas.getBoundingClientRect(),i=t.changedTouches[0];this.MoveWrite(i.pageX-(s.left+window.pageXOffset-e.clientLeft),i.pageY-(s.top+window.pageYOffset-e.clientTop))}}stopWriteEvent(t,e){var s;(s=this.WordInfo)==null||s.splitStroke(),this.timeout=window.setTimeout(()=>{var i;this.clearCanvas(),(i=this.WordInfo)==null||i.fetch().then(a=>a.json()).then(a=>{var n;(n=this.WordInfo)==null||n.init(),console.log(a[1][0][1])})},2e3),this.drawIng=e===void 0?!1:e}clearCanvas(){var t,e,s,i;(s=this.ctx)==null||s.clearRect(0,0,((t=this.canvas)==null?void 0:t.width)||0,((e=this.canvas)==null?void 0:e.height)||0),(i=this.ctx)==null||i.drawImage(this.img,0,0,this.canvasSize,this.canvasSize)}init(){this.clearCanvas(),this.WordInfo=new L(this.canvasSize,this.canvasSize,this.language)}setLineWidth(t){this.penSize=t}StartWrite(t,e){var s,i;clearTimeout(this.timeout),this.ctx&&(this.ctx.lineWidth=this.penSize,this.drawIng=!0,(s=this.WordInfo)==null||s.initXY(),this.ctx.beginPath(),this.ctx.moveTo(t,e),(i=this.WordInfo)==null||i.addXY(t,e))}MoveWrite(t,e){var s;clearTimeout(this.timeout),this.ctx&&this.drawIng&&(this.ctx.lineWidth=this.penSize,this.ctx.lineTo(t,e),this.ctx.stroke(),(s=this.WordInfo)==null||s.addXY(t,e))}}class L{constructor(t,e,s="zh_TW"){d(this,"x",[]);d(this,"y",[]);d(this,"ink",[]);this.width=t,this.height=e,this.language=s}init(){this.initXY(),this.ink=[]}initXY(){this.x=this.y=[]}addXY(t,e){this.x.push(t),this.y.push(e)}splitStroke(){this.ink.push([this.x,this.y,[]])}fetch(){return fetch("https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",{method:"POST",mode:"cors",headers:{"content-type":"application/json"},body:JSON.stringify({options:"enable_pre_space",requests:[{ink:this.ink,language:this.language,writing_guide:{writing_area_width:this.width,writing_area_height:this.height}}]})})}}var f=(o,t)=>{const e=o.__vccOpts||o;for(const[s,i]of t)e[s]=i;return e};const X=u({name:"addFont",data(){return{configs:[{open:!0,info:"",value:null}],penSize:5,ratio:window.devicePixelRatio||1,canvasStyle:400,canvas:null,ctx:null,word:null}},methods:{init(){if(this.canvas){let o=this.ctx=this.canvas.getContext("2d");this.word=new C(this.canvas,this.penSize,this.canvasStyle,o),Object.assign(window,{Word:this.word}),o&&(o.lineCap="round",o.lineJoin="round",o.strokeStyle="black")}else this.init()}},mounted(){this.canvas=this.$refs.canvas,Object.assign(window,{T_canvas:this.canvas}),this.init()},watch:{}}),Y=o=>(W("data-v-2252730a"),o=o(),y(),o),P={class:"wroteFontDiv flex flex-down flex-item-center"},j=Y(()=>l("div",{class:"tools flex flex-item-center flex-center"},[l("div",{class:"configs"})],-1));function z(o,t,e,s,i,a){return p(),_("div",P,[j,l("canvas",{ref:"canvas",class:"writeFont",width:"400",height:"400",style:{border:"2px solid",cursor:"crosshair"},onMousedown:t[0]||(t[0]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.mousedownEvent)&&((c=o.word)==null?void 0:c.mousedownEvent(...n))}),onMousemove:t[1]||(t[1]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.mousemoveEvent)&&((c=o.word)==null?void 0:c.mousemoveEvent(...n))}),onMouseup:t[2]||(t[2]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.stopWriteEvent)&&((c=o.word)==null?void 0:c.stopWriteEvent(...n))}),onMouseout:t[3]||(t[3]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.stopWriteEvent)&&((c=o.word)==null?void 0:c.stopWriteEvent(...n))}),onTouchstart:t[4]||(t[4]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.touchstartEvent)&&((c=o.word)==null?void 0:c.touchstartEvent(...n))}),onTouchmove:t[5]||(t[5]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.touchmoveEvent)&&((c=o.word)==null?void 0:c.touchmoveEvent(...n))}),onTouchend:t[6]||(t[6]=(...n)=>{var r,c;return((r=o.word)==null?void 0:r.stopWriteEvent)&&((c=o.word)==null?void 0:c.stopWriteEvent(...n))})},null,544)])}var R=f(X,[["render",z],["__scopeId","data-v-2252730a"]]);const A=u({name:"HelloWorld",data(){return{}},components:{WriteFont:R}});function B(o,t,e,s,i,a){const n=E("WriteFont");return p(),S(n)}var g=f(A,[["render",B]]),F=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:g});const M=[{name:"Home",path:"/",component:()=>h(()=>Promise.resolve().then(function(){return F}),void 0)}],D=I({history:x(),routes:M});var N=T({state:{},mutations:{},actions:{},modules:{},getters:{}});k(g).use(D).use(N).mount("#app");