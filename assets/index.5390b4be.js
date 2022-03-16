import{c as Mt,a as B,b as It,d as et,e as T,o as Et,f as z,t as S,s as v,g as k,h as m,S as F,M as O,i as nt,j as C,F as J,k as p,l as St,m as it,n as P,p as Ct,q as bt,r as kt,u as Dt}from"./vendor.48afbe8b.js";const Nt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}};Nt();const $t="_App_1wvid_6";var Rt={App:$t};function jt(n){return typeof n=="string"}const D={fromString(n){if(!jt(n))throw new Error("WaypointId must be a string");if(n.length<=0)throw new Error("WaypointId cannot be empty");return n}};function Bt(){return{gender:void 0,location:void 0,locationError:void 0,magnetDistanceInMeter:10,viewDistanceInMeter:30}}const[h,Q]=Mt({waypoints:[{type:"coin",id:D.fromString(D.fromString("1")),latitude:51.046671,longitude:4.105638},{type:"coin",id:D.fromString(D.fromString("2")),latitude:51.046828,longitude:4.10656},{type:"coin",id:D.fromString("3"),latitude:51.046875,longitude:4.107493},{type:"coin",id:D.fromString("4"),latitude:51.046383,longitude:4.107085},{type:"coin",id:D.fromString("5"),latitude:51.045738,longitude:4.106535},{type:"coin",id:D.fromString("6"),latitude:51.045473,longitude:4.106301},{type:"coin",id:D.fromString("7"),latitude:51.04576,longitude:4.105258},{type:"binocular",id:D.fromString("8"),latitude:51.046048,longitude:4.106499},{type:"coin",id:D.fromString("9"),latitude:51.046107,longitude:4.103996},{type:"coin",id:D.fromString("10"),latitude:51.04639,longitude:4.103199},{type:"coin",id:D.fromString("11"),latitude:51.046605,longitude:4.104639}],me:Bt(),captured:{},score:0});function Gt(n){Q("me",t=>({...t,gender:n}))}function Ot(n,t){Q("me",e=>({...e,location:n,locationError:t||void 0}))}function Qt(n){Q("captured",t=>({...t,[n]:!0}))}function W(n){return!!h.captured[n]}function Y(n){Q("me","viewDistanceInMeter",t=>Math.max(20,n(t)))}function Wt(n){Q("score",t=>Math.max(0,n(t)))}function Pt(){const n=h.waypoints.slice().reverse().find(e=>W(e.id));if(!n)return h.waypoints[0];const t=h.waypoints.indexOf(n);return h.waypoints[t+1]}function b(n,t,e=1e-6){return Math.abs(n-t)<e}class E{constructor(t,e){this.left=t,this.top=e}static create=(t,e)=>new this(t,e);static zero=E.create(0,0);static fromTuple=t=>new this(t[0],t[1]);static fromObject=t=>t instanceof E?t:new this(t.left,t.top);static areSimilar=(t,e,i)=>b(t.left,e.left,i)&&b(t.top,e.top,i);addPoint(t){return E.create(this.left+t.left,this.top+t.top)}subtractPoint(t){return E.create(this.left-t.left,this.top-t.top)}areSimilar(t){return E.areSimilar(this,t)}toTuple(){return[this.left,this.top]}toObject(){return{left:this.left,top:this.top}}toString(){return`point(${this.left}, ${this.top})`}}class M{constructor(t,e,i,r){this.left=t,this.top=e,this.width=i,this.height=r}static zero=new this(0,0,0,0);static create=(t,e,i,r)=>new this(t,e,i,r);static fromTuple=t=>this.create(...t);static fromObject=t=>t instanceof M?t:this.create(t.left,t.top,t.width,t.height);static toObject=t=>t instanceof this?t.toObject():t;static normalize(t){const{left:e,top:i,width:r,height:o}=t;return r>=0&&o>=0?M.fromObject(t):this.create(r>=0?e:e+r,o>=0?i:i+o,r>=0?r:-r,o>=0?o:-o)}static fromPoints(t){if(!t||t.length<=0)throw new Error("Cannot calculate bounds when no points are available.");t.length===1&&new this(t[0].left,t[0].top,0,0),t.length===2&&new this(t[0].left,t[0].top,t[1].left,t[1].top).normalize();let e=t[0].left,i=t[0].top,r=t[0].left,o=t[0].top;return t.forEach(s=>{s.left<e&&(e=s.left),s.top<i&&(i=s.top),s.left>r&&(r=s.left),s.top>o&&(o=s.top)}),new this(e,i,r-e,o-i)}static fromRects(t){if(!t||t.length<=0)throw new Error("Cannot calculate bounds when no rects are available.");t.length===1&&M.fromObject(t[0]);let e=1/0,i=1/0,r=-1/0,o=-1/0;return t.forEach(s=>{const a=M.normalize(s),l=a.left+a.width,d=a.top+a.height;a.left<e&&(e=a.left),a.top<i&&(i=a.top),l>r&&(r=l),d>o&&(o=d)}),new this(e,i,r-e,o-i)}static areSimilar(t,e,i=1e-6){return!(!b(t.left,e.left,i)||!b(t.top,e.top,i)||!b(t.width,e.width,i)||!b(t.height,e.height,i))}toTuple=()=>[this.left,this.top,this.width,this.height];toObject=()=>({left:this.left,top:this.top,width:this.width,height:this.height});getCenter=()=>E.create(this.left+this.width/2,this.top+this.height/2);grow(t,e=t,i=t,r=e){return new M(this.left-r,this.top-t,Math.max(0,this.width+r+e),Math.max(0,this.height+t+i))}debug(t){if(typeof t=="function"){const e=t(this);e!==void 0&&console.log(e)}else console.log(t,this.toString());return this}normalize(){return M.normalize(this)}areSimilar(t,e=1e-6){return M.areSimilar(this,t,e)}containsPoint(t){return t.left>=this.left&&t.left<=this.left+this.width&&t.top>=this.top&&t.top<=this.top+this.height}toString(){return`rect(${this.left}, ${this.top}, ${this.width}, ${this.height})`}}function rt(n,t){return c.create(n.a*t.a+n.c*t.b,n.b*t.a+n.d*t.b,n.a*t.c+n.c*t.d,n.b*t.c+n.d*t.d,n.a*t.e+n.c*t.f+n.e,n.b*t.e+n.d*t.f+n.f)}const ot=Math.PI/180;class c{constructor(t,e,i,r,o,s){this.a=t,this.b=e,this.c=i,this.d=r,this.e=o,this.f=s}static identity=c.create(1,0,0,1,0,0);static create(t,e,i,r,o,s){return new this(t,e,i,r,o,s)}static fromObject(t){return c.create(t.a,t.b,t.c,t.d,t.e,t.f)}static translate(t,e){return c.create(1,0,0,1,t,e)}static scale(t,e=t){return c.create(t,0,0,e,0,0)}static rotateByRad(t){const e=Math.cos(t),i=Math.sin(t);return c.create(e,i,-i,e,0,0)}static rotateByDeg(t){return c.rotateByRad(t*ot)}static multiply(...t){return t.length===0?c.identity:t.length===1?t[0]instanceof c?t[0]:c.fromObject(t[0]):t.length===2?rt(t[1],t[0]):t.reduceRight((e,i)=>rt(e,i))}static areSimilar(t,e,i=1e-6){return!(!b(t.a,e.a,i)||!b(t.b,e.b,i)||!b(t.c,e.c,i)||!b(t.d,e.d,i)||!b(t.e,e.e,i)||!b(t.f,e.f,i))}static transform(t,e,i,r=1){return[t.a*e+t.c*i+t.e*r,t.b*e+t.d*i+t.f*r]}static inverse(t){const{a:e,b:i,c:r,d:o,e:s,f:a}=t,l=e*o-i*r;return c.create(o/l,i/-l,r/-l,e/l,(o*s-r*a)/-l,(i*s-e*a)/l)}transform(t,e){return c.transform(this,t,e)}translate(t,e){return this.multiply(c.translate(t,e))}scale(t,e=t){return this.multiply(c.scale(t,e))}scaleAt(t,e,i,r=i){return this.multiply(c.translate(t,e),c.scale(i,r),c.translate(-t,-e))}rotateByRad(t){const e=Math.cos(t),i=Math.sin(t);return this.multiply(c.create(e,i,-i,e,0,0))}rotateByDeg(t){return this.multiply(c.rotateByRad(t*ot))}rotateByDegAt(t,e,i){return this.multiply(c.translate(t,e),c.rotateByDeg(i),c.translate(-t,-e))}multiply(...t){return c.multiply(this,...t)}inverse(){return c.inverse(this)}toTransform(t){return this.inverse().multiply(t)}fromTransform(t){return this.toTransform(t).inverse()}areSimilar(t,e=1e-6){return c.areSimilar(this,t,e)}toString(){return`transform(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`}toCssMatrix(){return`matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`}toObject(){return{a:this.a,b:this.b,c:this.c,d:this.d,e:this.e,f:this.f}}}M.prototype.transform=function(t){const[e,i]=c.transform(t,this.left,this.top),[r,o]=c.transform(t,this.width,this.height,0);return M.create(e,i,r,o)};M.prototype.toRectTransform=function(t){return c.scale(t.width/this.width,t.height/this.height).translate(t.left-this.left,t.top-this.top)};M.prototype.fromRectTransform=function(t){return this.toRectTransform(t).inverse()};c.prototype.applyToRect=function(t){const[e,i]=c.transform(this,t.left,t.top),[r,o]=c.transform(this,t.width,t.height,0);return M.create(e,i,r,o)};function st(n,t){const e=t.normalize(),i=e.width/e.height,r=n.width/n.height;let o=1,s=0,a=0;const{left:l,top:d}=e;if(i>r){const g=n.width/i;o=n.width/e.width,s=n.left-l*o,a=n.top+(n.height-g)/2-d*o}else{const g=n.height*i;o=n.height/e.height,s=n.left+(n.width-g)/2-l*o,a=n.top-d*o}return c.scale(o).translate(s,a)}M.prototype.fitRectTransform=function(t){return st(this,t)};M.prototype.fitRect=function(t){return st(this,t).applyToRect(t)};E.prototype.transform=function(t){const[e,i]=c.transform(t,this.left,this.top);return E.create(e,i)};c.prototype.applyToPoint=function(t){const[e,i]=c.transform(this,t.left,t.top);return E.create(e,i)};c.prototype.applyToPoints=function(t){return t.map(this.applyToPoint.bind(this))};class x{constructor(t,e){this.width=t,this.height=e}static create=(t,e)=>new this(t,e);static zero=new this(0,0);static one=new this(1,1);static fromTuple=t=>new this(t[0],t[1]);static fromObject=t=>t instanceof x?t:new this(t.width,t.height);static fromAngleRad(t){return x.create(Math.cos(t),-Math.sin(t))}static fromAngleDeg(t){return this.fromAngleRad(t*180/Math.PI)}static getAspectRatio=t=>t.width&&t.height?Math.abs(t.width/t.height):0;static areSimilar(t,e,i=1e-6){return!(!b(t.width,e.width,i)||!b(t.height,e.height,i))}areSimilar(t,e=1e-6){return x.areSimilar(this,t,e)}getLength(){return Math.sqrt(this.width*this.width+this.height*this.height)}getAngleRad(){return Math.atan2(-this.height,this.width)}getAngleDeg(){return this.getAngleRad()*180/Math.PI}getAspectRatio(){return x.getAspectRatio(this)}normalize(){const t=this.getLength();return this.scale(1/t)}inverse(){return x.create(1/this.width,1/this.height)}scale(t,e=t){return x.create(this.width*t,this.height*e)}scaleByVector(t){return x.create(this.width*t.width,this.height*t.height)}toTuple(){return[this.width,this.height]}toObject(){return{width:this.width,height:this.height}}toString(){return`vector(${this.width}, ${this.height})`}}x.prototype.transform=function n(n){const[t,e]=c.transform(n,this.width,this.height,0);return x.create(t,e)};c.prototype.applyToVector=function(t){const[e,i]=c.transform(this,t.width,t.height,0);return x.create(e,i)};c.prototype.translateByVector=function(t){return this.multiply(c.translate(t.width,t.height))};c.prototype.scaleByVector=function(t){return this.multiply(c.scale(t.width,t.height))};c.prototype.rotateByVector=function(t){return this.multiply(c.rotateByRad(x.fromObject(t).getAngleRad()))};function G(n,t){const[e,i]=B(n()),[r,o]=B(!1),s=It(n(),{...t,onUpdate:a=>{et(()=>{typeof a=="object"?i({...a}):Array.isArray(a)?i([...a]):i(a),o(!s.completed),t?.onUpdate&&t.onUpdate(a)})}});return T(Et(n,()=>{s.target(n());let a=0;function l(){s.update(),s.completed||(a=requestAnimationFrame(l))}l(),z(()=>{cancelAnimationFrame(a)})},{defer:!0})),[e,r,s]}var Ut="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACxUExURebv7+bWxebFrda1lL21nObvzsWle7WMWq17SpyUUpx7SrWUa617WsWUa9ale9a1jL3OpZyUc9aljJxzOntjOoxjMWtKGXNaGUIxEHNKOpRjUsWUe5xjOua1lL2UnObFnPfFrf/WtZyUnO/WtXN7WlpSQhAhEJytnJRjjEIpQnN7GUJSEAAAABAAAL3O3joQEObO5gAIADpSQlJ7GRAAELW9a//etffFnKVjUpQ6GQAAALUzKCwAAAA7dFJOU/////////////////////////////////////////////////////////////////////////////8AocQ7HgAAAAlwSFlzAAAOwgAADsIBFShKgAAADA9JREFUaEOdmgl74sgRhnUhYR0IdMDYQgEbsHdibzKz2bU3/P8flu+rakmNEZhJPX4GIbXq7Tq6+mCc423iuJ7vByq+505ufU/klsauH0bTzxKFgXtzD83nRXGDu3g6xd+YJLeBvmjjJao+EkmSRC8ocn86TQPXtL0sVyFeJAhoTDJIqMLLzNCEE/lfdPXKY1esEIIonxmRL2SpXdM4hjlXMRcfOqEihJCfiaLUIrSL07l5b0wuQVx6KorGCSpqU5YZzGJiXj2XC5C5mJGEYWE0joti1Jo4DszLZzIOCeI4FjOMsitCDjHoVJlc6PLobTDEVTOj6KqI1xQTp+MuG4MIAwE3Wr4SjY1S4tFBMwJx6SuEw+j4WgYK3hyjjEDuyl9jdBSk2QXKOSQo4aybfaWikIu2nEPiXzbEQAyljM+ifwaZVIDcmFi9GH+hziD45cKo6uUM4tZlDEN+zRLjL+Ow8vOo/AyZLKo6jlANzds3SgeBKYCUn8LyCRJUy2UVp8n/5y6py/DXZ4edQoJ6tSQF/volShf4DlJ7RqHKCcSNy2r5bbmsf9UUyxCFpEajygkESV7dC4X5NYrxfd9cWWIzJCh1fRIVGxKU0yiGKWILSvA45lxOGKlCTqJiQ+IyBQSmkBJzSrwJ0wdE7JDsquvKVmxdezUgqVK+Ifo6L37Jse1IOUXSkLqyp2MLsqhjgVQrQL4t72vWsC85yujM6AypK9tfA8R5YGWM47piGtNlVY0gsY5d5NieEgBEGVVl1FIGiIuixcpTYzzWcUXKChhUMrXnM0gBdJT4SQCQjrGy8muABChaMSAwpMqiuGYqL6sKr9BCWd6p2k66JV5ngkgpUV+t7pdWARsgiw6yXCZFE8VrcRmsoYBEO6nTEtEOtZSOQTvo76UVlAEC1xACb9WzvGgSOE7SjE4z7wEIHeAZ4Rf5rgTDQFO8Vj0YvZAe4rC3aIc2ERZbRZik5dpglisoMiCR1YoGdvqZVGoUo6EIXAz976/cHrLiiq7NQYnXazAloSXX+r6rMaI+FbcBwYeamGgKqYbI95D5SiBlvVrPiiL3Wx8uE0wto1MtknQbREMucOST2FjXarc9HHtIQEjJQKQKaWlMFJfAACSOVhJVibckJeC53o3ShSmeCGRIrx7yD7qLkFViIJuN+AyhUcF71CSsE+Hd+3oNm9I0jZK4oi/tGtlDMO2Kq+sKq2wGBRDBZHAavDYIHU73wBS9XK/hQqpPsqYJw0ghVmEZIMxU6YEF8TxgZuSk9NuolKI/y6AeLiiwlLwCYUryYWxDttstzSnCBvUJzoBREuq1xn8q+qGeDvYxnRGSIYEYk2vuihr0yEDAENm0fl6gWDVNgy6zrkNQVvAd+iV+6EurkAY94Ki65C5Qai4iAPE7SyCPj9utJ2rQXQqU0VpcDfYqhD2RnB6FPHUQWK8QvO91lN0OfxD96hnRbxTpAt01C5vMjMsRSCCQuo4NRPzVK3p8JAT/dkIiPvQpmqkhAmlSGlJZFbKHzC2I7BQxGumKrrtqSceRa/NE7RggWQQ1GP8jg9HF3EFMOlhCCI3p3SKqjZhbaoUwBII8JIQ1ZqR2He9l5sCKiwkjxQuZC8GlsFSnTRD1plWIF3ImxKzJEjAAGVQPV3uZn+okISTnSJeJKeGJSpi3FkY+xAKUHYi0QzPsBMSSpCTDmuQHyIKzxKqMBBJ2L3Y6kpA+Ud/xX37L9Zk00lYZIUkSEzLE3YK4MhdhlwVIFqXdjo7DK0kwsDVEwjGBDqWV2M2GqNlpIpCUdXl0IXG8HyCzBisTlgk6WVzeAGlSgYLLLhiGYm70kPElEfwFCrosMeF8YkYXMh+aukmmY1iPuoyXm4xJijnhyWilWBDxl0CQwnhDyocokioliY3bnRkcEo1UL+kUKgw7JeOEEHtZb0HEFIVox5BisF3O0zhVyNRvINplCsulPBO03I7Serk3OkWswHshJjh1l2jzk4NMfIeHlOljNKm3/HwGM5hU6b02WtCXDItCAtcbGYxuu/FhpYHgjfDwvJ/PF3vIocKsIfe7mKjvkayHw2G/X7wEv337jvwT/woEGd/2e7oeAh+14b1AJCSL573j7A//rKrD4eW3Qypznw2Bq6Lq8IQeoMnedZ6e93SjQqp8085Co3qARNOk8JtaIPBW8/wERrWoXl+h42VOCiHC4NTPWNwv5rDj8ArOwXWC54X4C5B1uPGTaeob3T0EC8Y0zzmdAuL732HHopo7L29vv79Wh8m/7iUoLGMdJKmenD2afX97e64qXLz8uxATMU8XbYRtR2F0D+7CSj7KMYYThiT5/sNxDhW69/b29vNQLZynh8+QdO/MD3cCeXveo61zeDCWpHnGs5MzS/g0bjrIA5zlHqpvh2doePvGDleMvJ9vWJQF8uDC1tc//mCLn1X14jjBoYM0sagxuntI23KNnfJ0E3GHAmf+n+p3KjCQJ57ltTkr8EYq+oIOfdUWb9UekEnVQdIUHWqN6gGC6WDWYMOkEB8QWCJ2AHIHiAtLEPjt7hEQtM0CC/L7fo+vP/wNugpInGZI1nMIRhgKfExXwvNbz4GDqoNo+HN/x27CW0iu3a7lEgnjBP0IKtOPP+6QxI4rD7JoGqcNe2pUDxAXSR4meJzwubfDOy/V/vXPt5/P+7/uqAEVChDM74/bAmv+AveQ5KT8PCz+gvPc3XbjKyRqinZkMDo+5zlAMkLgFejYV3v8LeZ/wRWOx7qFZcv7O6ZGTLvtZoK4sUW1CPKF67juztMUniLs8FZ/gtdDjlj2zjJ4k+OE2kCZoKjcoZNzOEsmKlnnvcMULuY2HvoxR4u7xeIFDAZLIfE0m8Foo9iGOJhPsR/tIe87F2++vLwEE+eHqxM8wvHR6kLC22w/PPeHM5mjhYsWu3eFoEAiJFAxtlo5IjXCpIfs6BfXSLeIYFX5gBU5bGoLokwDIN4fERJCsNWIQn9j/ahiQVCH84YQZhEd844XuYxTAAUpSD8xODRLn2AFy6YGMiMkKeBMoxZiQTBU/JlC8vajgwADNWDh86PlA7BymKI3jUjT7QcyWCANRp2l2Ya4eVvAVAwU+kspkJ1ncNt2BuW4QB7CDFzASZ2wMxJ3QlDH7QNCG3IMigJVkofCLVyvHRTZeNTi5VmOhHh/37ZNsVEfdcI+sKYhuRDXIg9txScQByvylJHHSBJTOj07xvVxM4sKWvW4zaNGITRFH0pac++HHXOaJfY64hTCrx5mJ/EXnG/ZQjWbIs0I99owDU8sEQa85XPpkQbHTz+ofoLgRhcUaGNgjRoq2vpJjHKALMWsZEPAkCpgQnJ6Xgs5gxyx1uRIkSxlcI0iQmDKWs7E4qbt8wIijN5b6XnHzecgQecvmgJIp0zSp+CmHgNakqu7D7ENaYyiQc4hjg56bjnFXycifmeCm+9GMGAxRiS3opt+Pzkm/I1GTDFhGYQd5ybIfO3FOEsMOT3cFhmBuN2ox8ZHKeioUaweUh+x4JinFiM+C/so5Nh8okALLjGdYPI0Il+g2ONjlmQyUFEwvRsltoxBJjwQNhRzXlCkf6/X679FUv3A1zSUhzBDGTzrGTFkFHIMSq7xQDGBgRpuvsip/0upScBiQZ8BwVUKGWViVJzIKIQO6yhMMihqZ0lkzlRUcN1wWmE0+s1PHI/qG4ccMQ2TIktvUlDDMeMBI0c4FDzmtMNowAzd+1z4wfQSZIIRx19mO5dhFJhNN61AeJHlePBhXAUGbsbrsYBALkD42ywpcJmOGKNMNiW6H5IDIhMOw7j0W/kliFBku2BcRn0Qboklf7t72HPxJ4FrjMsQeKxUivSaKnvNcqn/ajjAKC8zrkCODkoudou6uyWA0jNEmFWSVtNLMRe5AsGeBRQJDHfX3HieiO7yGaV0uj6v75ZchRy9uJyqy4jR80DRDwAQasbVcIhchxydpMsygxnEIGBGmV5xFeULCP/fB7MskfMNUx1F9KiCZpz9nnwmX0KOzj/EGLEG9vT/CYdWABE3N6gwn9dk0tAaclhVVFDHMO6BuPxfYga5BQJMgMUDlmTmAI1HaDxYj8NbELdCIG4DpTE2SRRdsXwR7kFuhkBcL+AcDmkC63jmKzke/weuV85QjswMwAAAAABJRU5ErkJggg==",Lt="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACxUExURffv7+/mvebmnO/WlN7WjN7FhPfmnPfvpc69e869a72tY86ta72cY7WcQqWEQpxzMZRjMa1rQr1zSs6Ua72EWtale71zUt6ljN61jN61lJRjQt69lNaca+a9nJyEY3NaQnNaGebFtZxjWsXOpcW1nMWcnEIZEBkIAHNCEEI6EHN7WhAhEBAICJyla2tCQkJCQmspEIxCGZx7EJxaEM6tWu+tOs6lEM6lQu/eQsVzKQAAAEuHyTcAAAA7dFJOU/////////////////////////////////////////////////////////////////////////////8AocQ7HgAAAAlwSFlzAAAOwgAADsIBFShKgAAACv1JREFUaEOdmQ172rgShWU+Wsc25sM2GEgIbrOEtLndbGl27/L/f9g9ZzSyZTCE3vM8DUaW59WZkWSbmuNvytTShhv0OxATBL3+YDAYinDQC4KbWDdDTNDX6G0JSftc0o0Q06ODwaDf631yoisHuh7mw0EEVI/Z6fc+Q0qoBZRwrtm5BgHAliDkYEmgNLivHjmDQC8712WICQAYMCVhCEYNgTS2L2IuJu1iOxFMUK9vIRrfSWN7AuaSmQsQ5qn3ScL1OiEdFBTugpnuRsylPi6TaBcglOsiDIhmugJ2tTFTnKkS4HNvcBHiyVI4CzsidjSBUduA7NRpFf6yaOa8MGcQpgo29CIwfgvy+XMX5RRiegjYIDzIb1DOguqnExg+ooZgP7mdclqXk6/BKeOTQmjl5rqEJ5STb5jp2lWFyIRYK6L2IDrEOdbTgFYtiBkM+9pTBSMKaSjXObwClFbxWxAkS7uqJCQ2L4F4FKsulj1zkrDW8WmyZFT9QXh3geLkaNJfNAx9Kz6kF7YWtl7SH9xFH1Fa6vex8YX+PPYPhyH7KEL6U4NhHJEiG/8NGCJ4fxhoWMiD9MNhRwxkK0oSRwHGyp7rknRjHZuENRAY0dXgidfcJaNREnOXbEmjdQrTMfSsNJAAzbhUo1NqPBpBQjnBXJIgwrumKs3B0GaEjm0e9IoQRtI0Te58CpfOueoTYGBK1iuyhgQ6UU80HMZEQCgLOvhiKHd0550l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";const Tt=S('<svg><image x="-15" y="-15" height="30" width="30"></image></svg>',4,!0);function zt(n){const t=n.gender==="female"?Lt:Ut;return(()=>{const e=Tt.cloneNode(!0);return v(e,"href",t),k(()=>e.style.setProperty("transform",`translate(${n.x}px, ${n.y}px)`)),e})()}const Ft=S("<svg><image></image></svg>",4,!0);function at(n){return(()=>{const t=Ft.cloneNode(!0);return k(e=>{const i=`translate(${n.x}px, ${n.y}px)`,r=n.opacity??1,o=-(n.size??30)/2,s=-(n.size??30)/2,a=n.imageUrl,l=n.size,d=n.size;return i!==e._v$&&t.style.setProperty("transform",e._v$=i),r!==e._v$2&&t.style.setProperty("opacity",e._v$2=r),o!==e._v$3&&v(t,"x",e._v$3=o),s!==e._v$4&&v(t,"y",e._v$4=s),a!==e._v$5&&v(t,"href",e._v$5=a),l!==e._v$6&&v(t,"height",e._v$6=l),d!==e._v$7&&v(t,"width",e._v$7=d),e},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0,_v$5:void 0,_v$6:void 0,_v$7:void 0}),t})()}var Jt="/assets/coin.836a8317.gif";function Yt(n){return m(at,{get x(){return n.x},get y(){return n.y},get opacity(){return n.opacity},imageUrl:Jt,size:30})}var Kt="/assets/binocular4.02f15592.png";function Vt(n){return m(at,{get x(){return n.x},get y(){return n.y},get opacity(){return n.opacity},imageUrl:Kt,size:40})}function Ht(n){return m(nt,{get when(){return n.opacity},get children(){return m(F,{get children(){return[m(O,{get when(){return n.waypoint.type==="coin"},get children(){return m(Yt,{get x(){return n.x},get y(){return n.y},get opacity(){return n.opacity}})}}),m(O,{get when(){return n.waypoint.type==="binocular"},get children(){return m(Vt,{get x(){return n.x},get y(){return n.y},get opacity(){return n.opacity}})}})]}})}})}const Xt="_Explosion__dot_tjq4j_1";var _t={Explosion__dot:Xt};const qt=S('<span class="Explosion"></span>'),Zt=S("<div></div>");function te(n){let t;const[e,i]=B([]);return T(()=>{const r=n.signal();if(n.condition&&!n.condition(r))return;const o=E.create(t.offsetLeft+t.offsetWidth/2,t.offsetTop+t.offsetHeight/2),s=[0,1,2,3,4,5,6,7,8,9].map(a=>{const l=Math.random()*Math.PI*2,d=10+Math.random()*20,g=x.fromAngleRad(l).scale(d),w=r<10?10:0;return{index:a,start:{x:o.left-5+Math.random()*10+w,y:o.top-5+Math.random()*10,scale:.3+Math.random()*.5,opacity:.4+Math.random()*.3},end:{x:o.left+g.width-5+Math.random()*10,y:o.top+g.height-5+Math.random()*10,scale:1+Math.random()*.5,opacity:-.1}}});i(a=>a.concat(s))}),(()=>{const r=qt.cloneNode(!0),o=t;return typeof o=="function"?o(r):t=r,C(r,m(J,{get each(){return e()},children:s=>{const[a,l]=B(s.start),[d]=G(a,{stiffness:.05,onComplete:()=>{i([])}});return Promise.resolve().then(()=>l(s.end)).catch(()=>{}),(()=>{const g=Zt.cloneNode(!0);return k(w=>{const y=_t.Explosion__dot,I=`translate(${d().x}px, ${d().y}px) scale(${d().scale})`,R=d().opacity;return y!==w._v$&&(g.className=w._v$=y),I!==w._v$2&&g.style.setProperty("transform",w._v$2=I),R!==w._v$3&&g.style.setProperty("opacity",w._v$3=R),w},{_v$:void 0,_v$2:void 0,_v$3:void 0}),g})()}}),null),C(r,()=>n.children,null),r})()}const ee="_Score_1r7y7_1",ne="_Score__value_1r7y7_8";var lt={Score:ee,Score__value:ne};const ie=S("<span></span>"),re=S("<div>Score: </div>");function oe(){return(()=>{const n=re.cloneNode(!0);return n.firstChild,C(n,m(te,{get signal(){return p(()=>h.score)},condition:t=>t>0,get children(){const t=ie.cloneNode(!0);return C(t,()=>h.score),k(()=>t.className=lt.Score__value),t}}),null),k(()=>n.className=lt.Score),n})()}const se="_TopView_15kh8_1",ae="_TopView_svg_15kh8_7";var ct={TopView:se,TopView_svg:ae};const K=S("<br>"),le=S("<div><div>\u26A0\uFE0F</div><div></div></div>");function ce(n){return m(F,{get fallback(){return n.children},get children(){return m(O,{get when(){return n.code},get children(){const t=le.cloneNode(!0),e=t.firstChild,i=e.nextSibling;return t.style.setProperty("margin","1rem"),t.style.setProperty("display","flex"),t.style.setProperty("align-items","center"),e.style.setProperty("font-size","3rem"),i.style.setProperty("margin","0.5rem 0 0 0.5rem"),C(i,m(F,{get children(){return[m(O,{get when(){return n.code===GeolocationPositionError.TIMEOUT},get children(){return["Timeout tijdens laden van de locatie.",K.cloneNode(!0),"Probeer pagina te refreshen"]}}),m(O,{get when(){return n.code===GeolocationPositionError.POSITION_UNAVAILABLE},get children(){return["Locatie informatie is niet beschikbaar.",K.cloneNode(!0),"Probeer pagina te refreshen"]}}),m(O,{get when(){return n.code===GeolocationPositionError.PERMISSION_DENIED},get children(){return["Geen toegang tot de locatie informatie.",K.cloneNode(!0),"Controleer of deze pagina rechten heeft tot locatie gegevens"]}})]}})),t}})}})}function ue(){const[n,t]=St(!0),[e,i]=B({longitude:0,latitude:0});function r(){const w=P.findNearest(e(),h.waypoints),y=h.waypoints.findIndex(I=>I.longitude===w.longitude&&I.latitude===w.latitude);return[h.waypoints[y],y]}let o=0;const s=2e-5,a=Math.PI/2;let l=-1;function d(){l+=Math.random()*a-a/2;const w=Math.cos(l)*s,y=Math.sin(l)*s;i(I=>({longitude:(I?.longitude??0)+w,latitude:(I?.latitude??0)+y})),o=setTimeout(d,150+Math.random()*200)}function g(w){switch(w.key){case"Home":{const{longitude:y,latitude:I}=h.waypoints[0];i({longitude:y,latitude:I});break}case"End":{const{longitude:y,latitude:I}=h.waypoints[h.waypoints.length-1];i({longitude:y,latitude:I});break}case" ":{o?(console.log("Stop walking."),clearInterval(o),o=0):(console.log("Start walking, press Space to stop."),d());break}case"PageUp":{const[,y]=r(),I=Math.max(0,Math.min(h.waypoints.length-1,y+1)),{longitude:R,latitude:j}=h.waypoints[I];i({longitude:R,latitude:j});break}case"PageDown":{const[,y]=r(),I=Math.max(0,Math.min(h.waypoints.length-1,y-1)),{longitude:R,latitude:j}=h.waypoints[I];i({longitude:R,latitude:j});break}case"ArrowLeft":i(y=>({...y,longitude:y.longitude-4e-5}));break;case"ArrowRight":i(y=>({...y,longitude:y.longitude+4e-5}));break;case"ArrowUp":i(y=>({...y,latitude:y.latitude+2e-5}));break;case"ArrowDown":i(y=>({...y,latitude:y.latitude-2e-5}));break}}it(()=>{document.addEventListener("keydown",g)}),z(()=>{document.addEventListener("keydown",g)}),p(()=>{i({longitude:n()?.longitude||0,latitude:n()?.latitude||0})}),p(()=>{e().longitude===h.me.location?.longitude&&e().latitude===h.me.location?.latitude||Ot(e(),t())})}function ut(n,t){return p(e=>[...e,n()].slice(-t),[])}var he="/assets/coin.49a2c5a4.mp3",de="/assets/binocular.4234ff62.mp3";function ht(n){const t=[new Audio(n),new Audio(n)];t.forEach(i=>i.prepend());let e=0;return{play(){return t[e++%2].play()}}}const fe=ht(he),ge=ht(de);function ye(){const n=p(()=>h.me.location),t=ut(n,2);p(()=>{const e=t()[0],i=n();if(!e||!i)return;const r=h.me.magnetDistanceInMeter,o=h.waypoints.filter(s=>!W(s.id)).filter(s=>P.getDistanceFromLine(s,e,i)<=r);et(()=>{o.forEach(s=>{Qt(s.id),s.type==="coin"&&(fe.play(),Wt(a=>a+1)),s.type==="binocular"&&(Y(a=>a+10),ge.play())})})})}function me(n,t,e,i){const r=n+(t-n)*e;return i?n<t?Math.min(t,Math.max(n,r)):Math.min(n,Math.max(t,r)):r}function pe(n,t,e,i){const r=(e-n)/(t-n);return i?Math.min(1,Math.max(0,r)):r}function dt(n,t,e,i,r,o){const s=pe(n,t,r,!1);return me(e,i,s,o)}function ve(n){const t=new AudioContext,e=t.createOscillator();e.frequency.value=n,e.type="square",e.connect(t.destination),e.start(),e.stop(.03)}function we(n,t){let e=Date.now(),i=0;T(()=>{function r(){const o=Math.max(0,n()-t()),s=dt(0,100,80,4e3,o,!1),a=dt(0,100,1800,400,o,!0),l=Math.max(0,s-(Date.now()-e));n()>100||n()===0||(i=setTimeout(()=>{const d=Date.now();d-e>50&&ve(a),e=d,r()},l))}return i&&(clearTimeout(i),i=0),r(),()=>{i&&(clearTimeout(i),i=0)}})}const Ae=S('<svg><g class="grid"><defs><pattern id="grid" patternUnits="userSpaceOnUse"><path fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="0.5"></path></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"></rect></g></svg>',12,!0);function xe(n){return(()=>{const t=Ae.cloneNode(!0),e=t.firstChild,i=e.firstChild,r=i.firstChild;return k(o=>{const s=n.x,a=n.y,l=n.width,d=n.height,g=`M ${n.width} 0 L 0 0 0 ${n.height}`;return s!==o._v$&&v(i,"x",o._v$=s),a!==o._v$2&&v(i,"y",o._v$2=a),l!==o._v$3&&v(i,"width",o._v$3=l),d!==o._v$4&&v(i,"height",o._v$4=d),g!==o._v$5&&v(r,"d",o._v$5=g),o},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0,_v$5:void 0}),t})()}const Me=S(`<svg><g class="magnet-circle"><defs><radialGradient id="magnet-circle"><stop offset="0" stop-color="rgba(0, 0, 255, 0.09)"></stop><stop offset="0.6" stop-color="rgba(0, 0, 255, 0.09)"><animate attributeName="offset" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"></animate></stop><stop offset="0.9" stop-color="rgba(0, 0, 255, 0.04)"><animate attributeName="offset" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"></animate></stop><stop offset="1" stop-color="rgba(0, 0, 255, 0.04)"></stop></radialGradient></defs><ellipse fill="url('#magnet-circle')"></ellipse></g></svg>`,22,!0);function Ie(n){return(()=>{const t=Me.cloneNode(!0),e=t.firstChild,i=e.nextSibling;return k(r=>{const o=n.x,s=n.y,a=n.radiusX,l=n.radiusY;return o!==r._v$&&v(i,"cx",r._v$=o),s!==r._v$2&&v(i,"cy",r._v$2=s),a!==r._v$3&&v(i,"rx",r._v$3=a),l!==r._v$4&&v(i,"ry",r._v$4=l),r},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),t})()}const Ee=S(`<svg><g class="view-mask"><defs><radialGradient id="view-circle-gradient"><stop offset="0.9" stop-color="black"></stop><stop offset="1" stop-color="white"></stop></radialGradient><mask id="view-circle-mask"><rect width="100%" height="100%" fill="white"></rect><ellipse fill="url('#view-circle-gradient')"></ellipse></mask></defs><rect width="100%" height="100%" mask="url('#view-circle-mask')" fill="rgba(255,255,255,0.8)"></rect></g></svg>`,20,!0);function Se(n){return(()=>{const t=Ee.cloneNode(!0),e=t.firstChild,i=e.firstChild,r=i.nextSibling,o=r.firstChild,s=o.nextSibling;return k(a=>{const l=n.x,d=n.y,g=n.radiusX,w=n.radiusY;return l!==a._v$&&v(s,"cx",a._v$=l),d!==a._v$2&&v(s,"cy",a._v$2=d),g!==a._v$3&&v(s,"rx",a._v$3=g),w!==a._v$4&&v(s,"ry",a._v$4=w),a},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),t})()}const Ce=S('<svg><g class="walk-trail"></g></svg>',4,!0),be=S('<svg><line stroke-linecap="round"></line></svg>',4,!0);function ke(n){return(()=>{const t=Ce.cloneNode(!0);return t.style.setProperty("mix-blend-mode","multiply"),C(t,m(J,{get each(){return n.points},children:(e,i)=>{const r=n.points[i()-1];if(!r||r.top===0&&r.left===0)return null;const o=i()/n.points.length;return(()=>{const s=be.cloneNode(!0);return v(s,"stroke",`rgba(${255-o*32}, ${255-o*32}, 255)`),v(s,"stroke-width",10*o),k(a=>{const l=r.left,d=r.top,g=e.left,w=e.top;return l!==a._v$&&v(s,"x1",a._v$=l),d!==a._v$2&&v(s,"y1",a._v$2=d),g!==a._v$3&&v(s,"x2",a._v$3=g),w!==a._v$4&&v(s,"y2",a._v$4=w),a},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),s})()}})),t})()}const De=S('<svg><g class="direction-arrow"><defs><linearGradient id="direction-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="rgba(0, 0, 255, 0.5)"></stop><stop offset="100%" stop-color="rgba(0, 0, 255, 0)"></stop></linearGradient></defs><path d="M -15 0 L15 0 L 0 -24 L-15 0" fill="url(#direction-gradient)"></path><text x="0" y="0" font-size="14px" text-anchor="middle" dominant-baseline="hanging" fill="#99f">m</text></g></svg>',16,!0);function Ne(n){const t="14px",e=p(()=>n.angle>0?n.angle%(Math.PI*2)<Math.PI?`rotateZ(180deg) translateY(-${t})`:"":n.angle%(Math.PI*2)<-Math.PI?`rotateZ(180deg) translateY(-${t})`:"");return m(nt,{get when(){return n.distanceInMeter},get children(){const i=De.cloneNode(!0),r=i.firstChild,o=r.nextSibling,s=o.nextSibling,a=s.firstChild;return i.style.setProperty("user-select","none"),s.style.setProperty("font-weight","bold"),C(s,()=>Math.round(n.distanceInMeter),a),k(l=>{const d=`translate(${n.x}px, ${n.y}px) rotate(${n.angle+Math.PI/2}rad)`,g=e();return d!==l._v$&&i.style.setProperty("transform",l._v$=d),g!==l._v$2&&s.style.setProperty("transform",l._v$2=g),l},{_v$:void 0,_v$2:void 0}),i}})}const $e=S('<svg><rect width="100%" height="100%" fill="#f8f8f8"></rect><g class="items"></g></svg>'),Re=S("<div></div>"),V={stiffness:.1},ft={};function je(){function n(t){switch(t.key){case"+":{Y(e=>e+10);break}case"-":{Y(e=>e-10);break}}}it(()=>{document.addEventListener("keydown",n)}),z(()=>{document.addEventListener("keydown",n)})}const Be=()=>{const[n,t]=B(M.zero),e=Ct({onResize:u=>t(M.create(0,0,u.width,u.height))}),i=p(()=>n().grow(-50)),r=p(()=>M.fromPoints(h.waypoints.map(u=>E.create(u.longitude,u.latitude)))),o=p(()=>{const u=.5,f=r().getCenter(),A=P.getDistance({longitude:f.left-u,latitude:f.top},{longitude:f.left+u,latitude:f.top}),N=P.getDistance({longitude:f.left,latitude:f.top-u},{longitude:f.left,latitude:f.top+u});return x.create(A,N)}),s=p(()=>{const{viewDistanceInMeter:u}=h.me,f=u/o().width,A=u/o().height;return M.create((h.me.location?.longitude??0)-f,(h.me.location?.latitude??0)-A,f*2,A*2)}),a=p(()=>{const u=c.scale(1,o().width/o().height).scale(1,-1),f=s().transform(u.inverse()).normalize();return u.inverse().multiply(i().fitRectTransform(f))}),[l]=G(a,V),d=10,g=p(()=>M.create(h.waypoints[0].longitude,h.waypoints[0].latitude,d/o().width,d/o().height).transform(l()).normalize());ue(),ye(),je();const w=p(()=>{const u=h.me.location;return E.create(u?.longitude||0,u?.latitude||0).transform(a())}),[y]=G(w,V),I=p(()=>{const u=h.me.magnetDistanceInMeter,f=c.identity.scaleByVector(o()).inverse().multiply(l()),A=x.create(u,u).transform(f);return x.create(Math.abs(A.width),Math.abs(A.height))}),R=p(()=>{const{left:u,top:f}=s().getCenter().transform(a()),A=s().transform(a()).normalize(),N=A.width/2,$=A.height/2;return{x:u,y:f,radiusX:N,radiusY:$}}),[j]=G(R,V),gt=ut(p(()=>h.me.location),50),yt=p(()=>gt().reduce((u,f)=>{if(!f)return u;const A=E.create(f.longitude,f.latitude).transform(l());return u.push(Math.round(A.left*10)/10),u.push(Math.round(A.top*10)/10),u},[])),mt=p(()=>{let u=0;return yt().reduce((f,A,N)=>(N%2==0?u=A:f.push(E.create(u,A)),f),[])});Gt("male");const H=p(()=>{const u=Pt();return u?x.create(u.longitude-(h.me.location?.longitude??0),u.latitude-(h.me.location?.latitude??0)):x.create(0,0)}),X=p(()=>H().scaleByVector(o()).getLength());we(X,p(()=>h.me.magnetDistanceInMeter));const pt=p(u=>{const f=H().getAngleRad();if(u===void 0)return f;let A=(f-u)%(Math.PI*2);return A>Math.PI?A-=Math.PI*2:A<-Math.PI&&(A+=Math.PI*2),u+A}),[U]=G(pt,{mass:10,damping:2.5,precision:1e-4}),_=15,q=p(()=>E.fromObject(y()).transform(c.fromObject(a()).inverse()).addPoint(E.fromTuple(x.fromAngleRad(U()).scale(h.me.viewDistanceInMeter).scaleByVector(o().inverse()).toTuple())).transform(a()).addPoint(E.fromTuple(x.fromAngleRad(U()).scale(_,-_).toTuple())));return(()=>{const u=Re.cloneNode(!0);return e(u),C(u,m(ce,{get code(){return h.me.locationError?.code||0},get children(){return[(()=>{const f=$e.cloneNode(!0),A=f.firstChild,N=A.nextSibling;return C(f,m(Ie,{get x(){return y().left},get y(){return y().top},get radiusX(){return I().width},get radiusY(){return I().height}}),N),C(f,m(ke,{get points(){return mt()}}),N),C(f,m(xe,{get x(){return g().left},get y(){return g().top},get width(){return g().width},get height(){return g().height}}),N),C(N,m(J,{get each(){return h.waypoints},children:$=>{const L=p(()=>{const tt=W($.id)?h.me.location?.longitude??$.longitude:$.longitude,xt=W($.id)?h.me.location?.latitude??$.latitude:$.latitude;return E.create(tt,xt)}),vt=p(()=>!(W($.id)||x.create((h.me.location?.longitude??0)-L().left,(h.me.location?.latitude??0)-L().top).transform(c.identity.scaleByVector(o())).getLength()>h.me.viewDistanceInMeter)),[wt]=G(p(()=>vt()?1:0,ft)),At=p(()=>L().transform(a())),[Z]=G(At,ft);return m(Ht,{waypoint:$,get x(){return Z().left},get y(){return Z().top},get opacity(){return wt()}})}})),C(f,m(zt,{get gender(){return h.me.gender??"male"},get x(){return y().left},get y(){return y().top}}),null),C(f,m(Se,{get x(){return j().x},get y(){return j().y},get radiusX(){return j().radiusX},get radiusY(){return j().radiusY}}),null),C(f,m(Ne,{get x(){return q().left},get y(){return q().top},get distanceInMeter(){return X()},get angle(){return U()}}),null),k(()=>v(f,"class",ct.TopView_svg)),f})(),m(oe,{})]}})),k(()=>u.className=ct.TopView),u})()},Ge=S("<div></div>"),Oe=S("<div>This is a POC for a GPS based treasurehunt game.<br>You can simulate movement with the arrow keys.<br>Press Home to jump the first waypoint, PageDown for the next waypoint.<div>x</div></div>"),Qe=()=>{const[n,t]=B(!0);return(()=>{const e=Ge.cloneNode(!0);return C(e,m(Be,{}),null),C(e,(()=>{const i=kt(()=>!!n(),!0);return()=>i()&&(()=>{const r=Oe.cloneNode(!0),o=r.firstChild,s=o.nextSibling,a=s.nextSibling,l=a.nextSibling,d=l.nextSibling,g=d.nextSibling;return r.$$click=()=>t(!1),r.style.setProperty("position","absolute"),r.style.setProperty("bottom","10px"),r.style.setProperty("right","10px"),r.style.setProperty("font-size","0.8em"),r.style.setProperty("background-color","white"),r.style.setProperty("border","1px solid #888"),r.style.setProperty("border-radius","5px"),r.style.setProperty("padding","8px"),r.style.setProperty("cursor","pointer"),r.style.setProperty("margin-left","10px"),g.style.setProperty("position","absolute"),g.style.setProperty("top","0px"),g.style.setProperty("right","8px"),r})()})(),null),k(()=>e.className=Rt.App),e})()};bt(["click"]);Dt(()=>m(Qe,{}),document.getElementById("root"));