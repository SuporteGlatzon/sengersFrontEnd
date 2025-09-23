import { AssociatesProps } from './associates.type';
import { BannerProps } from './banner.type';
import { CardProps } from './card.type';
import { RoomProps } from './rooms.type';

export type HomeProps = {
  banner: BannerProps[];
  associates: AssociatesProps[];
  book_rooms: RoomProps[];
  card: CardProps[];
};
