export interface Settings {
  genderValue: string[];
  discoverValue: boolean;
  ageValue: {
    lower: number;
    upper: number;
  };
  distanceValue: number;
}
export const SETTINGS: Settings = {
  genderValue: [],
  discoverValue: true,
  ageValue: {
    lower: 18,
    upper: 100,
  },
  distanceValue: 20,
};
