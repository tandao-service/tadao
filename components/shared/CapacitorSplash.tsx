'use client';

import { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';

export default function CapacitorSplash() {
    const [visible, setVisible] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // Hide the native splash ASAP (no-op on web)
        SplashScreen.hide().catch(() => { });

        const done = () => {
            // fade out the overlay, then unmount
            setOpacity(0);
            setTimeout(() => setVisible(false), 1000);
        };

        if (document.readyState === 'complete') {
            done();
            return;
        }

        window.addEventListener('load', done, { once: true });
        return () => window.removeEventListener('load', done);
    }, []);

    if (!visible) return null;

    return (
        <div
            id="app-splash"
            aria-label="Launching Tadao Market"
            style={{
                position: 'fixed',
                inset: 0,
                background: '#f97316',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                transition: 'opacity 250ms ease',
                opacity,
            }}
        >
            <img
                src="/logo_white.png"
                alt="Tadao Market"
                width={128}
                height={128}
                style={{ marginBottom: 12 }}
            />
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, letterSpacing: 0.3 }}>
                Tadao Market
            </div>
            <div style={{ marginTop: 6, color: '#fff', opacity: 0.92, fontSize: 14 }}>
                Buy and Sell Anything, Anytime, Anywhere
            </div>
        </div>
    );
}
