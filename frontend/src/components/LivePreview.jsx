import React, { useState, useEffect } from 'react';

const LivePreview = ({ serverInstance }) => {
    const [iframeUrl, setIframeUrl] = useState('');

    useEffect(() => {
        if (!serverInstance) return;

        // Listen for the server-ready event to get the URL
        // We update the state so the user can see the link is ready
        const handleServerReady = (port, url) => {
            if (url) {
                setIframeUrl(url);
            }
        };

        serverInstance.on('server-ready', handleServerReady);

        return () => {
            // Cleanup listener if possible (depends on EventEmitter implementation)
            if (serverInstance.off) {
                serverInstance.off('server-ready', handleServerReady);
            } else if (serverInstance.removeListener) {
                serverInstance.removeListener('server-ready', handleServerReady);
            }
        };
    }, [serverInstance]);

    /**
     * WHY OPEN IN A NEW TAB?
     * 
     * Opening the preview in a new tab avoids the "SharedArrayBuffer transfer requires self.crossOriginIsolated" error
     * because the previewed content runs in its own top-level browsing context, rather than being embedded in an iframe.
     * 
     * When embedded in an iframe, the parent page (this React app) must be cross-origin isolated (COOP/COEP headers) 
     * for the iframe to use SharedArrayBuffer securely. By moving it to a new tab, the previewed app operates independently 
     * of the parent app's security context.
     */
    const handleOpenInNewTab = () => {
        if (iframeUrl) {
            window.open(iframeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.iconWrapper}>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: iframeUrl ? '#2ea043' : '#6e7681' }}
                    >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>

                <h3 style={styles.title}>
                    {iframeUrl ? "Server is Running" : "Waiting for Server..."}
                </h3>

                <p style={styles.description}>
                    {iframeUrl
                        ? "Your application is ready. Click the button below to view it in a new tab."
                        : "Start the server to generate a live preview URL."}
                </p>

                <button
                    onClick={handleOpenInNewTab}
                    disabled={!iframeUrl}
                    style={{
                        ...styles.button,
                        opacity: iframeUrl ? 1 : 0.5,
                        cursor: iframeUrl ? 'pointer' : 'not-allowed',
                    }}
                >
                    <span>Open Preview in New Tab</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </button>

                {iframeUrl && (
                    <div style={styles.urlDisplay}>
                        URL: <a href={iframeUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>{iframeUrl}</a>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        borderLeft: '1px solid #30363d',
        padding: '2rem',
        boxSizing: 'border-box',
    },
    content: {
        maxWidth: '400px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
    },
    iconWrapper: {
        marginBottom: '1rem',
        padding: '1.5rem',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#f0f6fc',
    },
    description: {
        margin: 0,
        fontSize: '0.95rem',
        color: '#8b949e',
        lineHeight: 1.5,
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#238636',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '0.75rem 1.5rem',
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'background-color 0.2s',
        marginTop: '0.5rem',
    },
    urlDisplay: {
        fontSize: '0.85rem',
        color: '#8b949e',
        marginTop: '1rem',
        wordBreak: 'break-all',
    },
    link: {
        color: '#58a6ff',
        textDecoration: 'none',
    }
};

export default LivePreview;
