import Image from 'next/image';
import styles from './DesignCollections.module.css';
import assetSizes from '@/app/data/design-assets.json';
const sizes: Record<string, {width:number;height:number}> = assetSizes;

const collections = [
  { id: 'silk-campaigns', title: 'Silk, with a point of view.', category: 'Studio campaigns', note: 'Self-promotion / Campaign concepts', description: 'Ten visual hooks across websites, advertising, print and software. Built as a single campaign collection.', images: ['your-business-is-not-a-secret-society','your-flyer-needs-a-voice-note','website-escape-room','your-ad-needs-a-hook','fourteen-tabs-one-task','one-studio-less-chasing','stop-briefing-the-group-chat','your-logo-is-big-your-message-is-missing','the-bag-left-your-brand-went-with-it','your-website-closes-at-six'] },
  { id: 'flyers-posters', title: 'Made to draw a crowd.', category: 'Flyers & posters', note: 'Fictional projects / Concept studies', description: 'Eight directions for events, fashion, community and education. Expressive type, portraiture and clear information.', images: ['find-your-next-spark','talent-meets-discipline','dressed-for-the-moment','understand-your-money','influence-event','money-smart-kids','growing-in-grace','love-faith-friendship'] },
  { id: 'brand-event-studies', title: 'Identity, out in the world.', category: 'Brand & event studies', note: 'Fictional projects / Reference-based studies', description: 'Food identities, packaging presentations and event campaigns. Visual studies exploring established reference directions.', images: ['munche-food-identity','bun-vietnamese-kitchen','ticketwave-fan-zone','afrobeats-social-packages'] },
  { id: 'app-visual-studies', title: 'A little more personality.', category: 'App visual studies', note: 'Fictional apps / Reference-based UI studies', description: 'PerkLoop, SkillPop and Looply + Vaultly. Interface presentations with new portraiture and illustrations; visual concepts rather than live products.', images: ['perkloop-rewards','skillpop-learning','looply-vaultly-onboarding'] },
];
const title = (slug: string) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
export default function DesignCollections() {
  return <div className={styles.collections}>{collections.map((collection, index) => <details key={collection.id} id={collection.id} className={styles.collection}>
    <summary className={styles.summary}>
      <div className={styles.cover}><Image src={`/images/design-collections/${collection.images[0]}.webp`} alt={`${collection.category} collection preview`} fill sizes="(max-width: 700px) 90vw, 300px" className={styles.coverImage}/><span className={styles.count}>{collection.images.length} designs</span></div>
      <div className={styles.intro}><small>{String(index + 1).padStart(2,'0')} / {collection.category}</small><h3>{collection.title}</h3><p>{collection.description}</p><span className={styles.note}>{collection.note}</span><span className={styles.toggle}>Explore collection <span aria-hidden="true">+</span></span></div>
    </summary>
    <div className={styles.gallery}>{collection.images.map((slug, i) => <figure key={slug}><a href={`/images/design-collections/${slug}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title(slug)} at full size in a new tab`}><Image src={`/images/design-collections/${slug}.webp`} alt={`${title(slug)} — ${collection.note}`} width={sizes[slug].width} height={sizes[slug].height} sizes="(max-width: 700px) 90vw, 45vw" className={styles.artwork}/></a><figcaption><span>{String(i + 1).padStart(2,'0')}</span>{title(slug)}<span aria-hidden="true">↗</span></figcaption></figure>)}</div>
  </details>)}</div>;
}
