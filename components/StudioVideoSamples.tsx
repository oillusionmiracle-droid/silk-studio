import { studioVideos } from '@/lib/studioVideos';
export default function StudioVideoSamples({ placement }: { placement: 'homepage' | 'motion' }) {
  const videos = studioVideos.filter(video => video.placement === placement);
  return <div className={`studio-video-samples studio-video-samples--${placement}`} aria-label={placement === 'homepage' ? 'More studio videos' : 'Motion video showcase'}>{videos.map(video => <figure key={video.id}><div className={`studio-video-frame ${video.portrait ? 'studio-video-frame--portrait' : ''}`}><video controls playsInline preload="none" poster={video.poster} aria-label={video.title}><source src={video.src} type="video/mp4"/>Your browser cannot play this video. <a href={video.src}>Open the video</a>.</video></div><figcaption><span className="studio-eyebrow">{video.category}</span><h3>{video.title}</h3></figcaption></figure>)}</div>;
}
