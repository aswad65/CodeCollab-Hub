import React, { useState, useEffect, useCallback } from 'react';

const LivePreview = ({ serverInstance }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    // Function to handle reloading the iframe
    const handleReload = useCallback(() => {
        setReloadKey((prevKey) => prevKey + 1);
    }, []);

    useEffect(() => {
        if (!serverInstance) return;

        // Handler for the 'server-ready' event
        const handleServerReady = (url) => {
            // Depending on how the event is emitted, the arguments might vary. 
            // The prompt mentions: instance.on('server-ready', (port, url) => { setIframeUrl(url); })
            // So we interpret the arguments accordingly.
            // If the signature is (port, url), we take the second argument.
            // However, usually event handlers might receive a single object or varied args. 
            // We'll wrap it to be safe or define it exactly as requested.
            // Requested: instance.on('server-ready', (port, url) => { setIframeUrl(url); })
        };

        // We need to attach the specific listener. 
        // Since `serverInstance` is likely an EventEmitter, we use .on()
        // We'll assume the standard Node.js EventEmitter or a similar interface.

        const onServerReady = (port, url) => {
            if (url) {
                setIframeUrl(url);
            }
        };

        serverInstance.on('server-ready', onServerReady);

        // Cleanup listener on unmount
        return () => {
            // dynamic check for off or removeListener
            if (serverInstance.off) {
                serverInstance.off('server-ready', onServerReady);
            } else if (serverInstance.removeListener) {
                serverInstance.removeListener('server-ready', onServerReady);
            }
        };
    }, [serverInstance]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>
                    <span style={styles.statusDot(iframeUrl ? 'online' : 'offline')}></span>
                    Live Preview
                </div>
                <button
                    onClick={handleReload}
                    style={styles.reloadButton}
                    title="Reload Preview"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 1 8.49 15"></path>
                    </svg>
                    Reload
                </button>
            </div>

            <div style={styles.previewArea}>
                {iframeUrl ? (
                    <iframe
                        key={reloadKey}
                        src={iframeUrl}
                        style={styles.iframe}
                        title="Live Server Preview"
                        /**
                         * SECURITY & SHAREDARRAYBUFFER REQUIREMENTS:
                         * 
                         * 1. allow="cross-origin-isolated":
                         *    This iframe attribute allows the document inside to claim it is cross-origin isolated.
                         *    This is CRITICAL for using features like `SharedArrayBuffer` (needed for WebContainers, Web Workers with shared memory, etc.).
                         * 
                         * 2. sandbox="allow-scripts allow-same-origin":
                         *    - `allow-scripts`: Enables JavaScript execution.
                         *    - `allow-same-origin`: Allows the iframe to interact with its origin (though often restricted by COOP/COEP).
                         *      IMPORTANT: When Combined with `cross-origin-isolated`, the server serving the iframe content MUST send specific headers.
                         * 
                         * SERVER-SIDE HEADER REQUIREMENTS:
                         * To make `SharedArrayBuffer` work (avoiding DataCloneError), the server responding with the iframe content 
                         * (the URL loaded in `src`) MUST include these headers:
                         * 
                         *    Cross-Origin-Opener-Policy: same-origin
                         *    Cross-Origin-Embedder-Policy: require-corp
                         *    (And optionally: Cross-Origin-Resource-Policy: cross-origin)
                         * 
                         * If these headers are missing on the served content, the browser will block SharedArrayBuffer 
                         * even if correct attributes are set here.
                         */
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        allow="cross-origin-isolated; clipboard-read; clipboard-write;"
                    />
                ) : (
                    <div style={styles.placeholder}>
                        <div style={styles.placeholderContent}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            <p>No preview URL</p>
                            <span style={styles.subtext}>Start the server to see the live output</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #333', // Dark border assuming dark mode
        backgroundColor: '#0d1117',   // Dark background (GitHub-style dark)
        color: '#c9d1d9',
        overflow: 'hidden',
    },
    header: {
        padding: '8px 16px',
        borderBottom: '1px solid #333',
        backgroundColor: '#161b22',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40px',
        flexShrink: 0,
    },
    title: {
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusDot: (status) => ({
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: status === 'online' ? '#2ea043' : '#6e7681',
        boxShadow: status === 'online' ? '0 0 6px rgba(46, 160, 67, 0.4)' : 'none',
    }),
    reloadButton: {
        background: 'none',
        border: '1px solid #30363d',
        borderRadius: '4px',
        color: '#c9d1d9',
        cursor: 'pointer',
        padding: '4px 8px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s ease',
    },
    previewArea: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff', // Iframe content usually likes white background unless server serves dark
        overflow: 'hidden',
    },
    iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d1117', // Match container bg for placeholder
        color: '#8b949e',
    },
    placeholderContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    subtext: {
        fontSize: '12px',
        color: '#484f58',
        marginTop: '4px',
    }
};

export default LivePreview;
