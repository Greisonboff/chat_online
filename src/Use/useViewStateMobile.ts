// store.ts
import create from 'zustand';
type TextoEspecifico = 'contato' | 'mensagens' | 'visible';
// Defina o tipo de estado
interface State {
    viewMobile: TextoEspecifico;
    setViewMobile: (viewMobile: TextoEspecifico) => void;
}

// Crie o hook de estado global
const useViewMobile = create<State>((set) => ({
    viewMobile: 'contato',
    setViewMobile: (viewMobile: TextoEspecifico) => set((state: State) => ({ ...state, viewMobile })),
}));

export { useViewMobile }