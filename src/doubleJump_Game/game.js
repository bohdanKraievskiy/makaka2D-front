import React, {useState, useEffect, useCallback, useContext,useRef} from 'react';
import './game.css';
import {UserContext} from "../context/UserContext";
import axios from 'axios';
import {API_BASE_URL} from '../helpers/api';
import {RewardsContext} from "../context/RewardsContext";
function Platforms({ platforms }) {
    return platforms.map((platform, index) => (
        <div
            key={index}
            className={`platform ${platform.type === 3 ? 'deadly' : ''} ${platform.type === 4 ? 'game-over' : ''}`}
            style={{ left: `${platform.left}px`, bottom: `${platform.bottom}px` }}
        >
            <img
                src={`${process.env.PUBLIC_URL}/resources_directory/platform_type_${platform.type}.webp`}
                alt={`Platform type ${platform.type}`}
            />
        </div>
    ));
}

function Doodler({ doodler, direction }) {
    return (
        <img
            className="doodler"
            src={`${process.env.PUBLIC_URL}/resources_directory/13A8E8C5-B501-4EA6-B4AC-6BD22BD7A9BA.webp`}
            style={{
                left: `${doodler.left}px`,
                bottom: `${doodler.bottom}px`,
                transform: direction === 'right' ? 'scaleX(-1)' : 'none',
            }}
        />
    );
}

function Game({telegram_Id}) {
    const [lastPlatformHeight, setLastPlatformHeight] = useState(0);
    const { user, setUser,updateUserBalance  } = useContext(UserContext);
    const [isGameOver, setIsGameOver] = useState(true);
    const [platforms, setPlatforms] = useState([]);
    const [doodler, setDoodler] = useState({});
    const [score, setScore] = useState(0);
    const [direction, setDirection] = useState('none');
    const [platformCount, setPlatformCount] = useState(0);  // Initially set to 0
    const startPoint = 250;
    const { rewards, setRewards } = useContext(RewardsContext);
    const scoreRef = useRef(score);
    const type4PlatformAddedRef = useRef(false);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);
    const balanceUpdatedRef = useRef(false);
    const makeOneNewPlatform = useCallback((bottom, score) => {
        const left = Math.random() * (window.innerWidth - 85);
        let type = 1; // Статичні платформи за замовчуванням

        if (score > 35) {
            if (Math.random() < 0.4) { // 40% шанс для рухомих платформ
                type = 2;
            }
        }

        if (score > 50) {
            if (Math.random() < 0.2) { // 20% шанс для ломаючих платформ
                type = 3;
            }
        }

        // Ensure type 4 only appears when score is a positive multiple of 100 and hasn't been added yet
        if (score > 0 && score % 100 === 0 && !type4PlatformAddedRef.current) {
            type = 4;
            type4PlatformAddedRef.current = true; // Mark that a type 4 platform has been added
        } else if (score > 0 && score % 100 !== 0) {
            type4PlatformAddedRef.current = false; // Reset the flag if not at a multiple of 100
        }

        return { bottom, left, type, direction: 'right' };
    }, []);
    const movePlatforms = useCallback((platformOffset = 0) => {
        setPlatforms((prevPlatforms) => {
            const screenHeight = window.innerHeight;
            const platformSpeedBase = 4; // Змінено на 15, щоб платформи рухались швидше

            // Розрахунок швидкості платформи
            const platformSpeed = platformSpeedBase + platformOffset / 50;

            const newPlatforms = prevPlatforms.map((platform) => {
                let newLeft = platform.left;

                // Рух платформ вниз
                const newBottom = platform.bottom - platformSpeed - 4;

                // Рухомі платформи
                if (platform.type === 2) {
                    if (platform.direction === 'right') {
                        newLeft += 2;
                        if (newLeft >= window.innerWidth - 85) {
                            platform.direction = 'left';
                        }
                    } else {
                        newLeft -= 2;
                        if (newLeft <= 0) {
                            platform.direction = 'right';
                        }
                    }
                }

                return { ...platform, bottom: newBottom, left: newLeft };
            });

            // Додати нові платформи, коли існуючі платформи зникають
            if (newPlatforms[0].bottom < 82) {
                newPlatforms.shift();
                setScore((prevScore) => {
                    const newScore = prevScore + 1;
                    newPlatforms.push(makeOneNewPlatform(window.innerHeight-50, newScore));  // Додати нову платформу
                    return newScore;
                });
            }

            return newPlatforms;
        });
    }, [makeOneNewPlatform]);




    const moveMovingPlatforms = useCallback(() => {
        setPlatforms((prevPlatforms) => {
            return prevPlatforms.map((platform) => {
                if (platform.type === 2) { // Check if the platform is of type 2
                    let newLeft = platform.left;

                    // Move the platform left or right based on its direction
                    if (platform.direction === 'right') {
                        newLeft += 2;
                        if (newLeft >= window.innerWidth - 85) { // Change direction when hitting the edge
                            platform.direction = 'left';
                        }
                    } else {
                        newLeft -= 2;
                        if (newLeft <= 0) {
                            platform.direction = 'right';
                        }
                    }

                    return { ...platform, left: newLeft }; // Update the platform's left position
                }
                return platform; // Return the platform unchanged if not type 2
            });
        });
    }, []);

    const jump = useCallback(() => {
        setDoodler((prevDoodler) => {
            let newLeft = prevDoodler.left;

            // Move left or right based on direction
            if (direction === 'left' && prevDoodler.left > 0) {
                newLeft = prevDoodler.left - 5;
            } else if (direction === 'right' && prevDoodler.left < window.innerWidth - 50) {
                newLeft = prevDoodler.left + 5;
            }

            // Define jump characteristics
            const maxJumpHeight = 85; // Max jump height from starting point
            const jumpHeight = prevDoodler.bottom - prevDoodler.startPoint;

            // Ensure that the character does not jump higher than the maxJumpHeight
            if (jumpHeight >= maxJumpHeight) {
                return { ...prevDoodler, isJumping: false };
            }
            if (prevDoodler.isJumping) {
                movePlatforms();
                return { ...prevDoodler, bottom: prevDoodler.bottom + 5, left: newLeft }; // Constant increase in jump height
            }

            return prevDoodler; // Повернути без змін, якщо не стрибає
        });
    }, [direction, movePlatforms]);



    const fall = useCallback(() => {
        setDoodler((prevDoodler) => {
            let newLeft = prevDoodler.left;
            if (direction === 'left' && prevDoodler.left > 0) {
                newLeft = prevDoodler.left - 8;
            } else if (direction === 'right' && prevDoodler.left < (window.innerWidth - 85)) {
                newLeft = prevDoodler.left + 8;
            }
            if (prevDoodler.bottom <= 10) {
                gameOver();
            }

            return { ...prevDoodler, bottom: prevDoodler.bottom - 5, left: newLeft };
        });
    }, [direction]);
    const updateUserGameBalance = async () => {
        try {
            const updatedBalance = user.balance + scoreRef.current;
            console.log(updatedBalance);
            const response = await axios.post(`${API_BASE_URL}/users/update_game_balance/`, {
                telegram_id: telegram_Id,
                balance: updatedBalance,
                scoreRef:scoreRef.current
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                console.log("Balance updated successfully on server:", response.data.user);
                // Update the local context state
                setUser((prevUser) => ({
                    ...prevUser,
                    balance: updatedBalance,
                }));
                console.log(rewards.game)
                console.log(scoreRef.current)
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
            const currentScore = scoreRef.current; // Get the current score from the ref
            console.log("Current score before update:", currentScore);
            updateUserGameBalance(currentScore);
            balanceUpdatedRef.current = true;
        }
        setIsGameOver(true);
    }, [updateUserGameBalance]);

    const checkCollision = useCallback(() => {
        if (doodler.left <= 0) {
            setDirection('right');
        } else if (doodler.left >= 500) {
            setDirection('left');
        }
    }, [doodler.left]);

    useEffect(() => {
        if (!isGameOver) {
            const interval = setInterval(() => {
                checkCollision();
                moveMovingPlatforms();
                if (doodler.isJumping) {
                    jump();
                } else {
                    fall();
                }

                platforms.forEach((platform, index) => {
                    const doodlerTop = doodler.bottom + 100;
                    const doodlerLeft = doodler.left;
                    const doodlerRight = doodler.left + 50;

                    const platformTop = platform.bottom + 20;
                    const platformLeft = platform.left;
                    const platformRight = platform.left + 40;

                    if (
                        doodlerTop >= platform.bottom &&
                        doodler.bottom <= platformTop &&
                        doodlerRight >= platformLeft &&
                        doodlerLeft <= platformRight &&
                        !doodler.isJumping &&
                        doodler.bottom >= platform.bottom - 10 &&
                        doodler.bottom <= platformTop + 10
                    ) {
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                        if (platform.type === 3) {
                            setPlatforms((prevPlatforms) => prevPlatforms.filter((_, i) => i !== index)); // Remove broken platform
                        } else if (platform.type === 4) {
                            gameOver(); // Game over if touching a game over platform
                        }

                        // Check if the platform is higher than the last one
                        setDoodler((prevDoodler) => ({
                            ...prevDoodler,
                            isJumping: true,
                            startPoint: prevDoodler.bottom,
                        }));
                    }
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [checkCollision, doodler, fall, isGameOver, jump, movePlatforms, platforms]);


    const createPlatforms = useCallback(() => {
        const windowHeight = window.innerHeight;
        const visibleHeight = windowHeight - 100; // Adjust based on header/footer or any fixed height
        let platformGap = visibleHeight / platformCount; // Calculate the gap based on platform count

        // Ensure platformGap does not exceed 130
        if (platformGap > 55) {
            platformGap = 55;
        } else if (platformGap <10){
            platformGap=10;
        }

        const newPlatforms = [];
        for (let i = 0; i < platformCount; i++) {
            const newPlatBottom = 200 + i * platformGap;
            const newPlatform = makeOneNewPlatform(newPlatBottom, 0);
            newPlatforms.push(newPlatform);
        }
        return [newPlatforms, newPlatforms[0].left];
    }, [makeOneNewPlatform, platformCount]);

    const createDoodler = useCallback((doodlerBottom, doodlerLeft) => ({
        bottom: doodlerBottom,
        left: doodlerLeft,
        isJumping: true,
        direction: 'none',
        startPoint: startPoint,
    }), []);

    const start = useCallback(() => {
        balanceUpdatedRef.current = false;
        const [newPlatforms, doodlerLeft] = createPlatforms();
        setIsGameOver(false);
        setScore(0);
        setPlatforms(newPlatforms);
        setDoodler(createDoodler(startPoint, doodlerLeft));
    }, [createDoodler, createPlatforms]);
    useEffect(() => {
        // Calculate the number of platforms based on the window size
        const calculatePlatformCount = () => {
            const windowHeight = window.innerHeight;
            const maxGap = 75; // Maximum desired gap between platforms
            const calculatedCount = Math.ceil(windowHeight / maxGap);
            setPlatformCount(calculatedCount);
        };

        calculatePlatformCount(); // Initial calculation

        // Update the platform count when the window is resized
        window.addEventListener('resize', calculatePlatformCount);
        return () => window.removeEventListener('resize', calculatePlatformCount);
    }, []);

    useEffect(() => {
        if (platformCount > 0) {
            const [newPlatforms, doodlerLeft] = createPlatforms();
            setPlatforms(newPlatforms);
        }
    }, [platformCount, createPlatforms]);
    const handleTouchStart = useCallback((event) => {
        const touchX = event.touches[0].clientX;
        const halfScreenWidth = window.innerWidth / 2 + 100;
        if (isGameOver&& user.attempts_left>0  ) {
            fetchUserAttempts(telegram_Id)
            start();
        }
        if (touchX < halfScreenWidth) {
            setDirection('left');
        } else {
            setDirection('right');
        }
    }, [isGameOver, start]);

    const handleTouchEnd = useCallback(() => {
        setDirection('none');
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && isGameOver && user.attempts_left>0) {
            fetchUserAttempts(telegram_Id)
            start();
        } else if (event.key === 'ArrowLeft') {
            setDirection('left');
        } else if (event.key === 'ArrowRight') {
            setDirection('right');
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            setDirection('none');
        }
    }, [isGameOver, start]);

    const fetchUserAttempts = async (telegram_Id) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/update_attempts/`,
                { telegram_id: telegram_Id, action: 'use' });
            if (response.status === 200) {
                // Handle success
                setUser((prevUser) => ({
                    ...prevUser,  // Preserve existing user data
                    attempts_left: response.data.attempts_left  // Update attempts_left field
                }));
                console.log(response.data.attempts_left);
            }
        } catch (error) {
            console.error("Error fetching or using user attempts:", error);
        }
    };
    return (
        <div className="grid" onKeyDown={handleKeyDown} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}  tabIndex="0" >
            {!isGameOver ? (
                <>
                    <div className="score">{score}</div>
                    <Doodler doodler={doodler} direction={direction}/>
                    <Platforms platforms={platforms}/>
                </>
            ) : (
                <div className="_view_sf2n5_1 _view_zhpdf_1" style={{opacity: 1}}>

                    <div class="_title_1x19s_5">DoodleJump <br/>
                        Press Enter or tap the screen to start.
                    </div>
                    <div className="_mascote_94k9d_1 _centered_94k9d_13">
                        <img
                            id="home-mascote"
                            src={`${process.env.PUBLIC_URL}/resources_directory/image_2024-08-03_02-24-40.webp`}
                            className="_doggy_94k9d_6 _width-82_94k9d_23 _mascote_1vo1r_60 _isRendered_1vo1r_63"
                            alt="Mascote"
                        />
                    </div>
                    <div className="instructions">
                        Your balance: {user.balance}
                    </div>
                    {user.attempts_left > 0 ? (
                        <div className="instructions"> Game plays left: {user.attempts_left}</div> ) : (
                        <div className="instructions"> Wait 24hours to play again</div>
            )}
            <div class="_subtitleEmpty_1x19s_19 game_sub_title_ms718"> Use arrow keys or swipe to navigate. Don't hit the floor!
                    </div>

                </div>
            )}
        </div>
    );
}

export default Game;
