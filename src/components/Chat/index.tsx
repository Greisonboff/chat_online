import FormChat from "../FormChat";
import Mensagens from "../Mensagens";
import Contatos from "../Contatos";
import { useContato } from "../../Use/useContato";
import SplashScreen from "../SplashScreen";
import { useViewMobile } from "../../Use/useViewStateMobile";
import { useMediaQuery } from "react-responsive";

export default function Chat() {
  const { contactUserName } = useContato();
  const { viewMobile } = useViewMobile();

  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <div className="w-full flex min-h-[100vh] p-4 bg-[#1c1c1c] overflow-hidden">
      {(viewMobile === "contato" || !isMobile) && (
        <div className="w-full sm:w-[25%] h-[90vh]">
          <Contatos />
        </div>
      )}
      {(viewMobile === "mensagens" || !isMobile) && (
        <div className="w-full sm:w-[75%] h-[90vh] flex items-center flex-col">
          {!contactUserName ? (
            <SplashScreen />
          ) : (
            <>
              <Mensagens />
              <FormChat />
            </>
          )}
        </div>
      )}
    </div>
  );
}
