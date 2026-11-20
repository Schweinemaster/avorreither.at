import e from"./gsap.C2W12wA9.js";import{ScrollTrigger as t}from"./ScrollTrigger.Dg2oAicK.js";import{n,t as r}from"./Layout.astro_astro_type_script_index_0_lang.Bu64iR2c.js";var i=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;async function a(e,t,n,{alpha:r=!1,maxRatio:a=1.5,derivatives:o=!1}={}){let s=e.getContext(`webgl`,{antialias:!1,alpha:r,premultipliedAlpha:!0,powerPreference:`high-performance`});if(!s||o&&!s.getExtension(`OES_standard_derivatives`))return null;let c=s.getExtension(`KHR_parallel_shader_compile`),l=(o?`#extension GL_OES_standard_derivatives : enable
`:``)+t,u=s.createShader(s.VERTEX_SHADER),d=s.createShader(s.FRAGMENT_SHADER),f=s.createProgram();if(!u||!d||!f)return null;if(s.shaderSource(u,i),s.shaderSource(d,l),s.compileShader(u),s.compileShader(d),s.attachShader(f,u),s.attachShader(f,d),s.linkProgram(f),c){for(;!s.getProgramParameter(f,c.COMPLETION_STATUS_KHR);)if(await new Promise(e=>requestAnimationFrame(e)),s.isContextLost())return null}if(!s.getProgramParameter(f,s.LINK_STATUS))return null;s.useProgram(f);let p=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,p),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),s.STATIC_DRAW);let m=s.getAttribLocation(f,`position`);s.enableVertexAttribArray(m),s.vertexAttribPointer(m,2,s.FLOAT,!1,0,0);let h={};for(let e of n)h[e]=s.getUniformLocation(f,e);let g=[];return{gl:s,uniforms:h,resize(t=1){let n=Math.min(window.devicePixelRatio||1,a)*t,r=Math.max(1,Math.round(e.clientWidth*n)),i=Math.max(1,Math.round(e.clientHeight*n));return e.width===r&&e.height===i?!1:(e.width=r,e.height=i,s.viewport(0,0,r,i),!0)},draw(){s.drawArrays(s.TRIANGLE_STRIP,0,4)},texture(e,t,n,{alpha:r=!1,data:i=!1}={}){let a=s.createTexture();if(!a)return;g.push(a),s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,a),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,i?s.NONE:s.BROWSER_DEFAULT_WEBGL);let o=i?s.NEAREST:s.LINEAR;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,o),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,o);let c=r?s.RGBA:s.RGB;s.texImage2D(s.TEXTURE_2D,0,c,c,s.UNSIGNED_BYTE,n),s.uniform1i(h[e],t)},destroy(){for(let e of g)s.deleteTexture(e);s.deleteBuffer(p),s.deleteProgram(f)}}}function o(e,t,n,r=.5,i=.5){let a=e/t,o=a>n?1:a/n,s=a>n?n/a:1;return{scaleX:o,scaleY:s,offsetX:(1-o)*i,offsetY:(1-s)*r}}function s(e){let t=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0});if(!t)return[0,0,0];t.fillStyle=e,t.fillRect(0,0,1,1);let[n=0,r=0,i=0]=t.getImageData(0,0,1,1).data;return[n/255,r/255,i/255]}function c(e,t){let n=0,r=!1,i=0,a=0,o=e=>{if(n=0,!r||document.hidden)return;let s=Math.min(e-i,100)/1e3;i=e,a+=s,t(a,s)&&(n=requestAnimationFrame(o))},s=()=>{n||!r||document.hidden||(i=performance.now(),n=requestAnimationFrame(o))},c=new IntersectionObserver(([e])=>{r=!!e?.isIntersecting,s()});return c.observe(e),document.addEventListener(`visibilitychange`,s),{invalidate:s,destroy(){cancelAnimationFrame(n),c.disconnect(),document.removeEventListener(`visibilitychange`,s)}}}var l=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uPhoto;
uniform sampler2D uField;
uniform vec2 uFieldSize;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec2 uPointer;
uniform vec2 uFocus;
uniform float uProgress;
uniform float uFrontStart;
uniform vec3 uInk;
uniform vec3 uRed;
varying vec2 vUv;

// Field texel: r = depth (near = 1), g and b = height as 16 bit.
vec2 unpack(vec4 t) {
  return vec2(t.r, (t.g * 65280.0 + t.b * 255.0) / 65535.0);
}

// Exact-number texture (no filtering), so smoothed by hand.
vec2 field(vec2 uv) {
  vec2 p = uv * uFieldSize - 0.5;
  vec2 f = fract(p);
  vec2 texel = 1.0 / uFieldSize;
  vec2 base = (floor(p) + 0.5) * texel;
  vec2 a = unpack(texture2D(uField, base));
  vec2 b = unpack(texture2D(uField, base + vec2(texel.x, 0.0)));
  vec2 c = unpack(texture2D(uField, base + vec2(0.0, texel.y)));
  vec2 d = unpack(texture2D(uField, base + texel));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv * uScale + uOffset;

  // The camera pushes toward the summit.
  uv = uFocus + (uv - uFocus) / (1.0 + 0.2 * uProgress);

  // Depth shift: near rock moves against the pointer, far rock with it.
  // Fades out at the crop edges, so no clamped edge texels get pulled in.
  float near = field(uv).x;
  float inside = smoothstep(0.0, 0.03, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
  uv += uPointer * (near - 0.32) * vec2(0.016, 0.01) * inside;

  vec4 photo = texture2D(uPhoto, uv);
  float h = field(uv).y;

  // Contours = level sets of the height field; every fifth is heavier.
  float v = h * 50.0;
  float w = fwidth(v);
  float toLine = abs(fract(v - 0.5) - 0.5);
  float thin = 1.0 - smoothstep(w * 0.35, w * 1.05, toLine);
  float toIndex = abs(fract(v / 5.0 - 0.5) - 0.5) * 5.0;
  float bold = 1.0 - smoothstep(w * 0.9, w * 1.7, toIndex);
  // Skyline outline: contours end on the ridge, not in mid-air. Alpha is averaged over
  // one screen pixel (the photo is minified without mipmaps, so its edge aliases).
  vec2 px = fwidth(uv) * 0.5;
  float a = 0.25 * (texture2D(uPhoto, uv + px).a + texture2D(uPhoto, uv - px).a
    + texture2D(uPhoto, uv + vec2(px.x, -px.y)).a + texture2D(uPhoto, uv + vec2(-px.x, px.y)).a);
  float fa = max(fwidth(a), 1e-4);
  float outline = 1.0 - smoothstep(fa * 0.5, fa * 1.5, abs(a - 0.5));
  float line = max(max(thin * 0.62, bold) * photo.a, outline);

  // Front climbs from the lowest on-screen height. Below: map. Above: photo.
  float sweep = smoothstep(0.04, 0.84, uProgress);
  float front = mix(uFrontStart, 1.04, sweep);
  float isPhoto = smoothstep(front - 0.025, front + 0.025, h);
  float fw = fwidth(h);
  float edge = 1.0 - smoothstep(fw * 1.2, fw * 2.6, abs(h - front));
  edge *= step(0.002, sweep) * step(sweep, 0.998);

  // Fully mapped: lines lighten and fade toward the bottom edge into the page.
  float settled = smoothstep(0.84, 1.0, uProgress);
  float strength = mix(0.92, 0.55, settled) * mix(1.0, 1.0 - smoothstep(0.72, 1.0, vUv.y), settled);
  vec4 map = vec4(uInk, 1.0) * (line * strength);
  vec4 color = mix(map, photo, isPhoto);
  gl_FragColor = mix(color, vec4(uRed, 1.0), edge * photo.a);
}`,u=[`uPhoto`,`uField`,`uFieldSize`,`uScale`,`uOffset`,`uPointer`,`uFocus`,`uProgress`,`uFrontStart`,`uInk`,`uRed`];function d(e){let t=document.createElement(`canvas`);t.width=e.naturalWidth,t.height=e.naturalHeight;let n=t.getContext(`2d`,{willReadFrequently:!0});if(!n)return;n.drawImage(e,0,0);let{data:r}=n.getImageData(0,0,t.width,t.height),i=new Float32Array(t.width*t.height);for(let e=0;e<i.length;e++)i[e]=((r[e*4+1]??0)*256+(r[e*4+2]??0))/65535;return{values:i,width:t.width,height:t.height}}function f(e){return new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e})}function p(){let i=document.querySelector(`[data-hero-track]`),p=i?.querySelector(`[data-hero]`),m=p?.querySelector(`[data-hero-ridge]`),h=m?.querySelector(`img`),g=m?.querySelector(`canvas`),_=p?.querySelector(`[data-hero-sky]`),v=p?.querySelector(`[data-hero-name]`);if(!i||!p||!m||!h||!g||!_||!v||n())return;let y=!1,b=[],x=async()=>{let n=await a(g,l,u,{alpha:!0,derivatives:!0});if(!n)return;if(y){n.destroy();return}b.push(n.destroy);let{gl:x,uniforms:S}=n,C=Number(m.dataset.ratio)||1.5,w={progress:0,x:0,y:0,targetX:0,targetY:0},T=!1,E=getComputedStyle(p);x.uniform3fv(S.uInk,s(E.getPropertyValue(`--color-heading`))),x.uniform3fv(S.uRed,s(E.getPropertyValue(`--color-accent`))),x.uniform2f(S.uFocus,Number(m.dataset.summitX)||.5,Number(m.dataset.summitY)||.1);let D,O=()=>{n.resize();let e=o(g.clientWidth,g.clientHeight,C,0);x.uniform2f(S.uScale,e.scaleX,e.scaleY),x.uniform2f(S.uOffset,e.offsetX,e.offsetY);let t=0;if(D){let n=Math.min(D.height-1,Math.round((e.offsetY+e.scaleY)*D.height)),r=Math.floor(e.offsetX*D.width),i=Math.ceil((e.offsetX+e.scaleX)*D.width);t=1;for(let e=r;e<i;e++)t=Math.min(t,D.values[n*D.width+e]??1)}x.uniform1f(S.uFrontStart,t-.04)},k=c(p,()=>T?(w.x+=(w.targetX-w.x)*.08,w.y+=(w.targetY-w.y)*.08,x.uniform2f(S.uPointer,w.x,w.y),x.uniform1f(S.uProgress,w.progress),n.draw(),Math.abs(w.targetX-w.x)+Math.abs(w.targetY-w.y)>.002):!1);b.push(k.destroy);let A=new ResizeObserver(()=>{O(),k.invalidate()});A.observe(g),b.push(()=>A.disconnect());let j=e=>{e.preventDefault(),delete m.dataset.live};g.addEventListener(`webglcontextlost`,j),b.push(()=>g.removeEventListener(`webglcontextlost`,j)),await(async()=>{let a=m.dataset.field;if(!a)return;let o;try{[o]=await Promise.all([f(a),h.decode()])}catch{return}if(y)return;n.texture(`uPhoto`,0,h,{alpha:!0}),n.texture(`uField`,1,o,{data:!0}),x.uniform2f(S.uFieldSize,o.naturalWidth,o.naturalHeight),D=d(o),O(),x.uniform2f(S.uPointer,0,0),x.uniform1f(S.uProgress,0),n.draw(),T=!0,m.dataset.live=``;let s=()=>parseFloat(getComputedStyle(p).top)||0,c=p.offsetHeight<=window.innerHeight-s()+1;c&&(i.dataset.pinned=``);let l=e.context(()=>{let t=e.timeline({defaults:{ease:`none`},scrollTrigger:{trigger:i,start:()=>`top ${s()}px`,end:c?`bottom bottom`:`bottom top`,scrub:.4,invalidateOnRefresh:!0},onUpdate:k.invalidate});t.to(w,{progress:1,duration:1},0),t.to(_,{opacity:0,scale:1.08,transformOrigin:`46% 30%`,duration:.5},.25)},p);if(b.push(()=>{l.revert(),delete i.dataset.pinned,delete m.dataset.live}),t.refresh(),r()){let t=e.quickTo(_,`x`,{duration:.9,ease:`power3.out`}),n=e.quickTo(v,`x`,{duration:.9,ease:`power3.out`}),r=e.quickTo(v,`y`,{duration:.9,ease:`power3.out`}),i=(e,i)=>{w.targetX=e,w.targetY=i,t(e*10),n(e*5),r(i*3),k.invalidate()},a=e=>{let t=p.getBoundingClientRect();i(((e.clientX-t.left)/t.width-.5)*2,((e.clientY-t.top)/t.height-.5)*2)},o=()=>i(0,0);p.addEventListener(`pointermove`,a),p.addEventListener(`pointerleave`,o),b.push(()=>{p.removeEventListener(`pointermove`,a),p.removeEventListener(`pointerleave`,o),e.set([_,v],{clearProps:`transform`})})}})()};return`requestIdleCallback`in window?window.requestIdleCallback(()=>void x(),{timeout:1500}):setTimeout(()=>void x(),200),()=>{y=!0;for(let e of b.reverse())e()}}export{p as startHero};