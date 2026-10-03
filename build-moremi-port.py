#!/usr/bin/env python3
"""Port ~/workspace/moremi-page/index.html to Next.js app/moremi/page.tsx."""
import re, html as htmlmod

SRC = '/home/hatch/workspace/moremi-page/index.html'
DST = '/home/hatch/workspace/silk-studio-site/app/moremi/page.tsx'
html = open(SRC, encoding='utf-8').read()

# ---------- 1. CSS -> scoped stylesheet ----------
css = re.search(r'<style>(.*?)</style>', html, re.S).group(1).strip()
font_import = ("@import url('https://fonts.googleapis.com/css2?"
               "family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800"
               "&family=Gochi+Hand&display=swap');\n")

def scope_selector(sel):
    sel = sel.strip()
    if sel in ('html', 'body', ':root'):
        return '.moremi-scope'
    if sel == '*':
        return '.moremi-scope *'
    # NOTE: no early-return for .no-motion here — comma-separated selectors
    # like ".no-motion *, .no-motion *::before" must scope EVERY part, which
    # the per-part loop below does correctly.
    parts = [p.strip() for p in sel.split(',')]
    out = []
    for p in parts:
        if p in ('html', 'body', ':root'):
            out.append('.moremi-scope')
        elif p == '*':
            out.append('.moremi-scope *')
        elif p.startswith('.no-motion'):
            out.append('.moremi-scope.no-motion' + p[len('.no-motion'):])
        else:
            out.append('.moremi-scope ' + p)
    return ', '.join(out)

def scope_css(css_text):
    # strip comments
    css_text = re.sub(r'/\*.*?\*/', '', css_text, flags=re.S)
    out = []
    i, n = 0, len(css_text)
    while i < n:
        # skip whitespace
        if css_text[i].isspace():
            i += 1
            continue
        if css_text.startswith('@media', i):
            # copy @media header, then scope inner rules
            m = re.match(r'@media[^{]*\{', css_text[i:])
            header = m.group(0)
            i += len(header)
            depth = 1
            inner_start = i
            while depth:
                if css_text[i] == '{':
                    depth += 1
                elif css_text[i] == '}':
                    depth -= 1
                i += 1
            inner = css_text[inner_start:i - 1]
            out.append(header + scope_css(inner) + '}')
        elif css_text[i] == '@':
            # other at-rules (@import handled separately) — copy through
            j = css_text.find(';', i)
            out.append(css_text[i:j + 1])
            i = j + 1
        else:
            j = css_text.find('{', i)
            sel = css_text[i:j]
            depth = 1
            k = j + 1
            while depth:
                if css_text[k] == '{':
                    depth += 1
                elif css_text[k] == '}':
                    depth -= 1
                k += 1
            body_css = css_text[j:k]
            out.append(scope_selector(sel) + body_css)
            i = k
    return ''.join(out)

scoped = scope_css(css)
assert '`' not in scoped and '${' not in scoped
# additions for the Next.js integration (back-link into the main site)
scoped += ("\n.moremi-scope .mobile-menu a.back-home{font-size:14px;opacity:.75;"
           "border-bottom:1px solid rgba(255,255,255,.16)}\n")
# desktop-only fix (2026-10-03): the tile characters hung ~80-115px into the
# tiles and covered the headings on desktop widths. Lift them higher, shrink
# slightly, and give the tile content clearance. Mobile (max-width:860px)
# keeps its own values from the media query above — untouched.
scoped += ("\n@media(min-width:861px){"
           ".moremi-scope .tile{padding-top:72px}"
           ".moremi-scope .char-apps{width:120px;top:-52px;right:56px}"
           ".moremi-scope .char-games{width:96px;top:-48px;left:28px}"
           ".moremi-scope .char-stories{width:110px;top:-50px;right:56px}"
           ".moremi-scope .char-drops{width:120px;top:-52px;left:18px}"
           ".moremi-scope .film-video{position:relative;max-width:620px;margin:0 auto;"
           "aspect-ratio:16/9;border-radius:24px;overflow:hidden;"
           "box-shadow:var(--shadow);background:#000}"
           ".moremi-scope .film-video iframe{position:absolute;inset:0;"
           "width:100%;height:100%;border:0}"
           "}\n")
open('/home/hatch/workspace/silk-studio-site/app/moremi/moremi.css',
     'w', encoding='utf-8').write(font_import + scoped)
print('scoped css rules written')

# ---------- 2. Body markup -> JSX ----------
body = re.split(r'<script', html.split('<body>')[1], maxsplit=1)[0]

# asset paths -> /moremi/...
body = body.replace('src="field.jpg"', 'src="/moremi/field.jpg"')
body = re.sub(r'src="([A-Za-z0-9\-]+\.(png|jpg))"', r'src="/moremi/\1"', body)

# 2026-10-03: film poster card -> direct inline YouTube embed (compact 16:9).
# The poster image wasn't loading and the card took too much vertical space.
body = re.sub(
    r'<div class="film-wrap">\s*<button class="film" id="filmOpen"[^>]*>.*?</button>\s*</div>',
    '<div class="film-wrap"><div class="film-video">'
    '<iframe src="https://www.youtube-nocookie.com/embed/ZL52Dsv2qpg?rel=0" '
    'title="Watch the Moremi film" loading="lazy" '
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
    'allowFullScreen></iframe></div></div>',
    body, flags=re.S)
# the lightbox is no longer needed — remove its markup
body = re.sub(r'<div class="lightbox" id="lightbox".*?</div>\s*</div>',
              '', body, flags=re.S)
# back-links into the main site (desktop nav + mobile menu)
body = body.replace('<div class="nav-links">',
                    '<div class="nav-links"><a href="/">Silk Studio</a>', 1)
body = body.replace('<div class="mobile-menu" id="mobileMenu">',
                    '<div class="mobile-menu" id="mobileMenu">'
                    '<a href="/" class="back-home">\u2190 Silk Studio</a>', 1)

# 2026-10-03: motion toggle removed — motion is always on. Drop the button.
body = re.sub(r'<button[^>]*id="motionToggle"[^>]*>.*?</button>',
              '', body, flags=re.S)

# class -> className
body = body.replace('class="', 'className="')

# tabindex -> tabIndex for JSX (numeric)
body = body.replace('tabindex="0"', 'tabIndex={0}')
body = body.replace('tabindex="', 'tabIndex="')
# novalidate -> noValidate
body = body.replace('novalidate', 'noValidate')
# empty ontouchstart="" (iOS :active quirk workaround) is invalid JSX — strip it
body = body.replace(' ontouchstart=""', '')
# label for -> htmlFor ; autocomplete -> autoComplete
body = re.sub(r'<label for="', '<label htmlFor="', body)
body = body.replace('autocomplete="', 'autoComplete="')

# inline styles -> style objects
def style_to_obj(m):
    raw = m.group(1)
    parts = []
    for decl in raw.split(';'):
        decl = decl.strip()
        if not decl or ':' not in decl:
            continue
        prop, val = decl.split(':', 1)
        prop, val = prop.strip(), val.strip()
        if prop.startswith('--'):
            key = "'%s'" % prop
        else:
            key = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), prop)
        # numeric values without units -> number, else string
        if re.fullmatch(r'-?\d+(\.\d+)?', val):
            v = val
        else:
            v = "'%s'" % val.replace("'", "\\'")
        parts.append('%s: %s' % (key, v))
    has_custom = any(p.startswith("'--") for p in parts)
    cast = ' as CSSProperties' if has_custom else ''
    return 'style={{%s}%s}' % (', '.join(parts), cast)

body = re.sub(r'style="([^"]*)"', style_to_obj, body)

# self-close void elements
body = re.sub(r'<(img|input|br|source|hr)([^>]*?)(?<!/)>', r'<\1\2/>', body)

# SVG attributes -> camelCase for JSX
for a, b in [('stroke-width', 'strokeWidth'), ('stroke-linecap', 'strokeLinecap'),
             ('fill-rule', 'fillRule'), ('clip-rule', 'clipRule'),
             ('stroke-dasharray', 'strokeDasharray'), ('stroke-dashoffset', 'strokeDashoffset')]:
    body = body.replace(a + '=', b + '=')

# strip HTML comments
body = re.sub(r'<!--.*?-->', '', body, flags=re.S)

# escape apostrophes in JSX text nodes only (react/no-unescaped-entities);
# tags (incl. generated style={{...}} objects) are left untouched
body = re.sub(r'(?<=>)[^<]+', lambda m: m.group(0).replace("'", '&apos;'), body)

# sanity: no leftover event-handler attrs, no raw { } in text
assert 'onclick=' not in body.lower(), 'inline handler found'
print('markup lines:', body.count('\n'))

# ---------- 3. Scripts -> useEffect ----------
scripts = re.findall(r'<script>(.*?)</script>', html.split('<body>')[1], re.S)
js = '\n'.join(s.strip() for s in scripts if s.strip())
# 2026-10-03: film lightbox JS removed — the video is now an inline embed,
# so the lightbox open/close code (and its #filmOpen / #lightbox targets) is dead.
js = re.sub(r'/\* ====== FILM LIGHTBOX.*?\}\)\(\);\s*', '', js, flags=re.S)

# 2026-10-03: motion toggle removed — motion is always on. Replace the whole
# toggle IIFE with a forced __motionOn=true plus the floaties starter (the
# GSAP block gates on __motionOn, and __startFloaties is called optionally).
m = re.search(r'window\.__startFloaties = function\(\)\{.*?\n  \};', js, re.S)
floaties_fn = m.group(0) if m else ''
js = re.sub(r'/\* ====== MOTION TOGGLE.*?\n\}\)\(\);\s*',
            'window.__motionOn = true;\n' + floaties_fn + '\n', js, flags=re.S)
# map window.* globals to npm imports (defined in component)
js = js.replace('window.gsap', 'gsap')
js = js.replace('window.ScrollTrigger', 'ScrollTrigger')
js = js.replace('window.SplitText', 'SplitText')
# TS: getElementById results are used inside nested closures where TS can't
# narrow nullability. The elements are guaranteed by this component's own
# markup, so assert non-null (standard for ported DOM code).
js = re.sub(r"document\.getElementById\('([^']+)'\)",
            r"document.getElementById('\1')!", js)
# no-motion now lives on the scoped wrapper (was <html> in the standalone page)
js = js.replace("document.documentElement.classList.toggle('no-motion', !on)",
                "document.querySelector('.moremi-scope')!.classList.toggle('no-motion', !on)")
# __startFloaties is assigned by an earlier script block; call optionally
js = js.replace('window.__startFloaties();', 'window.__startFloaties?.();')
# querySelector nullability (same guarantee as above)
js = js.replace("document.querySelector('.nav')", "document.querySelector('.nav')!")
# form audience-switcher typings
js = js.replace('function setAudience(who){', 'function setAudience(who: string){')
js = js.replace("tabParent.setAttribute('aria-pressed', isParent);",
                "tabParent.setAttribute('aria-pressed', String(isParent));")
js = js.replace("tabSchool.setAttribute('aria-pressed', !isParent);",
                "tabSchool.setAttribute('aria-pressed', String(!isParent));")
js = js.replace("const audience = document.getElementById('audience')!;",
                "const audience = document.getElementById('audience')! as HTMLInputElement;")
js = js.replace("querySelectorAll('input,select').forEach(el=>el.required",
                "querySelectorAll('input,select').forEach(el=>{ (el as HTMLInputElement).required")
# forEach arrow bodies need closing braces to match the added opening brace
js = js.replace("el.id!=='p-phone');", "el.id!=='p-phone'; })")
js = js.replace("el.id!=='s-pupils');", "el.id!=='s-pupils'; })")
js = js.replace("const form = document.getElementById('waitlistForm')!;",
                "const form = document.getElementById('waitlistForm')! as HTMLFormElement;")
js = js.replace("const btn = document.getElementById('submitBtn')!;",
                "const btn = document.getElementById('submitBtn')! as HTMLButtonElement;")
# dead placeholder guard — the real Formspree ID is wired above
js = re.sub(r'\s*if\(FORMSPREE_ID === "YOUR_FORM_ID_HERE"\)\{.*?\n\s*\}\n',
            '\n', js, flags=re.S)
# gsap.utils.toArray needs an explicit generic under TS strict
js = js.replace('gsap.utils.toArray(', 'gsap.utils.toArray<HTMLElement>(')
# remaining closure typings
js = js.replace('function toggle(tile){', 'function toggle(tile: HTMLElement){')
js = js.replace("tiles.forEach(function(tile){",
                "tiles.forEach(function(t){ const tile = t as HTMLElement;")
js = js.replace("addEventListener('keydown', function(e){",
                "addEventListener('keydown', function(e: KeyboardEvent){")
js = js.replace("var frame = document.getElementById('lbVideo')!;",
                "var frame = document.getElementById('lbVideo')! as HTMLIFrameElement;")
# indent for embedding
js_indented = '\n'.join(('    ' + l) if l.strip() else '' for l in js.split('\n'))

# ---------- 4. Assemble ----------
page = """'use client';
/* Moremi waitlist page — ported from the approved HTML preview.
   Styles live in ./moremi.css, scoped under .moremi-scope (imported by layout). */
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

declare global {
  interface Window {
    __motionOn?: boolean;
    __startFloaties?: () => void;
  }
}

export default function MoremiPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
%s
    return () => {
      try {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.globalTimeline.clear();
        gsap.killTweensOf('*');
      } catch (e) {}
    };
  }, []);

  return (
    <div className="moremi-scope">
%s
    </div>
  );
}
""" % (js_indented, body)

open(DST, 'w', encoding='utf-8').write(page)
print('written', DST, len(page), 'chars')
