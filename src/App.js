import { useEffect, useState } from "react";

const LINK_FOR_TG = "https://t.me/share/url?url=";
const LINK = "https://t.me/moy_obraz";
const CHANEL_ID = "@moy_obraz";
const BACKEND_URL = "https://65b1e460ac6878b24552d09cd0d265f7.serveo.net";

const App = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [user, setUser] = useState(null);
  
  const GetUserAvatar = async () => {
    try {
      const id = user?.id;
      
      const resp = await fetch(
        `${BACKEND_URL}/api/user_avatar?user_id=${id}`,
      );
      const data = await resp.json();

      if(data.status === "success") setUserAvatar(data.photo_url);
    } catch(e) {
      console.error(e);
      alert("Произошла ошибка, при получении аватарки пользователя");
    };
  };

  const Share = () => {
    window.open(
      `${LINK_FOR_TG}${LINK}`, 
      "_blank",
    );
  };

  const Subscribe = () => {
    window.open(
      LINK, 
      "_blank",
    );
  };

  const CheckSubscribe = async () => {
    try {
      const id = user?.id;

      const resp = await fetch(
        `${BACKEND_URL}/api/check_subscribe?user_id=${id}&chat_id=${CHANEL_ID}`,
      );
      const data = await resp.json();

      if(data.status !== "success") throw new Error(data.msg);
      else if(data.is_subscribe) alert("Подписан");
      else alert("Не подписан");
    } catch(e) {
      console.error(e);
      alert("Произошла ошибка, при проверке подписки на канал");
    };
  };

  useEffect(() => {
    setUser(window.Telegram.WebApp.initDataUnsafe.user);
  }, []);

  useEffect(() => {
    GetUserAvatar();
  }, [user]);

  return (
    <div className="wrapper">
      <div className="block">
        <img 
          src={
            !userAvatar 
            ? "https://chpic.su/_data/stickers/a/Avatar_Airbender/Avatar_Airbender_043.webp" 
            : userAvatar
          }
          alt="User avatar" 
          className="block__img"
        />
        <p className="block__title">ID: {user?.id || "Not specified"}</p>
        <p className="block__title">Username: {user?.username || "Not specified"}</p>
        <p className="block__title">First Name: {user?.first_name || "Not specified"}</p>
        <p className="block__title">Last Name: {user?.last_name || "Not specified"}</p>
        <p className="block__title">Language: {user?.language_code || "Not specified"}</p>
      </div>


      <button 
        className="wrapper_btn"
        onClick={() => Share()}
      >
        Share
      </button>
      <button 
        className="wrapper_btn"
        onClick={() => Subscribe()}
      >
        Subscribe
      </button>
      <button 
        className="wrapper_btn"
        onClick={() => CheckSubscribe()}
      >
        Check
      </button>
    </div>
  );
};

export default App;
