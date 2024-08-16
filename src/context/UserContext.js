// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../helpers/api';
// Create a context for user
export const UserContext = createContext();

export const UserProvider = ({ children, userData }) => {
    // Initialize state for user with default values
    console.log(userData);
    const [user, setUser] = useState({
    });
    const updateUserBalance = async (newBalance) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/update_balance/`, {
                telegram_id: userData?.id.toString(),
                balance: newBalance,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                console.log("Balance updated successfully on server:", response.data.user);
                // Update the local context state
                setUser((prevUser) => ({
                    ...prevUser,
                    balance: newBalance,
                }));
            } else {
                console.error("Failed to update balance on server:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating balance on server:", error);
        }
    };
    // Provide the user data and a setter function
    return (
        <UserContext.Provider value={{ user, setUser, updateUserBalance  }}>
            {children}
        </UserContext.Provider>
    );
};
