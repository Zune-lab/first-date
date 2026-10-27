(function(){
  var lite=window.matchMedia&&matchMedia('(pointer:coarse)').matches; // điện thoại/tablet: giảm số hạt trang trí
  var cd=document.getElementById('candles');
  if(cd) for(var q=0;q<(lite?14:22);q++){var c=document.createElement('i');c.className='candle';var x=50+(Math.random()+Math.random()+Math.random()-1.5)*72;c.style.cssText='--x:'+x+'%;--w:'+(4+Math.random()*3)+'px;--h:'+(14+Math.random()*32)+'px;--b:'+(Math.random()*5)+'vh;--f:'+(.45+Math.random()*.7)+'s;--dl:-'+(Math.random()*2)+'s';cd.appendChild(c)}
  var eb=document.getElementById('embers');
  if(eb) for(var k=0;k<(lite?8:14);k++){var e=document.createElement('span');e.style.cssText='left:'+(Math.random()*100)+'%;--s:'+(2+Math.random()*4)+'px;--d:'+(6+Math.random()*7)+'s;--l:-'+(Math.random()*12)+'s;--x:'+(Math.random()*90-45)+'px';eb.appendChild(e)}
  var steps=document.querySelectorAll('.step'), dots=document.getElementById('dots'), di=dots.children;
  var what=document.getElementById('what'), when=document.getElementById('when');
  var cur=0, swapT=0, hT=0, card=document.getElementById('card'), rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(n){
    if(n===cur&&!swapT) return;
    dots.classList.toggle('on',n>=1&&n<=3);
    for(var i=0;i<3;i++) di[i].className=(i===n-1)?'a':'';
    window.scrollTo(0,0);
    var nb=document.getElementById('no'), fly=nb&&nb.classList.contains('fly');
    if(fly&&n!==3) nb.style.display='none';
    clearTimeout(swapT);
    steps.forEach(function(s){s.classList.remove('out')});
    steps[cur].classList.add('out');
    swapT=setTimeout(function(){
      swapT=0;
      var h0=card.offsetHeight;
      steps.forEach(function(s,i){s.classList.remove('out'); s.classList.toggle('on',i===n)});
      cur=n;
      if(fly&&n===3) nb.style.display='';
      if(!rm){
        clearTimeout(hT);
        card.style.height='auto'; var h1=card.offsetHeight;
        card.style.height=h0+'px'; void card.offsetHeight; card.style.height=h1+'px';
        hT=setTimeout(function(){card.style.height=''},620);
      }
    },rm?0:220);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-go]'); if(b) go(+b.getAttribute('data-go'));
  });
  function picked(box,sel){return Array.prototype.map.call(box.querySelectorAll(sel+'[aria-pressed="true"]'),function(c){return c.textContent.replace(/^\S+\s/,'').trim()})}
  function placeList(){return picked(what,'.tile').map(function(t){return t})}
  var dateIn={value:''}, timeIn={value:''};
  var ov=document.getElementById('ov'), cal=document.getElementById('cal'), calT=document.getElementById('calT');
  var pdate=document.getElementById('pdate'), ptime=document.getElementById('ptime'), wh=document.getElementById('wh'), wm=document.getElementById('wm');
  var now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate()), view=new Date(now.getFullYear(),now.getMonth(),1), mode='', lastF=null;
  function pad(x){return String(x).padStart(2,'0')}
  function drawCal(){
    var y=view.getFullYear(), m=view.getMonth(), first=(new Date(y,m,1).getDay()+6)%7, days=new Date(y,m+1,0).getDate(), h='';
    calT.textContent='Tháng '+(m+1)+', '+y;
    for(var i=0;i<first;i++) h+='<span></span>';
    for(var d=1;d<=days;d++){
      var v=y+'-'+pad(m+1)+'-'+pad(d), past=new Date(y,m,d)<today;
      h+='<button type="button" class="day" data-d="'+v+'"'+(past?' disabled':'')+' aria-pressed="'+(v===dateIn.value)+'">'+d+'</button>';
    }
    cal.innerHTML=h;
    document.getElementById('prev').disabled=(y===now.getFullYear()&&m===now.getMonth());
  }
  function wcount(c){return c.children.length}
  function widx(c){return Math.max(0,Math.min(wcount(c)-1,Math.round(c.scrollTop/44)))}
  function fillCol(c,n,step){var h='';for(var i=0;i<n;i++)h+='<div class="wi">'+pad(i*step)+'</div>';c.innerHTML=h}
  fillCol(wh,24,1); fillCol(wm,12,5);
  function mark(c){var k=widx(c);Array.prototype.forEach.call(c.children,function(el,i){el.className='wi'+(i===k?' on':'')})}
  [wh,wm].forEach(function(c){
    var raf=0;
    c.addEventListener('scroll',function(){if(raf) return; raf=requestAnimationFrame(function(){raf=0;mark(c)})});
    c.addEventListener('click',function(e){var el=e.target.closest('.wi'); if(el) c.scrollTo({top:Array.prototype.indexOf.call(c.children,el)*44,behavior:'smooth'})});
  });
  function setWheels(){
    var p=(timeIn.value||'19:00').split(':'), h=+p[0], m=Math.round(+p[1]/5)%12;
    setTimeout(function(){wh.scrollTop=h*44; wm.scrollTop=m*44; mark(wh); mark(wm)},0);
  }
  function showVals(){
    var a=document.getElementById('fdv'), b=document.getElementById('ftv'), d=dateIn.value, ds='';
    if(d){var p=d.split('-'); ds=p[2]+'/'+p[1]+'/'+p[0]}
    a.textContent=ds||'Chọn ngày'; a.className=ds?'':'ph';
    b.textContent=timeIn.value||'Chọn giờ'; b.className=timeIn.value?'':'ph';
  }
  function openSheet(m,f){
    mode=m; lastF=f; pdate.hidden=(m!=='d'); ptime.hidden=(m!=='t');
    if(m==='d') drawCal(); else setWheels();
    document.getElementById('shut').textContent=(m==='d')?'Đóng':'Xong';
    clearTimeout(ct); ov.classList.remove('closing'); ov.hidden=false;
  }
  var ct=0;
  function closeSheet(){if(ov.hidden||ov.classList.contains('closing')) return; ov.classList.add('closing'); ct=setTimeout(function(){ov.hidden=true; ov.classList.remove('closing')},rm?0:220); if(lastF) lastF.focus()}
  document.getElementById('fd').addEventListener('click',function(){openSheet('d',this)});
  document.getElementById('ft').addEventListener('click',function(){openSheet('t',this)});
  cal.addEventListener('click',function(e){
    var b=e.target.closest('.day'); if(!b||b.disabled) return;
    var v=b.getAttribute('data-d'); dateIn.value=(dateIn.value===v)?'':v; showVals(); sync(); closeSheet();
  });
  document.getElementById('prev').addEventListener('click',function(){view.setMonth(view.getMonth()-1);drawCal()});
  document.getElementById('next').addEventListener('click',function(){view.setMonth(view.getMonth()+1);drawCal()});
  document.getElementById('clr').addEventListener('click',function(){if(mode==='d') dateIn.value=''; else timeIn.value=''; showVals(); sync(); closeSheet()});
  document.getElementById('shut').addEventListener('click',function(){
    if(mode==='t'){timeIn.value=pad(widx(wh))+':'+pad(widx(wm)*5); showVals(); sync();}
    closeSheet();
  });
  ov.addEventListener('click',function(e){if(e.target===ov) closeSheet()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden) closeSheet()});
  function whenRaw(){
    var d=dateIn.value, t=timeIn.value, s='';
    if(d){var p=d.split('-'), dt=new Date(+p[0],+p[1]-1,+p[2]);
      s=['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'][dt.getDay()]+', '+p[2]+'/'+p[1]+'/'+p[0]}
    if(t) s+=(s?' lúc ':'')+t;
    return s;
  }
  function placesText(){
    var w=Array.prototype.map.call(what.querySelectorAll('.tile[aria-pressed="true"] b'),function(x){return x.textContent});
    return w.join(', ');
  }
  function sync(){
    document.getElementById('n1').textContent=what.querySelector('[aria-pressed="true"]')?'Tiếp tục':'Bỏ qua';
    document.getElementById('n2').textContent=(dateIn.value||timeIn.value)?'Tiếp tục':'Bỏ qua';
  }
  what.addEventListener('click',function(e){
    var b=e.target.closest('.tile'); if(!b) return;
    b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true'); sync();
  });
  var tz=new Date();
  dateIn.min=tz.getFullYear()+'-'+String(tz.getMonth()+1).padStart(2,'0')+'-'+String(tz.getDate()).padStart(2,'0');
  when.addEventListener('input',sync);

  var no=document.getElementById('no'), yes=document.getElementById('yes'), zone=document.getElementById('zone'), hint=document.getElementById('hint');
  var lines=['Ơ, nút bay mất tiêu rồi 🙈','Cún bảo bấm nút hồng đi 🐶','Thử lại lần nữa? Vẫn bay nhé 🪽','Chạy đâu cho thoát 💨','Nút này có cánh đó nha ✈️','Hết cửa rồi, bấm nút hồng thôi 💗'], n=0;
  var flying=false, lastX=-999, lastY=-999;
  function growYes(){var k=Math.min(n,14),h=56+k*16;yes.style.minHeight=h+'px';yes.style.fontSize=(1+k*.07)+'rem';zone.style.height=Math.max(122,h+14)+'px';yes.classList.toggle('big',k>=5)}
  function dodge(e){
    if(e){e.preventDefault(); e.stopPropagation()}
    if(!flying){
      var r=no.getBoundingClientRect();
      document.body.appendChild(no); no.classList.add('fly');
      no.style.left=r.left+'px'; no.style.top=r.top+'px'; flying=true; void no.offsetWidth;
    }
    var W=Math.max(0,innerWidth-no.offsetWidth-8), H=Math.max(0,innerHeight-no.offsetHeight-8), x=0, y=0;
    var cx=no.offsetLeft, cy=no.offsetTop;
    for(var i=0;i<12;i++){
      x=8+Math.random()*W; y=64+Math.random()*Math.max(0,H-56);
      var far=Math.hypot(x-cx,y-cy)>Math.min(220,innerWidth*.5);
      var fromP=Math.hypot(x-lastX,y-lastY)>160;
      if(far&&fromP) break;
    }
    no.style.left=x+'px'; no.style.top=y+'px';
    no.style.transform='rotate('+(Math.random()*60-30)+'deg) scale('+(.8+Math.random()*.4)+')';
    hint.textContent=lines[Math.min(n,lines.length-1)]; n++;
    growYes();
  }
  function track(e){lastX=e.clientX; lastY=e.clientY}
  no.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse') dodge(e)});
  no.addEventListener('pointerdown',function(e){track(e); dodge(e)});
  no.addEventListener('touchstart',function(e){var t=e.touches[0]; lastX=t.clientX; lastY=t.clientY; dodge(e)},{passive:false});
  no.addEventListener('click',dodge);
  document.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse'||!steps[3].classList.contains('on')) return;
    track(e);
    var r=no.getBoundingClientRect();
    if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<r.width/2+70) dodge();
  });
  window.addEventListener('resize',function(){if(flying&&no.offsetLeft>innerWidth-no.offsetWidth) dodge()});

  var msg='';
  yes.addEventListener('click',function(){
    var w=placesText(), t=whenRaw();
    msg='Chốt kèo nhé Trâm!'+(w?' Mình đi: '+w+'.':'')+(t?' Thời gian: '+t+'.':'')+' Không được bùng đâu đó 🐶💗';
    go(4);
    document.body.classList.add('party');
    burst(); setTimeout(burst,1100);
  });
  var fx=document.getElementById('fx'), hcat=document.getElementById('hcat'), tapN=0, lastBurst=0, MAXFX=lite?36:64;
  fx.addEventListener('animationend',function(e){e.target.remove()}); // 1 listener cho tất cả hạt
  /* pháo hoa: ít hạt hơn, dựng 1 lần bằng DocumentFragment, có trần số hạt + chặn bấm dồn */
  function burst(){
    var now=Date.now(); if(now-lastBurst<350) return; lastBurst=now;
    var left=MAXFX-fx.childElementCount; if(left<=0) return;
    var em=['🕯️','💜','🩷','🐾','✨','🦋','🎉'], cols=['#8b6dff','#e64aa8','#ff5fae','#46d6d9','#f4efff','#ffd166'],
        nR=lite?10:16, nC=lite?8:12, nE=lite?3:5, frag=document.createDocumentFragment(), i, s, side;
    for(i=0;i<nR&&left>0;i++,left--){
      s=document.createElement('span'); s.className='cf';
      s.style.cssText='left:'+(Math.random()*100)+'%;--w:'+(5+Math.random()*6)+'px;--h:'+(8+Math.random()*8)+'px;--c:'+cols[i%cols.length]+';--t:'+(2.6+Math.random()*2)+'s;--dl:'+(Math.random()*.6)+'s;--dx:'+(Math.random()*160-80)+'px;--r:'+(360+Math.random()*720)+'deg';
      frag.appendChild(s);
    }
    for(i=0;i<nC&&left>0;i++,left--){
      side=i%2; s=document.createElement('span'); s.className='cf cn';
      s.style.cssText=(side?'right:0;':'left:0;')+'--w:'+(5+Math.random()*5)+'px;--h:'+(8+Math.random()*7)+'px;--c:'+cols[i%cols.length]+';--t:'+(1.8+Math.random()*1.2)+'s;--dl:'+(Math.random()*.25)+'s;--dx:'+((side?-1:1)*(70+Math.random()*190))+'px;--up:'+(38+Math.random()*42)+'vh;--r:'+(360+Math.random()*720)+'deg';
      frag.appendChild(s);
    }
    for(i=0;i<nE&&left>0;i++,left--){
      s=document.createElement('span'); s.textContent=em[i%em.length];
      s.style.left=(Math.random()*92)+'%'; s.style.animationDelay=(Math.random()*.7)+'s'; s.style.fontSize=(1.1+Math.random())+'rem';
      frag.appendChild(s);
    }
    fx.appendChild(frag);
  }
  function tapCat(){
    var t=document.getElementById('tap'), L=['Yay! 🎉','Thêm nữa nè 💜','Vui quá trời 🦋','Cún xoay vòng vòng 🐾','Happi happi happi ✨'];
    var tg=(cg&&!cg.hidden)?cg:hcat;
    tg.classList.remove('spin'); void tg.getBoundingClientRect(); tg.classList.add('spin');
    t.textContent=L[tapN++%L.length]; burst();
  }
  var cg=document.getElementById('clapgif');
  function useGif(){cg.hidden=false; hcat.style.display='none'}
  if(cg){ if(cg.complete&&cg.naturalWidth) useGif(); else cg.addEventListener('load',useGif); cg.addEventListener('click',tapCat) }
  hcat.addEventListener('click',tapCat);
  hcat.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tapCat()}});
  var dc=document.getElementById('dc'), sending=false;
  dc.addEventListener('click',function(e){
    e.preventDefault(); if(sending) return;
    var out=document.getElementById('copied'); if(!window.giftNotify){out.textContent='Thiếu file discord.js (kiểm tra thẻ script) 🥲';return}
    sending=true; out.textContent='Đang gửi…';
    (window.giftNotify?giftNotify('💌 Trâm vừa gửi lời nhắn',{'Đi đâu':placesText()||'Chưa chọn','Khi nào':whenRaw()||'Chưa chọn','Lời nhắn':(document.getElementById('note').value.trim()||'(không viết gì)')}):Promise.resolve(false)).then(function(ok){
      if(ok){out.textContent='Đã gửi rồi nha 💌';dc.textContent='Đã gửi ✓';document.getElementById('note').disabled=true}
      else{sending=false;out.textContent='Chưa gửi được, thử lại nhé 🥲'}
    });
  });
  var DISCORD_ID='';
  var tb=document.getElementById('theme'), root=document.documentElement;
  var dark=true; try{dark=localStorage.getItem('gift-theme')!=='light'}catch(e){} root.setAttribute('data-theme',dark?'dark':'light');
  function setIcon(){tb.textContent=dark?'☀️':'🌙'} setIcon();
  tb.addEventListener('click',function(){dark=!dark;root.setAttribute('data-theme',dark?'dark':'light');try{localStorage.setItem('gift-theme',dark?'dark':'light')}catch(e){}setIcon()});
})();