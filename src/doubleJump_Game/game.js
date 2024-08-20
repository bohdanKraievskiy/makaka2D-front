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
    const { user, setUser } = useContext(UserContext);
    const { rewards, setRewards } = useContext(RewardsContext);
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
        if (isGameOver && user.attempts_left > 0) {
            fetchUserAttempts(telegram_Id);
            start();
        }
    }, [isGameOver, start]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && isGameOver && user.attempts_left > 0) {
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
                    attempts_left: response.data.attempts_left
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
                        <div className="_title_zhpdf_5" style={{fontSize: "10vw", marginBottom: "0px"}}>{user.balance}
                            <svg width="38" height="39" viewBox="0 0 38 39" fill="none"
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
                            </svg>
                        </div>
                        <div className="_subtitleEmpty_1x19s_19 game_sub_title_ms718"
                             style={{fontSize: "12px", opacity: 0.8}}> Lorem Ipsum is simply dummy text of the printing
                            and
                            typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                            1500s
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
                                  style={{right: "20px", bottom: 11}}>{user.attempts_left}</text>
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
