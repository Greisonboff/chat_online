// store.ts
import create from 'zustand';

// Defina o tipo de estado
interface State {
  userName: string;
  setUserName: (userName: string) => void;
  userEmail: string;
  setUserEmail: (userEmail: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  openLogin: boolean;
  setOpenLogin: (userId: boolean) => void;
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  useUnreadMessages: string[];
  setUseUnreadMessages: (useUnreadMessages: string[]) => void;
  userImg: string | null;
  setUserImg: (userImg: string | null) => void;
}

// Crie o hook de estado global
const useAutentic = create<State>((set) => ({
  userEmail: '',
  setUserEmail: (userEmail: string) => set((state: State) => ({ ...state, userEmail })),
  userId: '',
  setUserId: (userId: string) => set((state: State) => ({ ...state, userId })),
  openLogin: false,
  setOpenLogin: (openLogin: boolean) => set((state: State) => ({ ...state, openLogin })),
  userName: '',
  setUserName: (userName: string) => set((state: State) => ({ ...state, userName })),
  isAuth: false,
  setIsAuth: (isAuth: boolean) => set((state: State) => ({ ...state, isAuth })),
  useUnreadMessages: [''],
  setUseUnreadMessages: (useUnreadMessages: string[]) => set((state: State) => ({ ...state, useUnreadMessages })),
  userImg: null,
  setUserImg: (userImg: string | null) => set((state: State) => ({ ...state, userImg })),
}));

export { useAutentic }