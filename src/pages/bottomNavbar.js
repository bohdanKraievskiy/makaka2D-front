// src/components/BottomNavbar.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/BottomNavbar.css"; // Подключение CSS файла для стилей

const BottomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Получаем текущий путь

    // Функция для проверки, активна ли вкладка
    const isActive = (path) => location.pathname === path;

    return (
        <div className="_navbar_1cr97_7">
            <div
                className={`_navbarItem_1cr97_20 ${isActive("/home") ? "_isActive_1cr97_41" : ""}`}
                onClick={() => {
                    navigate("/home")
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M4 11.4522V16.8002C4 17.9203 4 18.4807 4.21799 18.9086C4.40973 19.2849 4.71547 19.5906 5.0918 19.7823C5.5192 20.0001 6.07899 20.0001 7.19691 20.0001H16.8031C17.921 20.0001 18.48 20.0001 18.9074 19.7823C19.2837 19.5906 19.5905 19.2849 19.7822 18.9086C20 18.4811 20 17.9216 20 16.8037V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522Z"
                        stroke="#A6A6A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
                <div className="_navbarItemTitle_1cr97_29">Home</div>
            </div>

            <div
                className={`_navbarItem_1cr97_20 ${isActive("/game") ? "_isActive_1cr97_41" : ""}`}
                onClick={() => {
                    navigate("/game")
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                }}
            >
                <svg width="24" height="24" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.5 5.75V3.85C10.5 3.59804 10.6001 3.35641 10.7782 3.17825C10.9564 3.00009 11.198 2.9 11.45 2.9C11.702 2.9 11.9436 2.79991 12.1218 2.62175C12.2999 2.44359 12.4 2.20196 12.4 1.95V1M8.6 14.3L7.175 12.875M7.175 12.875L5.75 11.45M7.175 12.875L5.75 14.3M7.175 12.875L8.6 11.45M15.25 13.825V11.925M1 12.875C1 9.75235 1 8.19055 1.8626 7.1389C2.02039 6.94667 2.19667 6.77039 2.3889 6.6126C3.4415 5.75 5.0014 5.75 8.125 5.75H12.875C15.9986 5.75 17.5594 5.75 18.6111 6.6126C18.8033 6.77039 18.9796 6.94667 19.1374 7.1389C20 8.1915 20 9.7514 20 12.875C20 15.9986 20 17.5594 19.1374 18.6111C18.9796 18.8033 18.8033 18.9796 18.6111 19.1374C17.5585 20 15.9986 20 12.875 20H8.125C5.00235 20 3.44055 20 2.3889 19.1374C2.19667 18.9796 2.02039 18.8033 1.8626 18.6111C1 17.5585 1 15.9986 1 12.875Z"
                        stroke="#909090" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <div className="_navbarItemTitle_1cr97_29">Game</div>
            </div>

            <div
                className={`_navbarItem_1cr97_20 ${isActive("/leaderboard") ? "_isActive_1cr97_41" : ""}`}
                onClick={() => {
                    navigate("/leaderboard")
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8"
                        stroke="#A6A6A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
                <div className="_navbarItemTitle_1cr97_29">Leaderboard</div>
            </div>

            <div
                className={`_navbarItem_1cr97_20 ${isActive("/invite") ? "_isActive_1cr97_41" : ""}`}
                onClick={() => {
                    navigate("/invite")
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M21 19.9999C21 18.2583 19.3304 16.7767 17 16.2275M15 20C15 17.7909 12.3137 16 9 16C5.68629 16 3 17.7909 3 20M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5M9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13Z"
                        stroke="#A6A6A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
                <div className="_navbarItemTitle_1cr97_29">Friends</div>
            </div>
        </div>
    );
};

export default BottomNavbar;
