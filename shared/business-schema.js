import { seoCopy, siteOrigin } from './seo.js';

// Use only contact details and service areas already described on the website.
export function businessSchema(site) {
  const origin=siteOrigin(site), businessId=`${origin}/#business`;
  const services=[
    ['interior-projects','Interior design','Home, office, commercial and institutional interior design, layouts, materials and installation.'],
    ['furniture','Custom furniture','Custom seating, tables, cabinets and storage from ALLEX Furniture.'],
    ['adsteel','Steel construction','Steel buildings, warehouses, factories and civil construction from AD Steel & Construction.'],
  ];
  return {'@context':'https://schema.org','@graph':[
    {'@type':'LocalBusiness','@id':businessId,name:'ALLEX Design and Development Ltd.',url:`${origin}/`,description:seoCopy.en.description,logo:`${origin}/brand-logo.png`,image:`${origin}/social-preview.jpeg`,telephone:'+8801762689690',email:'info@allexdesign.com',address:{'@type':'PostalAddress',streetAddress:'NI Tower (Level 7), Plot 01, Road 10, Block E, Banani',addressLocality:'Dhaka',postalCode:'1213',addressCountry:'BD'},sameAs:['https://www.facebook.com/TheAllexDesign','https://www.youtube.com/@theallexdesign','https://www.instagram.com/allexgroup/'],hasOfferCatalog:{'@type':'OfferCatalog',name:'Interior, furniture and steel construction services',itemListElement:services.map(([anchor,name])=>({'@type':'Offer',itemOffered:{'@id':`${origin}/#service-${anchor}`,name}}))}},
    {'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:'ALLEX Design',publisher:{'@id':businessId},inLanguage:'en'},
    ...services.map(([anchor,name,description])=>({'@type':'Service','@id':`${origin}/#service-${anchor}`,name,serviceType:name,description,url:`${origin}/#${anchor}`,provider:{'@id':businessId}})),
  ]};
}
