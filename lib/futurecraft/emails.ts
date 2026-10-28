/* Hand-authored table-based transactional email HTML: robust in common email clients. */
const site='https://silkstudios.com.ng/futurecraft';
function escapeHtml(value:string){return value.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]||ch));}

function frame({eyebrow,heading,intro,body,cta,art}:{eyebrow:string;heading:string;intro:string;body:string;cta:string;art:string}) {
 return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'+
 '<body style="margin:0;background:#f2f7ff;color:#111629;font-family:Arial,Helvetica,sans-serif;">'+
 '<table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background:#f2f7ff;"><tr><td align="center" style="padding:32px 12px;">'+
 '<table role="presentation" cellspacing="0" cellpadding="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border-collapse:collapse;">'+
 '<tr><td style="padding:23px 32px 20px;color:#111629;font-size:24px;letter-spacing:-1.2px;font-weight:900;"><img src="'+site+'/mark.svg" alt="" width="38" height="38" style="vertical-align:middle;width:38px;height:38px;border:0;margin-right:9px;">futurecraft<span style="font-size:10px;vertical-align:top;">®</span><span style="float:right;font:700 10px monospace;letter-spacing:2px;color:#b0aeab;padding-top:10px;">GENESIS 001</span></td></tr>'+
 '<tr><td style="padding:0 30px;"><img src="'+art+'" alt="Futurecraft creative space" width="540" style="display:block;width:100%;max-width:540px;height:auto;max-height:275px;object-fit:cover;border:0;"></td></tr>'+
 '<tr><td style="padding:28px 32px 9px;font:700 11px monospace;letter-spacing:2px;color:#0565ff;">'+eyebrow+'</td></tr>'+
 '<tr><td style="padding:0 32px;color:#111629;font-size:44px;line-height:1.04;font-weight:900;letter-spacing:-2px;">'+heading+'</td></tr>'+
 '<tr><td style="padding:25px 32px 0;color:#25324b;font-size:17px;line-height:1.65;">'+intro+'</td></tr>'+
 '<tr><td style="padding:12px 32px 30px;color:#52617a;font-size:15px;line-height:1.75;">'+body+'</td></tr>'+
 '<tr><td style="padding:0 32px 38px;"><a href="'+site+'" style="background:#0565ff;color:#fff;text-decoration:none;display:inline-block;padding:18px 26px;font-weight:900;font-size:13px;letter-spacing:1px;">'+cta+' &nbsp;↗</a></td></tr>'+
 '<tr><td style="padding:22px 32px;background:#eaf4ff;color:#182840;font:700 11px monospace;line-height:1.7;">STOP WATCHING. START MAKING.<br><span style="font-size:10px;color:#65655f;">Futurecraft · Learn the future by making it.</span></td></tr>'+
 '<tr><td style="padding:22px 32px;color:#66768e;font-size:11px;line-height:1.6;">You received this because you signed up for Futurecraft Genesis. Exact dates and programme details will be shared when confirmed. Futurecraft is an independent co-founded academy, currently hosted on the Silk Studio website.</td></tr>'+
 '</table></td></tr></table></body></html>';
}
export function genesisConfirmationEmail(name:string) {
 return frame({eyebrow:'REGISTRATION / RECEIVED',heading:'YOU MADE<br>THE FIRST MOVE.',intro:'Hey '+escapeHtml(name)+', your Genesis registration has landed. ✳',body:'We have your details for the free 14-week beginner bootcamp. There is no fee or payment required. We will share confirmed session dates and joining instructions as they are finalized. Keep an eye on your inbox — a second note from us will introduce what makes Futurecraft different.',cta:'EXPLORE FUTURECRAFT',art:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'});
}
export function genesisWelcomeEmail(name:string) {
 return frame({eyebrow:'WELCOME / FIRST MAKERS',heading:'YOU ARE A<br>MAKER NOW.',intro:'Welcome in, '+escapeHtml(name)+'. This isn’t about collecting more tutorials. It’s about finally making something.',body:'At Genesis, you’ll explore design, AI video, playable games and business automation alongside other beginners. Expect practical two-hour sessions, experiments, honest feedback, and guest creators who actually build things. You can start from zero. We’ll email the verified timetable and community onboarding details before classes begin.',cta:'MEET YOUR NEW COMMUNITY',art:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'});
}
