export type City = {} & StateCityDefaults;

type StateCityDefaults = {
  id: number;
  title: string;
};

export type State = {
  id: number;
  title: string;
  letter: string;
};
