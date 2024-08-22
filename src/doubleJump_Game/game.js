import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Используем для маршрутизации
import './game.css';
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import { API_BASE_URL } from '../helpers/api';
import { RewardsContext } from "../context/RewardsContext";
import { Platforms, Points } from './Platforms';
import Result from "../pages/Result";
function Game({ telegram_Id }) {
    const { user, setUser, fetchUser } = useContext(UserContext);
    const { rewards, setRewards,fetchUserRewards } = useContext(RewardsContext);
    const [isGameOver, setIsGameOver] = useState(true);
    const [platforms, setPlatforms] = useState([]);
    const [score, setScore] = useState(0);
    const [platformCount, setPlatformCount] = useState(0);
    const [timer, setTimer] = useState(30);
    const [doublePointsMode, setDoublePointsMode] = useState(false);
    const [points, setPoints] = useState([]);
    const [background, setBackground] = useState('');
    const [background_upper,setBackground_upper] = useState('')
    const scoreRef = useRef(score);
    const type3ExistsRef = useRef(false); // Отслеживаем наличие платформы типа 3
    const type4ExistsRef = useRef(false); // Отслеживаем наличие платформы типа 4
    const isFrozenRef = useRef(false);
    const timerRef = useRef(timer);
    const hasStartedRef = useRef(false); // Реф для отслеживания начала игры
    const isActiveSessionRef = useRef(false); // Реф для отслеживания активной сессии
    const backgroundImgRef = useRef(null);
    const [marginTop, setMarginTop] = useState(0);
    const location = useLocation(); // Используем для маршрутизации
    const navigate = useNavigate();
    const [_backgroundColor, setBackgroundColor] = useState('#131313');
    const [showResultPage, setShowResultPage] = useState(false);

    useEffect(() => {

        const loadData = async () => {
            if (!user || Object.keys(user).length === 0) {
                await fetchUser(telegram_Id);
            }
            if (!rewards || Object.keys(rewards).length === 0) {
                await fetchUserRewards(telegram_Id);
            }
        };

        loadData();
    }, [telegram_Id, user,rewards]);
    useEffect(() => {
        // Убедитесь, что элемент доступен и его высота известна
        if (backgroundImgRef.current) {
            const backgroundHeight = (window.innerHeight);
            setMarginTop(backgroundHeight);
        }
    }, [background]); // Обновление при изменении background

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        if (!isGameOver && timer > 0 && !isFrozenRef.current) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else if (timer <= 0) {
           gameOver();
        }
    }, [isGameOver, timer, isFrozenRef.current]);

    const balanceUpdatedRef = useRef(false);

    const makeOneNewPlatform = useCallback((bottom, score) => {
        const left = Math.random() * (window.innerWidth - 85);
        let type = 1; // Статические платформы по умолчанию
        let speedMultiplier = Math.random() * 2 + 1.5; // Рандомная скорость (от 0.5 до 2)

        // Проверяем, если тип 3 или тип 4 уже на экране
        if (Math.random() < 0.1) {
            type = 2;
        } else if (Math.random() < 0.1) {
            type = 1;
        } else {
            if (Math.random() < 0.05) {
                type = 3;
                type3ExistsRef.current = true;
            } else if (Math.random() < 0.05) {
                type = 4;
                type4ExistsRef.current = true;
            }
        }

        return { bottom, left, type, speedMultiplier };
    }, []);

    const movePlatforms = useCallback(() => {
        setPlatforms((prevPlatforms) => {
            const screenHeight = window.innerHeight;
            const platformSpeedBase = 4;

            if (isFrozenRef.current) {
                return prevPlatforms;
            }

            const newPlatforms = prevPlatforms.map((platform) => {
                const newBottom = platform.bottom - platform.speedMultiplier * platformSpeedBase;
                return { ...platform, bottom: newBottom };
            }).filter(platform => platform.bottom > 0);

            if (newPlatforms.length < platformCount) {
                newPlatforms.push(makeOneNewPlatform((screenHeight + 50), scoreRef.current));
            }

            return newPlatforms;
        });
    }, [makeOneNewPlatform, platformCount]);

    const updateUserGameBalance = async () => {
        try {
            const updatedBalance = user.balance + scoreRef.current;
            const response = await axios.post(`${API_BASE_URL}/users/update_game_balance/`, {
                telegram_id: telegram_Id,
                balance: updatedBalance,
                scoreRef: scoreRef.current
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setUser((prevUser) => ({
                    ...prevUser,
                    balance: updatedBalance,
                }));
                setRewards(prevRewards => ({
                    ...prevRewards,
                    game: prevRewards.game + scoreRef.current,
                    total: prevRewards.total + scoreRef.current
                }));
            } else {
                console.error("Failed to update balance on server:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating balance on server:", error);
        }
    };

    const gameOver = useCallback(() => {
        if (!balanceUpdatedRef.current) {
            updateUserGameBalance();
            balanceUpdatedRef.current = true;
        }
        hasStartedRef.current = false;
        setIsGameOver(true);
        setBackground(''); // Сбрасываем фон игры
        setBackground_upper('')
        if (isActiveSessionRef.current) {
            setShowResultPage(true) // Переход на страницу результатов после завершения игры
        }
    }, [updateUserGameBalance, navigate]);

    useEffect(() => {
        if (hasStartedRef.current) {
            setBackground('normal_bg.webp'); // Меняем фон на фон 1 при старте
            setBackground_upper('normal_uper.webp')
            setBackgroundColor('#BBEBFF');
        }
    }, [hasStartedRef.current]);

    useEffect(() => {
        // Деактивируем активную сессию при смене маршрута
        isActiveSessionRef.current = false;
    }, [location]);

    const onPlatformClick = useCallback((index, type, left, bottom) => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        const pointsToAdd = type === 2 ? (doublePointsMode ? 6 : 3) : (doublePointsMode ? 2 : 1);
        if (type === 4) {
            setPoints((prevPoints) => [
                ...prevPoints,
                { id: Date.now(), value: '-100', position: { left, bottom } },
            ]);
        } else {
            setPoints((prevPoints) => [
                ...prevPoints,
                { id: Date.now(), value: `+${pointsToAdd}`, position: { left, bottom } },
            ]);
        }

        if (type === 3) {
            isFrozenRef.current = true;
            setBackground('frozen_bg.webp'); // Меняем фон на фон 2 при заморозке
            setBackground_upper('frozen_uper.webp')
            setTimeout(() => {
                isFrozenRef.current = false;
                setBackground('normal_bg.webp'); // Возвращаем фон на фон 1
                setBackground_upper('normal_uper.webp')
                setBackgroundColor('#BBEBFF');
            }, 3000);
            setBackgroundColor('#48A7AD');
            type3ExistsRef.current = false;
            setTimer((prevTimer) => prevTimer); // Останавливаем таймер
        } else if (type === 4) {
            setScore((prevScore) => Math.max(0, prevScore - 100)); // Отнимаем 100 баллов
            setBackground('bomb_bg.webp'); // Меняем фон на фон 3 при активации типа 4
            setBackground_upper('bomb_uper.webp')
            setBackgroundColor('#9E0000');
            setTimeout(() => {
                setBackground('normal_bg.webp'); // Возвращаем фон на фон 1
                setBackground_upper('normal_uper.webp')
                setBackgroundColor('#BBEBFF');
            }, 2000);

            type4ExistsRef.current = false;
        } else {
            setScore((prevScore) => prevScore + pointsToAdd);
        }

        setPlatforms((prevPlatforms) => prevPlatforms.filter((_, i) => i !== index));
    }, [doublePointsMode]);

    useEffect(() => {
        if (!isGameOver) {
            const interval = setInterval(() => {
                movePlatforms();
            }, 30);
            return () => clearInterval(interval);
        }
    }, [isGameOver, movePlatforms]);

    const createPlatforms = useCallback(() => {
        const windowHeight = window.innerHeight;
        const visibleHeight = windowHeight - 100;
        let platformGap = visibleHeight / platformCount;

        if (platformGap > 55) {
            platformGap = 55;
        } else if (platformGap < 10) {
            platformGap = 10;
        }

        const newPlatforms = [];
        for (let i = 0; i < platformCount; i++) {
            const newPlatBottom = 200 + i * platformGap;
            const newPlatform = makeOneNewPlatform(newPlatBottom, 0);
            newPlatforms.push(newPlatform);
        }
        return newPlatforms;
    }, [makeOneNewPlatform, platformCount]);

    const start = useCallback(() => {
        hasStartedRef.current = true;
        isActiveSessionRef.current = true; // Активируем сессию при старте
        balanceUpdatedRef.current = false;
        setShowResultPage(false);
        setTimer(30);
        const newPlatforms = createPlatforms();
        setIsGameOver(false);
        setScore(0);
        setPlatforms(newPlatforms);
    }, [createPlatforms]);

    useEffect(() => {
        const calculatePlatformCount = () => {
            const windowHeight = window.innerHeight;
            const maxGap = 75;
            const calculatedCount = Math.ceil(windowHeight / maxGap);
            setPlatformCount(calculatedCount);
        };

        calculatePlatformCount();

        window.addEventListener('resize', calculatePlatformCount);
        return () => window.removeEventListener('resize', calculatePlatformCount);
    }, []);

    useEffect(() => {
        if (platformCount > 0) {
            const newPlatforms = createPlatforms();
            setPlatforms(newPlatforms);
        }
    }, [platformCount, createPlatforms]);

    const handleTouchStart = useCallback((event) => {
        console.log(user.attempts_left)
        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        if (isGameOver && user?.attempts_left > 0) {
            fetchUserAttempts(telegram_Id);
            start();
        }
    }, [isGameOver, start]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && isGameOver && user?.attempts_left > 0) {
            fetchUserAttempts(telegram_Id);
            start();
        }
    }, [isGameOver, start]);

    const fetchUserAttempts = async (telegram_Id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/update_attempts/`,
                { telegram_id: telegram_Id, action: 'use' });
            if (response.status === 200) {
                setUser((prevUser) => ({
                    ...prevUser,
                    attempts_left: response.data?.attempts_left
                }));
            }
        } catch (error) {
            console.error("Error fetching or using user attempts:", error);
        }
    };

    return (
        <div className="grid" style={{ background: hasStartedRef.current ? `${_backgroundColor}` : '' }} tabIndex="0">
            {!showResultPage ? (
                !isGameOver ? (
                    <>
                        <div className="_gameText_889">
                            <Platforms platforms={platforms} onPlatformClick={onPlatformClick} />
                            {points.map(point => (
                                <Points key={point.id} points={point.value} position={point.position} />
                            ))}
                        </div>
                        {hasStartedRef.current ? (
                            <div className="_game_background980">
                                <img
                                    draggable={false}
                                    id="backgroundItem"
                                    ref={backgroundImgRef}
                                    src={`${process.env.PUBLIC_URL}/resources_directory/${background}`}
                                    alt="Background"
                                    className="_game_background981"
                                    style={{
                                        position: "absolute",
                                        bottom: "110px",
                                        width: "100%",
                                        touchAction: "none", // Prevent zooming with touch
                                        userSelect: "none" // Prevent text selection
                                    }} // Positioning the first image relative to the parent
                                />
                                <img
                                    draggable={false}
                                    src={`${process.env.PUBLIC_URL}/resources_directory/${background_upper}`}
                                    alt="background_uper"
                                    className="_game_background982"
                                    style={{
                                        position: "absolute", // Keeps the image at a fixed position within the parent
                                        bottom: "82px", // Adjust this value to set the distance from the bottom of the screen
                                        left: 0, // Ensure it's aligned to the left edge
                                        right: 0, // Ensure it's aligned to the right edge
                                        margin: "0 auto", // Center the image horizontally
                                        width: "100%", // Make the image responsive to screen width
                                        touchAction: "none", // Prevent zooming with touch
                                        userSelect: "none" // Prevent text selection
                                }}
                                />
                            </div>
                        ) : (<></>)
                        }
                        <div className="timer">0:{timer}</div>
                        <div className="score">
                            {score}</div>
                    </>
                ) : (
                    <div className="_view_sf2n5_1 _view_zhpdf_1" style={{opacity: 1, gap: "8vw"}}>
                        <div className="_media_iud9y_8 _game_start87">
                            <img
                                className="_avatar_iud9y_19"
                                src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                                loading="lazy"
                                alt="Avatar"
                            />
                        </div>
                        <div className="instructions">
                            {user.username}
                        </div>
                        <div className="_title_1vo1r_5">
                            <div style={{flexDirection: "row "}}
                                 className={`_balance_eubs4_1 balance-text _exclusive_font`}>
                                <span style={{fontSize: "12vw", color: "white"}}>{user.balance} </span>
                                &nbsp;
                                <span style={{fontSize: "12vw"}}> WAP</span>
                            </div>
                        </div>
                        <div className="_subtitleEmpty_1x19s_19 game_sub_title_ms718"
                             style={{fontSize: "12px", opacity: 1, display: "flex", flexDirection: "column"}}>
                            <t>Play our mini games to farm as many WAPs as
                                possible. &nbsp;
                            </t>
                            &nbsp;
                            <t>You're entitled to 5 <svg width="20" height="10" viewBox="0 0 40 27" fill="none"
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
                                tickets a day, collect more by inviting friends.
                            </t>
                        </div>
                        <div className="box_rectangle19 " onClick={handleTouchStart}
                             style={{overflow: "hidden", height: "40vw"}}>
                            <img src={`${process.env.PUBLIC_URL}/resources_directory/rectangle-removebg-preview.webp`}
                                 style={{width: "100%", background: "#BBEBFF"}}/>
                            <text className="_game_bananes_781">Drop Game</text>
                            <img className="_left_game_bananes"
                                 src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-17_14-50-10.webp`}
                            />
                            <text className="_left_game_bananes"
                                  style={{right: "20px", bottom: 11}}>{user?.attempts_left}</text>
                        </div>
                        <div className="_root_oar9p_1 _type-white_ip8lu_54" onClick={handleTouchStart}
                             style={{background: "#F7C605"}}>
                            Start Farming
                        </div>
                    </div>
                )
            ) : (
                <Result user={user} score={score} onStart={handleTouchStart}/>
            )}
        </div>
    );
}

export default Game;
