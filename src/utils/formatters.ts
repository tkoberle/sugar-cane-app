export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatArea = (area: number): string => {
  return `${formatNumber(area, 2)} ha`;
};

export const formatProductivity = (tonnage: number, area: number): string => {
  const productivity = area > 0 ? tonnage / area : 0;
  return `${formatNumber(productivity, 1)} t/ha`;
};

export const formatATR = (atr: number): string => {
  return `${formatNumber(atr, 2)} kg ATR/t`;
};

export const formatPercentage = (value: number): string => {
  return `${formatNumber(value, 1)}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Green
    case 'reform':
      return '#FF9800'; // Orange
    case 'rotation':
      return '#2196F3'; // Blue
    case 'new':
      return '#9C27B0'; // Purple
    default:
      return '#757575'; // Gray
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'reform':
      return 'Reforma';
    case 'rotation':
      return 'Rotação';
    case 'new':
      return 'Novo';
    default:
      return status;
  }
};

export const getCycleColor = (cycle: number): string => {
  const colors = [
    '#9C27B0', // 0 - Purple (New planting)
    '#4CAF50', // 1 - Green (First cut)
    '#8BC34A', // 2 - Light Green (Second cut)
    '#CDDC39', // 3 - Lime (Third cut)
    '#FF9800', // 4 - Orange (Fourth cut)
    '#FF5722', // 5 - Deep Orange (Fifth cut)
  ];
  
  return colors[cycle] || '#757575';
};

export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};