export type PageKey = 'home' | 'discover' | 'friends' | 'recent';

export type GameFormat = 'rbxl' | 'rbxlx';

export type GameItem = {
  name: string;
  size: number;
  openedAt: string;
  format: GameFormat;
};
