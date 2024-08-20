import React, { useState, useContext, useEffect } from "react";
import "../Styles/mainStyles.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { LeaderboardContext } from "../context/LeaderboardContext";

const InvitePage = ({ telegramId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [copyMessage, setCopyMessage] = useState(false);
    const { friends_stats } = useContext(LeaderboardContext);
    const [activeTab, setActiveTab] = useState('Frens');

    // Determine if the device is an iPhone
    const isIPhone = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const handleGoToScore = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(true);
        // You may want to navigate or perform another action here.
    };

    const handleClose = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setIsLoading(false);
    };

    const handleCopyInviteLink = () => {
        const inviteLink = `https://t.me/OnlyUP_game_bot/OnlyUp?startapp=${telegramId}\nHey! Join me and earn some $UP on Solana with the OnlyUP mini-game!`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            if (isIPhone()) {
                alert('Link was copied to the clipboard!!');
            } else {
                setCopyMessage(true);
                setTimeout(() => setCopyMessage(false), 5000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleShareInviteLink = () => {
        const shareLink = `https://t.me/share/url?url=https://t.me/OnlyUP_game_bot/OnlyUp?startapp=${telegramId}\nHey! Join me and earn some $UP on Solana with the OnlyUP mini-game!`;
        window.open(shareLink, '_blank');
    };

    const renderFriendsList = () => {
        return friends_stats.map((friend, index) => (
            <div key={index} className="_item_iud9y_1">
                <div className="_media_iud9y_8">
                    <img
                        className="_avatar_iud9y_19"
                        src={`https://ui-avatars.com/api/?name=${friend.username}&background=random&color=fff`}
                        loading="lazy"
                        alt="Avatar"
                    />
                </div>
                <div className="_body_iud9y_25">
                    <div className="_text_iud9y_47">{friend.username}</div>
                    <div className="_footer_iud9y_32">{friend.score} $UP</div>
                </div>
                <div className="_details_iud9y_56">
                    <span className="_medal_iud9y_66">{friend.position}</span>
                </div>
            </div>
        ));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderPrimeList = () => {
        return friends_stats.map((friend, index) => {
            // Преобразуем дату в нужный формат
            const date = new Date(friend.date_added);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

            return (
                <div key={index} className="_item_iud9y_1">
                    <div className="_body_iud9y_25">
                        <div className="_text_iud9y_47">+{friend.balance_increment}</div>
                        <div className="_footer_iud9y_32">{formattedDate}</div>
                    </div>
                    <div className="_details_iud9y_56">
                        <span className="_medal_iud9y_66">by 🍌 {friend.username}</span>
                        <div className="_footer_iud9y_32">Checking in</div>
                    </div>
                </div>
            );
        });
    };


    return (
        <div className="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_view_sf2n5_1 _view_1x19s_1" style={{ opacity: 1 }}>
                    <div className={`_backdrop_wo9zh_1  ${isLoading ? '_opened_wo9zh_16' : ''}`}></div>
                    <div className={`_content_wo9zh_21 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                        <div className={`_cross_wo9zh_61 ${isLoading ? '_opened_wo9zh_16' : ''}`} onClick={handleClose}></div>
                        <div className={`_contentInner_wo9zh_44 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                            <div className="_sheetTitle_1x19s_93">Referral Rules</div>
                            <div className="_separator_1x19s_86"></div>
                            <div className="_buttons_1x19s_79">
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Invite a Friend</div>
                                    <div className="_footer_ruller_7yda">You will both get 2,000 🍌 and 1</div>
                                </div>
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Invite a Friend with a Telegram Premium Account</div>
                                    <div className="_footer_ruller_7yda">You will both get 20,000 🍌 and 5</div>
                                </div>
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Additional Incentives</div>
                                    <div className="_footer_ruller_7yda">Get 10% of Your Fren’s 🍌 Yields in Rewards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <img
                            id="home-mascote"
                            src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-16_16-03-47.webp`}
                            className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    <div className="_title_1x19s_5">Invite to Earn $PRIME</div>

                    <div className="box_rectangle10">
                        <div className="rec_sm541">
                            <div className="box_text1060">+{friends_stats.length}</div>
                        </div>
                        <div className="box_text970">{friends_stats.length}</div>
                        <div className="box_text920">Frens</div>
                        <div className="box_text860" onClick={handleGoToScore}>View referral rules ></div>
                    </div>

                    <div className="box_rectangle10 slider-bar">
                        <div
                            className={`slider_if819 ${activeTab === 'Frens' ? 'slider_if819-active' : ''}`}
                            onClick={() => handleTabChange('Frens')}
                        >
                            Frens
                        </div>
                        <div
                            className={`slider_if819 ${activeTab === 'Prime' ? 'slider_if819-active' : ''}`}
                            onClick={() => handleTabChange('Prime')}
                        >
                            $ PRIME
                        </div>
                    </div>
                    {activeTab === 'Frens' ? renderFriendsList() : renderPrimeList()}

                    <div className="_buttonWrap_1x19s_70">
                        <div className="_root_oar9p_1 _type-yellow_oar9p_43" onClick={handleShareInviteLink}>Invite friends</div>
                        <div className="_root_oar9p_1 _type-white_oar9p_43 _copy-white_pa08af" onClick={handleCopyInviteLink}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4.94718" y="0.81818" width="10.2346" height="10.885" rx="1.90909" fill="#131313" stroke="#F2F2F2" strokeWidth="1.63636" />
                                <rect x="0.81818" y="4.62897" width="10.2346" height="10.885" rx="1.90909" fill="white" stroke="#131313" strokeWidth="1.63636" />
                            </svg>
                            Copy link
                        </div>
                    </div>

                    {copyMessage && <div className="_copied_1x19s_86">Copied</div>}
                </div>
            </div>
        </div>
    );
};

export default InvitePage;
