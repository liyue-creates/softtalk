(function(){
var $=function(s){return document.querySelector(s)},app=$('#app');
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var SCENES=['已读不回','忘了纪念日','打游戏没理你'],TONES=['撒娇','认真','搞笑'];
var PROMS=[['买奶茶','奶茶兑换券','🧋'],['请吃饭','大餐兑换券','🍲'],['陪你逛街','陪逛兑换券','🛍️'],['任你处置','任你处置券','👑'],['自己填','专属兑换券','🎁']];
var MAXC=20;
// 9 templates: scene x tone. {n}=name
var T=[
 ['{n}～我错啦！看到消息没回，是我脑子短路了嘛。以后你的消息我秒回，回得比外卖还快，原谅我好不好嘛 🥺',
  '{n}，那天你的消息我看到了却没回，让你等了好久，这真的是我的问题。以后再忙我也会先回你一句，让你知道我一直都在。',
  '{n}大人在上！小的已读不回，罪加一等。手指已经被我关禁闭了，从今天起它只负责一件事：秒回你 📱'],
 ['{n}～纪念日都能忘，我是笨蛋本蛋！可是喜欢你这件事我一天都没忘过，给我一次补过的机会嘛 🥺',
  '{n}，忘了我们的纪念日，让你失望了，对不起。那一天对你很重要，对我也一样，我想好好补给你一个。',
  '{n}，我的记性被小猫叼走了！已经把纪念日设成手机闹钟、电脑壁纸和饭卡密码，这辈子再也忘不掉了 📅'],
 ['{n}～打游戏把你晾在一边，我好坏！游戏里我是大神，在你这儿我只想当个乖乖的跟班，理理我嘛 🥺',
  '{n}，那天我只顾着打游戏，把你冷落了，对不起。比起赢一局，我更想好好陪你说说话。',
  '{n}，队友骂我我不在乎，你不理我我真的慌了！已经把游戏卸载……又装上了，但这次先陪你再上线 🎮']];
var PLEAS=['我是🐷','罪该万死','陛下恕罪','再也不敢了','小的知错','打得好！','轻点轻点','你说得都对','我是笨蛋','我检讨！','求求了🥺','以后都听你的'];
var NOS=['不原谅','真的不原谅吗…','再给次机会嘛','我会哭的哦','呜呜呜…','求求你了🥺','好吧你点不到我的'];
// ---- assets: final art drops into assets/ with manifest.json {"m1_stand":"file.svg",...}
var MAN={};
function figHTML(g,set,pose){var k=g+set+'_'+pose;if(MAN[k])return '<img class="fig" alt="" src="assets/'+MAN[k]+'">';return svgFig(g,set,pose)}
var INK='#4a3b36',HAIR='#6b4a3a';
function svgFig(g,set,pose){
 var shirt=g=='m'?'#6FA3D8':'#F08A9C',s='',hx=100,hy=78,tilt=0;
 if(pose.indexOf('hit')==0)tilt=pose=='hit2'?10:-10;
 s+='<g transform="rotate('+tilt+' 100 200)">';
 var L='stroke="'+INK+'" stroke-width="4" stroke-linecap="round" fill="none"';
 var kneel=pose=='plead';
 // legs
 if(kneel)s+='<path d="M90 186 L84 210 L62 214 M110 186 L116 210 L138 214" '+L+'/>';
 else if(pose.indexOf('hit')==0)s+='<path d="M92 186 L82 210 L70 226 M108 186 L124 206 L118 228" '+L+'/>';
 else s+='<path d="M92 186 L90 228 M108 186 L110 228" '+L+'/><ellipse cx="86" cy="230" rx="8" ry="4" fill="#fff" stroke="'+INK+'" stroke-width="3"/><ellipse cx="114" cy="230" rx="8" ry="4" fill="#fff" stroke="'+INK+'" stroke-width="3"/>';
 // arms
 if(kneel)s+='<path d="M84 142 L70 98 L98 22 M116 142 L130 98 L102 22" '+L+'/>';
 else if(pose.indexOf('hit')==0)s+='<path d="M84 142 L56 128 L44 108 M116 142 L146 124 L158 104" '+L+'/>';
 else if(pose=='happy')s+='<path d="M84 142 L62 120 M116 142 L138 120" '+L+'/>';
 else s+='<path d="M84 142 L72 176 M116 142 L128 176" '+L+'/>';
 // shirt (white sticker edge)
 var sh=g=='m'?'M80 132 Q100 126 120 132 L124 188 L76 188 Z':'M82 132 Q100 126 118 132 L130 194 L70 194 Z';
 s+='<path d="'+sh+'" fill="'+shirt+'" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="'+sh+'" fill="'+shirt+'" stroke="'+INK+'" stroke-width="3.5" stroke-linejoin="round"/>';
 // head sticker
 s+='<circle cx="'+hx+'" cy="'+hy+'" r="61" fill="#fff" stroke="#eadfd8" stroke-width="2"/>';
 s+=hairBack(g,set);
 s+='<circle cx="'+hx+'" cy="'+hy+'" r="50" fill="#FFF8F0" stroke="'+INK+'" stroke-width="5"/>';
 s+=hairFront(g,set)+face(pose)+'</g>';
 return '<svg class="fig" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
}
function hairBack(g,set){var f='fill="'+HAIR+'" stroke="'+INK+'" stroke-width="4"';
 if(g=='f'&&set==1)return '<circle cx="128" cy="28" r="20" '+f+'/>';
 if(g=='f'&&set==2)return '<path d="M48 70 Q44 140 66 150 L134 150 Q156 140 152 70 Z" '+f+'/>';
 return ''}
function hairFront(g,set){var f='fill="'+HAIR+'" stroke="'+INK+'" stroke-width="4" stroke-linejoin="round"';
 if(g=='m'&&set==1)return '<path d="M50 78 Q46 28 98 26 Q150 24 152 76 Q140 56 124 52 L118 62 L108 50 L96 62 L88 50 L74 64 Q62 60 50 78 Z" '+f+'/>';
 if(g=='m'&&set==2)return '<path d="M50 80 Q44 30 100 26 Q156 30 150 80 Q146 60 132 58 Q122 66 112 56 Q100 66 88 56 Q78 66 68 58 Q56 62 50 80 Z" '+f+'/>';
 if(g=='f'&&set==1)return '<path d="M50 82 Q46 30 100 28 Q154 30 150 82 Q138 52 104 50 Q90 66 60 66 Q52 72 50 82 Z" '+f+'/>';
 return '<path d="M50 86 Q46 28 100 28 Q154 28 150 86 Q144 56 118 52 Q100 60 82 52 Q56 58 50 86 Z" '+f+'/>'}
function face(p){var I=INK,s='<ellipse cx="66" cy="96" rx="9" ry="6" fill="#F7B5BF" opacity=".8"/><ellipse cx="134" cy="96" rx="9" ry="6" fill="#F7B5BF" opacity=".8"/>';
 var L='stroke="'+I+'" stroke-width="4" stroke-linecap="round" fill="none"';
 if(p=='stand')s+='<circle cx="80" cy="84" r="5" fill="'+I+'"/><circle cx="120" cy="84" r="5" fill="'+I+'"/><path d="M90 104 Q100 98 110 104" '+L+'/><path d="M146 52 Q140 62 146 66 Q152 62 146 52Z" fill="#8EC5EC"/>';
 else if(p=='plead')s+='<circle cx="80" cy="84" r="9" fill="'+I+'"/><circle cx="120" cy="84" r="9" fill="'+I+'"/><circle cx="83" cy="80" r="3.5" fill="#fff"/><circle cx="123" cy="80" r="3.5" fill="#fff"/><path d="M88 106 Q94 100 100 106 Q106 100 112 106" '+L+'/><path d="M72 94 Q68 104 72 108 Q76 104 72 94Z" fill="#8EC5EC"/><path d="M128 94 Q124 104 128 108 Q132 104 128 94Z" fill="#8EC5EC"/>';
 else if(p=='hit1')s+='<path d="M72 78 L86 85 L72 92 M128 78 L114 85 L128 92" '+L+'/><ellipse cx="100" cy="106" rx="8" ry="6" fill="#c9566b" stroke="'+I+'" stroke-width="3"/><path d="M150 70 Q164 62 170 70 Q162 78 150 70Z" fill="#8EC5EC"/>';
 else if(p=='hit2')s+='<path d="M80 84 m-7 0 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4" '+L+' stroke-width="3"/><path d="M120 84 m-7 0 a7 7 0 1 1 7 7 a4 4 0 1 1 -4 -4" '+L+' stroke-width="3"/><path d="M88 108 Q94 102 100 108 Q106 102 112 108" '+L+'/><ellipse cx="112" cy="30" rx="12" ry="9" fill="#FFD3C4" stroke="'+I+'" stroke-width="3"/>';
 else if(p=='hit3')s+='<path d="M72 80 L86 86 L72 92 M128 80 L114 86 L128 92" '+L+'/><path d="M90 108 Q100 100 110 108" '+L+'/><path d="M64 88 Q52 92 46 104 M136 88 Q148 92 154 104" stroke="#8EC5EC" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="96" y="22" width="28" height="11" rx="5" fill="#FBE3E8" stroke="'+I+'" stroke-width="2.5" transform="rotate(-20 110 28)"/>';
 else s+='<path d="M72 86 Q80 76 88 86 M112 86 Q120 76 128 86" '+L+'/><path d="M86 100 Q100 116 114 100 Z" fill="#c9566b" stroke="'+I+'" stroke-width="3" stroke-linejoin="round"/>';
 return s}
// ---- url codec (base64url of utf-8 JSON)
function enc(o){var b=new TextEncoder().encode(JSON.stringify(o)),s='';for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(t){try{t=t.replace(/-/g,'+').replace(/_/g,'/');var s=atob(t),b=new Uint8Array(s.length);for(var i=0;i<s.length;i++)b[i]=s.charCodeAt(i);return JSON.parse(new TextDecoder().decode(b))}catch(e){return null}}
function clean(d){d=d||{};var r={n:String(d.n||'').trim().slice(0,12),w:d.w==1?1:0,c:d.c==2?2:1,s:[0,1,2].indexOf(+d.s)>=0?+d.s:0,t:[0,1,2].indexOf(+d.t)>=0?+d.t:0,p:[0,1,2,3,4].indexOf(+d.p)>=0?+d.p:0};
 if(r.p==4){r.pc=String(d.pc||'').trim().slice(0,MAXC);if(!r.pc)r.p=0}return r}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function apo(d){return esc(T[d.s][d.t].replace('{n}',d.n||'你'))}
function promText(d){return d.p==4?d.pc:PROMS[d.p][0]}
function ta(d){return d.w?'她':'他'}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove('on')},1800)}
// ---- sound (tap-triggered only)
var AC;function ac(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume()}catch(e){}return AC}
function tone(f1,f2,dur,type,vol,delay){var c=ac();if(!c)return;var t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol||.2,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.02)}
function bonk(){tone(320,90,.16,'triangle',.3)}
function squeak(){tone(900,1400,.08,'square',.06)}
function yay(){tone(300,1200,.35,'sine',.25);tone(1200,500,.25,'sine',.2,.35);[523,659,784,1046].forEach(function(f,i){tone(f,f,.14,'triangle',.18,.62+i*.1)})}
// ---- generator
function gen(){
 var d=clean({});
 app.innerHTML='<h1>软话小人<small>替你把对不起说出口</small></h1>'+
 '<div class="row"><span class="lab">TA 叫</span><input class="t" id="nm" maxlength="12" placeholder="对方的名字或昵称"></div>'+
 '<div class="row"><span class="lab">谁道歉</span><div class="chips" id="cw"></div></div>'+
 '<div class="row"><span class="lab">小人</span><div class="chips" id="cc"></div></div>'+
 '<div class="row"><span class="lab">为啥</span><div class="chips" id="cs"></div></div>'+
 '<div class="row"><span class="lab">语气</span><div class="chips" id="ct"></div></div>'+
 '<div class="row"><span class="lab">补偿</span><div class="chips" id="cp"></div></div>'+
 '<div class="row" id="cpRow"><span class="lab"></span><input class="t" id="pc" maxlength="'+MAXC+'" placeholder="比如：帮你洗一周碗"></div>'+
 '<div class="pv"><div class="mini" id="mini"></div><p id="pv"></p></div>'+
 '<div class="btns"><button class="big alt" id="see">先看看效果</button><button class="big" id="go">生成链接</button></div>';
 function chips(id,arr,key){var el=$(id);el.innerHTML=arr.map(function(a,i){return '<button class="chip" data-i="'+i+'">'+a+'</button>'}).join('');
  el.onclick=function(e){var b=e.target.closest('.chip');if(!b)return;d[key]=+b.dataset.i+(key=='c'?1:0);draw()}}
 chips('#cw',['他','她'],'w');chips('#cc',['一号情侣','二号情侣'],'c');chips('#cs',SCENES,'s');chips('#ct',TONES,'t');chips('#cp',PROMS.map(function(p){return p[0]}),'p');
 function draw(){var m={w:d.w,c:d.c-1,s:d.s,t:d.t,p:d.p};['w','c','s','t','p'].forEach(function(k){[].forEach.call($('#c'+k).children,function(b,i){b.classList.toggle('on',i==m[k])})});
  $('#cpRow').style.display=d.p==4?'flex':'none';
  var x=cur();$('#pv').innerHTML=apo(x)+'<br><span style="color:#b2485d">＋ '+(x.p==4&&!d.pc?'自己填一个补偿':esc(promText(x))+' 兑换券')+'</span>';
  $('#mini').innerHTML=figHTML(d.w?'f':'m',d.c,'plead')}
 function cur(){d.n=$('#nm').value;d.pc=$('#pc').value;var c=clean(d);if(d.p==4&&!c.pc){c.p=4;c.pc=''}return c}
 $('#nm').oninput=draw;$('#pc').oninput=draw;
 function link(){var c=clean(cur());return location.origin+location.pathname+'?d='+enc(c)}
 $('#see').onclick=function(){location.href=link()};
 $('#go').onclick=function(){if(d.p==4&&!$('#pc').value.trim()){toast('先写一个补偿吧');$('#pc').focus();return}
  var u=link(),ok=false;
  function done(){toast('去发给 TA 吧')}
  function fallback(){try{var ta=document.createElement('textarea');ta.value=u;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,u.length);ok=document.execCommand('copy');ta.remove()}catch(e){}
   if(ok)done();else{$('#lk').textContent=u;$('#linkBox').style.display='flex'}}
  if(navigator.clipboard&&window.isSecureContext&&!/MicroMessenger/i.test(navigator.userAgent))navigator.clipboard.writeText(u).then(done,fallback);else fallback()};
 $('#lkOk').onclick=function(){$('#linkBox').style.display='none';toast('去发给 TA 吧')};
 draw();
}
// ---- receiver
function recv(d){
 var g=d.w?'f':'m',name=esc(d.n||'你'),T2=ta(d),hits=0,noi=0;
 app.innerHTML=
 '<section class="act on" id="a1"><p class="say">有人想对 '+name+' 说…</p><div class="env" id="env"><svg viewBox="0 0 230 160"><rect x="6" y="6" width="218" height="148" rx="16" fill="#fff" stroke="#fff" stroke-width="10"/><rect x="6" y="6" width="218" height="148" rx="16" fill="#FBE3E8" stroke="'+INK+'" stroke-width="4"/><path d="M8 14 L115 92 L222 14" fill="none" stroke="'+INK+'" stroke-width="4" stroke-linejoin="round"/><path d="M115 96 c-10 -14 -30 -6 -20 10 l20 18 l20 -18 c10 -16 -10 -24 -20 -10z" fill="#E9899B" stroke="'+INK+'" stroke-width="3"/></svg></div><p class="hint">点信封打开</p></section>'+
 '<section class="act" id="a2"><div class="bubble">'+apo(d)+'</div><div class="stage" id="stg">'+figHTML(g,d.c,'plead')+'</div><div class="cnt" id="cnt">不开心的话，先打我出出气 👇</div><div class="tease" id="tz">还有一份补偿，等你原谅后领取 🎁</div><div class="acts2"><button class="big alt" id="hitb">先打我出出气</button><button class="big" id="nx">下一步</button></div></section>'+
 '<section class="act" id="a3"><p class="q">原谅'+T2+'吗？</p><div class="stage" id="stg3" style="height:170px">'+figHTML(g,d.c,'plead')+'</div><div class="zone" id="zone"><button class="big" id="yes">原谅</button><button id="no">不原谅</button></div>'+
 '<div class="coupon" id="cp"><span class="no">No.'+(Date.now()%100000)+'</span><h3>'+PROMS[d.p][2]+' '+esc(d.p==4?'兑换券':PROMS[d.p][1])+'</h3><div style="font-size:18px;margin:6px 0">'+esc(promText(d))+'</div><div class="who">'+name+' 专用 · 凭此券找'+T2+'兑换</div><div class="sig">长按或截图保存 · 永久有效</div></div></section>'+
 '<div class="foot">软话小人</div><canvas id="cf"></canvas>';
 function go(id){[].forEach.call(document.querySelectorAll('.act'),function(a){a.classList.toggle('on',a.id==id)})}
 $('#env').onclick=function(){squeak();go('a2')};
 var stg=$('#stg'),poses=['hit1','hit2','hit3'],hitMode=false,rt;
 $('#hitb').onclick=function(){hitMode=true;this.textContent='打够了';this.onclick=function(){go('a3')};$('#cnt').textContent='点小人就能打';};
 stg.addEventListener('pointerdown',function(e){if(!hitMode){hitMode=true;$('#hitb').textContent='打够了';$('#hitb').onclick=function(){go('a3')}}
  hits++;bonk();stg.innerHTML=figHTML(g,d.c,poses[(hits-1)%3]);var f=stg.firstChild;f.classList.add('hit');
  if(navigator.vibrate)try{navigator.vibrate(15)}catch(x){}
  var r=stg.getBoundingClientRect(),x=(e.clientX||r.left+r.width/2)-r.left,y=(e.clientY||r.top+r.height/3)-r.top;
  var p=document.createElement('div');p.className='fly';p.textContent=PLEAS[(hits-1)%PLEAS.length];p.style.left=Math.max(50,Math.min(r.width-50,x))+'px';p.style.top=Math.max(0,y-30)+'px';stg.appendChild(p);setTimeout(function(){p.remove()},1150);
  for(var i=0;i<(RM?2:4);i++){var s=document.createElement('div');s.className='star';s.textContent=i%2?'⭐':'✨';s.style.left=x+'px';s.style.top=y+'px';var a=Math.random()*6.28,dd=40+Math.random()*30;s.style.setProperty('--x',Math.cos(a)*dd+'px');s.style.setProperty('--y',Math.sin(a)*dd+'px');stg.appendChild(s);(function(s){setTimeout(function(){s.remove()},650)})(s)}
  $('#cnt').textContent='已经打了 '+hits+' 下';
  if(hits>=8)$('#tz').classList.add('on');
  clearTimeout(rt);rt=setTimeout(function(){stg.querySelector('.fig').outerHTML=figHTML(g,d.c,'plead')},900)});
 $('#nx').onclick=function(){go('a3');placeNo()};
 var zone=$('#zone'),no=$('#no'),yes=$('#yes');
 function placeNo(first){var zw=zone.clientWidth,zh=zone.clientHeight,bw=no.offsetWidth,bh=no.offsetHeight;
  if(first!==false&&noi==0){no.style.left=(zw-bw)/2+'px';no.style.top=(zh-bh-4)+'px';return}
  var yr=yes.getBoundingClientRect(),zr=zone.getBoundingClientRect(),x,y,k=0;
  do{x=Math.random()*(zw-bw);y=Math.random()*(zh-bh);k++}while(k<30&&x<yr.right-zr.left+6&&x+bw>yr.left-zr.left-6&&y<yr.bottom-zr.top+6&&y+bh>yr.top-zr.top-6);
  no.style.left=x+'px';no.style.top=y+'px'}
 function dodge(e){e.preventDefault();noi++;squeak();no.textContent=NOS[Math.min(noi,NOS.length-1)];yes.style.setProperty('--s',Math.min(1+noi*.18,2.1));placeNo(false)}
 no.addEventListener('pointerdown',dodge);no.addEventListener('click',function(e){e.preventDefault()});
 yes.onclick=function(){yay();$('#zone').style.display='none';$('#stg3').innerHTML=figHTML(g,d.c,'happy');$('.q').textContent='谢谢你原谅'+T2+'！';$('#cp').classList.add('on');boom()};
 function boom(){var c=window.confetti&&confetti.create($('#cf'),{resize:true,useWorker:false});if(!c)return;var col=['#E9899B','#6FA3D8','#FFD36E','#9CC28A','#fff'];
  if(RM){c({particleCount:60,spread:90,origin:{y:.5},colors:col,ticks:120});return}
  c({particleCount:120,spread:100,origin:{y:.6},colors:col});setTimeout(function(){c({particleCount:60,angle:60,spread:60,origin:{x:0,y:.7},colors:col});c({particleCount:60,angle:120,spread:60,origin:{x:1,y:.7},colors:col})},250)}
 setTimeout(placeNo,0);
}
var q=new URLSearchParams(location.search).get('d');
function start(){if(q){var d=dec(q);recv(clean(d))}else gen()}
// optional manifest swap-in; never blocks more than 600ms
var done=false;function s1(){if(!done){done=true;start()}}
try{fetch('assets/manifest.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():{}}).then(function(m){if(!done){MAN=(m&&m.files)||m||{}}s1()},s1)}catch(e){s1()}
setTimeout(s1,600);
})();
