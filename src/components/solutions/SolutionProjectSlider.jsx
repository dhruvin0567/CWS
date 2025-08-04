import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  #root {
    overflow-x: hidden;
  }
`;

const SolutionProjectSlider = React.memo(function SolutionProjectSlider({
  slides = [],
}) {
  const [loadedImages, setLoadedImages] = useState({});

  const loaderTimers = useRef({});

  const handleImageLoad = (index) => {
    clearTimeout(loaderTimers.current[index]);
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    clearTimeout(loaderTimers.current[index]);
    setLoadedImages((prev) => ({ ...prev, [index]: "error" }));
  };

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: false,
    focusOnSelect: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <GlobalStyle />
      <section className="section aximo-project-page aximo-section-padding5">
        <div className="container-fluid">
          <Slider {...sliderSettings} className="custom-slider">
            {slides.map((slide, index) => {
              const isLoaded = loadedImages[index];
              const showLoader = isLoaded !== true;

              // Setup delayed loader trigger
              useEffect(() => {
                loaderTimers.current[index] = setTimeout(() => {
                  if (!loadedImages[index]) {
                    setLoadedImages((prev) => ({ ...prev, [index]: false }));
                  }
                }, 300); // Only show loader if image not loaded within 300ms

                return () => clearTimeout(loaderTimers.current[index]);
              }, [index, slide.image]);

              return (
                <div className="slide-item" key={slide.id || index}>
                  <div
                    className="aximo-project-thumb Solution-slider mb-0"
                    style={{ position: "relative", minHeight: "250px" }}
                  >
                    {showLoader && (
                      <div className="image-loader">
                        <div className="aximo-preloader">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    )}
                    {isLoaded !== "error" ? (
                      <img
                        src={slide.image}
                        alt={slide.alt || "Project Image"}
                        loading="lazy"
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="image-error">Image failed to load</div>
                    )}
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
    </>
  );
});

SolutionProjectSlider.displayName = "SolutionProjectSlider";

export default SolutionProjectSlider;
