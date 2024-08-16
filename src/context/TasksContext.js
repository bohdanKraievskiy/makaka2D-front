import React, { createContext, useState } from 'react';

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

    return (
        <TasksContext.Provider value={{ tasks, setTasks, completeTask }}>
            {children}
        </TasksContext.Provider>
    );
};
