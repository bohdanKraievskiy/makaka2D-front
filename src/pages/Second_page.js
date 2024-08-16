import "../Styles/Second_page.css";
import React, { useState, useEffect,useRef,useContext  } from "react";
import axios from "axios"; // Импорт axios
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { RewardsContext } from '../context/RewardsContext';
import { TasksContext } from '../context/TasksContext';
import {LeaderboardContext} from "../context/LeaderboardContext";
import {API_BASE_URL} from "../helpers/api"; // Import TasksContext
const SecondPage = (userData) => {
    const [isCompleted, setIsCompleted] = useState({
        accountAge: false,
        activityLevel: false,
        telegramPremium: false,
    });
    const { setUser } = useContext(UserContext);
    const { setRewards } = useContext(RewardsContext);
    const { tasks, setTasks } = useContext(TasksContext); // Access tasks and setTasks
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    const [accountAgePercentage, setAccountAgePercentage] = useState(0);
    const { setUserStats, setLeaderboard, setCount } = useContext(LeaderboardContext);
    const calculateAccountAgePercentage = (ageInDays) => {
        const telegramCreationDate = new Date(2013, 7, 14); // 14th August 2013
        const currentDate = new Date();
        const totalDays = Math.floor((currentDate - telegramCreationDate) / (1000 * 60 * 60 * 24));
        return Math.round(((totalDays - ageInDays) / totalDays) * 100);
    };

    // Функция для создания пользователя
    const createUser = async () => {
        try {
            console.log(userData.userData)
            const randomUsername = userData?.userData.username;
            const randomTelegramId = userData?.userData.id;
            const isPremium = userData?.userData.is_premium;
            const reference = `874423521djiawiid`;

            // Fetch the registration date
                const registrationResponse = await axios.get(`${API_BASE_URL}/account_date/`,{
                    params: { telegram_id: randomTelegramId }
                });
            if (registrationResponse.status === 200) {
                const registrationDateStr = registrationResponse.data.account_date.registration_date;
                const registrationDate = new Date(registrationDateStr);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - registrationDate);
                const randomAge = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
                const percentage = calculateAccountAgePercentage(randomAge);
                const topGroup = randomAge / 365;
                const userData = {
                    age: randomAge,
                    username: randomUsername,
                    telegram_id: randomTelegramId,
                    is_premium: isPremium,
                    reference: reference,
                    balance: randomAge,
                    top_group: topGroup,
                    top_percent: percentage,
                    attempts_left:20
                };
                setUser(userData);

                const rewardsData = {
                    age: userData.age,
                    boost: 0,
                    game: 0,
                    daily: 0,
                    frens: 0,
                    premium: 0,
                    tasks: 0,
                    total: 0
                };
                setRewards(rewardsData);

                const initialTasks = [
                    {"title": "Follow OnlyUP on X", "url": "https://twitter.com/OnlyUP1B", "reward": "+1000", "completed": false},
                    {"title": "Join our telegram chat", "url": "https://t.me/OnlyUP_Official_chat", "reward": "+1000", "completed": false},
                    {"title": "OnlyUp Community", "url": "https://t.me/OnlyUP_Announcements", "reward": "+1000", "completed": false},
                    {"title": "OnlyUp on X like and tweet", "url": "https://x.com/onlyup1b/status/1820518292827902366?s=52&t=002GowCIMLy2LH0C0Gkt6w", "reward": "+1000", "completed": false },
                    {"title": "Invite 3 friends in 24 hours", "url": "", "reward": "+3000", "completed": false},
                    {"title": "OnlyUp on X like, retweet and comment", "url": "https://x.com/OnlyUP1B/status/1822543659130048546", "reward": "+1000", "completed": false },
                    {"title": "New post on X like, retweet and comment", "url": "https://x.com/onlyup1b/status/1823697112627818729?s=52&t=002GowCIMLy2LH0C0Gkt6w",
                        "reward": "+5000", "completed": false}
                ];

                // Update tasks context
                setTasks(initialTasks);

                const response = await axios.post(
                    `${API_BASE_URL}/users/`,
                    userData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (response.status === 201) {
                    console.log("User created successfully:", response.data);
                    setIsCompleted((prev) => ({ ...prev, activityLevel: true }))
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                } else {
                    console.error("Failed to create user:", response.data);
                }
            } else {
                console.error("Failed to fetch registration date:", registrationResponse.data);
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const fetchLeaderboard = async (randomTelegramId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leaderboard/`, {
                params: { telegram_id: randomTelegramId }
            });
            if (response.status === 200) {
                console.log(response)
                const leaderboardData = response.data;
                console.log(leaderboardData)
                setLeaderboard(leaderboardData.board);
                setCount(leaderboardData.count);
                setUserStats(leaderboardData.me);
            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            createUser();
            setTimeout(1000)
            fetchLeaderboard(userData?.userData.id);
            isFirstRender.current = false;

        }

        const timers = [
            setTimeout(() => {
                setIsCompleted((prev) => ({ ...prev, accountAge: true }));
                const randomAge = 3611; // This should come from your user data
                const percentage = calculateAccountAgePercentage(randomAge);
                setAccountAgePercentage(percentage);
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }, 1500),
            setTimeout(() => {
                setIsCompleted((prev) => ({...prev, telegramPremium: true}))
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }, 3500),

        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    const handleClickToNextPage = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        if (Object.values(isCompleted).every((val) => val)) {
            navigate("/last_check");
        }
    };
    return (
        <div className="_view_sf2n5_1 _view_jzemx_1" style={{opacity: 1}}>
            <div className="_title_jzemx_9">Checking your account</div>
            <div className="_loaders_jzemx_15">
                <div style={{opacity: 1, transform: "none"}}>
                    <div>
                        <div className="_top_jzemx_39">
                            <div className="_name_jzemx_33">Account Age Verified</div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`_checkmark_jzemx_23 ${isCompleted.accountAge ? "_isCompleted_jzemx_26" : ""}`}
                            >
                                <path
                                    d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                                    stroke="#FFF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="_loader_jzemx_15">
                            <div
                                className={`_loaderProgress_jzemx_51 ${isCompleted.accountAge ? "_isCompleted_jzemx_26" : ""}`}
                                style={{
                                    width: isCompleted.accountAge ? "100%" : "0%",
                                    transitionDuration: "2100ms",
                                    transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div style={{opacity: 1, transform: "none"}}>
                    <div>
                        <div className="_top_jzemx_39">
                            <div className="_name_jzemx_33">Activity Level Analyzed</div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`_checkmark_jzemx_23 ${isCompleted.activityLevel ? "_isCompleted_jzemx_26" : ""}`}
                            >
                                <path
                                    d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                                    stroke="#FFF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="_loader_jzemx_15">
                            <div
                                className={`_loaderProgress_jzemx_51 ${isCompleted.activityLevel ? "_isCompleted_jzemx_26" : ""}`}
                                style={{
                                    width: isCompleted.activityLevel ? "100%" : "0%",
                                    transitionDuration: "3400ms",
                                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div style={{opacity: 1, transform: "none"}}>
                    <div>
                        <div className="_top_jzemx_39">
                            <div className="_name_jzemx_33">Telegram Premium Checked</div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`_checkmark_jzemx_23 ${isCompleted.telegramPremium ? "_isCompleted_jzemx_26" : ""}`}
                            >
                                <path
                                    d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                                    stroke="#FFF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="_loader_jzemx_15">
                            <div
                                className={`_loaderProgress_jzemx_51 ${isCompleted.telegramPremium ? "_isCompleted_jzemx_26" : ""}`}
                                style={{
                                    width: isCompleted.telegramPremium ? "100%" : "0%",
                                    transitionDuration: "3000ms",
                                    transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>
            <div
                className={`_root_oar9p_1 _type-blue_oar9p_88 _fixedBottom_oar9p_110 _action_jzemx_61 ${
                    Object.values(isCompleted).every((val) => val) ? "_isCompleted_jzemx_26" : ""
                }`} onClick={handleClickToNextPage}
            >
                Continue
            </div>
        </div>
    );
};

export default SecondPage;
