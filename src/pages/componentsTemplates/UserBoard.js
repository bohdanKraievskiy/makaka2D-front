// src/components/UserBoard.js
import React, {useContext, useEffect} from 'react';
import { LeaderboardContext } from '../../context/LeaderboardContext';
import {UserContext} from "../../context/UserContext";
import {useNavigate} from "react-router-dom";

const UserBoard = ({telegramId}) => {
    const { userStats } = useContext(LeaderboardContext);
    const { user, setUser, fetchUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!userStats || Object.keys(userStats).length === 0) {
            navigate("/preload")
        }
    }, [telegramId,userStats]);
    if (!userStats) return null;

    return (
        <div className="_me_zhpdf_13">
            <div className="_item_iud9y_1">
                <div className="_media_iud9y_8">
                    <img className="_avatar_iud9y_19"
                         src={`https://ui-avatars.com/api/?name=${user?.username}&background=random&color=fff`}
                         loading="lazy" alt="Avatar"/>
                </div>
                <div className="_body_iud9y_25">
                    <div className="_text_iud9y_47">{user?.username}</div>
                    <div className="_footer_iud9y_32">{userStats?.score} WAP</div>
                </div>
                <div className="_details_iud9y_56">#{userStats?.position}</div>
            </div>
        </div>
    );
};

export default UserBoard;
