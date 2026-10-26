export function filterFurniture(products, query = '', group = 'All') {
  const words = query.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return products.filter(product => {
    if (group !== 'All' && product.group !== group) return false;
    const searchable = [product.name, product.group].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase();
    return words.every(word => searchable.includes(word));
  });
}
