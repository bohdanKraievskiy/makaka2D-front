import React, { useState, useContext, useEffect } from 'react';
import { TasksContext } from '../../context/TasksContext';
import '../../Styles/mainStyles.css'; // Підключення стилів для кнопки
import axios from 'axios';
import { UserContext } from "../../context/UserContext";
import { RewardsContext } from "../../context/RewardsContext";
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
import { API_BASE_URL } from '../../helpers/api';

const TaskItem = ({ title, footerText, url, index, setAnimated }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const { setShowModal, setModalMessage } = useContext(ModalContext);
    const { completeTask } = useContext(TasksContext);
    const { user, setUser, updateUserBalance } = useContext(UserContext);
    const { rewards, setRewards } = useContext(RewardsContext);
    const history = useNavigate();
    const taskDuration = 86400000; // 24 hours in milliseconds

    // Unique keys for localStorage
    const storageKey = `task-${index}-checked`;
    const startTimeKey = `task-${index}-startTime`;

    // Retrieve isChecked state and startTime from localStorage on component mount
    useEffect(() => {
        const storedCheckedState = localStorage.getItem(storageKey);
        const storedStartTime = localStorage.getItem(startTimeKey);

        if (storedCheckedState !== null) {
            setIsChecked(JSON.parse(storedCheckedState));
        }

        if (storedStartTime) {
            const elapsedTime = Date.now() - parseInt(storedStartTime, 10);
            if (elapsedTime >= taskDuration) {
                // If the time limit is exceeded, reset the task
                setIsChecked(false);
                setTimerExpired(true);
                localStorage.removeItem(storageKey);
                localStorage.removeItem(startTimeKey);
            } else {
                // If not yet expired, start the timer
                const remainingTime = taskDuration - elapsedTime;
                setTimeout(() => {
                    setIsChecked(false);
                    setTimerExpired(true);
                    localStorage.removeItem(storageKey);
                    localStorage.removeItem(startTimeKey);
                }, remainingTime);
            }
        }
    }, [storageKey, startTimeKey]);

    const handleShowModal = () => {
        setModalMessage("Time expired. Start the task again.");
        setShowModal(true);
    };

    const verifyTask = async (telegramId, taskTitle, reward) => {
        try {
            const rewardValue = parseInt(reward.replace('+', ''), 10);
            const response = await axios.post(`${API_BASE_URL}/tasks/verify/`, {
                telegram_id: telegramId,
                task: taskTitle,
                reward: rewardValue,
                username:user.username
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.status === "success") {
                window.scrollTo({top: 0, behavior: 'smooth'});
                const updatedBalance = user.balance + rewardValue;
                updateUserBalance(updatedBalance);
                setRewards(prevRewards => ({
                    ...prevRewards,
                    tasks: prevRewards.tasks + rewardValue,
                    total: prevRewards.total + rewardValue
                }));
                completeTask(index);
                setAnimated(true);
            } else {
                // Handle task expired or not started yet
                console.error("Task failed:", response.data.message);
                setIsChecked(false);
                localStorage.removeItem(storageKey);  // Remove key from localStorage
                localStorage.removeItem(startTimeKey);
                handleShowModal();
            }
        } catch (error) {
            console.error("Error verifying task:", error);
            handleShowModal();
        }
    };


    const handleButtonClick = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');


            if (!isChecked) {
                if(url) {
                    window.open(url, '_blank');
                }
                setIsChecked(true);
                localStorage.setItem(storageKey, true);
                localStorage.setItem(startTimeKey, Date.now().toString());
            } else {
                verifyTask(user.telegram_id, title, footerText);
            }

    };
    const renderSVG = (title) => {

        if (title.includes("channel")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>

            );
        } else if (title.includes("friends")) {
            return (
                <svg fill="#ffffff" viewBox="-9 -3 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg"
                     stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"><title>friend</title>
                        <path
                            d="M17.25 20.5c1.281 0.719 2 1.906 1.875 3.125-0.063 0.75-0.031 0.75-1 0.875-0.594 0.063-4.375 0.094-8.219 0.094-4.375 0-8.938-0.031-9.281-0.125-1.281-0.344-0.531-2.719 1.156-3.844 1.344-0.844 4.063-2.156 4.813-2.313 1.031-0.219 1.156-0.875 0-2.844-0.25-0.469-0.531-1.813-0.563-3.25-0.031-2.313 0.375-3.875 2.406-4.656 0.375-0.125 0.813-0.188 1.219-0.188 1.344 0 2.594 0.75 3.125 1.844 0.719 1.469 0.375 5.313-0.375 6.719-0.906 1.594-0.813 2.094 0.188 2.344 0.625 0.156 2.688 1.125 4.656 2.219zM24.094 18.531c1 0.531 1.563 1.5 1.469 2.438-0.031 0.563-0.031 0.594-0.781 0.688-0.375 0.063-2.344 0.094-4.656 0.094-0.406-0.969-1.188-1.844-2.25-2.406-1.219-0.688-2.656-1.406-3.75-1.875 0.719-0.344 1.344-0.625 1.625-0.688 0.781-0.188 0.875-0.625 0-2.188-0.219-0.375-0.469-1.438-0.5-2.563-0.031-1.813 0.375-3.063 1.938-3.656 0.313-0.094 0.656-0.156 0.969-0.156 1.031 0 2 0.563 2.406 1.438 0.531 1.156 0.281 4.156-0.281 5.281-0.688 1.25-0.625 1.625 0.156 1.813 0.5 0.125 2.094 0.906 3.656 1.781z"></path>
                    </g>
                </svg>
            );
        } else if (title.includes("🍌")) {
            return (
                <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.4463 0.088937C13.6307 0.010188 13.8325 -0.0169719 14.0308 0.0102836C14.2291 0.0375392 14.4166 0.118214 14.5737 0.243911C14.7308 0.369609 14.8519 0.535733 14.9242 0.724994C14.9966 0.914254 15.0176 1.11973 14.9852 1.32004L13.2925 11.736C13.1283 12.7407 12.0417 13.3169 11.1334 12.8164C10.3737 12.3977 9.24525 11.7526 8.23027 11.0795C7.72277 10.7426 6.1682 9.66368 6.35926 8.89594C6.52345 8.2395 9.13555 5.77275 10.6282 4.30618C11.214 3.73 10.9469 3.39762 10.255 3.92761C8.537 5.24352 5.77863 7.24463 4.86663 7.80794C4.0621 8.30462 3.64267 8.38942 3.14115 8.30462C2.22617 8.15016 1.37761 7.91091 0.685033 7.61941C-0.250845 7.2257 -0.20532 5.9204 0.684286 5.54031L13.4463 0.088937Z"
                          fill="#F6F6F6"/>
                </svg>
            );
        } else if (title.includes("X")) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                     viewBox="-60,-60,400,400">
                    <g fill="#fffefe" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                       stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                       font-family="none" font-weight="none" font-size="none" text-anchor="none"
                       style={{"mix-blend-mode": "normal"}}>
                        <g transform="scale(10.66667,10.66667)">
                            <path
                                d="M2.86719,3l6.86914,9.81836l-7.00195,8.18164h2.64648l5.53906,-6.49023l4.54102,6.49023h5.91016l-7.19727,-10.30273l6.57031,-7.69727h-2.60547l-5.14258,6.00977l-4.19727,-6.00977z"></path>
                        </g>
                    </g>
                </svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="20px"
                     height="20px"
                     viewBox="0 100 450 350">
                    <path fill="#ffffff"
                          d="M192 0c17.7 0 32 14.3 32 32l0 112-64 0 0-112c0-17.7 14.3-32 32-32zM64 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80-64 0 0-80zm192 0c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96zm96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64zm-96 88l0-.6c9.4 5.4 20.3 8.6 32 8.6c13.2 0 25.4-4 35.6-10.8c8.7 24.9 32.5 42.8 60.4 42.8c11.7 0 22.6-3.1 32-8.6l0 8.6c0 52.3-25.1 98.8-64 128l0 96c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-78.4c-17.3-7.9-33.2-18.8-46.9-32.5L69.5 357.5C45.5 333.5 32 300.9 32 267l0-27c0-35.3 28.7-64 64-64l88 0c22.1 0 40 17.9 40 40s-17.9 40-40 40l-56 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l56 0c39.8 0 72-32.2 72-72z"/>
                </svg>
            );
        }
    };

    const emojiToSVG = (text) => {
        return text.replace(/🍌/g, '<svg/>'); // Замінюємо 🍌 на <svg/>
    };

    return (

        <div className="_listItem_1wi4k_1">
            <div className="_media_1wi4k_8">
                {renderSVG(title)}
            </div>
            <div className="_body_1wi4k_22">
                <div className="_title_1wi4k_29">{title}</div>
                <div className="_footer_1wi4k_38">{footerText}</div>
            </div>
            <div className="_after_1wi4k_45">
            <div
                    className={isChecked ? "_type-white_ip8lu_54 _root_oar9p_1 _size-s_oar9p_31" : "_type-dark_oar9p_58 _root_oar9p_1 _size-s_oar9p_31"}
                    onClick={handleButtonClick}>  {isChecked ? "Check" : "Start"}</div>
            </div>
        </div>
    );
};

export default TaskItem;