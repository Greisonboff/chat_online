import React, { useState, useRef } from "react";
import ImegeProfile from "./ImegeProfile";
import { useAutentic } from "../../Use/useAutentic";
import { MdOutlinePhotoCamera } from "react-icons/md";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { firebaseConfig } from "../../firebase";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { FaPencil } from "react-icons/fa6";
import { getAuth, updateProfile } from "firebase/auth";
import { createUser } from "../../hooks/CreateUser";
import Alert from "@mui/joy/Alert";
import { FaUserCircle } from "react-icons/fa";
import { useContato } from "../../Use/useContato";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

interface UploadStatus {
  active: boolean;
  text: string;
  type: "danger" | "success";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { userId, userName, setUserName, setUserImg } = useAutentic();
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    active: false,
    text: "",
    type: "danger",
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const { contactUserName, setContactUserName } = useContato();

  const storage = firebase.storage();
  const storageRef = storage.ref();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Tempo de animação do modal em milissegundos
  };

  // Função para lidar com a seleção de arquivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === "string") {
            setImageSrc(result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const toSave = () => {
    const promises = [];
    // Obtém a instância do Auth
    const auth = getAuth();

    // Obtém o usuário atual
    const user = auth.currentUser;
    if (user) {
      const newName =
        inputNameRef.current?.firstChild instanceof HTMLInputElement
          ? inputNameRef.current?.firstChild.value
          : undefined;

      if (newName !== undefined && newName !== "") {
        // Atualiza as informações do usuário
        promises.push(
          updateProfile(user, {
            displayName: newName,
          })
        );
        createUser({ userName: newName, userId: userId });
      }

      if (selectedFile) {
        const fileRef = storageRef.child("images_perfil/" + userId);
        if (fileRef) {
          promises.push(fileRef.put(selectedFile));
        }
      }

      Promise.all(promises)
        .then(() => {
          // Todas as Promises foram resolvidas com sucesso
          setUploadStatus({
            active: true,
            text: `Your account was updated.`,
            type: "success",
          });
          if (selectedFile && imageSrc) {
            setUserImg(imageSrc);
          }
          if (newName !== undefined && newName !== "") {
            setUserName(newName);
            if (userName === contactUserName) {
              setContactUserName(newName);
            }
          }
          // Execute qualquer lógica adicional aqui, se necessário
        })
        .catch((error) => {
          // Um erro ocorreu em pelo menos uma das Promises
          console.error("Erro ao executar uma ou mais operações:", error);
          setUploadStatus({
            active: true,
            text: "Error account not updated.",
            type: "danger",
          });
        });
    }
  };

  const clearUploadStatus = () => {
    setUploadStatus({
      active: false,
      text: "Error account not updated.",
      type: "danger",
    });
  };

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${
        isClosing ? "opacity-0" : ""
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="relative z-10 bg-white rounded-lg overflow-hidden">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-8 w-[90vw] md:w-[50vw] md:max-w-[600px] text-slate-200 bg-[#1c1c1c] flex flex-col items-center">
            <div className="flex gap-[5%] w-full justify-center flex-wrap">
              <div
                className="inline-block cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] rounded-full absolute overflow-hidden">
                  {imageSrc ? (
                    <ImegeProfile
                      src={imageSrc}
                      clasName="w-auto h-auto text-[200px] absolute"
                    />
                  ) : (
                    <ImegeProfile
                      id={userId}
                      clasName="w-auto h-auto text-[200px] absolute"
                    />
                  )}
                </div>

                <div className=" text-black w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] rounded-full relative flex justify-end sm:justify-center flex-col items-end sm:items-center sm:bg-white sm:bg-opacity-70 z-10 opacity-1 sm:opacity-0 sm:hover:opacity-100">
                  <MdOutlinePhotoCamera
                    size={30}
                    className="bg-white sm:bg-transparent rounded-md"
                  />
                  <p className="font-semibold text-center hidden sm:flex">
                    Change profile photo
                  </p>
                </div>
                <input
                  ref={inputRef}
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex flex-col justify-center gap-2">
                <p className="text-lg">Your name</p>
                <Input
                  className="text-black"
                  ref={inputNameRef}
                  placeholder={userName}
                  variant="soft"
                  size="md"
                  endDecorator={<FaPencil />}
                />
              </div>
            </div>
            <div className="flex justify-center flex-col items-center h-[50px] m-6 gap-2">
              {uploadStatus.active ? (
                <Alert
                  size="md"
                  startDecorator={<FaUserCircle size={25} />}
                  endDecorator={
                    <Button
                      onClick={() => clearUploadStatus()}
                      size="sm"
                      variant="solid"
                      color={uploadStatus.type}
                    >
                      Close
                    </Button>
                  }
                  variant="outlined"
                >
                  {uploadStatus.text}
                </Alert>
              ) : (
                <Button onClick={toSave} variant="soft" size="lg">
                  To save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
