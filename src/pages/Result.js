import React, { useState, useContext } from "react";
import "../Styles/mainStyles.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { LeaderboardContext } from "../context/LeaderboardContext";
const Result = ({user,score,onStart}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [copyMessage, setCopyMessage] = useState(false);
    const { friends_stats } = useContext(LeaderboardContext);
    const friendsArray = Array.isArray(friends_stats) ? friends_stats : [];
    const handleGoToScore = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(true);
    };

    const handleClose = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(false);
    };
    const isIPhone = () => {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    };
    const handleCopyInviteLink = () => {
        const inviteLink = `https://t.me/OnlyUP_game_bot/OnlyUp?startapp=\n            Hey! Join me and earn some $UP on Solana with the OnlyUP mini-game!`;
        navigator.clipboard.writeText(inviteLink).then(() => {}).catch(err => {
            console.error('Failed to copy: ', err);
        });

        if (isIPhone()) {
            alert('Link was copied to the clipboard!!');
        } else {
            setCopyMessage(true);
            setTimeout(() => setCopyMessage(false), 5000);
        }
    };

    const handleShareInviteLink = () => {
        const shareLink = `https://t.me/share/url?url=https://t.me/OnlyUP_game_bot/OnlyUp?startapp=${7789798}\n            Hey ! Join me and earn some $UP on Solana with the OnlyUP mini-game !`;
        window.open(shareLink, '_blank');
    };

    return (
        <div className="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view" style={{overflow:"hidden"}}>
                <div className="_view_sf2n5_1 _view_1x19s_1" style={{opacity: 1}}>
                    <div className={`_backdrop_wo9zh_1  ${isLoading ? '_opened_wo9zh_16' : ''}`}></div>
                    <div className={`_content_wo9zh_21 ${isLoading ? '_opened_wo9zh_16' : ''}`} style={{height:"65%"}}>
                        <div className={`_cross_wo9zh_61 ${isLoading ? '_opened_wo9zh_16' : ''}`}
                             onClick={handleClose}></div>
                        <div className={`_contentInner_wo9zh_44 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                            <div className="_sheetTitle_1x19s_93">Referral Rules</div>
                            <div className="_separator_1x19s_86"></div>
                            <div className="_mascote_94k9d_1 _centered_94k9d_13"
                                 style={{marginLeft: "25%", marginTop: "5%", width: "40vw", height: "auto"}}>
                                <img
                                    id="home-mascote" style={{width: "60vw"}}
                                    src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-17_19-39-30.webp`}
                                    className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                                    alt="Mascote"
                                />
                            </div>
                            <div className="_title_zhpdf_5" style={{fontSize: "45px", marginTop: "10%"}}>+{score}🍌</div>
                            <div className="_subtitleEmpty_1x19s_19 game_sub_title_ms718"
                                 style={{fontSize: "12px", opacity: 0.8}}> Scored {score}🍌 points in Tomato Game!
                                dare vou to challende me!
                            </div>
                            <div className="_buttonWrap_1x19s_70" style={{position:"initial"}}>
                                <div className="_root_oar9p_1 _type-white_oar9p_43 _copy-white_pa08af"
                                     onClick={handleCopyInviteLink} style={{width: "100%",position:"relative"}}>
                                    Copy Link

                                </div>
                            </div>
                            <div className="_root_oar9p_1 _type-white_ip8lu_54" onClick={handleShareInviteLink}
                                 style={{background: "#1B1B1B",color:"white"}}>
                                Send
                            </div>
                        </div>
                    </div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13" style={{marginTop: "35%"}}>
                        <img
                            id="home-mascote" style={{width: "60vw"}}
                            src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-17_17-32-32.webp`}
                            className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    <div className="_title_1x19s_5">Congrats!
                        bountiful harvest
                    </div>
                    <div className="_title_zhpdf_5" style={{fontSize: "54px", marginTop: "10%"}}>+{score}🍌</div>
                    <div className="_root_oar9p_1 _type-white_ip8lu_54"
                         style={{background: "#F7C605", gap: 40, marginTop: "20%"}} onClick={handleGoToScore}>
                        <img style={{width: "50px"}}
                             src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-17_17-39-06.webp`}/>

                        Share Your Result +{score} 🍌
                        <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="3" height="13" fill="#242424"/>
                            <rect x="3" y="2" width="3" height="9" fill="#242424"/>
                            <rect x="6" y="5" width="3" height="3" fill="#242424"/>
                        </svg>

                    </div>
                    <div className="_root_oar9p_1 _type-white_ip8lu_54" onClick={onStart} style={{background: "#1B1B1B",marginTop:"5%"}}>
                        Play ({user.attempts_left} Attempts Left)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
