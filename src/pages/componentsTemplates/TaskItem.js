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
                reward: rewardValue
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

        if (timerExpired) {
            setIsChecked(false);
            localStorage.removeItem(storageKey);
            localStorage.removeItem(startTimeKey);
            handleShowModal();
            return;
        }

        if (title === "Invite 3 friends in 24 hours") {
            if (!isChecked) {
                // Start the task and save the start time
                axios.post(`${API_BASE_URL}/tasks/start/`, {
                    telegram_id: user.telegram_id
                }).then(() => {
                    setIsChecked(true);
                    localStorage.setItem(storageKey, true);
                    localStorage.setItem(startTimeKey, Date.now().toString());
                }).catch(error => {
                    console.error("Failed to start task:", error);
                    handleShowModal();
                });
            } else {
                // Verify task completion
                verifyTask(user.telegram_id, title, footerText);
            }
        } else {
            if (!isChecked) {
                window.open(url, '_blank');
                setIsChecked(true);
                localStorage.setItem(storageKey, true);
                localStorage.setItem(startTimeKey, Date.now().toString());
            } else {
                verifyTask(user.telegram_id, title, footerText);
            }
        }
    };



    return (
        <div className="_listItem_1wi4k_1">
            <div className="_media_1wi4k_8">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="20px"
                     height="20px"
                     viewBox="0 100 450 350">
                    <path fill="#ffffff"
                          d="M192 0c17.7 0 32 14.3 32 32l0 112-64 0 0-112c0-17.7 14.3-32 32-32zM64 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80-64 0 0-80zm192 0c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96zm96 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64zm-96 88l0-.6c9.4 5.4 20.3 8.6 32 8.6c13.2 0 25.4-4 35.6-10.8c8.7 24.9 32.5 42.8 60.4 42.8c11.7 0 22.6-3.1 32-8.6l0 8.6c0 52.3-25.1 98.8-64 128l0 96c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-78.4c-17.3-7.9-33.2-18.8-46.9-32.5L69.5 357.5C45.5 333.5 32 300.9 32 267l0-27c0-35.3 28.7-64 64-64l88 0c22.1 0 40 17.9 40 40s-17.9 40-40 40l-56 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l56 0c39.8 0 72-32.2 72-72z"/>
                </svg>
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