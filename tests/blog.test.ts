import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { blogPosts } from '../lib/blogPosts';
import { sitemapXml, robotsText } from '../lib/searchIndex';
test('every published blog article has a unique indexable URL and a deployable credited image',()=>{
 const sitemap=sitemapXml();
 assert.equal(new Set(blogPosts.map(p=>p.slug)).size,blogPosts.length);
 for(const post of blogPosts){assert.ok(sitemap.includes(`/blog/${post.slug}</loc>`));assert.ok(existsSync(`public${post.image.src}`));assert.ok(post.image.alt.length>20);assert.ok(post.image.credit);assert.ok(post.image.source.startsWith('https://'));}
 assert.ok(sitemap.includes('xmlns:image='));assert.ok(robotsText().includes('Allow: /blog/'));assert.ok(!robotsText().includes('Disallow: /blog'));
});
