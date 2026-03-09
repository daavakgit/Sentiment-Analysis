import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#050505',
                overflow: 'hidden'
            }}
        >
            <video
                autoPlay
                loop
                playsInline
                muted
                className="jsx-63a27d274199709e w-full h-full object-cover [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_70%,transparent_94.5%)] lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.8
                }}
            >
                <source src="/assets/eye.mp4" type="video/mp4" className="jsx-63a27d274199709e" />
            </video>

        </motion.div>
    );
};

export default Preloader;
