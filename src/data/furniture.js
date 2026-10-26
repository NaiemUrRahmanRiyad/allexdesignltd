const site = 'https://www.allexfurniturebd.com';
const uploads = `${site}/wp-content/uploads/2024/06`;
export const furniture = {
  website: `${site}/`,
  shop: `${site}/shop/`,
  reviewedOn: '2026-10-14',
  introduction: 'Explore ALLEX Furniture, our furniture sister concern, alongside your interior project. Its collection brings together office chairs, sofas, tables and storage, with a dedicated route for custom furniture enquiries.',
  mission: 'To develop distinctive furniture for living and working spaces, combining inventive design with environmental care and a commitment to customer satisfaction.',
  vision: 'To pursue international design leadership through lasting quality, expressive furniture and a more sustainable future.',
  categories: ['Office furniture', 'Hospital furniture', 'Industrial furniture', 'Garments furniture', 'Custom made furniture'],
  // Summaries of the source testimonials; website-project context is retained.
  testimonials: [
    { name: 'Kh Hasanuzzaman', role: 'Owner, Dania Machineries', initials: 'KH', summary: 'Appreciated the helpful support, a result that matched his expectations and the value of the service.', context: 'Service feedback' },
    { name: 'Md. Masud Rana', role: 'CTO, One Solutions', initials: 'MR', summary: 'Expressed appreciation for the work on his website and the finished result, and recommended the team.', context: 'Website project feedback' },
    { name: 'S M Mehdi Akram', role: 'CEO, Royal Group', initials: 'MA', summary: 'Highlighted a fast quotation, clear communication and a website with straightforward content management.', context: 'Website project feedback' },
  ],
  products: [
    ['light-brown-sofa', 'Light Brown Sofa', 'light-brown-sofa-PXKX3RE', 'Sofas'],
    ['blue-sofa-with-red-pillar', 'Blue Sofa with Red Pillar', 'blue-sofa-with-red-pillar-PUSBB9D', 'Sofas'],
    ['wooden-table', 'Wooden Table', 'wooden-table-on-white-background-P6CQMJC', 'Tables & storage'],
  ].map(([id, name, asset, group]) => ({ id, name, group, image: `/furniture/${asset}.webp`, sourceImage: `${uploads}/${asset}-600x600.png`, url: `${site}/product/${id}/` })).concat([
    { id: 'office-cabinet', name: 'Office Storage Cabinet', group: 'Cabinets', image: '/furniture/office-cabinet-sample.webp', sample: true, description: 'An office storage cabinet sample. Choose the shelf arrangement, materials and finish with our team.' },
    { id: 'office-desk', name: 'Office Desk', group: 'Tables & storage', image: '/furniture/office-desk-sample.webp', sample: true, description: 'An office desk sample with a drawer unit. Tell us the size you need and your preferred finish.' },
    { id: 'board-almirah', name: 'Board Almirah', group: 'Almirah', image: '/furniture/board-almirah-sample.webp', sample: true, description: 'A laminated-board almirah sample with a woodgrain finish. The style is inspired by Otobi furniture; this is a custom design sample, not an Otobi product.' },
    { id: 'executive-chair-af-800', name: 'Executive Chair — AF-800 Style', group: 'Chairs', image: '/furniture/executive-chair-cutout.webp', url: 'https://skgrillart.in/product/high-back-ergonomic-executive-office-chair-premium-leatherette-revolving-chair/', reference: true, description: 'A style reference for AF-800 executive seating. Confirm the final model, upholstery and size with our team before ordering.' },
    { id: 'mesh-chair-af-15', name: 'Compact Mesh Chair — AF-15 Style', group: 'Chairs', image: '/furniture/mesh-chair-cutout.webp', url: 'https://www.penghaooffice.com/product/black-mesh-mid-back-office-chair-with-black-armrests-ph-9002/', reference: true, description: 'A style reference for an AF-15 compact mesh chair. Confirm the model, cushion and size with our team before ordering.' },
    { id: 'visitor-chair-ss', name: 'Visitor Chair — SS Base & Rexine', group: 'Chairs', image: '/furniture/visitor-chair-cutout.webp', url: 'https://www.partexfurniture.com/visitor-chair-i001.html', reference: true, description: 'Visitor seating with an SS base and rexine upholstery, for offices and professor rooms. Discuss the required size and finish with our team.' },
    { id: 'lab-stool-27', name: 'Student Lab Stool — 18 / 27 inch', group: 'Lab seating', image: '/furniture/lab-stool-cutout.webp', url: 'https://www.paragonmed.com/product-category/surgery/stools/stainless-steel-stools/', reference: true, description: 'Student lab stools in 18-inch and 27-inch options. The photo is a style reference; confirm the height, material and finish for your laboratory.' },
    { id: 'lab-assistant-chair', name: 'Lab Assistant Chair', group: 'Lab seating', image: '/furniture/lab-assistant-chair-cutout.webp', url: 'https://skgrillart.in/product/office-visitor-chair-with-stainless-steel-frame-and-black-rexine-cushion/', reference: true, description: 'Seating for lab assistants. Discuss the size, materials and finish needed for your laboratory.' },
  ]),
};
