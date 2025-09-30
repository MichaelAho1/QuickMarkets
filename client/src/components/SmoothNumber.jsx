import React, { useState, useEffect, useRef } from 'react';
import styles from './SmoothNumber.module.css';

const SmoothNumber = ({ 
    value, 
    format = 'number', 
    duration = 300,
    className = '',
    prefix = '',
    suffix = '',
    decimals = 2
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef(null);
    const previousValue = useRef(value);

    useEffect(() => {
        if (value !== previousValue.current) {
            setIsAnimating(true);
            
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            const startValue = previousValue.current;
            const endValue = value;
            const startTime = performance.now(); 

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (endValue - startValue) * easeOutCubic;
                
                setDisplayValue(currentValue);
                
                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setIsAnimating(false);
                    previousValue.current = value;
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        }
    }, [value, duration]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const formatValue = (val) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(val);
        } else if (format === 'percentage') {
            return `${val.toFixed(decimals)}%`;
        } else if (format === 'number') {
            return val.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }
        return val.toString();
    };

    return (
        <span 
            className={`${styles.smoothNumber} ${isAnimating ? styles.animating : ''} ${className}`}
        >
            {prefix}{formatValue(displayValue)}{suffix}
        </span>
    );
};

export default SmoothNumber;
