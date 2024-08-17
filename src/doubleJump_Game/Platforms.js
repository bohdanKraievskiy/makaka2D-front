import React from 'react';

function Platforms({ platforms, onPlatformClick }) {
    return platforms.map((platform, index) => (
        <div
            key={index}
            className={`platform ${platform.type === 3 ? 'freezing' : ''} ${platform.type === 4 ? 'deadly' : ''}`}
            style={{
                left: `${platform.left}px`,
                bottom: `${platform.bottom}px`,
                width: platform.type === 2 ? '75px' : '60px', // Платформы типа 2 меньше
            }}
            onClick={() => onPlatformClick(index, platform.type, platform.left, platform.bottom)}
            onTouchStart={() => onPlatformClick(index, platform.type, platform.left, platform.bottom)}
        >
            <img draggable={false}
                 src={`${process.env.PUBLIC_URL}/resources_directory/platform_type_${platform.type}.webp`}
                 alt={`Platform type ${platform.type}`}
            />
        </div>
    ));
}

function Points({ points, position }) {
    return (
        <div
            className="points"
            style={{
                left: `${position.left}px`,
                bottom: `${position.bottom}px`,
            }}
        >
            {points}
        </div>
    );
}

export { Platforms, Points };
