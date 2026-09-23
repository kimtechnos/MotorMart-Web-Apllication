import { create } from "zustand";
import { devtools } from "zustand/middleware";

const userStore = (set) => ({
  user: null,
  changeUserInformation: (newUserObject) => {
    set(() => ({ user: newUserObject }));
  },
  clearUserInformation: () => {
    set(() => ({ user: null }));
  },
});

const useUserStore = create(devtools(userStore));

export default useUserStore;
