import IMatch from './IMatch';

export type IMatchModel = {
  findAll(): Promise<IMatch[]>;
  getMatchesInProgress(progress: boolean): Promise<IMatch[]>;
  finishMatch(id: number): void;
};
