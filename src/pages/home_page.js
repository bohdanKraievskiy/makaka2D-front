import React, { useContext, useEffect,useState } from "react";
import "../Styles/mainStyles.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { RewardsContext } from '../context/RewardsContext';
import CommunitySlide from './componentsTemplates/CommunitySlide';
import TaskItem from './componentsTemplates/TaskItem';
import RewardItem from './componentsTemplates/RewardItem';
import {TasksContext} from "../context/TasksContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
SwiperCore.use([Pagination]);
const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { rewards } = useContext(RewardsContext);
    const {tasks} = useContext(TasksContext);
    const handleGoToScore = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        navigate("/last_check");
    };
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        if (animated) {
            setAnimated(true)
            const timer = setTimeout(() => setAnimated(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [user.balance]);

    const imageSrc = animated
        ? `${process.env.PUBLIC_URL}/resources_directory/Frame7.webp`
        : `${process.env.PUBLIC_URL}/resources_directory/image_2024-08-03_02-24-40.webp`;

    return (
        <div class="_page_1ulsb_1">
            <div className="_gameView_1cr97_1" id="game-view">
                <div className="_replay_1vo1r_24" onClick={handleGoToScore}>
                    <svg width="576" height="64" viewBox="0 0 576 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="576" height="83" fill="#FFAF67"/>
                        <path
                            d="M317.466 83C317.466 83 356.164 53.462 385.5 46.5C411.908 40.233 442.381 22.4708 455 46.5C461.628 59.1196 455 83 455 83H389.703H317.466Z"
                            fill="#FFCC8C"/>
                        <path d="M231.921 83H254.733L449.5 0H427.723H406.812L231.921 83Z" fill="#FFCC8C"/>
                        <path
                            d="M317.466 0H355.485C355.485 0 250.5 65.5001 240 60.5C229.5 55.4999 233.5 30.5 240 17.5C246.5 4.5 317.466 0 317.466 0Z"
                            fill="#FFCC8C"/>
                        <path
                            d="M193.901 0H216.5C216.5 0 226.725 90.1486 193.901 83C173.157 78.4822 193.861 54.0025 174 46.5C143.613 35.0212 132 83 132 83H78.5002L193.901 0Z"
                            fill="#FFCC8C"/>
                        <path
                            d="M531.5 60.5C553.321 40.9023 576 0 576 0H555.089L479 83H500.5C500.5 83 520.371 70.4954 531.5 60.5Z"
                            fill="#FFCC8C"/>
                        <path
                            d="M-0.5 83H64.5002C64.5002 83 72.9673 67.7607 74.0002 57C74.3919 52.9183 74.0002 50.6005 74.0002 46.5C74.0002 28.3406 88.5 0 64.4998 0C40.4997 0 -0.5 83 -0.5 83Z"
                            fill="#FFCC8C"/>
                    </svg>

                    <div className="_replayTitle_1vo1r_48"></div>
                </div>
                ` <div className="_backdrop_wo9zh_1"></div>
                <div className="_view_sf2n5_1 _view_1vo1r_1" style={{opacity: 1}}>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1906" height="676" viewBox="0 0 1906 676"
                             fill="none" className="_glass_94k9d_29">
                            <path
                                d="M1883.31 89.9479C1883.31 53.1478 1853.48 23.3154 1816.68 23.3154H1201.73C1162.44 23.3154 1127.14 40.388 1102.85 67.4479H824.909C809.553 41.0733 780.975 23.3154 748.209 23.3154H320.821C156.058 23.3154 22.4922 156.881 22.4922 321.644V509.207C22.4922 588.661 86.9024 653.071 166.357 653.071H483.414C678.643 653.071 836.908 494.807 836.908 299.577V200.713H1068.9V354.743C1068.9 519.505 1202.46 653.071 1367.23 653.071H1397.42C1665.77 653.071 1883.31 435.53 1883.31 167.18V89.9479Z"
                                fill="black" stroke="white" stroke-width="45"></path>
                        </svg>
                        <img id="home-mascote"
                             src={imageSrc}
                             className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63">
                        </img>
                    </div>
                    <div className="_title_1vo1r_5">
                        <div className={`_balance_eubs4_1 ${animated ? 'balance-animated' : ''}`}>
                            <span>{user.balance}</span>
                            <span className="_symbol_eubs4_9">$UP</span>
                        </div>
                    </div>
                    <div className="_root_oar9p_1 _type-white_oar9p_43">Claim rewards (coming soon)</div>
                    <div className="_socialCarousel_1xku1_1">
                        <div className="swiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide swiper-slide-active" style={{width: "100%"}}>
                                    <div className="_itemWrap_1xku1_16 _itemWrapFirst_1xku1_20">
                                        <div className="social-carousel">
                                            <Swiper
                                                spaceBetween={50}
                                                slidesPerView={1}
                                                pagination={{clickable: true}}
                                            >
                                                <SwiperSlide>
                                                    <CommunitySlide
                                                        title="OnlyUp Community"
                                                        text="Home for Telegram $UP"
                                                        buttonText="Join"
                                                        url="https://t.me/OnlyUP_Official_chat"
                                                    />
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <CommunitySlide
                                                        title="Follow OnlyUP on X"
                                                        text="Stay updated with the latest news"
                                                        buttonText="Join"
                                                        url="https://twitter.com/OnlyUP1B"
                                                    />
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <CommunitySlide
                                                        title="Join our telegram chat"
                                                        text="2.8k+"
                                                        buttonText="Join"
                                                        url="https://t.me/OnlyUP_Official_chat"
                                                    />
                                                </SwiperSlide>
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="_taskList_dti3z_1">
                        <div className="_title_dti3z_5">Tasks</div>
                        <div>
                        {tasks.map((task, index) => (
                                !task.completed && (
                                    <TaskItem
                                        key={index}
                                        index={index}
                                        title={task.title}
                                        footerText={task.reward}
                                        url={task.url}
                                        setAnimated={animated}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                    <div className="_rewardList_1a8v0_1">
                        <div className="_title_1a8v0_5">Your rewards</div>
                        {rewards.age !== 0 && <RewardItem text="Account age" details={rewards.age.toString()}/>}
                        {rewards.boost !== 0 && <RewardItem text="Boosts reward" details={rewards.boost}/>}
                        {rewards.game !== 0 && <RewardItem text="Game reward" details={rewards.game}/>}
                        {rewards.daily !== 0 && <RewardItem text="Daily reward" details={rewards.daily}/>}
                        {rewards.frens !== 0 && <RewardItem text="Friends reward" details={rewards.frens}/>}
                        {rewards.premium !== 0 && <RewardItem text="Telegram Premium" details={rewards.premium}/>}
                        {rewards.tasks !== 0 && <RewardItem text="Tasks reward" details={rewards.tasks}/>}
                        {rewards.total !== 0 && <RewardItem text="Total reward" details={rewards.total}/>}
                        {tasks.map((task, index) => (
                            task.completed && <RewardItem key={index} text={task.title} details={task.reward}/>
                        ))}
                    </div>
                    <a className="_policyLink_1vo1r_85"
                       >Privacy
                        policy</a></div>
            </div>
        </div>
    )
        ;
};

export default HomePage;