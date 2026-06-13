import { Howl} from 'howler';
const soundFile = require('../assets/audio/multi-pop.mp3');

  const playSound = () => {
    const sound = new Howl({
      src: [soundFile]
    });
    sound.play();
  };

export default playSound;
