import React, { createContext, useState,useEffect } from 'react';
import axios from "axios";
import {API_BASE_URL} from "../helpers/api";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        {"title": "Follow OnlyUP on X", "url": "https://t.me/video_save_kyuubi", "reward": "+1000", "completed": false},
        {"title": "Join our telegram chat", "url": "https://t.me/video_save_kyuubi", "reward": "+1000", "completed": false},
        {"title": "OnlyUp Community", "url": "https://t.me/video_save_kyuubi", "reward": "+1000", "completed": false},
        {"title": "OnlyUp on X like and tweet", "url": "https://x.com/onlyup1b/status/1820518292827902366?s=52&t=002GowCIMLy2LH0C0Gkt6w", "reward": "+1000", "completed": false },
        {"title": "New post on X like, retweet and comment", "url": "https://x.com/onlyup1b/status/1823697112627818729?s=52&t=002GowCIMLy2LH0C0Gkt6w",
            "reward": "+5000", "completed": false}
    ]);
    const completeTask = (index) => {
        setTasks(tasks.map((task, i) => i === index ? { ...task, completed: true } : task));
    };

    const fetchTasks = async (telegramId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${telegramId}/tasks/`);
            if (response.status === 200 && response.data.status === "success") {
                setTasks(response.data.tasks);
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                localStorage.setItem("tasks", JSON.stringify(response.data.tasks));

            } else {
                console.error('Error fetching tasks:', response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };


    return (
        <TasksContext.Provider value={{ tasks, setTasks, completeTask,fetchTasks }}>
            {children}
        </TasksContext.Provider>
    );
};
