import React, { Component } from 'react';
// import { Trans } from 'react-i18next';
import "../dashboard/Dashboard.css"

class Footer extends Component {
    render() {
        // Only render footer if children or valid content is present
        const copyright = (
            <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
                Copyright© <a href="https://ludowins.in/" target="_blank" rel="noopener noreferrer">ludowins.in</a> 2023
            </span>
        );
        return (
            <footer className="footer bg-white" id='dashFooter' style={{ background: 'white' }}>
                <div className="container-fluid">
                    <div className="d-sm-flex justify-content-center justify-content-sm-between py-2 w-100">
                        {copyright}
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;