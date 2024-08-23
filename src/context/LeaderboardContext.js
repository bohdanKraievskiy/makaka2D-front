import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from "../helpers/api";

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
    const [userStats, setUserStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [count, setCount] = useState(0);
    const [friends_stats,setFriendsStats] = useState(null);

    const fetchLeaderboard = async (telegramId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leaderboard/`, {
                params: { telegram_id: telegramId }
            });
            if (response.status === 200) {
                console.log(response)
                const leaderboardData = response.data;
                console.log(leaderboardData)
                setLeaderboard(leaderboardData.board);
                setCount(leaderboardData.count);
                setUserStats(leaderboardData.me);
                setFriendsStats(leaderboardData.friends_stats);
                console.log(leaderboardData.friends_stats)

            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        }
    };

    return (
        <LeaderboardContext.Provider value={{ userStats, setUserStats, leaderboard, setLeaderboard, count, setCount,setFriendsStats,friends_stats,fetchLeaderboard }}>
            {children}
        </LeaderboardContext.Provider>
    );
};
