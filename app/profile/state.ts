export interface ProfileData {
  age: number | null;
  gender: string;
  state: string;
  district: string;
  income: number | null;
  category: string;
  occupation: string;
  disability: boolean | null;
}

export const defaultProfile: ProfileData = {
  age: null,
  gender: "",
  state: "",
  district: "",
  income: null,
  category: "",
  occupation: "",
  disability: null,
};
