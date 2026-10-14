import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'node:fs';
import { studioVideos } from '../lib/studioVideos';
test('the first two submitted videos follow the homepage reel and the remaining films populate motion', () => {
 assert.deepEqual(studioVideos.filter(video => video.placement === 'homepage').map(video => video.id), ['ugc-product-demo', 'editing-reel']);
 assert.deepEqual(studioVideos.filter(video => video.placement === 'motion').map(video => video.id), ['cinematic-campaign', 'product-film']);
});
test('every video has a deployable clip and poster', () => {
 for (const video of studioVideos) { assert.ok(existsSync(`public${video.src}`), video.src); assert.ok(existsSync(`public${video.poster}`), video.poster); }
});
