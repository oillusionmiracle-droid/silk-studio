import Image from 'next/image';
const references = [
  ['TuHEE0zSMU4', 'Skincare, creator style', 'AI UGC / Demo + walkthrough'],
  ['ngX8XVp05S4', 'Reaction-led hooks', 'AI UGC / Demo + walkthrough'],
  ['wm8FFfbQzbU', 'Arcads creator demos', 'AI UGC / Youri van Hofwegen'],
  ['LFmpVy6eGXs', 'Heinz / A.I. Ketchup', 'AI campaign / Heinz · Rethink'],
  ['UYBr5I3un8g', 'Coca-Cola / Masterpiece', 'AI-assisted film / Coca-Cola'],
  ['GbQomqb28os', 'Nike / You Can’t Stop Us', 'Brand film / Nike'],
  ['BR4wKFiRv_c', 'Apple / Flock', 'Brand film / Apple'],
  ['M7FIvfx5J10', 'Volvo / The Epic Split', 'Brand film / Volvo Trucks'],
  ['owGykVbfgUE', 'Old Spice / The Man Your Man…', 'Brand film / Old Spice'],
  ['ZUG9qYTJMsI', 'Dollar Shave Club / Launch film', 'Brand film / Dollar Shave Club'],
];
export default function StudioReferences() {
  return <section className="studio-references studio-section" id="ads"><div className="studio-section-line"><span>03 / Motion & advertising</span><span>Give your idea a little life.</span></div><div className="studio-section-heading"><h2>Made to make<br /><em>you look.</em></h2><div><p>Creator-style AI ads, product films, and visual stories. From the first hook to the final cut.</p><a href="#brief" className="studio-text-link">Brief an ad campaign ↗</a></div></div><div className="studio-ad-feature"><video controls playsInline preload="none" poster="/images/portfolio/work-1.jpg" aria-label="Silk studio motion sample"><source src="/images/portfolio/work-1.mp4" type="video/mp4" /></video><div><span className="studio-eyebrow">From the Silk archive</span><h3>Movement with<br />a purpose.</h3><p>A studio motion sample. For your campaign, we shape the script, visual direction, and delivery around your product and audience.</p><a className="studio-button studio-lime" href="#brief">Let’s make your next ad ↗</a></div></div><details className="studio-reference-room"><summary><span>Explore the reference room</span><span>10 directions ↗</span></summary><p className="studio-note">Third-party inspiration from your personal portfolio, credited to the original creators. These are references, not Silk client work. The first three include AI UGC demos within tutorials.</p><div className="studio-reference-grid">{references.map(([id,title,credit]) => <a key={id} href={`https://www.youtube.com/watch?v=${id}${id === 'TuHEE0zSMU4' ? '&t=127s' : ''}`} target="_blank" rel="noopener noreferrer"><div><Image unoptimized src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" /><span>↗</span></div><small>{credit}</small><h3>{title}</h3></a>)}</div></details></section>;
}
