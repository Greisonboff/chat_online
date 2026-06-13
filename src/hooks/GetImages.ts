import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { firebaseConfig } from '../firebase';


const ImageGallery = async () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // se já inicializado, use esse
    }

    // Referência para o Firebase Storage
    const storage = firebase.storage();
    const imagesRef = storage.ref().child('images_perfil');

    try {
      // Listar todos os arquivos na pasta de imagens
      const res = await imagesRef.listAll();
      const promises = res.items.map((itemRef) => itemRef.getDownloadURL());
      const urls = await Promise.all(promises);
      
      // Retorna as URLs das imagens
      return urls;
    } catch (error) {
      console.error('Erro ao obter URLs de download:', error);
      // Em caso de erro, você pode lançar uma exceção ou retornar um valor padrão
      throw error;
    }
};

export default ImageGallery;