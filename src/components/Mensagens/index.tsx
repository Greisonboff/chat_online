import React, { useEffect, useState, useRef, useCallback } from "react";
import { db } from "../../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { DocumentData } from "@firebase/firestore-types";
import { useAutentic } from "../../Use/useAutentic";
import { useContato } from "../../Use/useContato";
import { IoWarningOutline } from "react-icons/io5";
import ImegeProfile from "../Contatos/ImegeProfile";
import { updateUnreadMessages } from "../../hooks/CreateUser";
import { excluirMensagens } from "../../Use/useExcluirMensagens";
import Button from "@mui/joy/Button";
import { VscKebabVertical } from "react-icons/vsc";
import { IoIosReturnLeft } from "react-icons/io";
import { useViewMobile } from "../../Use/useViewStateMobile";
interface Time {
  seconds: number;
  nanoseconds: number;
}

type UnsubscribeType = (() => void) | null;

export default function Mensagens() {
  const { userId, useUnreadMessages } = useAutentic();
  const [dados, setDados] = useState<DocumentData[]>([]);
  const { contactUserId, contactUserName } = useContato();
  const unsubscribeRef: React.MutableRefObject<UnsubscribeType> = useRef(null);
  const menuUserRef = useRef<HTMLDivElement>(null);
  const menuUserRefSate = useRef(true);
  const { setViewMobile } = useViewMobile();

  const fetchDados = useCallback(async () => {
    const collectionData = collection(
      db,
      "projeto-chat_mensagens",
      userId,
      `mensagen-${contactUserId}`
    );
    const q = query(collectionData, orderBy("time"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dadosArray = snapshot.docs.map((doc) => ({
        data: doc.data(),
      }));
      setDados(dadosArray);
    });
    unsubscribeRef.current = unsubscribe;
    return unsubscribe;
  }, [userId, contactUserId]);

  useEffect(() => {
    if (userId && userId !== "" && contactUserId && contactUserId !== "") {
      fetchDados();
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      menuUserRefSate.current = true;
      if (menuUserRef.current) menuUserRef.current.style.display = "none";
    };
  }, [userId, contactUserId, fetchDados]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Função para manter o scroll para baixo
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    // Chama a função após renderizar para garantir que o scroll esteja sempre no final
    scrollToBottom();
  }, [dados]);

  useEffect(() => {
    if (useUnreadMessages.includes(contactUserId)) {
      const filterUnreadMessages = useUnreadMessages.filter(
        (user) => user !== contactUserId
      );
      updateUnreadMessages(filterUnreadMessages, userId);
    }
  }, [useUnreadMessages, contactUserId, userId]);

  const currentDate = new Date();

  const dia = currentDate.getDate().toString().padStart(2, "0");
  const mes = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const ano = currentDate.getFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;

  let completHour = "";
  let completDay = "";

  function convertData(e: Time) {
    if (e?.seconds) {
      const date = new Date(e.seconds * 1000);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth() + 1; // Meses começam em 0 (janeiro) e vão até 11 (dezembro)
      const year = date.getFullYear();

      completHour = `${hour < 10 ? `0${hour}` : hour}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;
      completDay = `${day < 10 ? `0${day}` : day}/${
        month < 10 ? `0${month}` : month
      }/${year}`;

      if (dataFormatada === completDay) {
        completDay = "today";
      }
      return completDay;
    }
  }

  function verifyUserMsg(e: string) {
    return e === userId;
  }

  let isFirstMsg = 0;
  function verifyUserMsgFirst(e: number) {
    if (isFirstMsg !== e) {
      isFirstMsg = e;
      return true;
    } else {
      return false;
    }
  }

  const deletMsg = () => {
    excluirMensagens(userId, contactUserId);
  };

  const openMenuUser = () => {
    if (menuUserRef.current)
      menuUserRef.current.style.display = menuUserRefSate.current
        ? "block"
        : "none";
    menuUserRefSate.current = !menuUserRefSate.current;
  };

  return (
    <div className="flex rounded-lg gap-4 flex-col h-[90%] w-full overflow-y-auto bg-slate-100">
      {contactUserName && (
        <div className="w-full h-50 bg-white flex justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <IoIosReturnLeft
                size={35}
                color="black"
                onClick={() => {
                  setViewMobile("contato");
                }}
              />
            </div>
            <div className="w-[5em] h-[5em]">
              <div className="rounded-full overflow-hidden">
                <ImegeProfile id={contactUserId} />
              </div>
            </div>
            <p className="text-lg">{contactUserName}</p>
          </div>
          <div className="flex items-center">
            <div ref={menuUserRef} className="hidden">
              <Button variant="soft" className="text-sm" onClick={deletMsg}>
                delete messages
              </Button>
            </div>
            <VscKebabVertical
              onClick={openMenuUser}
              className="cursor-pointer"
              size={20}
            />
          </div>
        </div>
      )}
      <div ref={chatContainerRef} className="py-2 overflow-auto max-h-[75vh]">
        {dados.map((item, index) => (
          <div key={index}>
            {item.data?.time && completDay !== convertData(item.data?.time) && (
              <>
                <div className="flex justify-center">{completDay}</div>
                <hr className="p-1" />
              </>
            )}
            <div
              className={`flex pb-1 ${
                verifyUserMsg(item.data.userId)
                  ? `justify-end ${
                      verifyUserMsgFirst(item.data.userId)
                        ? "firist-message-column-right pl-[24px]"
                        : "px-[24px]"
                    }`
                  : `${
                      verifyUserMsgFirst(item.data.userId)
                        ? "firist-message-column-left pr-[24px]"
                        : "px-[24px]"
                    }`
              }`}
            >
              <div
                className={`rounded-xl p-2 border ${
                  verifyUserMsg(item.data.userId)
                    ? "bg-[#a1da87]"
                    : "bg-[#e3f5e0]"
                }`}
              >
                <div className=" flex justify-end">
                  <p className="text-sm rounded-lg bg-slate-200 px-1 flex justify-center">
                    {completHour}
                  </p>
                </div>
                <div className="p-1">
                  <p className=" w-full">{item.data.texto}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!dados.length && (
        <div
          className="flex flex-col items-center justify-center h-full"
          data-mensage="true"
        >
          <div className="flex gap-1 items-center border rounded-xl py-2 px-4 bg-[#c0e3af] font-semibold text-2xl">
            <IoWarningOutline />
            No message sent
          </div>
        </div>
      )}
    </div>
  );
}
