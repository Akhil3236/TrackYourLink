import React from 'react';
import { Navbar } from '../components/Navbar';
import './Legal.css';

export const TermsOfService = () => {
    return (
        <div className="legal-page">
            <Navbar />
            <div className="legal-container">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2>1. Agreement to Terms</h2>
                    <p>By accessing our website at TrackYourLink.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                </section>

                <section>
                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on TrackYourLink's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul>
                        <li>modify or copy the materials;</li>
                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>attempt to decompile or reverse engineer any software contained on TrackYourLink's website;</li>
                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Disclaimer</h2>
                    <p>The materials on TrackYourLink's website are provided on an 'as is' basis. TrackYourLink makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>

                <section>
                    <h2>4. Limitations</h2>
                    <p>In no event shall TrackYourLink or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TrackYourLink's website, even if TrackYourLink or a TrackYourLink authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                </section>

                <section>
                    <h2>5. Governing Law</h2>
                    <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                </section>

                <section>
                    <h2>6. Modifications</h2>
                    <p>TrackYourLink may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
                </section>
            </div>
        </div>
    );
};
