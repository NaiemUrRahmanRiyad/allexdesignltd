const officeAddress = 'NI Tower (Level -7), Plot: 01, Road: 10, Block: E, Banani, Dhaka-1213';

export const content = {
  name: 'ALLEX Design and Development Ltd.',
  contact: {
    address: officeAddress,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`,
    phone: '+880 176 2 689690',
    phoneUrl: 'tel:+8801762689690',
    email: 'info@allexdesign.com',
    emailUrl: 'mailto:info@allexdesign.com',
    whatsappUrl: 'https://wa.me/8801762689690',
  },
  socialLinks: [
    { name: 'Facebook', url: 'https://www.facebook.com/TheAllexDesign' },
    { name: 'YouTube', url: 'https://www.youtube.com/@theallexdesign' },
    { name: 'Instagram', url: 'https://www.instagram.com/allexgroup/' },
  ],
  phrases: ['Interior solutions', 'Custom furniture', 'Home & office interiors', 'AD Steel structures'],
  // Current company summaries reviewed against the official site and Facebook page.
  about: 'We design interiors and custom furniture for homes, offices, shops and institutions. Our architects and designers work with you to plan spaces that suit your daily needs, style and budget.',
  howWeWork: 'We listen to your requirements, agree on a design, then coordinate production and installation. We discuss materials and finishes with you and provide support after delivery.',
  projectProcess: [
    { title: 'Consultation', description: 'Tell us about your space, how you use it and your budget.' },
    { title: 'Design', description: 'We plan the layout, materials and furniture with you.' },
    { title: 'Build', description: 'Once you approve the design, we arrange production or site work.' },
    { title: 'Installation', description: 'We install the finished work and discuss any follow-up support.' },
  ],
  companyHighlights: [
    {
      title: 'A complete design team',
      description: 'Our architects and designers work together on layouts, materials and the details needed to carry out your project.',
    },
    {
      title: 'Furniture made in-house',
      description: 'ALLEX Furniture makes custom pieces for your space, with materials and finishes agreed before production.',
    },
    {
      title: 'Quality that lasts',
      description: 'After-sales service is available. Depending on the item, warranty coverage ranges from 1 to 5 years; confirm the terms with our team.',
    },
    {
      title: 'Proven experience',
      description: 'Our work includes homes, offices, shops and institutions, each with different needs and ways of using the space.',
    },
  ],
  sources: {
    about: ['https://www.allexdesign.com/about-us/', 'https://www.allexdesign.com/'],
    services: ['https://www.allexdesign.com/', 'https://www.allexdesign.com/about-us/', 'https://www.facebook.com/TheAllexDesign'],
    furniture: ['https://www.allexfurniturebd.com/', 'https://www.allexfurniturebd.com/shop/'],
    adsteel: ['https://www.adsteel.co/', 'https://www.adsteel.co/our-services/', 'https://www.adsteel.co/steel-structure-projects/'],
    reviewedOn: '2026-10-14',
  },
  services: [
    {
      title: 'Interior design',
      eyebrow: 'DESIGNED AROUND YOU',
      description: 'We plan home, office and commercial interiors around your needs, from room layouts to materials, furniture and installation.',
      imageAlt: 'Contemporary living space illustrating a thoughtfully planned interior',
    },
    {
      title: 'Custom furniture',
      eyebrow: 'MADE FOR YOUR SPACE',
      description: 'ALLEX Furniture makes seating, tables and storage to suit your space. Materials, finishes and warranty terms are discussed for each order.',
      imageAlt: 'Furniture makers working on panels at the ALLEX furniture workshop',
    },
    {
      title: 'Construction & development',
      eyebrow: 'THOUGHTFULLY BUILT',
      description: 'We coordinate planning and site work for residential and commercial projects, based on the approved design and agreed scope.',
      imageAlt: 'Multi-storey framework under construction in the AD Steel Pathao warehouse portfolio',
    },
    {
      title: 'AD Steel',
      eyebrow: 'STEEL STRUCTURES & BUILDINGS',
      description: 'AD Steel & Construction works on steel buildings, warehouses, factories and civil construction. Discuss the site and the work you need with our team.',
      imageAlt: 'Steel roof framing and storage racks inside the Pathao warehouse from the AD Steel portfolio',
    },
  ],
  statistics: [{ label: 'Projects completed', value: 500, suffix: '+', duration: 2400, start: 0 }],
};
