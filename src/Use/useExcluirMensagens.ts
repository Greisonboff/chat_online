import { db } from '../firebase';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';

const excluirMensagens = async (userId: string, contactUserId: string) => {
    try {
        // Referência para a coleção que você deseja excluir
        const collectionRef = collection(db, 'projeto-chat_mensagens', userId, `mensagen-${contactUserId}`);

        // Obter todos os documentos dentro da coleção
        const querySnapshot = await getDocs(collectionRef);

        // Excluir todos os documentos dentro da coleção
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        // Depois de excluir todos os documentos, exclua a coleção
        if (collectionRef.parent) {
            await deleteDoc(collectionRef.parent);
        }

        console.log("Coleção excluída com sucesso.");
    } catch (error) {
        console.error("Erro ao excluir coleção:", error);
    }
};

export {excluirMensagens}
