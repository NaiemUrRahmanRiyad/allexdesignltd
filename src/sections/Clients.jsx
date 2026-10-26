import { memo } from 'react';
import { useState } from 'react';
import { Localize } from '../i18n/Language.jsx';
import { clients } from '../data/clients.js';
import imageMetadata from '../data/image-metadata.json';

const featured = ['pathao','bkash','brac','beximco','daraz','parliament','crown-cement','jotun','transcom','us-bangla','aristopharma','aarong'];
const ordered = [...clients].sort((a,b) => {
  const rank = id => featured.includes(id) ? featured.indexOf(id) : featured.length;
  return rank(a.id) - rank(b.id);
});
function ClientLogo({ client }) {
  const [failed, setFailed] = useState(false);
  return <li className={`client-logo-card${client.dark || ['presidency','transcom','carrybee','jheel-maestria'].includes(client.id) ? ' client-logo-dark' : ''}`}>
    <div className="client-logo-frame">{failed ? <strong>{client.name}</strong> : <img src={client.image} alt={client.name} width={imageMetadata[client.image]?.width || 300} height={imageMetadata[client.image]?.height || 150} loading="lazy" decoding="async" onError={() => setFailed(true)} />}</div>
    <span>{client.name}</span>
  </li>;
}
function Clients() {
  const [expanded, setExpanded] = useState(false);
  return <Localize><section id="clients" className="clients section" aria-labelledby="clients-title">
    <div className="clients-heading" data-reveal><p className="eyebrow">OUR HONORABLE CLIENTS</p><h2 id="clients-title">Built on <em>lasting relationships.</em></h2><p>Some of the organizations we have worked with.</p></div>
    <div className="clients-collection"><ul className="client-logo-grid">{ordered.slice(0,12).map(client => <ClientLogo key={client.id} client={client} />)}</ul>
    <ul id="additional-client-logos" hidden={!expanded} className="client-logo-grid client-logo-grid-extra">{ordered.slice(12).map(client => <ClientLogo key={client.id} client={client} />)}</ul>
    </div>
    {ordered.length > 12 && <div className="clients-actions"><button type="button" aria-expanded={expanded} aria-controls="additional-client-logos" onClick={() => setExpanded(value => !value)}>{expanded ? 'Show fewer clients' : 'Show all clients'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button></div>}
    <p className="clients-credit"><a href="https://commons.wikimedia.org/wiki/File:Emblem_of_the_Jatiya_Sangsad.svg" target="_blank" rel="noopener noreferrer">Parliament emblem: Bangladesh Parliament</a> · <a href="https://commons.wikimedia.org/wiki/File:Daraz_Logo.png" target="_blank" rel="noopener noreferrer">Daraz logo: Design Studio</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0 · Unmodified</a></p>
  </section></Localize>;
}

export default memo(Clients);
