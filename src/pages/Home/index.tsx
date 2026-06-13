import { useEffect } from "react";
import Auth from "../../components/Autenticacao";
import Chat from "../../components/Chat";
import { useAutentic } from "../../Use/useAutentic";
import { validateAuth } from "../../hooks/IsAuth";
import LoadModal from "../../components/LoadModal";
import { useLoad } from "../../Use/useLoad";

export default function Home() {
  const { isAuth, setIsAuth, setUserId, setUserName, openLogin } =
    useAutentic();
  const { isLoad, setIsLoad } = useLoad();

  useEffect(() => {
    setIsLoad(true);
    validateAuth()
      .then((isAuthenticated) => {
        if (isAuthenticated) {
          setIsAuth(true);
          setUserId(isAuthenticated?.uid);
          setUserName(isAuthenticated?.displayName ?? "");
        } else {
          setIsAuth(false);
          setUserId("");
          setUserName("");
        }
        setIsLoad(false);
      })
      .catch((error) => {
        console.error(
          "Ocorreu um erro durante a validação da autenticação:",
          error
        );
        setIsLoad(false);
      });
  }, [setIsAuth, setUserId, setUserName, setIsLoad]);

  return (
    <div>
      {isLoad === true && <LoadModal />}
      {openLogin || !isAuth ? <Auth /> : null}
      {!openLogin && isAuth ? <Chat /> : null}
    </div>
  );
}
