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
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
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
                        <span className="_medal_iud9y_66">by <svg width="19" height="19" viewBox="0 0 38 39" fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M22.7347 36.0173V35.0137H25.6689V33.9696H26.6803V32.9931H27.6569V31.877H28.738V30.7959H29.8889V29.4357H30.9564V28.263H32.0678V27.1176H33.2371V26.0527H34.3182V26.0178H34.3531V25.4947H34.3182V23.0882H35.3645V19.0426H36.3062V19.0077H36.4108V9.97479H35.3645V8.82387H34.2833V7.70783H33.2022V6.5918H32.121V7.70783H32.0861V8.82387H33.2022V9.97479H34.2833V16.0432H33.1673V19.0426H32.0513V21.0654H30.9003V23.0534H29.7843V24.0648H28.738V26.0527H27.6917V27.0641H26.7152V28.0755H25.6689V29.0521H25.634V29.0869H24.5529V30.0286H23.4717V31.0749H20.7514V31.9817H18.6937V32.9931H16.636V34.0742H10.6722V33.028H5.68487V32.9931H5.64999V31.9119H4.63858V30.8656H3.4179V29.7496H1.11609V30.6912H1.15097V30.7959H2.33675V31.8422L3.45279 31.877V32.9085H4.64506V33.9347H5.68487V34.9113H5.71973V34.981H7.6728V36.0622H7.70768V36.0273H10.6722V37.0736H19.74V37.1085H19.7646V36.0173H22.7347Z"
                                      fill="#BE8103"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M26.6803 12.9741V16.0083H25.634V18.1358H24.518V19.3564H24.4831V19.3913H23.3322V20.4376H22.0767V21.728H20.9606V23.0533H19.9143V24.0647H18.7634V25.0761H16.6011V26.0876H13.6715V27.1339H10.6722V28.1453H4.6037V27.1687H3.4179V27.2036H3.38302V28.4243H2.23212V29.7496H2.26699V28.4591H3.4179V29.7844H4.1503V29.1567H4.63858V30.0634H5.64999V31.04H5.7895V31.0749H10.6024V31.04H10.6373V30.0634H13.2879V30.0983H16.6709V29.052H17.7171V28.1104H20.9606V27.1339H21.972V27.0641H22.0069V26.0876H23.4717V26.0527H23.5066V25.111H23.5415V25.0761H24.5878V24.832H24.5529V24.0647H25.4248V24.0996H25.6689V23.0882H26.6803V22.0419H27.6917V19.0774H28.7031V18.066H29.7843V13.9855H30.9003V7.74268H29.8192V8.82384H28.8078V9.97477H27.7615V12.9741H26.6803Z"
                                      fill="#F9ED0E"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M30.9003 4.04575V3.90624H30.9352V3.03434H32.0861V1.98805H33.237V1.04639H29.8192V4.04575H30.9003Z"
                                      fill="#A6BA04"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M33.237 4.04599V1.98828H32.0861V3.03457H30.9352V3.90648H30.9003V6.55706H32.0861V4.04599H33.237Z"
                                      fill="#698506"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M1.11609 28.3891H2.19726V27.2033H1.11609V28.3891ZM3.41792 29.7842V30.8653H4.63858V31.9116H5.64999V32.9928H5.68487V33.0276H10.6722V34.0739H16.636V32.9928H18.6937V31.9814H20.7514V31.0746H23.4717V30.0283H24.5529V29.0866H25.634V29.0517H25.6689V28.0752H26.7152V27.0638H27.6917V26.0524H28.738V24.0645H29.7843V23.0531H30.9003V21.0651H32.0513V19.0423H33.1673V16.0429H34.2833V9.97449H33.2022V8.82356H32.0861V7.70752H29.8192V7.7424H30.9003V13.9852H29.7843V18.0658H28.7031V19.0772H27.6917V22.0416H26.6803V23.0879H25.6689V24.0993H25.4248V24.0645H24.5529V24.8317H24.5878V25.0759H23.5415V25.1107H23.5066V26.0524H23.4717V26.0873H22.0069V27.0638H21.972V27.1336H20.9606V28.1101H17.7172V29.0517H16.6709V30.098H13.2879V30.0632H10.6373V31.0397H10.6024V31.0746H5.7895V31.0397H5.64999V30.0632H4.63858V29.1564H4.15032V29.7841H3.41792V29.7842ZM3.41792 29.7493V28.4589H2.267V29.7493H3.41792Z"
                                      fill="#F7C605"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M33.237 4.04566H32.0861V6.55675H30.9003V4.04566H29.8192V1.04631H33.237V4.04566H33.237ZM26.6803 12.974H27.7615V9.97462H28.8078V8.8237H29.8192V7.70765H29.854H32.121V6.59161H33.2022V7.70765H34.2833V8.8237H35.3645V9.97462H36.4108V19.0075H36.3061V19.0424H35.3645V23.0881H34.3182V25.4945H34.3531V26.0177H34.3182V26.0525H33.237V27.1337H33.2022V27.1686H32.0861V28.2846H33.237V27.1686H34.3879V26.1223H34.4228V26.0874H35.4342V23.1229H36.4456V19.0424H37.4571V9.93974H36.4108V8.8237H35.3645V7.70765H34.3182V6.55673H33.237V4.04564H34.3182V0.976537H33.3068V0H29.7843V1.01141H28.7729V4.08052H29.7843V6.31259H29.8192V7.67276H28.7729V8.82368H27.7615V9.93973H27.7266V9.9746H26.7152V12.9391H26.6803V12.974H25.634V16.0082H24.518H24.4831V18.1356H23.3322V19.3563H22.0767V20.4375H23.3322V19.3912H24.4831V19.3563H24.518V18.1357H25.634V16.0082H26.6803V12.974H26.6803ZM30.9701 29.4355H32.0513V28.2846H30.9701V29.4355H29.8889V30.7957H28.738V31.8769H27.6568V32.9929H26.6803V33.9695H25.6689V35.0157H22.7393V36.0271H19.7748V37.0734H22.7393V36.0271H25.634V35.9923H25.6689V35.0506H26.7152V34.0043H27.6917V33.0627H28.7729V31.9466H29.8889V30.8306H30.9701V29.4355ZM7.67278 36.062V37.0386H7.70765V37.0734H10.6372V38.1546H19.7748V37.1083H19.7399V37.0734H10.6721V36.0272H7.70765V36.062H7.67278V36.062ZM1.25555 31.842H2.33672V30.7957H1.25555V31.842ZM5.78946 34.9809H5.7197V34.9111H5.68484V33.9346H4.63855V32.9232H3.48764V33.9346H4.63855V35.0157H5.68484V35.0855V36.0271H7.67278V34.9809H5.78946V34.9809ZM2.33671 31.8769V32.9231H3.45275V31.8769H2.33671ZM1.15092 30.7957V30.6911H1.11604V29.7494H2.19721V28.459H2.23209V28.4241H3.383V27.2034H3.41787V27.1686H4.60367V28.1451H4.63853H10.6721V27.1337H13.6715V26.0874H16.6011V25.076H18.7634V24.0646H19.9143V23.0532H20.9606V21.7279H22.0766V20.4724H20.9606V21.693H19.8794V23.0183H18.7634V24.0646H15.7292V25.0411H13.6366V26.0525H13.532V26.0874H10.6721V27.0988H10.6372V27.1337H4.77804H4.63853V26.1223H0V26.1572V30.7957H1.15092V30.7957ZM1.11604 28.3892V27.2034H2.19721V28.3892H1.11604Z"
                                      fill="#3A1505"/>
                            </svg> {friend.username}</span>
                        <div className="_footer_iud9y_32">Checking in</div>
                    </div>
                </div>
            );
        });
    };


    return (
        <div className="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_view_sf2n5_1 _view_1x19s_1" style={{opacity: 1}}>
                    <div className={`_backdrop_wo9zh_1  ${isLoading ? '_opened_wo9zh_16' : ''}`}></div>
                    <div className={`_content_wo9zh_21 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                        <div className={`_cross_wo9zh_61 ${isLoading ? '_opened_wo9zh_16' : ''}`}
                             onClick={handleClose}></div>
                        <div className={`_contentInner_wo9zh_44 ${isLoading ? '_opened_wo9zh_16' : ''}`}>
                            <div className="_sheetTitle_1x19s_93">Referral Rules</div>
                            <div className="_separator_1x19s_86"></div>
                            <div className="_buttons_1x19s_79">
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Invite a Friend</div>
                                    <div className="_footer_ruller_7yda">You will both get 2,000 WAP and 1 <svg
                                        width="15" height="20" viewBox="0 0 40 27" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9546 12.5738V17.901H14.2751V12.5738H15.9546ZM15.9546 12.5738V10.8915H17.634V17.901H16.0945V12.5738H15.9546ZM8.95695 9.06908H14.1352V10.7513H12.4558V17.901H10.7764V10.7513H8.95699V9.06908H8.95695ZM19.5934 17.901H17.774V10.7513H16.0946V9.06908H15.9546V10.7513H14.2752V7.24659H17.774V5.5643H12.4558V3.74182H10.6364V2.05962H28.2705V23.2282H23.0922V21.4057H19.5934V19.7235H17.774V18.0412H19.5934V17.901V17.901ZM7.13754 12.5738H8.95695V16.2188H7.27749V17.901H5.45817V19.7234H1.95931V24.9104H28.4104V1.91943H1.81931V9.06908H5.45813V10.7513H7.13754V12.5738V12.5738Z"
                                              fill="#E9E8E6"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M28.4104 7.24659V9.06908H30.2299V14.3962H28.4104V16.0785H30.2299V21.5459H28.5504V23.2282H30.2299V25.0506H42.5456V19.7234H38.9069V17.901H37.3674V17.7608H37.2274V16.0785H35.5481V12.714H37.2274V10.7513H39.0468V9.06908H42.5456V1.91943H30.2299V7.1064H30.0899V7.24659H28.4104Z"
                                              fill="#FF4392"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M24.9116 10.893H26.591V12.5753H24.9116V10.893ZM23.0923 12.5753H24.7716V14.2575H23.0923V16.2202H24.9116V14.3977H26.591V17.9025H21.2728V9.07058H24.7716V10.7528H23.0923V12.5753ZM10.6364 3.74328H12.4558V5.56576H17.7741V7.24805H14.2752V10.7527H15.9547V9.07053H19.5934V18.0426H17.7741V19.7249H19.5934V21.4071H23.0923V23.2296H28.2705V2.06104H10.6365V3.74323L10.6364 3.74328Z"
                                              fill="#FEFDFE"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 1.92057V0.238281H1.81931V1.92057H42.5456Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 25.0518H1.81931V26.734H42.5456V25.0518Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M21.2729 17.9012H26.5911V14.3965H24.9116V16.219H23.0923V14.2564H24.7716V12.5741H23.0923V10.7515H24.7716V9.06934H21.2729V17.9012Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M8.95689 10.7515H10.7764V17.9012H12.4558V10.7515H14.1352V9.06934H8.95689V10.7515Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M19.5934 17.9012V9.06934H16.0946V10.7515H17.7741V17.9012H19.5934Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.6856 19.7235H44.2251V24.9105L42.7226 25.0489L42.6856 19.7235ZM37.3674 17.7608V16.2188H38.9069V17.7608H37.3674ZM37.2274 16.0786V17.7608H37.3674V17.901H38.9069V19.7235H42.5456V25.0506H30.2298V23.2283H28.5504V21.546H30.2298V16.0786H28.4104V25.0507H44.365V19.5833H39.0468V16.0786H37.2274H37.2274Z"
                                              fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M1.81932 9.06908V1.91943H0V9.06908H1.81932Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 9.06908V1.91943H28.4104V7.24659H30.0899V7.1064H30.2299V1.91943H42.5456V9.06908Z"
                                              fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5455 1.91943V9.06908H44.225V1.91943H42.5455Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9547 12.5749H16.0946V17.9021H17.6341V10.8926H15.9547V12.5749Z"
                                              fill="#FEFDFE"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M28.4104 9.06934V14.3965H30.2299V9.06934H28.4104Z" fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2273 12.5741H39.0467V10.8917H42.5455V9.06934H39.0467V10.7515H37.2273V12.5741Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9546 12.5747H14.2751V17.9019H15.9546V12.5747Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M0.139938 24.9126H1.8193V19.7256H0.139938V24.9126Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5455 25.0513H44.365V19.584H42.5455V25.0513Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M8.95691 16.0794V12.5747H7.13754V16.0794H8.95691Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 19.7249V17.9023H38.9068V19.7249H42.5456Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M5.31817 9.06934H1.81931V10.7515H5.31817V9.06934Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M1.9593 19.5846H5.31822V17.9023H1.9593V19.5846Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2273 16.0799V12.7153H35.548V16.0799H37.2273Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M24.9115 12.5749H26.591V10.8926H24.9115V12.5749Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M7.13759 12.5749V10.8926H5.45818V12.5749H7.13759Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M7.13759 16.0786H6.99758V16.2188H5.45818V17.7609H7.13759V16.0786Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2275 17.901H39.0469V16.0786H37.2275V17.901Z" fill="#3A1505"/>
                                    </svg>
                                    </div>
                                </div>
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Invite a Friend with a Telegram Premium Account
                                    </div>
                                    <div className="_footer_ruller_7yda">You will both get 20,000 WAP and 5 <svg
                                        width="15" height="20" viewBox="0 0 40 27" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9546 12.5738V17.901H14.2751V12.5738H15.9546ZM15.9546 12.5738V10.8915H17.634V17.901H16.0945V12.5738H15.9546ZM8.95695 9.06908H14.1352V10.7513H12.4558V17.901H10.7764V10.7513H8.95699V9.06908H8.95695ZM19.5934 17.901H17.774V10.7513H16.0946V9.06908H15.9546V10.7513H14.2752V7.24659H17.774V5.5643H12.4558V3.74182H10.6364V2.05962H28.2705V23.2282H23.0922V21.4057H19.5934V19.7235H17.774V18.0412H19.5934V17.901V17.901ZM7.13754 12.5738H8.95695V16.2188H7.27749V17.901H5.45817V19.7234H1.95931V24.9104H28.4104V1.91943H1.81931V9.06908H5.45813V10.7513H7.13754V12.5738V12.5738Z"
                                              fill="#E9E8E6"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M28.4104 7.24659V9.06908H30.2299V14.3962H28.4104V16.0785H30.2299V21.5459H28.5504V23.2282H30.2299V25.0506H42.5456V19.7234H38.9069V17.901H37.3674V17.7608H37.2274V16.0785H35.5481V12.714H37.2274V10.7513H39.0468V9.06908H42.5456V1.91943H30.2299V7.1064H30.0899V7.24659H28.4104Z"
                                              fill="#FF4392"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M24.9116 10.893H26.591V12.5753H24.9116V10.893ZM23.0923 12.5753H24.7716V14.2575H23.0923V16.2202H24.9116V14.3977H26.591V17.9025H21.2728V9.07058H24.7716V10.7528H23.0923V12.5753ZM10.6364 3.74328H12.4558V5.56576H17.7741V7.24805H14.2752V10.7527H15.9547V9.07053H19.5934V18.0426H17.7741V19.7249H19.5934V21.4071H23.0923V23.2296H28.2705V2.06104H10.6365V3.74323L10.6364 3.74328Z"
                                              fill="#FEFDFE"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 1.92057V0.238281H1.81931V1.92057H42.5456Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 25.0518H1.81931V26.734H42.5456V25.0518Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M21.2729 17.9012H26.5911V14.3965H24.9116V16.219H23.0923V14.2564H24.7716V12.5741H23.0923V10.7515H24.7716V9.06934H21.2729V17.9012Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M8.95689 10.7515H10.7764V17.9012H12.4558V10.7515H14.1352V9.06934H8.95689V10.7515Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M19.5934 17.9012V9.06934H16.0946V10.7515H17.7741V17.9012H19.5934Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.6856 19.7235H44.2251V24.9105L42.7226 25.0489L42.6856 19.7235ZM37.3674 17.7608V16.2188H38.9069V17.7608H37.3674ZM37.2274 16.0786V17.7608H37.3674V17.901H38.9069V19.7235H42.5456V25.0506H30.2298V23.2283H28.5504V21.546H30.2298V16.0786H28.4104V25.0507H44.365V19.5833H39.0468V16.0786H37.2274H37.2274Z"
                                              fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M1.81932 9.06908V1.91943H0V9.06908H1.81932Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 9.06908V1.91943H28.4104V7.24659H30.0899V7.1064H30.2299V1.91943H42.5456V9.06908Z"
                                              fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5455 1.91943V9.06908H44.225V1.91943H42.5455Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9547 12.5749H16.0946V17.9021H17.6341V10.8926H15.9547V12.5749Z"
                                              fill="#FEFDFE"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M28.4104 9.06934V14.3965H30.2299V9.06934H28.4104Z" fill="#EE2460"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2273 12.5741H39.0467V10.8917H42.5455V9.06934H39.0467V10.7515H37.2273V12.5741Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M15.9546 12.5747H14.2751V17.9019H15.9546V12.5747Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M0.139938 24.9126H1.8193V19.7256H0.139938V24.9126Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5455 25.0513H44.365V19.584H42.5455V25.0513Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M8.95691 16.0794V12.5747H7.13754V16.0794H8.95691Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M42.5456 19.7249V17.9023H38.9068V19.7249H42.5456Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M5.31817 9.06934H1.81931V10.7515H5.31817V9.06934Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M1.9593 19.5846H5.31822V17.9023H1.9593V19.5846Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2273 16.0799V12.7153H35.548V16.0799H37.2273Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M24.9115 12.5749H26.591V10.8926H24.9115V12.5749Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M7.13759 12.5749V10.8926H5.45818V12.5749H7.13759Z" fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M7.13759 16.0786H6.99758V16.2188H5.45818V17.7609H7.13759V16.0786Z"
                                              fill="#3A1505"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M37.2275 17.901H39.0469V16.0786H37.2275V17.901Z" fill="#3A1505"/>
                                    </svg></div>
                                </div>
                                <div className="_body_iud9y_25">
                                    <div className="_rullers_o1nm32">Additional Incentives</div>
                                    <div className="_footer_ruller_7yda">Get 10% of Your Fren’s farming
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <img style={{width:"101vw",marginTop:"-10%",marginLeft:"-5%",maxWidth:1000}}
                            id="home-mascote"
                            src={`${process.env.PUBLIC_URL}/resources_directory/download (1).gif`}
                            className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    <div className="_title_1x19s_5" style={{marginTop:"5%"}}>Invite to Earn $PRIME</div>

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
                        <div className="_root_oar9p_1 _type-yellow_oar9p_43" onClick={handleShareInviteLink}>Invite
                            friends
                        </div>
                        <div className="_root_oar9p_1 _type-white_oar9p_43 _copy-white_pa08af"
                             onClick={handleCopyInviteLink}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="4.94718" y="0.81818" width="10.2346" height="10.885" rx="1.90909"
                                      fill="#131313" stroke="#F2F2F2" strokeWidth="1.63636"/>
                                <rect x="0.81818" y="4.62897" width="10.2346" height="10.885" rx="1.90909" fill="white"
                                      stroke="#131313" strokeWidth="1.63636"/>
                            </svg>

                        </div>
                    </div>

                    {copyMessage && <div className="_copied_1x19s_86">Copied</div>}
                </div>
            </div>
        </div>
    );
};

export default InvitePage;
