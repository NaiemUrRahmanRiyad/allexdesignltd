import { Localize } from '../i18n/Language.jsx';
import { useState } from 'react';

export default function ProjectCard({ project, index }) {
  const [playing, setPlaying] = useState(false);
  const [thumbnailQuality, setThumbnailQuality] = useState('maxresdefault');
  const [thumbnailUnavailable, setThumbnailUnavailable] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${project.id}/${thumbnailQuality}.jpg`;
  const playerUrl = new URL(project.videoUrl);
  playerUrl.searchParams.set('autoplay', '1');
  playerUrl.searchParams.set('rel', '0');

  return <Localize><article className="project-card" data-reveal style={{ '--reveal-delay': `${(index % 2) * 100}ms` }}>
    <div className="project-card-heading">
      <span className="project-card-mark" aria-hidden="true">A</span>
      <div><p>ALLEX DESIGN</p><h3 title={project.title}>{project.title}</h3></div>
      <span className="project-card-type">YOUTUBE</span>
    </div>
    {<div className="project-card-details" aria-label="Project details">
      {project.type && <span>{project.type}</span>}
      {project.location && <span>{project.location}</span>}
      <p>{project.scope}</p>
    </div>}
    <div className="project-media">
      {playing ? <iframe src={playerUrl.href} title={project.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button
        className={`project-preview${thumbnailUnavailable ? ' is-fallback' : ''}`}
        type="button"
        aria-label={`Play ${project.title}`}
        onClick={() => setPlaying(true)}
      >
        {!thumbnailUnavailable && <img
          src={thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          width="1280"
          height="720"
          onError={() => {
            if (thumbnailQuality === 'maxresdefault') setThumbnailQuality('hqdefault');
            else setThumbnailUnavailable(true);
          }}
        />}
        <span className="project-preview-play" aria-hidden="true"><span /></span>
        <span className="project-preview-label">PLAY VIDEO</span>
      </button>}
    </div>
    <a className="video-link" href={`https://www.youtube.com/watch?v=${encodeURIComponent(project.id)}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${project.title} on YouTube`}>Watch on YouTube <span aria-hidden="true">↗</span></a>
  </article></Localize>;
}
