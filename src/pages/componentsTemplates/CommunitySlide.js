import React from 'react';

const CommunitySlide = ({ title, text, buttonText, url, ton }) => {
    const handleClick = () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        window.open(url, '_blank');
    };

    // Determine background image and other styles based on the title
    const backgroundStyle = title === "WAP Community"
        ? {
            backgroundImage: `url(${process.env.PUBLIC_URL}/resources_directory/Banner.webp)`,
            backgroundSize: 'cover',  // Assuming you want the image to cover the element
            backgroundPositionY: '-30px'
        }
        : {
            backgroundImage: `url(${process.env.PUBLIC_URL}/resources_directory/photo_2024-08-30_12-14-09.webp)`,
            backgroundSize: 'cover',
            backgroundPositionY: '-14px'
        };

    return (
        <div className="swiper-slide swiper-slide-active" style={{ width: "100%" }}>
            <div className="_itemWrap_1xku1_16 _itemWrapFirst_1xku1_20">
                <div className="_item_1xku1_6" style={backgroundStyle}>
                    <div className="_title_1xku1_28">{title}</div>
                    <div className="_text_1xku1_34">{text}</div>
                    <div className="_clide_ton">
                        <div>Bonus:&nbsp;</div>
                        <div style={{ color: "#0cc0df" }}>Earn {ton} $TON</div>
                    </div>
                    <div className="_button_1xku1_41" onClick={handleClick}>{buttonText}</div>
                </div>
            </div>
        </div>
    );
};

export default CommunitySlide;
