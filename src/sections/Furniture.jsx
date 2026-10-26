import imageMetadata from '../data/image-metadata.json';
import { memo } from 'react';
import { Localize, useLanguage } from '../i18n/Language.jsx';
import { useEffect, useRef, useState } from 'react';
import { furniture } from '../data/furniture.js';
import { serviceDirectory } from '../data/service-directory.js';
function productName(label) {
  return label.split(/(AF-\d+)/g).map((part, index) => /^AF-\d+$/.test(part) ? <span className="product-model-code" key={index}>{part}</span> : part);
}
function ProductImage({ product }) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);
  return <Localize>{failed ? <span className="furniture-image-fallback">{product.name}<br />Image unavailable</span> : <img src={product.image} alt={product.reference ? `${t('Reference photo')}: ${t(product.name)}` : product.name} width={imageMetadata[product.image].width} height={imageMetadata[product.image].height} loading="lazy" decoding="async" onError={() => setFailed(true)} />}</Localize>;
}
function Product({ product, onEnquire, onOpen }) {
  const { t } = useLanguage();
  return <Localize><article className="furniture-card">
    <button type="button" className="furniture-photo product-open" onClick={() => onOpen(product)} aria-label={`${t('View sample')}: ${t(product.name)}`}>
      <ProductImage product={product} />
      <span className="furniture-photo-arrow" aria-hidden="true">↗</span>
    </button>
    <h3>{productName(t(product.name))}</h3>{(product.reference || product.sample) && <p className="furniture-reference-label">{product.sample ? 'Design sample · Made to order' : 'Reference photo · Made to order'}</p>}
    <div className="furniture-card-actions"><button type="button" className="product-detail-trigger" onClick={() => onOpen(product)} aria-label={`${t('View details')}: ${t(product.name)}`}>View sample <span aria-hidden="true">↗</span></button><button type="button" onClick={() => onEnquire(`Furniture enquiry: ${product.name}`, product)} aria-label={`Enquire about ${product.name}`}>Enquire</button></div>
  </article></Localize>;
}
function Furniture({ onEnquire }) {
  const { t, language } = useLanguage();
  const n=language==='bn'?1:0; const service=serviceDirectory[1];
  const [selected, setSelected] = useState(null);
  const dialog = useRef();
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('product');
    const product = furniture.products.find(item => item.id === id);
    if (product) setSelected(product);
  }, []);
  useEffect(() => { if (selected && !dialog.current.open) dialog.current.showModal(); }, [selected]);
  const samples = ['executive-chair-af-800', 'light-brown-sofa', 'office-cabinet', 'board-almirah'].map(id => furniture.products.find(product => product.id === id)).filter(Boolean);
  return <Localize><section id="furniture" className="furniture section service-overview" aria-labelledby="furniture-title">
    <div className="furniture-intro" data-reveal>
      <div><p className="eyebrow">OUR FURNITURE SISTER CONCERN</p><h2 id="furniture-title">The pieces that<br /><em>complete your space.</em></h2></div>
      <div className="furniture-brand-copy"><a href={furniture.website} target="_blank" rel="noopener noreferrer" aria-label="Visit ALLEX Furniture"><img className="furniture-logo" src="/furniture/allex-furniture-logo.png" alt="ALLEX Furniture" width={imageMetadata['/furniture/allex-furniture-logo.png'].width} height={imageMetadata['/furniture/allex-furniture-logo.png'].height} loading="lazy" /></a><p>{service.summary[n]}</p></div>
    </div>
    <div className="overview-ranges" aria-label={'Furniture ranges'}>{service.ranges.map(range=><span key={range[0]}>{range[n]}</span>)}</div>
    <div className="furniture-samples"><p className="overview-selection-label">{'A few selected pieces'}</p><div className="furniture-grid">{samples.map(product=><Product key={product.id} product={product} onEnquire={onEnquire} onOpen={setSelected}/>)}</div></div>
    <dialog className="product-dialog" ref={dialog} aria-labelledby="product-dialog-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
      <button type="button" className="dialog-close" aria-label={t('Close product details')} onClick={() => dialog.current.close()}>×</button>
      {selected && <div className="product-dialog-grid"><div className="product-dialog-image"><ProductImage key={selected.id} product={selected} /></div><div className="product-dialog-copy"><p className="eyebrow">ALLEX FURNITURE COLLECTION</p><h2 id="product-dialog-title">{productName(t(selected.name))}</h2><span className="product-group">{selected.group}</span>{selected.sample && <p className="furniture-reference-note">Illustrative design sample. Final materials, dimensions and finish are confirmed with our team.</p>}<p>{(selected.reference || selected.sample) ? selected.description : 'Collection item shown on the official ALLEX Furniture website.'}</p>{selected.reference && <p className="furniture-reference-note">Reference photo from an external supplier. Final ALLEX design and finish may vary.</p>}<p>Discuss dimensions, materials, finish and availability with our team.</p><div className="product-dialog-actions"><button type="button" className="button" onClick={() => { dialog.current.close(); onEnquire(`Furniture enquiry: ${selected.name}`, selected); }}>Enquire about this item <span aria-hidden="true">↗</span></button>{selected.url && <a className="furniture-text-link" href={selected.url} target="_blank" rel="noopener noreferrer">{selected.reference ? 'View photo source ↗' : 'View on ALLEX Furniture ↗'}</a>}</div></div></div>}
    </dialog>
    <div className="overview-next-step" data-reveal><p>{'See the full furniture collection and product details on the ALLEX Furniture website.'}</p><div className="overview-actions"><a className="button" href={service.detailsUrl} target="_blank" rel="noopener noreferrer">{'View full collection'} <span aria-hidden="true">↗</span></a><button type="button" className="button furniture-custom-button" onClick={()=>onEnquire('Custom furniture consultation')}>{'Discuss custom furniture'} <span aria-hidden="true">↗</span></button></div></div>
  </section></Localize>;
}

export default memo(Furniture);

