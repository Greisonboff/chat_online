import { doc, setDoc, collection, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type CreateUser = {
  userName: string;
  userId: string;
};

const collectionName = "projeto-chat_users";
const collectionData = collection(db, collectionName);
const createUser = ({ userName, userId }: CreateUser) => {
  const userRef = doc(collectionData, userId);
  setDoc(userRef, {
    userName: userName,
    userId: userId,
    unread_messages: [],
  })
    .then(() => {})
    .catch((error) => {
      console.error("Erro createUser:", error);
    });
};

const getUser = (userId: string) => {
  const ref = doc(collectionData, userId);
  getDoc(ref)
    .then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Dados do documento encontrado");
      } else {
        console.log("Documento não encontrado!");
      }
    })
    .catch((error) => {
      console.error("Erro setNewMsgUser:", error);
    });
};

const setUpdateDoc = (ref: any, userIds: string[]) => {
  updateDoc(ref, {
    unread_messages: userIds,
  })
    .then(() => {})
    .catch((error) => {
      console.error("Erro setNewMsgUser:", error);
    });
};

const setNewMsgUser = (userId: string, contactUserId: string) => {
  const ref = doc(collectionData, contactUserId);
  getDoc(ref)
    .then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Dados do documento:", docSnap.data().unread_messages);
        let data = [...docSnap.data().unread_messages, userId];
        setUpdateDoc(ref, data);
      } else {
        console.log("Documento não encontrado!");
      }
    })
    .catch((error) => {
      console.error("Erro setNewMsgUser:", error);
    });
};

const updateUnreadMessages = (users: string[], userId: string) => {
  const ref = doc(collectionData, userId);
  updateDoc(ref, {
    unread_messages: users,
  })
    .then(() => {
      console.log("updateUnreadMessages com sucesso!");
    })
    .catch((error) => {
      console.error("Erro updateUnreadMessages:", error);
    });
};
export { createUser, setNewMsgUser, getUser, updateUnreadMessages };
