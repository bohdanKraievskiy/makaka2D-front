import React, { useState, useContext } from "react";
import "../Styles/Last_page.css"; // Додайте CSS для стилізації
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const LastPage = () => {
    const { user } = useContext(UserContext);
    const [state, setState] = useState("initial"); // Текущее состояние страницы
    const navigate = useNavigate();

    const handleContinue = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        if (state === "initial") {
            setState("amazing");
        } else if (state === "amazing" && user.is_premium) {
            setState("premium");
        } else {
            navigate("/home");
        }
    };

    const handleSwitch = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        // Переключаем состояние между "initial", "amazing" и "premium"
        setState((prevState) => {
            if (prevState === "initial") {
                return "amazing";
            } else if (prevState === "amazing"  && user.is_premium ) {
                return "premium";
            } else {
                return "initial";
            }
        });
    };

    return (
        <div className="_page_1ulsb_1">
            <div className="_view_sf2n5_1 _view_mgd6s_11" style={{ opacity: 1 }}>
                <div className="_inner_mgd6s_1">
                    <div className="_left_mgd6s_121" onClick={handleSwitch}></div>
                    <div className="_right_mgd6s_131" onClick={handleSwitch}></div>
                    <div className="_progressBar_mgd6s_93">
                        <div
                            className={`_bar_mgd6s_105 _barActive_mgd6s_117 ${state === "initial" ? "_barActive_mgd6s_117" : ""}`}
                            onClick={handleSwitch}
                        ></div>
                        <div
                            className={`_bar_mgd6s_105 ${state === "amazing" ? "_barActive_mgd6s_117" : ""} ${state === "premium" ? "_barActive_mgd6s_117" : ""}`}
                            onClick={handleSwitch}
                        ></div>
                        { user.is_premium ? (<div
                            className={`_bar_mgd6s_105 ${state === "premium" ? "_barActive_mgd6s_117" : ""}`}
                            onClick={handleSwitch}
                        ></div>):null}
                    </div>
                    {state === "initial" ? (
                        <>
                            <div className="_title_mgd6s_24">Elite member!</div>
                            <div className="_subTitle_mgd6s_34">You've joined Telegram</div>
                            <div className="_valueWrap_mgd6s_42">
                                <div className="_value_mgd6s_42">{Math.round(user ? user.top_group : "...")}</div>
                                <div className="_valueTitle_mgd6s_78">years ago</div>
                            </div>
                            <div className="_valueSubTitle_mgd6s_86">
                                Your account number is #{user?.telegram_id}.<br />  You're in the Top {user ? Math.round(user.top_percent) : "..."}% Telegram users 🔥
                            </div>
                        </>
                    ) : state === "amazing" ? (
                        <>
                            <div className="_title_mgd6s_24">You are amazing!</div>
                            <div className="_subTitle_mgd6s_34">Here is your APE reward</div>
                            <div className="_valueWrap_mgd6s_42">
                                <div className="_value_mgd6s_42">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/resources_directory/13A8E8C5-B501-4EA6-B4AC-6BD22BD7A9BA.webp`}
                                        width="237" height="242"
                                    />
                                </div>
                                <div className="_valueTitle_mgd6s_78">{user?.age}</div>
                            </div>
                            <div className="_valueSubTitle_mgd6s_86">
                                Welcome to the  movement 🤝
                            </div>
                        </>
                    ) : state === "premium" && user.is_premium ? (
                        <>
                            <div className="_title_mgd6s_24">Premium User!</div>
                            <div className="_subTitle_mgd6s_34">Exclusive Benefits Await</div>
                            <div className="_valueWrap_mgd6s_42">
                                <div className="_value_mgd6s_42">
                                    <img
                                        src={`${process.env.PUBLIC_URL}/resources_directory/star_premium.webp`}
                                        width="767" height="auto"
                                    />
                                </div>
                                <div className="_valueTitle_mgd6s_78">Enjoy your premium rewards!</div>
                            </div>
                            <div className="_valueSubTitle_mgd6s_86">
                                Thank you for being a premium member. 🌟
                            </div>
                        </>
                    ) : null}
                    <div
                        className="_root_oar9p_1 _type-white_oar9p_43 _fixedBottom_oar9p_110 _button_mgd6s_141"
                        onClick={handleContinue}
                        style={{ cursor: "pointer" }}
                    >
                        Continue
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LastPage;
