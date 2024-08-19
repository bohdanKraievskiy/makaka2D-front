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
    const scoreRef = useRef(score);
    const type3ExistsRef = useRef(false); // Отслеживаем наличие платформы типа 3
    const type4ExistsRef = useRef(false); // Отслеживаем наличие платформы типа 4
    const isFrozenRef = useRef(false);
    const timerRef = useRef(timer);
    const hasStartedRef = useRef(false); // Реф для отслеживания начала игры
    const isActiveSessionRef = useRef(false); // Реф для отслеживания активной сессии
    const location = useLocation(); // Используем для маршрутизации
    const navigate = useNavigate();
    const [_backgroundColor, setBackgroundColor] = useState('#131313');
    const [showResultPage, setShowResultPage] = useState(false);
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
        let speedMultiplier = Math.random() * 1.5 + 1; // Рандомная скорость (от 0.5 до 2)

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

        if (isActiveSessionRef.current) {
            setShowResultPage(true) // Переход на страницу результатов после завершения игры
        }
    }, [updateUserGameBalance, navigate]);

    useEffect(() => {
        if (hasStartedRef.current) {
            setBackground('normal_bg.webp'); // Меняем фон на фон 1 при старте
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
            setTimeout(() => {
                isFrozenRef.current = false;
                setBackground('normal_bg.webp'); // Возвращаем фон на фон 1
                setBackgroundColor('#BBEBFF');
            }, 3000);
            setBackgroundColor('#48A7AD');
            type3ExistsRef.current = false;
            setTimer((prevTimer) => prevTimer); // Останавливаем таймер
        } else if (type === 4) {
            setScore((prevScore) => Math.max(0, prevScore - 100)); // Отнимаем 100 баллов
            setBackground('bomb_bg.webp'); // Меняем фон на фон 3 при активации типа 4
            setBackgroundColor('#9E0000');
            setTimeout(() => {
                setBackground('normal_bg.webp'); // Возвращаем фон на фон 1
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
        <div className="grid" style={{ background: hasStartedRef.current ? `${_backgroundColor}` : '' }} onKeyDown={handleKeyDown} onTouchStart={handleTouchStart} tabIndex="0">
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
                            <img draggable={false}
                                 src={`${process.env.PUBLIC_URL}/resources_directory/${background}`}
                                 alt="Background" className="_game_background981"
                            />
                        ) : (<></>)
                        }
                        <div className="timer">0:{timer}</div>
                        <div className="score">🍌{score}</div>
                    </>
                ) : (
                    <div className="_view_sf2n5_1 _view_zhpdf_1" style={{ opacity: 1, gap: "8vw" }}>
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
                        <div className="_title_zhpdf_5" style={{ fontSize: "10vw" }}>{user.balance}🍌</div>
                        <div className="_subtitleEmpty_1x19s_19 game_sub_title_ms718"
                             style={{ fontSize: "12px", opacity: 0.8 }}> Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
                            1500s
                        </div>
                        <div className="box_rectangle19 " onClick={start} style={{ overflow: "hidden", height: "150px" }}>
                            <img src={`${process.env.PUBLIC_URL}/resources_directory/rectangle-removebg-preview.webp`}
                                 style={{ width: "100%", background: "#BBEBFF" }} />
                            <text className="_game_bananes_781">Drop Game</text>
                            <img className="_left_game_bananes"
                                 src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-17_14-50-10.webp`}
                            />
                            <text className="_left_game_bananes"
                                  style={{ right: "20px", bottom: 13 }}>{user.attempts_left}</text>
                        </div>
                        <div className="_root_oar9p_1 _type-white_ip8lu_54" onClick={start} style={{ background: "#F7C605" }}>
                            Start Farming
                        </div>
                    </div>
                )
            ) : (
                <Result user={user} score={score} onStart={start} />
            )}
        </div>
    );
}

export default Game;
