// src/components/LastPage.js
import React, {useContext, useState} from "react";
import "../Styles/mainStyles.css"; // Додайте CSS для стилізації
import UserBoard from "./componentsTemplates/UserBoard";
import Leaderboard from "./componentsTemplates/Leaderboard";
import {LeaderboardContext} from "../context/LeaderboardContext";

const LeaderboardPage = () => {
    const { count } = useContext(LeaderboardContext);
    return (
        <div class="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_view_sf2n5_1 _view_zhpdf_1" style={{opacity: 1}}>
                    <div className="_title_zhpdf_5">Telegram Wall of Fame</div>
                    <UserBoard />
                    <div className="_boardTitle_zhpdf_23">{count?.toString()} holders</div>
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;