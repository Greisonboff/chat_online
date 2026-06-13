import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const validateAuth = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Inicialize o Firebase Auth
        const auth = getAuth();
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                console.log("Usuário autenticado");
                resolve(user);
            } else {
                console.log("Usuário não autenticado");
                resolve(null);
            }
        });
    });
}

export { validateAuth }