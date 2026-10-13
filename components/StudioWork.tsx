'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import projects from '@/app/data/studio-projects.json';

type Project = typeof projects[number];
export default function StudioWork({ archive = false }: { archive?: boolean }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = archive ? projects.filter(p => filter === 'All' || p.category === filter) : ['bordeaux', 'splithouse', 'proofroom', 'suya'].map(id => projects.find(p => p.id === id)!);
  function open(project: Project) { setSelected(project); dialog.current?.showModal(); }
  return <>
    {archive && <div className="studio-filters" role="group" aria-label="Filter projects">{['All', 'Apps', 'Websites'].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}<span>{category === 'All' ? projects.length : projects.filter(p => p.category === category).length}</span></button>)}</div>}
    <div className="studio-work-grid">{visible.map((project, index) => <article key={project.id} className={`studio-project studio-project-${project.id}`}>
      <button className="studio-project-image" onClick={() => open(project)} aria-label={`Explore ${project.title}`}>
        <Image src={project.image} alt={`${project.title} project preview`} fill sizes="(max-width: 700px) 92vw, 46vw" priority={index < 2} />
        <span className="studio-image-label">{project.category} / {project.id === 'bordeaux' || project.id === 'suya' ? 'Concept' : 'Independent project'}</span><span className="studio-project-arrow" aria-hidden="true">↗</span>
      </button>
      <div className="studio-project-caption"><div><span className="studio-eyebrow">{project.category} / Design & development</span><h3><button onClick={() => open(project)}>{project.title}</button></h3></div><span className="studio-project-number">0{index + 1}</span></div>
      <p>{project.summary.split('. ')[0]}.</p>
    </article>)}</div>
    {archive && <p className="studio-note">Independent products, website concepts, and portfolio explorations. Some previews use generated interface mockups; project details explain the current scope.</p>}
    <dialog ref={dialog} className="studio-dialog" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} aria-labelledby="studio-project-title">
      {selected && <><div className="studio-dialog-bar"><span className="studio-eyebrow">{selected.category} / Project notes</span><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close project">×</button></div><div className="studio-dialog-image"><Image src={selected.image} alt={`${selected.title} preview`} fill sizes="850px" /></div><div className="studio-dialog-content"><h2 id="studio-project-title">{selected.title}</h2><p>{selected.summary}</p><div className="studio-dialog-facts"><div><h3>My role</h3><p>{selected.role}</p></div><div><h3>What’s inside</h3><p>{selected.built}</p></div></div><a className="studio-button studio-lime" href={selected.url} target="_blank" rel="noopener noreferrer">Explore project ↗</a></div></>}
    </dialog>
  </>;
}
