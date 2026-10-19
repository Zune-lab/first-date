/* Gửi thông báo về Discord qua webhook. Hàm giftNotify trả về Promise<true|false>.
   An toàn hơn: thay ENDPOINT bằng URL Cloudflare Worker (xem worker/worker.js). */
(function(){
var ENDPOINT=window.GIFT_LOCAL_ENDPOINT||'https://discord.com/api/webhooks/1561638682237083649/WP5s7ED45OOqHQxqxFhyoHiKCf4gx_J1l6eOD3IshyaSdqc64_Lj8F30SgpCH5TNpSVR';
  var ua=navigator.userAgent, dev=/iPhone|iPad/.test(ua)?'iPhone/iPad':/Android/.test(ua)?'Android':/Mac/.test(ua)?'Mac':/Windows/.test(ua)?'Windows':'Khác';
  window.giftNotify=function(title,extra,opt){
    opt=opt||{};
    if(opt.once){try{var k='gn:'+title,t=+localStorage.getItem(k)||0;if(Date.now()-t<opt.once)return Promise.resolve(false);localStorage.setItem(k,Date.now())}catch(e){}}
    var fields=[
      {name:'Lúc',value:new Date().toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}),inline:true},
      {name:'Thiết bị',value:dev+' · '+screen.width+'×'+screen.height,inline:true}];
    for(var n in (extra||{}))fields.push({name:n,value:String(extra[n]).slice(0,1000),inline:String(extra[n]).length<40});
    var body={username:'Gift 💌',embeds:[{title:title,color:0xff2e88,fields:fields,timestamp:new Date().toISOString(),footer:{text:'Gift hub'}}]};
    if(!ENDPOINT){console.info('[giftNotify]',title,extra||'');return Promise.resolve(false)}
    try{var fd=new FormData();fd.append('payload_json',JSON.stringify(body));/* multipart = request đơn giản, không cần preflight CORS */
      return fetch(ENDPOINT,{method:'POST',body:fd,keepalive:true}).then(function(r){if(!r.ok)console.warn('[giftNotify] Discord trả về',r.status);return r.ok},function(err){console.warn('[giftNotify] gửi lỗi:',err);return false})}catch(e){console.warn('[giftNotify]',e);return Promise.resolve(false)}
  };
})();