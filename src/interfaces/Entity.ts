export interface Building {
  id?: number | undefined;
  name: string;
  city?: string | null | undefined;
  postCode?: string | null | undefined;
  street?: string | null | undefined;
  countryCode?: string | null | undefined;
}

export interface Floor {
  id?: number | undefined;
  buildingId: number;
  name?: string | undefined | null;
  number?: number | undefined | null;
  floorPath?: string | undefined | null;
}

export interface Seat {
  id?: number | undefined;
  number: number;
  locationX: number;
  locationY: number;
  floorId: number;
}

export interface User {
  id?: number | undefined;
  ldapId: string;
  email?: string | undefined | null;
  name?: string | undefined | null;
  fullName?: string | undefined | null;
  roles?: Array<string> | undefined | null;
  image?: string | undefined | null;
  isAdmin: boolean;
}

export interface Asset {
  id?: number | undefined;
  type: string;
  name: string;
}

export interface SeatAsset {
  id?: number | undefined;
  seatId: number;
  assetId: number;
  priority: number;
}

export interface Booking {
  id?: number | undefined;
  userId?: number | undefined;
  seatId: number;
  fromDay?: Date | undefined;
  untilDay?: Date | undefined;
  createdAt?: Date | undefined;
}

export const NAMES = {
  asset: 'asset',
  booking: 'booking',
  building: 'building',
  floor: 'floor',
  seat: 'seat',
  seatAsset: 'seat-asset',
  user: 'user',
};
