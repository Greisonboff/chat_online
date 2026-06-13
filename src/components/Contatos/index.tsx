import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  query,
} from "firebase/firestore";
import { useContato } from "../../Use/useContato";
import { useAutentic } from "../../Use/useAutentic";
import { useLogoutUser } from "../../hooks/LogoutUser";
import ImageGallery from "../../hooks/GetImages";
import ImegeProfile from "./ImegeProfile";
import { GoKebabHorizontal } from "react-icons/go";
import Modal from "./ConfigProfile";
import { BiMessageRoundedAdd } from "react-icons/bi";
import playSound from "../../hooks/NotificationAudio";
import { useViewMobile } from "../../Use/useViewStateMobile";
import SkeletonContatos from "./Skeleton";
import Button from "@mui/joy/Button";

export default function Contatos() {
  const [users, setUsers] = useState<QueryDocumentSnapshot[]>([]);
  const { setContactUserId, setContactUserName, setContactUserImg } =
    useContato();
  const {
    userId,
    setOpenLogin,
    useUnreadMessages,
    setUseUnreadMessages,
    setUserImg,
  } = useAutentic();
  const deslogarUsuario = useLogoutUser();
  const [openConfig, setOpenConfig] = useState(false);
  const [orderByUsers, setOrderByUsers] = useState<QueryDocumentSnapshot[]>([]);
  const { setViewMobile } = useViewMobile();

  useEffect(() => {
    const collectionName = "projeto-chat_users";
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedUsers: QueryDocumentSnapshot[] = [];
      snapshot.forEach((doc) => {
        updatedUsers.push(doc);
      });
      setUsers(updatedUsers);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await deslogarUsuario();
    setOpenLogin(true);
  };

  //pega as imagens
  useEffect(() => {
    ImageGallery()
      .then((urls) => {
        const imgUser = urls.filter((item) =>
          item.toString().includes(userId.toString())
        )[0];
        if (imgUser) {
          setUserImg(imgUser);
        }
        setContactUserImg(urls);
        // Faça algo com as URLs das imagens
      })
      .catch((error) => {
        console.error("Erro ao obter URLs das imagens:", error);
      });
    return () => {
      setUserImg(null);
    };
  }, [setContactUserImg, setUserImg, userId]);

  useEffect(() => {
    if (users) {
      const a = users.filter((user) => user.id === userId);
      const b = users.filter((user) => user.id !== userId);
      const orderBy = [];
      orderBy.push(...a, ...b);
      setOrderByUsers(orderBy);

      let userFiltrado = users.find((user) => user.id === userId);
      if (userFiltrado) {
        const unread_messages = userFiltrado?.data()?.unread_messages;
        setUseUnreadMessages(unread_messages);
        orderBy.forEach((user) => {
          if (unread_messages?.includes(user.id) && user.id !== userId) {
            playSound();
          }
        });
      }
    }
  }, [users, userId, setUseUnreadMessages]);

  return (
    <div className="text-gray-200">
      <div className="h-10 flex items-center justify-between pr-4 pl-2">
        <Button
          variant="outlined"
          onClick={() => {
            handleLogout();
          }}
        >
          exit
        </Button>
        <GoKebabHorizontal
          onClick={() => setOpenConfig(true)}
          className="cursor-pointer"
          size={20}
        />
        {openConfig && <Modal onClose={() => setOpenConfig(false)} />}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center">
          <h1>user list:</h1>
        </div>
        <ul className="sm:h-[85vh] sm:overflow-y-auto">
          {orderByUsers?.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setContactUserId(user.data().userId);
                setContactUserName(user.data().userName);
                setViewMobile("mensagens");
              }}
              className="min-h-16 min-w-[190px] flex justify-between gap-4 border border-black rounded-lg mx-1 my-3 p-2 cursor-pointer hover:border-gray-400"
            >
              <div
                id={user.data().userId}
                className="flex items-center gap-2 w-full"
              >
                <div className="w-[5em] h-[5em]">
                  <div className="rounded-full overflow-hidden">
                    <ImegeProfile id={user.data().userId} />
                  </div>
                </div>
                <span>{user?.data()?.userName}</span>
              </div>
              <div className="flex items-center relative">
                {useUnreadMessages?.includes(user.id) && (
                  <>
                    <MessageCounter
                      useId={user.id}
                      useUnreadMessagesData={useUnreadMessages}
                    />
                    <BiMessageRoundedAdd
                      onClick={() => playSound()}
                      size={25}
                      color="green"
                    />
                  </>
                )}
              </div>
            </li>
          ))}
          {orderByUsers.length === 0 && (
            <>
              <SkeletonContatos />
              <SkeletonContatos />
              <SkeletonContatos />
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

function MessageCounter({
  useId,
  useUnreadMessagesData,
}: {
  useId: string;
  useUnreadMessagesData: string[];
}) {
  const count = useUnreadMessagesData.filter((value) => value === useId).length;

  if (count === 0) {
    return <></>;
  }
  return (
    <p className="text-[12px] absolute bottom-[25%] right-[85%]">{count}</p>
  );
}
