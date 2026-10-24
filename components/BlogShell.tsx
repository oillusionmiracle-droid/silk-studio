'use client';
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
export default function BlogShell({children}:{children:ReactNode}) {
 const [theme,setTheme]=useState<'light'|'dark'>('light');
 useEffect(()=>{try{const saved=localStorage.getItem('silk_blog_theme');if(saved==='dark'||saved==='light')setTheme(saved);}catch{}},[]);
 function toggle(){const next=theme==='light'?'dark':'light';setTheme(next);try{localStorage.setItem('silk_blog_theme',next);}catch{}}
 return <div className="silk-blog" data-blog-theme={theme}><div className="blog-masthead"><Link href="/blog" aria-label="Blog home">Blog<span className="blog-brand-dot">.</span></Link><p>Business. Culture. The work behind the work.</p><button onClick={toggle} aria-label={`Switch blog to ${theme==='light'?'dark':'light'} mode`}>{theme==='light'?<Moon size={16}/>:<Sun size={16}/>}<span>{theme==='light'?'Dark':'Light'}</span></button></div>{children}</div>;
}
