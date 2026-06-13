import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseConfig } from '../firebase';
import { useAutentic } from "../Use/useAutentic"

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);


// Função para fazer logout
const useLogoutUser = () => {
    const { setUserName, setUserEmail, setUserId } = useAutentic();
    const signOutUser = async() => {
        try {
            await firebase.auth().signOut();
            console.log("Usuário desconectado com sucesso!");
            setUserEmail('');
            setUserId('');
            setUserName('');
        } catch (error) {
            console.error("Erro ao desconectar usuário:", error);
        }
    }
    return signOutUser
};

export { useLogoutUser }