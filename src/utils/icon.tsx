import { BsArrowUpRight } from 'react-icons/bs';

export default function showIcon(iconName: string) {
  switch (iconName) {
    case 'BsArrowUpRight':
      return <BsArrowUpRight />;
    default:
      return '';
  }
}
