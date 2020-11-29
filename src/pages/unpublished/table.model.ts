export interface Furniture {
  id: string;
  name: string;
  type: FurnitureType;
  price: number;
  code: string;
  count: number;
  isPublished: boolean;
  description: string;
  image?: string;
  model3D?: string;
}

export enum FurnitureType {
  CHAIR = 'Сандал',
  BED = 'Ор',
  TABLE = 'Ширээ',
  OTHER = 'Бусад'
}

export class FurnitureTypeResolver {
  static resolve(type: string): FurnitureType {
    switch (type) {
      case 'CHAIR':
        return FurnitureType.CHAIR;
      case 'TABLE':
        return FurnitureType.TABLE;
      case 'BED':
        return FurnitureType.BED;
      default:
        return FurnitureType.OTHER;
    }
  }
}
