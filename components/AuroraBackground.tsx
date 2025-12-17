'use client';

import { Box } from '@mui/material';
import React from 'react';

const AuroraBackground = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                background: '#030512', // Deep Void
            }}
        >
            {/* Ambient Orb 1: Primary Cyan/Blue */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '50vw',
                    height: '50vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    animation: 'float 20s infinite alternate',
                }}
            />

            {/* Ambient Orb 2: Accent Magenta */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(80px)',
                    animation: 'float-delayed 25s infinite alternate-reverse',
                }}
            />

            {/* Ambient Orb 3: Deep Indigio Center */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '30%',
                    width: '40vw',
                    height: '40vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(100px)',
                    animation: 'pulse 15s infinite alternate',
                }}
            />

            {/* Grid Overlay (Optional, extremely subtle) */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                    opacity: 0.2, // Very subtle
                    pointerEvents: 'none'
                }}
            />

            <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10%, 10%) rotate(5deg); }
          100% { transform: translate(-5%, 5%) rotate(-5deg); }
        }
        @keyframes float-delayed {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, -5%) scale(1.1); }
          100% { transform: translate(5%, -10%) scale(0.9); }
        }
        @keyframes pulse {
            0% { opacity: 0.5; transform: scale(0.9); }
            100% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
        </Box>
    );
};

export default AuroraBackground;
