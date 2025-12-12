export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 4)}...${addr.slice(-2)}`;
};