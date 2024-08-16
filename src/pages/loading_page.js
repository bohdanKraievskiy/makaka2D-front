import React, { useEffect, useContext,useState, useRef } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { RewardsContext } from "../context/RewardsContext";
import { TasksContext } from "../context/TasksContext";
import { LeaderboardContext } from "../context/LeaderboardContext";
import { useNavigate } from "react-router-dom";
import {API_BASE_URL} from '../helpers/api';
const PreLoad = ({ telegramId }) => {
    const navigate = useNavigate();
    const { user, setUser, updateUserBalance } = useContext(UserContext);
    const { setRewards } = useContext(RewardsContext);
    const { setTasks } = useContext(TasksContext);
    const { setUserStats, setLeaderboard, setCount,setFriendsStats } = useContext(LeaderboardContext);
    const [rewardData, setRewardData] = useState(null);
    const [showRewardPage, setShowRewardPage] = useState(false);

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (hasFetchedData.current) return;
        const loadData = async () => {
            try {
                hasFetchedData.current = true
                const rewardResult = await fetchDailyReward(telegramId);
                if (rewardResult) {
                    setRewardData(rewardResult);
                    setShowRewardPage(true); // Show reward page if a new reward is claimed
                };
                await fetchLeaderboard(telegramId);
                await fetchUser(telegramId);
                await fetchUserRewards(telegramId);
                await fetchTasks(telegramId);
            } catch (error) {
                console.error("Error loading data", error);
            }
        };

        loadData();
    }, [telegramId, navigate, setUser, setRewards, setTasks, setUserStats, setLeaderboard, setCount]);

    const fetchLeaderboard = async (telegramId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leaderboard/`, {
                params: { telegram_id: telegramId }
            });
            if (response.status === 200) {
                console.log(response)
                const leaderboardData = response.data;
                console.log(leaderboardData)
                setLeaderboard(leaderboardData.board);
                setCount(leaderboardData.count);
                setUserStats(leaderboardData.me);
                setFriendsStats(leaderboardData.friends_stats)
                console.log(leaderboardData.friends_stats)
            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        }
    };
    const fetchUser = async (telegramId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/join/`, {
                user_id: telegramId
            });

            if (response.status === 200 && response.data.status === "success") {
                setUser(response.data.user);
            } else {
                console.error("Error fetching user:", response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                navigate("/welcome"); // Navigate to WelcomePage if user is not found
            } else {
                console.error("Failed to fetch user:", error);
            }
        }
    };

    const fetchUserRewards = async (telegramId) => {
        try {
            console.log(telegramId)
            const response = await axios.get(`${API_BASE_URL}/users/${telegramId}/rewards/`);
            if (response.status === 200 && response.data.status === "success") {
                setRewards(response.data.reward);
            }
        } catch (error) {
            console.error("Failed to fetch user rewards:", error);
        }
    };
    const fetchTasks = async (telegramId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${telegramId}/tasks/`);
            if (response.status === 200 && response.data.status === "success") {
                setTasks(response.data.tasks);
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                if(!showRewardPage) {
                 navigate("/home");
                }
            } else {
                console.error('Error fetching tasks:', response.data.message);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };
    const fetchDailyReward = async (telegramId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/daily_reward/`, {
                telegram_id: telegramId
            });
            if (response.status === 200 && response.data.status === "success") {
                return response.data;
            } else {
                console.error("Error fetching daily reward:", response.data.message);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch daily reward:", error);
            return null;
        }
    };

    const handleRewardClaimed = () => {
        setRewards(prevRewards => ({
            ...prevRewards,
            daily: prevRewards.daily + rewardData.balance,
            total: prevRewards.total + rewardData.balance
        }));
        updateUserBalance(user.balance+rewardData.balance);
        setShowRewardPage(false);
        navigate("/home");
    };
    return (
        <div>
            {showRewardPage ? (
                <RewardPage rewardData={rewardData} onClaim={handleRewardClaimed} />
            ) : (
                <div className="_view_sf2n5_1 _view_1x19s_1" style={{opacity: 1}}>
                    <div className="_title_1x19s_5">OnlyUP</div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <img
                            id="home-mascote"
                            src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-03_02-24-40.webp`}
                            className="_doggy_94k9d_6 louve_t09 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    <div class="_subtitleEmpty_1x19s_19">Loading...</div>
                </div>
            )}
        </div>
    );
};

const RewardPage = ({rewardData, onClaim}) => {
    const {streak, reward} = rewardData;

    return (
        <div className="_page_1ulsb_1">
            <div className="_view_sf2n5_1 _view_mgd6s_11" style={{ opacity: 1 }}>
                <div className="_inner_mgd6s_1">
                    <div className="_title_mgd6s_24">Daily Reward!</div>
                    <div className="_subTitle_mgd6s_34">Congratulations! You've claimed your daily reward</div>
                    <div className="_valueWrap_mgd6s_42">
                        <div className="_value_mgd6s_42">{streak}</div>
                        <div className="_valueTitle_mgd6s_78">daily  streak</div>
                    </div>
                    <div className="_valueSubTitle_mgd6s_86">
                        +{reward} $UP.<br/>
                    </div>
                    <div
                        className="_root_oar9p_1 _type-white_oar9p_43 _fixedBottom_oar9p_110 _button_mgd6s_141"
                        onClick={onClaim}
                        style={{cursor: "pointer"}}
                    >
                        Continue
                    </div>

                </div>
            </div>
        </div>
    );
};
export default PreLoad;
