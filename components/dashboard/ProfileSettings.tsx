'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Lock, Save, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { initials } from '@/lib/dashboard';
import { PageIntro } from './OverviewParts';
const areas = ['Agege','Ajeromi-Ifelodun','Alimosho','Amuwo-Odofin','Apapa','Badagry','Epe','Eti-Osa','Ibeju-Lekki','Ifako-Ijaiye','Ikeja','Ikorodu','Kosofe','Lagos Island','Lagos Mainland','Mushin','Ojo','Oshodi-Isolo','Shomolu','Surulere','Lekki Phase 1','Lekki Phase 2','Victoria Island','Ikoyi','Yaba','Ajah','Gbagada','Maryland','Ogba','Ogudu','Ojodu','Sangotedo','Chevron','Oniru'];
export default function ProfileSettings({ admin = false }: { admin?: boolean }) {
  const { user, profile, refreshProfile, updatePassword } = useAuth();
  const [details, setDetails] = useState({ name: '', phone: '', address: '', area: '' });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');
  useEffect(() => {
    if (profile?.id === user?.id && profile) setDetails({ name: profile.full_name || '', phone: profile.phone || '', address: profile.default_address || '', area: profile.default_area || '' });
  }, [profile, user?.id]);
  async function save(e: FormEvent) {
    e.preventDefault(); if (!user || saving) return;
    setSaving(true); setNotice(''); setError('');
    try {
      const fields = { full_name: details.name.trim(), phone: details.phone.trim(), default_address: details.address.trim(), default_area: details.area, updated_at: new Date().toISOString() };
      const { error: saveError } = await supabase.from('profiles').update(fields).eq('id', user.id).select('id').single();
      if (saveError) throw saveError;
      await refreshProfile(); setNotice('Your profile details are saved.');
    } catch { setError('Your profile couldn’t be saved. Please try again.'); }
    finally { setSaving(false); }
  }
  async function changePassword(e: FormEvent) {
    e.preventDefault(); if (passwordBusy) return;
    if (password !== confirm) { setPasswordNotice('The passwords don’t match.'); return; }
    setPasswordBusy(true); setPasswordNotice('');
    try { const result = await updatePassword(password); if (result.error) setPasswordNotice(result.error); else { setPassword(''); setConfirm(''); setPasswordNotice('Password updated successfully.'); } }
    finally { setPasswordBusy(false); }
  }
  const name = profile?.full_name || user?.email?.split('@')[0] || 'Silk member';
  return <><PageIntro eyebrow={admin ? 'ADMINISTRATOR PROFILE' : 'YOUR PROFILE'} title="Make yourself at home." description="Your contact details, delivery preferences and account security."/>
    <div className="dash-settings-grid"><aside className="dash-profile-card"><span className="dash-avatar">{initials(name)}</span><span className="dash-kicker">{admin ? 'STUDIO ADMINISTRATOR' : 'SILK STUDIO ACCOUNT'}</span><h2>{name}</h2><p>{user?.email}</p><div className="dash-profile-detail"><UserRound size={17}/>{admin ? 'Administrator' : 'Customer'}</div><p className="dash-profile-hint">These details belong to your account. Update them whenever you need.</p><a href="https://wa.me/2347064829776" className="dash-text-link" target="_blank" rel="noopener noreferrer">Get help with your account <ArrowUpRight size={15}/></a></aside>
    <div className="dash-settings-panels"><section className="dash-panel"><div className="dash-panel-heading"><div><span className="dash-kicker">THE BASICS</span><h2>Your details</h2></div><UserRound size={21}/></div>{notice && <p className="dash-success" role="status"><Check size={17}/>{notice}</p>}{error && <p className="dash-notice" role="alert">{error}</p>}<form className="dash-form" onSubmit={save}><div className="dash-form-grid"><label htmlFor="profile-name">Full name<input id="profile-name" autoComplete="name" required maxLength={120} value={details.name} onChange={e => setDetails(current => ({ ...current, name: e.target.value }))} placeholder="Your name"/></label><label htmlFor="profile-phone">Phone / WhatsApp<input id="profile-phone" type="tel" autoComplete="tel" required maxLength={30} value={details.phone} onChange={e => setDetails(current => ({ ...current, phone: e.target.value }))} placeholder="+234…"/></label></div><label htmlFor="profile-email">Email address<input id="profile-email" type="email" value={user?.email || ''} readOnly/><small>Your sign-in email is shown here for reference.</small></label><div className="dash-form-divider"><span className="dash-kicker">DELIVERY PREFERENCES</span><p>Used to fill in your details at checkout.</p></div><label htmlFor="profile-address">Street address<input id="profile-address" autoComplete="street-address" maxLength={300} value={details.address} onChange={e => setDetails(current => ({ ...current, address: e.target.value }))} placeholder="Street, building and apartment"/></label><label htmlFor="profile-area">Lagos area<select id="profile-area" autoComplete="address-level2" value={details.area} onChange={e => setDetails(current => ({ ...current, area: e.target.value }))}><option value="">Choose an area</option>{areas.map(area => <option key={area}>{area}</option>)}</select></label><div className="dash-form-actions"><span>Only your own profile details are changed.</span><button className="dash-button dash-dark" disabled={saving}><Save size={16}/>{saving ? 'Saving…' : 'Save changes'}</button></div></form></section>
    <section className="dash-panel"><div className="dash-panel-heading"><div><span className="dash-kicker">ACCOUNT SECURITY</span><h2>A little peace of mind.</h2></div><Lock size={21}/></div><p className="dash-panel-copy">Choose a password you don’t use anywhere else. You may be asked to sign in again to confirm a change.</p>{passwordNotice && <p className="dash-notice" role="status">{passwordNotice}</p>}<form className="dash-form" onSubmit={changePassword}><div className="dash-form-grid"><label htmlFor="profile-password">New password<input id="profile-password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"/></label><label htmlFor="profile-password-confirm">Confirm password<input id="profile-password-confirm" type="password" autoComplete="new-password" minLength={6} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter it again"/></label></div><button className="dash-button dash-outline" disabled={passwordBusy}>{passwordBusy ? 'Updating…' : 'Update password'}<ArrowUpRight size={16}/></button></form></section></div></div></>;
}
