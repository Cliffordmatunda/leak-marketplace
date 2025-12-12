import { memo } from 'react';

// Using memo() guarantees this component NEVER re-renders unless props change.
// Typing in the login form will no longer affect this animation.
const AnimatedBackground = memo(() => {
    return (
        <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform translate-z-0"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform translate-z-0"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 will-change-transform translate-z-0"></div>
        </>
    );
});

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;