import IMatch from './IMatch';

export type IMatchModel = {
  findAll(): Promise<IMatch[]>;
  getMatchesInProgress(progress: boolean): Promise<IMatch[]>;
  finishMatch(id: number): Promise<void>;
  updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number)
  : Promise<void>;
};
