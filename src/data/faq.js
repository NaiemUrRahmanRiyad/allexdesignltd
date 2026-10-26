export const faqs = [
  {
    "id": "consultation",
    "label": [
      "Book a consultation"
    ],
    "terms": [
      "consultation",
      "consult",
      "appointment",
      "booking",
      "book a meeting",
      "meeting book",
      "poramorsho",
      "poramorso"
    ],
    "answer": [
      "You can request a consultation with your work type, project location, approximate budget and preferred date and time. Our team will confirm availability. Use the button below to open the request form."
    ],
    "action": "consultation"
  },
  {
    "id": "interior",
    "label": [
      "Interior design"
    ],
    "terms": [
      "interior",
      "interior design",
      "intirior",
      "interiar",
      "ghor sajate",
      "basha sajate",
      "bari sajate",
      "office sajate",
      "flat design"
    ],
    "answer": [
      "We plan interiors for homes, offices, commercial spaces and institutions around your requirements, taste and budget. Request a consultation to discuss your space."
    ],
    "link": "#interior-projects",
    "action": "consultation"
  },
  {
    "id": "services",
    "label": [
      "Services"
    ],
    "terms": [
      "service",
      "services",
      "sheba",
      "ki kaj",
      "ki koren"
    ],
    "answer": [
      "We offer interior design, custom furniture, construction & development, and steel structure solutions through AD Steel."
    ],
    "link": "#services"
  },
  {
    "id": "furniture",
    "label": [
      "Furniture collection"
    ],
    "terms": [
      "furniture",
      "chair",
      "sofa",
      "table",
      "cabinet",
      "almirah",
      "farnichar"
    ],
    "answer": [
      "View a few selected furniture samples here. Visit the ALLEX Furniture website for the full collection and product information, or enquire about a sample with our team."
    ],
    "link": "#furniture"
  },
  {
    "id": "price",
    "label": [
      "Price & quotation"
    ],
    "terms": [
      "price",
      "prices",
      "cost",
      "quote",
      "quotation",
      "budget",
      "koto"
    ],
    "answer": [
      "Pricing depends on your project scope, dimensions, materials and finish. Please request a quotation from our team; this FAQ cannot confirm prices, stock or delivery dates."
    ],
    "link": "#contact"
  },
  {
    "id": "projects",
    "label": [
      "Our projects"
    ],
    "terms": [
      "project",
      "projects",
      "portfolio",
      "video"
    ],
    "answer": [
      "Our Project Films section contains project videos. Select a video to watch it or use its YouTube link."
    ],
    "link": "#projects"
  },
  {
    "id": "steel",
    "label": [
      "Steel construction"
    ],
    "terms": [
      "steel",
      "warehouse",
      "factory",
      "turf"
    ],
    "answer": [
      "AD Steel & Construction works on steel buildings, warehouses, factories and civil construction. See the AD Steel section for services and project references."
    ],
    "link": "#adsteel"
  },
  {
    "id": "contact",
    "label": [
      "Contact & office"
    ],
    "terms": [
      "contact",
      "phone",
      "address",
      "office address",
      "location",
      "email",
      "whatsapp"
    ],
    "answer": [
      "Visit: NI Tower (Level -7), Plot: 01, Road: 10, Block: E, Banani, Dhaka-1213\nPhone: +880 176 2 689690\nEmail: info@allexdesign.com"
    ],
    "link": "#contact"
  },
  {
    "id": "about",
    "label": [
      "About ALLEX"
    ],
    "terms": [
      "about",
      "company",
      "allex"
    ],
    "answer": [
      "ALLEX Design works across interior design, furniture and project execution for residential, commercial and institutional spaces."
    ],
    "link": "#about"
  }
];
const aliases={"furniture":["farniture","furnichar","furnicher","cheyar","chayer","almari","almira","asbab"],"price":["dam","daam","khoroch","khoroc","kototaka","koto taka","koto porbe","quotation chai","budget kemon"],"contact":["thikana","thikana den","kothay","kothai","kothay obosthito","jogajog","jogajug","number","nambar","namber","mobile"],"projects":["ager kaj","kajer chobi","kajer video","project dekhao","portfolio dekhi"],"services":["ki ki koren","ki ki kaj","ki sheba","ki seba","ki kaj koro"],"steel":["stil","godam","karkhana"],"consultation":["book korte chai","booking korte chai","appointment chai","dekha korte chai","meeting korte chai","kotha bolte chai"]};
export function faqLocale(){return 0;}
export function matchFaq(query) {
  const text = query.toLowerCase().normalize('NFKC').replace(/[?!,।]+/g,' ').replace(/\s+/g,' ').trim();
  // A request to book wins over incidental budget or project mentions.
  if (/\b(book|booking|appointment|consultation|poramorsho|poramorso)\b/.test(text)) return faqs.find(f=>f.id==='consultation');
  const scored = faqs.map(item => ({ item, score:[...item.terms,...(aliases[item.id]||[])].reduce((sum,term) => {
    const found = /[a-z]/.test(term) ? new RegExp(`\\b${term}\\b`,'i').test(text) : text.includes(term);
    return sum + (found ? (item.id === 'price' ? 10 : item.id === 'about' ? 1 : 3) : 0);
  },0) }));
  // Specific questions take precedence over a general company mention.
  return scored.filter(row => row.score > 0).sort((a,b) => b.score-a.score)[0]?.item || null;
}
