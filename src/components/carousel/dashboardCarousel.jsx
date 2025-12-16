import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./dashboardCarousel.css";

const slides = [
  {
    img: "/promo1.png",
    title: "Get 5% Cash Back",
    desc: "Earn rewards on groceries, dining, and more.",
  },
  {
    img: "/promo2.png",
    title: "Save Smarter",
    desc: "High-yield savings accounts up to 4.5% APY.",
  },
  {
    img: "/promo3.png",
    title: "Travel Rewards",
    desc: "Enjoy free flights and hotel stays with points.",
  },
];

const DashboardCarousel = () => {
  return (
    <div className="carousel_container">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide_content">
              <img src={slide.img} alt={slide.title} className="slide_image" />
              <div className="slide_overlay">
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DashboardCarousel;
