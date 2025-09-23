export default function getDate(date: string) {
  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  const partes = date.split('-');
  const dia = partes[2];
  const mes = meses[parseInt(partes[1], 10) - 1]; // -1 para indexar corretamente o array de meses
  return `${dia}/${mes}`;
}
