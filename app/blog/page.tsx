import type { Metadata } from 'next';
import BlogShell from '@/components/BlogShell';
import BlogListing from '@/components/BlogListing';
import { blogPosts } from '@/lib/blogPosts';
import { SITE_URL } from '@/lib/siteMetadata';
export const metadata: Metadata = { title:'Blog | Silk Studio', description:'Fresh perspectives on AI, creator culture, design and running a business. Useful stories from Silk Studio in Lagos.',alternates:{canonical:'/blog',types:{'application/rss+xml':'/blog/feed.xml'}},robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large'}},openGraph:{title:'The Silk Studio Blog',description:'Business. Culture. The work behind the work.',url:'/blog',images:[{url:'/images/blog/creative-desk.jpg',width:1400,height:840,alt:blogPosts[0].image.alt}]}};
export default function BlogPage(){
 const schema={'@context':'https://schema.org','@type':'Blog',name:'Silk Studio Blog',url:`${SITE_URL}/blog`,blogPost:blogPosts.map(p=>({'@type':'BlogPosting',headline:p.title,url:`${SITE_URL}/blog/${p.slug}`,image:`${SITE_URL}${p.image.src}`,datePublished:p.published,author:{'@type':'Organization',name:'Silk Studio',url:SITE_URL}}))};
 return <main id="top"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><BlogShell><BlogListing posts={blogPosts.map(({sections,takeaway,sources,...preview})=>preview)}/></BlogShell></main>;
}
