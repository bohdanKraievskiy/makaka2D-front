import React, { createContext, useState } from 'react';

export const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
    const [rewards, setRewards] = useState([]);

    return (
        <RewardsContext.Provider value={{ rewards, setRewards }}>
            {children}
        </RewardsContext.Provider>
    );
};
