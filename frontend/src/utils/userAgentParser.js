/**
 * Parse User Agent string and extract meaningful information
 */
export const parseUserAgent = (userAgent) => {
    if (!userAgent) {
        return {
            browser: 'Unknown',
            browserVersion: 'N/A',
            os: 'Unknown',
            osVersion: 'N/A',
            device: 'Desktop',
            platform: 'Unknown'
        };
    }

    const ua = userAgent;
    let browser = 'Unknown';
    let browserVersion = 'N/A';
    let os = 'Unknown';
    let osVersion = 'N/A';
    let device = 'Desktop';
    let platform = 'Unknown';

    // Detect Browser
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browser = 'Chrome';
        const match = ua.match(/Chrome\/([\d.]+)/);
        browserVersion = match ? match[1] : 'N/A';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
        const match = ua.match(/Version\/([\d.]+)/);
        browserVersion = match ? match[1] : 'N/A';
    } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        const match = ua.match(/Firefox\/([\d.]+)/);
        browserVersion = match ? match[1] : 'N/A';
    } else if (ua.includes('Edg')) {
        browser = 'Edge';
        const match = ua.match(/Edg\/([\d.]+)/);
        browserVersion = match ? match[1] : 'N/A';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
        browser = 'Opera';
        const match = ua.match(/(?:Opera|OPR)\/([\d.]+)/);
        browserVersion = match ? match[1] : 'N/A';
    }

    // Detect Operating System
    if (ua.includes('Windows NT 10.0')) {
        os = 'Windows';
        osVersion = '10/11';
    } else if (ua.includes('Windows NT 6.3')) {
        os = 'Windows';
        osVersion = '8.1';
    } else if (ua.includes('Windows NT 6.2')) {
        os = 'Windows';
        osVersion = '8';
    } else if (ua.includes('Windows NT 6.1')) {
        os = 'Windows';
        osVersion = '7';
    } else if (ua.includes('Mac OS X')) {
        os = 'macOS';
        const match = ua.match(/Mac OS X ([\d_]+)/);
        if (match) {
            osVersion = match[1].replace(/_/g, '.');
        }
    } else if (ua.includes('Linux')) {
        os = 'Linux';
        if (ua.includes('Ubuntu')) osVersion = 'Ubuntu';
        else if (ua.includes('Fedora')) osVersion = 'Fedora';
    } else if (ua.includes('Android')) {
        os = 'Android';
        const match = ua.match(/Android ([\d.]+)/);
        osVersion = match ? match[1] : 'N/A';
        device = 'Mobile';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
        os = 'iOS';
        const match = ua.match(/OS ([\d_]+)/);
        if (match) {
            osVersion = match[1].replace(/_/g, '.');
        }
        device = ua.includes('iPad') ? 'Tablet' : 'Mobile';
    }

    // Detect Platform
    if (ua.includes('Win64') || ua.includes('x64')) {
        platform = '64-bit';
    } else if (ua.includes('Win32') || ua.includes('x86')) {
        platform = '32-bit';
    } else if (ua.includes('Intel Mac')) {
        platform = 'Intel';
    } else if (ua.includes('ARM')) {
        platform = 'ARM';
    }

    // Detect Device Type
    if (ua.includes('Mobile')) {
        device = 'Mobile';
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
        device = 'Tablet';
    }

    return {
        browser,
        browserVersion,
        os,
        osVersion,
        device,
        platform,
        raw: userAgent
    };
};
