(function(){
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tb=document.getElementById('theme'), root=document.documentElement, dark=true;
  try{dark=localStorage.getItem('gift-theme')!=='light'}catch(e){}
  function apply(){root.setAttribute('data-theme',dark?'dark':'light');tb.setAttribute('aria-checked',dark)} apply();
  tb.addEventListener('click',function(){dark=!dark;try{localStorage.setItem('gift-theme',dark?'dark':'light')}catch(e){}apply()});

  var toast=document.getElementById('toast'), tt=0, n=0, L=['Chưa tới lúc đâu, đợi mình gặp nhau nha 🙈','Món này mở sau khi gặp mặt 💜','Kiên nhẫn xíu nè ✨'];
  document.addEventListener('click',function(e){
    var t=e.target.closest('.row.locked');
    if(t){t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');var gb=t.querySelector('b');gb.classList.remove('glitch');void gb.offsetWidth;gb.classList.add('glitch');
      if(navigator.vibrate)navigator.vibrate([30,40,30]);toast.textContent=L[n++%L.length];toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},2400);return}
    var a=e.target.closest('a.feature'); if(!a||e.metaKey||e.ctrlKey||e.shiftKey) return;if(navigator.vibrate)navigator.vibrate(18);
    e.preventDefault();
    if(rm){location.href=a.href;return}
    tear(a);
  });

  /* xé vé: tách tấm vé làm hai nửa theo đường đứt nét rồi mới chuyển trang */
  var busy=false, Y=62;
  function tear(a){
    if(busy) return; busy=true;
    var r=a.getBoundingClientRect(), pts=[], k, x, y, i;
    for(k=0;k<=16;k++){x=k*6.25;y=Y+(k%2?1:-1)*(.6+Math.random()*1.7);pts.push([x,y])}
    var zz=pts.map(function(p){return p[0]+'% '+p[1]+'%'}).join(',');
    function half(clip){
      var c=a.cloneNode(true);c.removeAttribute('href');c.className='feature tear';c.setAttribute('aria-hidden','true');
      c.style.cssText='position:fixed;margin:0;z-index:40;pointer-events:none;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;clip-path:'+clip;
      document.body.appendChild(c);return c}
    var up=half('polygon(0 0,100% 0,'+zz.split(',').reverse().join(',')+')'), dn=half('polygon('+zz+',100% 100%,0 100%)');
    a.style.visibility='hidden';
    if(navigator.vibrate)navigator.vibrate([20,30,60]);

    var ty=r.top+r.height*Y/100, g=document.createElement('i');
    g.className='rip-glow';g.style.cssText='left:'+r.left+'px;top:'+(ty-2)+'px;width:'+r.width+'px';document.body.appendChild(g);
    g.animate([{transform:'scaleX(0)',opacity:1},{transform:'scaleX(1)',opacity:1,offset:.35},{transform:'scaleX(1.1)',opacity:0}],{duration:650,easing:'ease-out',fill:'forwards'});

    var o={duration:720,easing:'cubic-bezier(.6,0,.9,.5)',fill:'forwards'};
    up.animate([{transform:'rotate(-1.6deg)'},{transform:'translate(-4px,-8px) rotate(-3.5deg)',offset:.18},{transform:'translate(-60px,-150px) rotate(-16deg)',opacity:0}],o);
    dn.animate([{transform:'rotate(-1.6deg)'},{transform:'translate(4px,6px) rotate(-.5deg)',offset:.18},{transform:'translate(50px,190px) rotate(12deg)',opacity:0}],o);

    var cols=['#fff1e6','#ff2e88','#b48cff','#ffd9a0'];
    for(i=0;i<18;i++){var s=document.createElement('i'),w=4+Math.random()*7;
      s.className='bit';s.style.cssText='left:'+(r.left+Math.random()*r.width)+'px;top:'+ty+'px;width:'+w+'px;height:'+w*1.4+'px;background:'+cols[i%4];
      document.body.appendChild(s);
      s.animate([{transform:'none',opacity:1},{transform:'translate('+(Math.random()*120-60)+'px,'+(60+Math.random()*180)+'px) rotate('+(Math.random()*720-360)+'deg)',opacity:0}],{duration:600+Math.random()*400,delay:120,easing:'cubic-bezier(.2,.6,.4,1)',fill:'both'})}

    setTimeout(function(){document.body.classList.add('leaving')},380);
    setTimeout(function(){location.href=a.href},760);
  }
  window.addEventListener('pageshow',function(e){
    if(!e.persisted) return; busy=false;document.body.classList.remove('leaving');
    document.querySelectorAll('.tear,.rip-glow,.bit').forEach(function(n){n.remove()});
    var f=document.querySelector('a.feature');if(f)f.style.visibility='';
  });
})();