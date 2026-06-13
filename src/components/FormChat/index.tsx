import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRef } from "react";
import Button from "@mui/joy/Button";
import { useAutentic } from "../../Use/useAutentic";
import { useContato } from "../../Use/useContato";
import { setNewMsgUser } from "../../hooks/CreateUser";
import { BsSend } from "react-icons/bs";

export default function FormChat() {
  const { userName, userId } = useAutentic();
  const { contactUserId } = useContato();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function writeUserData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let valor = textareaRef.current?.value;

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    if (!valor && valor?.trim() === "") {
      return;
    }

    try {
      const newCollectionRef = collection(
        db,
        "projeto-chat_mensagens",
        userId,
        `mensagen-${contactUserId}`
      );
      const newCollectionRefPara = collection(
        db,
        "projeto-chat_mensagens",
        contactUserId,
        `mensagen-${userId}`
      );
      setNewMsgUser(userId, contactUserId);
      addDoc(newCollectionRef, {
        userName: userName,
        userId: userId,
        texto: valor,
        time: serverTimestamp(),
      })
        .then((docRef) => {})
        .catch((error) => {
          console.error("Erro ao adicionar documento:", error);
        });
      if (userId === contactUserId) return;

      addDoc(newCollectionRefPara, {
        userName: userName,
        userId: userId,
        texto: valor,
        time: serverTimestamp(),
      })
        .then((docRef) => {})
        .catch((error) => {
          console.error("Erro ao adicionar documento:", error);
        });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={writeUserData}
        className="flex gap-2 w-full pt-3 h-[10%]"
      >
        <textarea
          ref={textareaRef}
          onKeyDown={(event) => {
            // Verifica se a tecla pressionada é "Enter" (código 13)
            if (event.keyCode === 13) {
              event.preventDefault();
              if (formRef.current) {
                formRef.current.dispatchEvent(
                  new Event("submit", {
                    bubbles: true, // Garante que o evento se propague
                    cancelable: true, // Permite que o evento seja cancelado
                  })
                );
              }
            }
          }}
          placeholder="..."
          className="h-auto p-2 rounded-lg border border-gray-900 w-full resize-none"
        />
        <Button type="submit" variant="outlined">
          <BsSend size={25} />
        </Button>
      </form>
    </>
  );
}
