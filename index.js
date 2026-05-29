
const send = () => parent.postMessage(
      { type: 'web_page_height', height: document.body.scrollHeight },
      '*'
    );
    window.addEventListener('load', send);
    new ResizeObserver(send).observe(document.documentElement);

    const events = [
      ['Atlantic City FC vs Lagos Royals','19:30','Premier Demo League','2.12','3.25','2.88'],
      ['Kano North vs Port Harcourt Aces','20:15','Crown Cup','1.74','3.80','4.20'],
      ['Ibadan Meteors vs Abuja Towers','21:00','Metro League','2.45','3.10','2.62'],
      ['Calabar United vs Benin Stars','Tomorrow','Elite Division','1.96','3.40','3.35']
    ];

    const live=[
      {name:'Atlantic City FC vs Lagos Royals',score:'1 — 1',clock:"62'",move:'up',odds:'2.12'},
      {name:'Kano North vs Port Harcourt Aces',score:'0 — 2',clock:"74'",move:'down',odds:'4.20'},
      {name:'Ibadan Meteors vs Abuja Towers',score:'78 — 76',clock:"Q4 03:12",move:'up',odds:'1.68'},
      {name:'Victoria Open: Amara K. vs Nia B.',score:'6-4 2-2',clock:'Set 2',move:'down',odds:'1.91'}
    ];

    let slip=[];
    let stake=5000;
    let searchQuery='';

    const screens=[...document.querySelectorAll('.screen')];

    const escapeHTML=(str)=>String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','<')
      .replaceAll('>','>')
      .replaceAll('"','"')
      .replaceAll("'",'&#039;');

    function getSlipKey(item){
      return `${item.pick}__${item.market}__${item.odds}`;
    }
    function hasSlip(item){
      const key=getSlipKey(item);
      return slip.some(s=>getSlipKey(s)===key);
    }

    function hideReviewAndTerms(){
      document.querySelectorAll('#reviewNote').forEach(n=>n.classList.remove('show'));
      const termsNote=document.getElementById('termsNote');
      if(termsNote) termsNote.classList.remove('show');
    }

    function showScreen(id){
      screens.forEach(s=>s.classList.toggle('active',s.id===id));
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));
      window.scrollTo({top:0,behavior:'smooth'});
      hideReviewAndTerms();
      sendHeightSoon();
    }

    document.querySelectorAll('.nav-btn,.nav-jump').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));

    function matchesQuery(text){
      if(!searchQuery) return true;
      return String(text).toLowerCase().includes(searchQuery);
    }

    function syncSelectedButtons(){
      const selectedKeys=new Set(slip.map(s=>getSlipKey(s)));
      document.querySelectorAll('.odds.pick').forEach(btn=>{
        const item={pick:btn.dataset.pick,market:btn.dataset.market,odds:+btn.dataset.odds};
        btn.classList.toggle('selected', selectedKeys.has(getSlipKey(item)));
      });
    }

    function renderOdds(){
      const tbody=document.getElementById('oddsRows');
      const rows=events.map(e=>{
        const eventName=e[0];
        const time=e[1];
        const league=e[2];
        const home=eventName.split(' vs ')[0];
        const away=eventName.split(' vs ')[1];

        const haystack=`${eventName} ${time} ${league}`;
        if(!matchesQuery(haystack)) return '';

        return `<tr>
          <td><b>${escapeHTML(eventName)}</b><br><span class="tiny">Popular: match result, goals, handicap</span></td>
          <td>${escapeHTML(time)}</td>
          <td>${escapeHTML(league)}</td>
          <td><button class="odds pick" data-pick="${escapeHTML(home)}" data-market="Match result" data-odds="${escapeHTML(e[3])}">${escapeHTML(e[3])}</button></td>
          <td><button class="odds pick" data-pick="Draw" data-market="Match result" data-odds="${escapeHTML(e[4])}">${escapeHTML(e[4])}</button></td>
          <td><button class="odds pick" data-pick="${escapeHTML(away)}" data-market="Match result" data-odds="${escapeHTML(e[5])}">${escapeHTML(e[5])}</button></td>
        </tr>`;
      }).join('');

      tbody.innerHTML=rows || `<tr><td colspan="6" style="color:var(--muted);padding:14px 10px">No sportsbook results for “${escapeHTML(searchQuery)}”.</td></tr>`;
      syncSelectedButtons();
    }

    function renderLive(){
      const wrap=document.getElementById('liveCards');
      const cards=live.map(x=>{
        const haystack=`${x.name} ${x.score} ${x.clock} ${x.move} ${x.odds}`;
        if(!matchesQuery(haystack)) return '';
        return `<div class="event-card">
          <div class="section-title">
            <div><b><span class="live-dot"></span>${escapeHTML(x.name)}</b><p class="muted">${escapeHTML(x.clock)}</p></div>
            <div class="score">${escapeHTML(x.score)}</div>
          </div>
          <p class="movement ${x.move==='up'?'up':'down'}">${x.move==='up'?'▲ Odds moved up':'▼ Odds moved down'} — simulated</p>
          <button class="odds pick" data-pick="${escapeHTML(x.name)}" data-market="Live market" data-odds="${escapeHTML(x.odds)}">${escapeHTML(x.odds)}</button>
          <div class="warning">Live display is a visual mockup, not a real feed.</div>
        </div>`;
      }).join('');

      wrap.innerHTML=cards || `<div class="event-card" style="grid-column:1/-1;color:var(--muted)">No live results for “${escapeHTML(searchQuery)}”.</div>`;
      syncSelectedButtons();
    }

    function pickClick(e){
      const btn=e.target.closest('.pick');
      if(!btn) return;

      const item={
        pick:btn.dataset.pick,
        market:btn.dataset.market,
        odds:+btn.dataset.odds
      };

      if(hasSlip(item)) return;

      slip.push(item);
      btn.classList.add('selected');
      renderSlip();
    }
    document.addEventListener('click',pickClick);

    function renderSlip(){
      const count=document.getElementById('slipCount');
      count.textContent=`${slip.length} pick${slip.length===1?'':'s'}`;

      const html = slip.length
        ? slip.map((s,i)=>`
          <div class="slip-item">
            <div class="slip-item-row">
              <div>
                <b>${escapeHTML(s.pick)}</b><br>
                <span class="tiny">${escapeHTML(s.market)}</span>
              </div>
              <button class="remove" data-remove="${i}">×</button>
            </div>
            <div class="slip-item-row" style="margin-top:8px">
              <span class="muted">Demo odds</span>
              <b>${Number(s.odds).toFixed(2)}</b>
            </div>
          </div>`).join('') +
          `<div class="stake">
            <input id="stakeInput" value="${escapeHTML(stake)}" aria-label="Demo stake">
            <button class="btn secondary" id="updateStake">Update</button>
          </div>
          <div class="summary">
            <div><span>Stake</span><b>₦${Number(stake).toLocaleString()}</b></div>
            <div><span>Potential return</span><b>₦${Math.round(stake*slip.reduce((a,b)=>a*b.odds,1)).toLocaleString()}</b></div>
          </div>
          <div class="warning">Review only. This prototype cannot place real wagers. Terms/risk acknowledgement would be required in a real product.</div>
          <button class="btn green" id="reviewSlip" style="width:100%;margin-top:12px">Review demo slip</button>
          <div id="reviewNote" class="modal-note">Demo slip reviewed — no wager placed, no account updated.</div>
          <button class="btn danger" id="clearSlip" style="width:100%;margin-top:8px">Clear slip</button>`
        : `<p class="muted">No selections yet. Click any odds button to add a fictional pick.</p>
           <div class="safety">Responsible play reminder: set limits before betting in any real regulated product.</div>`;

      document.getElementById('betSlip').innerHTML=html;
      const mobile=document.getElementById('mobileSlipInline');
      if(mobile) mobile.innerHTML=html;
      syncSelectedButtons();
      sendHeightSoon();
    }

    document.addEventListener('click',e=>{
      if(e.target.matches('.remove')){
        slip.splice(+e.target.dataset.remove,1);
        renderSlip();
      }
      if(e.target.id==='clearSlip'){
        slip=[];
        document.querySelectorAll('.odds.selected').forEach(x=>x.classList.remove('selected'));
        hideReviewAndTerms();
        renderSlip();
      }
      if(e.target.id==='updateStake'){
        const v=parseFloat(document.getElementById('stakeInput')?.value||stake);
        stake=Number.isFinite(v)?v:stake;
        renderSlip();
      }
      if(e.target.id==='reviewSlip'){
        document.querySelectorAll('#reviewNote').forEach(n=>n.classList.toggle('show'));
        sendHeightSoon();
      }
      if(e.target.classList.contains('terms-btn')){
        const tn=document.getElementById('termsNote');
        if(tn) tn.classList.toggle('show');
        sendHeightSoon();
      }
    });

    document.querySelectorAll('[data-tabs="wallet"] button').forEach(b=>b.addEventListener('click',()=>{
      document.querySelectorAll('[data-tabs="wallet"] button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      document.querySelectorAll('#wallet .tab-panel').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab));
      hideReviewAndTerms();
      sendHeightSoon();
    }));

    const adminData={
      overview:`<div class="grid four"><div class="metric"><b>4,812</b><span>Fictional users</span></div><div class="metric"><b>138</b><span>Open markets</span></div><div class="metric"><b>27</b><span>Pending reviews</span></div><div class="metric"><b>16</b><span>Campaigns</span></div></div><div class="warning">Admin screens are visual concepts only and do not perform operations.</div>`,
      users:`<table><thead><tr><th>User</th><th>KYC</th><th>Risk</th><th>Status</th></tr></thead><tbody><tr><td>Ada C.</td><td>Pending</td><td>Low</td><td><span class="tag">Review</span></td></tr><tr><td>Malik O.</td><td>Verified</td><td>Medium</td><td><span class="tag green">Active</span></td></tr></tbody></table>`,
      markets:`<table><thead><tr><th>Event</th><th>Market</th><th>Status</th><th>Settlement</th></tr></thead><tbody><tr><td>Atlantic City FC</td><td>Match result</td><td><span class="tag green">Open</span></td><td>Pending</td></tr><tr><td>Kano North</td><td>Total goals</td><td><span class="tag red">Suspended</span></td><td>Not started</td></tr></tbody></table>`,
      campaigns:`<div class="grid two"><div class="promo"><b>Weekend Ledger Boost</b><p class="muted">Active demo campaign</p></div><div class="promo"><b>Crown Tier Preview</b><p class="muted">Draft approval state</p></div></div>`,
      opsTransactions:`<table><thead><tr><th>Reference</th><th>Type</th><th>Amount</th><th>Review</th></tr></thead><tbody><tr><td>CLW-7721</td><td>Withdrawal mock</td><td>₦5,000</td><td><span class="tag">Manual check</span></td></tr><tr><td>CLD-1048</td><td>Deposit mock</td><td>₦10,000</td><td><span class="tag green">Clear</span></td></tr></tbody></table>`
    };

    function renderAdmin(key='overview'){
      const el=document.getElementById('adminContent');
      const raw=adminData[key];
      if(!searchQuery){
        el.innerHTML=raw;
        sendHeightSoon();
        return;
      }

      // demo-only filtering: match against raw text
      const tmp=document.createElement('div');
      tmp.innerHTML=raw;
      const text=tmp.textContent||'';
      if(!matchesQuery(text)){
        el.innerHTML=`<div class="warning" style="margin-top:8px">No admin results for “${escapeHTML(searchQuery)}”.</div>`;
      }else{
        el.innerHTML=raw;
      }
      sendHeightSoon();
    }

    document.querySelectorAll('.admin-tab').forEach(b=>b.addEventListener('click',()=>{
      document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderAdmin(b.dataset.admin);
      hideReviewAndTerms();
    }));

    function sendHeightSoon(){
      setTimeout(()=>parent.postMessage({type:'web_page_height',height:document.body.scrollHeight},'*'),60);
    }

    // topbar search wiring
    const searchInput=document.querySelector('.topbar .search input');
    if(searchInput){
      const onSearch=()=>{
        searchQuery=String(searchInput.value||'').trim().toLowerCase();
        const sportsbook=document.getElementById('sportsbook');
        const liveScreen=document.getElementById('live');
        const adminScreen=document.getElementById('admin');

        if(sportsbook?.classList.contains('active')) renderOdds();
        if(liveScreen?.classList.contains('active')) renderLive();
        if(adminScreen?.classList.contains('active')){
          const activeAdmin=document.querySelector('.admin-tab.active')?.dataset.admin || 'overview';
          renderAdmin(activeAdmin);
        }
        sendHeightSoon();
      };
      searchInput.addEventListener('input',onSearch);
      searchInput.addEventListener('keydown',e=>{ if(e.key==='Escape'){ searchInput.value=''; onSearch(); }});
    }

    renderOdds();
    renderLive();
    renderSlip();
    renderAdmin();

