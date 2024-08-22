import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
    const [userStats, setUserStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [count, setCount] = useState(0);
    const [friends_stats,setFriendsStats] = useState(null);

    const loadFromLocalStorage = () => {
        const storedData = localStorage.getItem('leaderboard');
        if (storedData) {
            const leaderboardData = JSON.parse(storedData);
            setLeaderboard(leaderboardData.board);
            setCount(leaderboardData.count);
            setUserStats(leaderboardData.me);
            setFriendsStats(leaderboardData.friends_stats);
        }
    };

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        loadFromLocalStorage();
    }, []);


    return (
        <LeaderboardContext.Provider value={{ userStats, setUserStats, leaderboard, setLeaderboard, count, setCount,setFriendsStats,friends_stats }}>
            {children}
        </LeaderboardContext.Provider>
    );
};
