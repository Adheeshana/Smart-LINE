import React, { useEffect } from 'react';
import './Snowfall.css';

const Snowfall = () => {
  useEffect(() => {
    const snowContainer = document.querySelector('.snowfall-container');
    if (!snowContainer) return;

    // Create snowflakes
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      snowflake.style.opacity = Math.random() * 0.5 + 0.5;
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.animationDelay = Math.random() * 2 + 's';
      snowContainer.appendChild(snowflake);

      // Remove snowflake after animation
      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    };

    // Create snowflakes continuously
    const interval = setInterval(createSnowflake, 100);

    return () => clearInterval(interval);
  }, []);

  return <div className="snowfall-container"></div>;
};

export default Snowfall;
