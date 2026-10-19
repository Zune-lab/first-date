// Cloudflare Worker: giấu webhook Discord, chỉ nhận từ domain của bạn.
// Settings → Variables: WEBHOOK (Secret) = URL webhook Discord
//                       ALLOW = https://ten-mien-cua-ban.com,http://127.0.0.1:5500
export default {
  async fetch(req, env) {
    const o = req.headers.get('Origin') || '';
    const ok = (env.ALLOW || '').split(',').includes(o);
    const cors = {'Access-Control-Allow-Origin': ok ? o : 'null', 'Access-Control-Allow-Headers': 'content-type'};
    if (req.method === 'OPTIONS') return new Response(null, {headers: cors});
    if (!ok || req.method !== 'POST') return new Response('no', {status: 403, headers: cors});
    let b; try { b = await req.json(); } catch (e) { return new Response('bad', {status: 400, headers: cors}); }
    const e = (b.embeds || []).slice(0, 1).map(x => ({
      title: String(x.title || '').slice(0, 200), color: x.color, timestamp: x.timestamp, footer: x.footer,
      fields: (x.fields || []).slice(0, 8).map(f => ({name: String(f.name).slice(0, 60), value: String(f.value).slice(0, 300), inline: !!f.inline}))
    }));
    await fetch(env.WEBHOOK, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({username: 'Gift 💌', embeds: e})});
    return new Response('ok', {headers: cors});
  }
};
