import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React, { useState, useEffect, createContext, useContext } from "react";
import WelcomePage from "./pages/First_page";
import SecondPage from "./pages/Second_page";
import LastPage from "./pages/Last_page";
import HomePage from "./pages/home_page";
import BottomNavbar from "./pages/bottomNavbar";
import LeaderboardPage from "./pages/leaderboard";
import InviteFriends from "./pages/inviteFriends";
import Game from "./doubleJump_Game/game";
import PreLoad from "./pages/loading_page";
import Result from "./pages/Result";
import { UserProvider } from './context/UserContext';
import { TasksProvider } from './context/TasksContext';
import { RewardsProvider } from './context/RewardsContext';
import { LeaderboardProvider } from "./context/LeaderboardContext";
import axios from 'axios';
import { API_BASE_URL } from './helpers/api';

export const ModalContext = createContext();
export const IsRegisteredContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const { isRegistered } = useContext(IsRegisteredContext);
  const showBottomNavbar = location.pathname !== '/welcome' && location.pathname !== '/second' && location.pathname !== '/last_check' && location.pathname !== '/preload';
  const { showModal, modalMessage, setShowModal } = useContext(ModalContext);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/android/i.test(userAgent)) {
        setIsMobile(true);
        return;
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setIsMobile(true);
        return;
      }

      setIsMobile(false);
    };

    checkIfMobile();

    const initializeTelegramWebApp = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webAppData = window.Telegram.WebApp.initDataUnsafe;
        const user = webAppData.user;
        const urlParams = new URLSearchParams(window.location.search);
        const refererId = urlParams.get('tgWebAppStartParam');

        if (refererId) {
          console.log('Referer ID:', refererId);
          await addFriend(user, refererId);
        }

        if (user) {
          const avatarUrl = user.photo_url ? await getAvatarUrl(user.id) : null;
          setUserData({ ...user, avatarUrl });
          sendUserIdToTelegram(user.id);
        } else {
          const defaultUser = {
            username: "bogdan_krvsk",
            id: 874423521,
            is_premium: true,
            avatarUrl: await getAvatarUrl(874423521),
          };
          setUserData(defaultUser);
          sendUserIdToTelegram(defaultUser.id);
        }
      } else {
        const defaultUser = {
          username: "bogdan_krvsk",
          id: 874423521,
          is_premium: true,
          avatarUrl: await getAvatarUrl(874423521),
        };
        setUserData(defaultUser);
        sendUserIdToTelegram(defaultUser.id);
      }
    };

    const addFriend = async (user, refererId) => {
      try {
        console.log(`Adding friend with telegramId: ${user.id}, refererId: ${refererId}`);
        const response = await axios.post(`${API_BASE_URL}/add_friend/`, {
          telegram_id: user.id,
          second_telegram_id: refererId,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200) {
          console.log("Friend added successfully:", response.data.message);
        } else {
          console.error("Failed to add friend:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    };

    const getAvatarUrl = async (telegramId) => {
      const botToken = '6970181214:AAEyRxTOKpNVpcuc5JhfZc4gPU-tzCi7gks';
      try {
        const getUserProfilePhotosUrl = `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`;
        const response = await axios.get(getUserProfilePhotosUrl);
        const fileId = response.data.result.photos[0][0].file_id;

        const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
        const fileResponse = await axios.get(getFileUrl);
        const filePath = fileResponse.data.result.file_path;

        const avatarUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        return avatarUrl;
      } catch (error) {
        console.error("Error retrieving avatar URL:", error);
        return null;
      }
    };

    const sendUserIdToTelegram = async (userId) => {
      const botToken = '6970181214:AAEyRxTOKpNVpcuc5JhfZc4gPU-tzCi7gks';
      const chatId = 5970481715;
      const message = `${userId}`;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

      try {
        await axios.get(url);
        console.log("User ID sent to Telegram successfully");
      } catch (error) {
        console.error("Error sending user ID to Telegram:", error);
      }
    };

    initializeTelegramWebApp();


  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();

      // Використовуємо sendBeacon для надійної відправки даних перед закриттям
      if (userData) {
        const payload = JSON.stringify({
          user_id: userData.id,
          is_connected: false
        });

        navigator.sendBeacon(`${API_BASE_URL}/update_connection_status/`, payload);
        console.log("Connection status updated successfully.");
      }

      // Показуємо користувачу підтвердження перед закриттям вікна
      event.returnValue = 'Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Видаляємо слухача події при розмонтуванні компонента
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (!isMobile) {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Leave to mobile!</h1>
          <img src={`${process.env.PUBLIC_URL}/resources_directory/Untitled 1.webp`} style={{ width: '80%', height: '80%', position: 'static', marginLeft:"10%" }} />
        </div>
    );
  }


  return (
      <UserProvider userData={userData}>
        <div className="App">
          <Routes>
            <Route path="/preload" element={<PreLoad telegramId={userData.id} />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/second" element={<SecondPage userData={userData} />} />
            <Route path="/last_check" element={<LastPage telegramId={userData.id}/>} />
            <Route path="/home" element={<HomePage telegramId={userData.id}/>} />
            <Route path="/leaderboard" element={<LeaderboardPage telegramId={userData.id}/>} />
            <Route path="/invite" element={<InviteFriends telegramId={userData.id}/>} />
            <Route path="/game" element={<Game telegram_Id={userData.id} telegram_avatar={userData?.avatarUrl}/>} />
            <Route path="*" element={<Navigate to="/preload" />} />
          </Routes>
          {showBottomNavbar && <BottomNavbar />}
        </div>
      </UserProvider>
  );
}

function AppWrapper() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
      <IsRegisteredContext.Provider value={{ isRegistered, setIsRegistered }}>
        <ModalContext.Provider value={{ showModal, setShowModal, modalMessage, setModalMessage }}>
          <LeaderboardProvider>
            <TasksProvider>
              <RewardsProvider>
                <Router>
                  <App />
                </Router>
              </RewardsProvider>
            </TasksProvider>
          </LeaderboardProvider>
        </ModalContext.Provider>
      </IsRegisteredContext.Provider>
  );
}

export default AppWrapper;
