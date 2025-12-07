import { create } from "zustand";
import { ProfileData, defaultProfile } from "./state";

interface ProfileStore {
  data: ProfileData;
  update: (values: Partial<ProfileData>) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  data: defaultProfile,
  update: (values) =>
    set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ data: defaultProfile }),
}));
