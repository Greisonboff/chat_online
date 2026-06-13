// store.ts
import create from 'zustand';

// Defina o tipo de estado
interface State {
    isLoad: boolean;
    setIsLoad: (isLoad: boolean) => void;
}

// Crie o hook de estado global
const useLoad = create<State>((set) => ({
    isLoad: false,
    setIsLoad: (isLoad: boolean) => set((state: State) => ({ ...state, isLoad })),
}));

export { useLoad }