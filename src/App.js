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
import {API_BASE_URL} from './helpers/api';
import QRCode from 'qrcode.react';
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
      const isMobileDevice = /android|iPad|iPhone|iPod/.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
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
          await addFriend(user.id, refererId);
        }
        if (user) {
          setUserData(user);
          sendUserIdToTelegram(user.id);
        } else {
          const defaultUser = {
            username: "bogdan_krvsk",
            id: 874423521,
            is_premium: true
          };
          setUserData(defaultUser);
          sendUserIdToTelegram(defaultUser.id);
        }
      } else {
        const defaultUser = {
          username: "bogdan_krvsk",
          id: 874423521,
          is_premium: true
        };
        setUserData(defaultUser);
        sendUserIdToTelegram(defaultUser.id);
      }
    };

    const addFriend = async (telegramId, refererId) => {
      try {
        console.log(`Adding friend with telegramId: ${telegramId}, refererId: ${refererId}`);
        const response = await axios.post(`${API_BASE_URL}/add_friend/`, {
          telegram_id: telegramId,
          second_telegram_id: refererId
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

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (!isMobile) {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Leave to mobile!</h1>
          <QRCode value={window.location.href} />
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
            <Route path="/last_check" element={<LastPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/invite" element={<InviteFriends telegramId={userData.id}/>} />
            <Route path="/game" element={<Game telegram_Id={userData.id}/>} />
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
