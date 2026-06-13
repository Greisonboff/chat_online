import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "../../firebase";
import { useAutentic } from "../../Use/useAutentic";
import background from "../../assets/background.jpg";
import { createUser } from "../../hooks/CreateUser";
import { useLoad } from "../../Use/useLoad";
const Auth = () => {
  // Inicialize o Firebase
  firebase.initializeApp(firebaseConfig);

  const {
    userEmail,
    setUserName,
    setUserEmail,
    setUserId,
    setOpenLogin,
    setIsAuth,
  } = useAutentic();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [viewCadastro, setViewCadastro] = useState(false);
  const { setIsLoad } = useLoad();

  // Função para registrar um novo usuário
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoad(true);
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const user = userCredential.user;

      if (user) {
        user.updateProfile({
          displayName: name,
        });
        setUserName(name);
        setUserEmail(email);
        setUserId(user.uid);
        setErroLogin("");
        createUser({ userName: name, userId: user.uid });
        setIsAuth(true);
        setIsLoad(false);
        setOpenLogin(false);
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setErroLogin("registrar");
      setIsLoad(false);
      setIsAuth(false);
    }
  };

  // Função para fazer login com e-mail/senha
  const loginUser = async (email: string, password: string) => {
    try {
      setIsLoad(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);

      const user = firebase.auth().currentUser;
      if (user) {
        if (user.displayName) setUserName(user.displayName);
        if (user.email) setUserEmail(user.email);
        setUserId(user.uid);
        setErroLogin("");
        setOpenLogin(false);
        setIsAuth(true);
        setIsLoad(false);
      } else {
        console.error(
          "Usuário não autenticado após signInWithEmailAndPassword"
        );
        setUserEmail("");
        setUserId("");
        setErroLogin("login");
        setIsAuth(false);
        setIsLoad(false);
      }
      setUserEmail(email);
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      setUserEmail("");
      setErroLogin("login");
      setIsLoad(false);
    }
  };

  const handleRegister = () => {
    if (name !== "" && email !== "" && password !== "") {
      registerUser(name, email, password);
    }
  };

  const handleLogin = () => {
    if (email !== "" && password !== "") {
      loginUser(email, password);
    }
  };

  useEffect(() => {
    setErroLogin("");
    setIsLoad(false);
  }, [viewCadastro, setIsLoad]);

  return (
    <>
      {!userEmail && (
        <div
          className="flex items-center justify-center min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl">
            <h1 className="text-lg font-semibold text-center">
              Welcome to Dialogue
            </h1>
            <form
              id="login-form"
              className="max-w-md mx-auto space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              {viewCadastro && (
                <div>
                  <label className="block py-1">Your name</label>
                  <input
                    type="text"
                    className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-sm mt-2 px-2 hidden text-gray-600">
                    Text helper
                  </p>
                </div>
              )}
              <div>
                <label className="block py-1">Your email</label>
                <input
                  type="email"
                  className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm mt-2 px-2 hidden text-gray-600">
                  Text helper
                </p>
              </div>
              <div>
                <label className="block py-1">Password</label>
                <input
                  type="password"
                  className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-3 items-center">
                {viewCadastro ? (
                  <button
                    className="w-full border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300"
                    onClick={handleRegister}
                  >
                    Registrar
                  </button>
                ) : (
                  <button
                    className="w-full border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between flex-col-reverse sm:flex-row">
                <button
                  className="px-4 py-2 border border-transparent hover:border-indigo-600 rounded-lg"
                  onClick={() => setViewCadastro(!viewCadastro)}
                >
                  {viewCadastro ? (
                    <>Login your account</>
                  ) : (
                    <>Create your account</>
                  )}
                </button>
                {erroLogin && (
                  <div className="bg-red-200 rounded-lg px-4 py-2">
                    <span className="text-red-500">
                      Erro ao realizar de {erroLogin}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Auth;
