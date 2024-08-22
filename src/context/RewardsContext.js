import React, {createContext, useEffect, useState} from 'react';
import axios from "axios";
import {API_BASE_URL} from "../helpers/api";

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const [rewards, setRewards] = useState([]);

    const loadFromLocalStorageReward = async () => {
        const response = await axios.get(`${API_BASE_URL}/users/${874423521}/rewards/`);
        if (response.status === 200 && response.data.status === "success") {
            setRewards(response.data.reward);
            localStorage.setItem("rewards", JSON.stringify(response.data.reward));

        }
    };



    return (
        <RewardsContext.Provider value={{ rewards, setRewards,loadFromLocalStorageReward }}>
            {children}
        </RewardsContext.Provider>
    );
};
