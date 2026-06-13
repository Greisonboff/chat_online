import { useAutentic } from "../../Use/useAutentic";
import { useContato } from "../../Use/useContato";
import { PiUserCircleLight } from "react-icons/pi";

type Prop = {
  id?: string;
  clasName?: string;
  src?: string;
};

export default function ImegeProfile({ id, clasName, src }: Prop) {
  const { userId, userImg } = useAutentic();

  const { contactUserImg } = useContato();

  const image = id
    ? contactUserImg.filter((item) =>
        item.toString().includes(id.toString())
      )[0]
    : src;

  if (id === userId && userImg) {
    return (
      <img
        className={`${clasName ? clasName : "w-[5em] h-[5em]"}`}
        src={userImg}
        alt="profile state"
      />
    );
  }

  if (image) {
    return (
      <img
        className={`${clasName ? clasName : "w-[5em] h-[5em]"}`}
        src={image}
        alt="profile"
      />
    );
  }

  return (
    <PiUserCircleLight className={`${clasName ? clasName : "text-[5em]"}`} />
  );
}
