import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';

const SliderBox = ({ items, moveGap = 3 }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const onNext = () => {
        if (activeIndex < items.length - moveGap) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const responsive = {
        0: {
            items: 3
        }
    };

    return (
        <div className="carousel-block">
            <AliceCarousel
                responsive={responsive}
                disableButtonsControls={true}
                disableDotsControls={true}
                paddingLeft={100}
                paddingRight={100}
                activeIndex={activeIndex}
                items={items}
                touchTracking={true}
            /> 
            <div className="btn-prev-slider" onClick={onPrev}>&lang;</div>
            <div className="btn-next-slider" onClick={onNext}>&rang;</div>
        </div>
    );
};

export default SliderBox;