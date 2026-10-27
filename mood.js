/* Theme cầu vồng: màu tự trôi dần giữa các màu, cố định cho cả hub + thư mời (không đổi/lưu theme nữa) */
(function(){
var map={hong:['#ff2e88','#ff6b57','#b48cff'],tim:['#a66bff','#ff8fd0','#d6c4ff'],bien:['#1fb5d6','#5ee0c1','#8fb8ff'],nang:['#ff7a29','#ffc14d','#ffb08a'],matcha:['#3fd08a','#c8e86a','#8fe0c8']};
var names={hong:'Hồng ngọt',tim:'Tím mộng mơ',bien:'Xanh biển',nang:'Cam nắng',matcha:'Matcha'};
var order=['hong','tim','bien','matcha','nang'],r=document.documentElement,timer=0,SEG=14000;
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function h2n(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,f){var x=h2n(a),y=h2n(b);return x.map(function(v,i){return Math.round(v+(y[i]-v)*f)})}
function hex(n){return '#'+n.map(function(v){return (v<16?'0':'')+v.toString(16)}).join('')}
function apply(c){var s=r.style,n=c.map(h2n);
 s.setProperty('--hot',c[0]);s.setProperty('--coral',c[1]);s.setProperty('--lilac',c[2]);
 s.setProperty('--hotrgb',n[0].join(','));s.setProperty('--lilrgb',n[2].join(','));
 s.setProperty('--mag',c[0]);s.setProperty('--pink',c[1]);s.setProperty('--violet',c[2]);s.setProperty('--mrgb',n[0].join(','));s.setProperty('--vrgb',n[2].join(','))}
/* mỗi màu giữ ~20% thời gian, 60% còn lại chuyển mượt sang màu kế */
function tick(){var t=Date.now()/SEG,i=Math.floor(t),f=Math.min(1,Math.max(0,(t-i-.2)/.6));f=f*f*(3-2*f);
 var A=map[order[i%order.length]],B=map[order[(i+1)%order.length]];apply([0,1,2].map(function(n){return hex(mix(A[n],B[n],f))}))}
/* điện thoại: đổi màu mỗi 600ms (mỗi lần đổi là cả trang phải tính lại + vẽ lại, 150ms làm máy yếu tụt còn ~20fps); máy tính giữ 150ms cho mượt */
var coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches,STEP=coarse?600:150;
function auto(){clearInterval(timer);tick();if(!rm)timer=setInterval(function(){if(!document.hidden)tick()},STEP)}
auto();
})();
