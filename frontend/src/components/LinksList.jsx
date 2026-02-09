import { useState } from 'react';
import { LinkCard } from './LinkCard';

export const LinksList = ({ links }) => {
    if (!links || links.length === 0) {
        return <div className="empty-state">No links yet. Create your first link above!</div>;
    }

    return (
        <div className="links-list">
            <h2 style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>Your Links ({links.length})</h2>
            <div className="links-grid">
                {links.map((link, index) => (
                    <LinkCard
                        key={link.id}
                        link={link}
                        isLatest={index === 0}
                    />
                ))}
            </div>
        </div>
    );
};
