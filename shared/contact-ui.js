// Use the same current form values for every WhatsApp entry point.
export function contactWhatsappMessage(fields, { consultation = false, product, pageUrl } = {}) {
  const lines = [consultation ? 'Hello ALLEX, I would like to request a consultation.' : 'Hello ALLEX, I would like to discuss a project.'];
  if (product) {
    const url = new URL(pageUrl);
    url.search = '';
    url.searchParams.set('product', product.id);
    url.hash = 'furniture';
    lines.push(`Product: ${product.name}\nProduct link: ${url.href}`);
  }
  for (const [key, label] of [['name', 'Name'], ['phone', 'Phone'], ['email', 'Email'], ['workType', 'Work type'], ['projectLocation', 'Location'], ['budget', 'Budget (BDT)'], ['preferredTime', 'Preferred time (Bangladesh)'], ['subject', 'Subject'], ['message', 'Project details']]) {
    if (typeof fields[key] === 'string' && fields[key].trim()) lines.push(`${label}: ${fields[key]}`);
  }
  return lines.join('\n');
}

export function isDialogBackdropClick(event, dialog) {
  if (event.target !== dialog) return false;
  const bounds = dialog.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
}

