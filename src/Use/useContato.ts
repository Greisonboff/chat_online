// store.ts
import create from 'zustand';

// Defina o tipo de estado
interface State {
  contactUserName: string;
  setContactUserName: (contactUserName: string) => void;
  contactUserId: string;
  setContactUserId: (contactUserId: string) => void;
  contactUserImg: string[];
  setContactUserImg: (contactUserImg: string[]) => void;
}

// Crie o hook de estado global
const useContato = create<State>((set) => ({
  contactUserId: '',
  setContactUserId: (contactUserId: string) => set((state: State) => ({ ...state, contactUserId })),
  contactUserName: '',
  setContactUserName: (contactUserName: string) => set((state: State) => ({ ...state, contactUserName })),
  contactUserImg: [],
  setContactUserImg: (contactUserImg: string[]) => set((state: State) => ({ ...state, contactUserImg })),
}));

export { useContato }