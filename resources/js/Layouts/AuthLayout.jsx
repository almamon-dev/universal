import { Link } from "@inertiajs/react";
import "@/../css/login.css";

export default function AuthLayout({
    children,
    leftImage,
    rightBackgroundImage,
}) {
    return (
        <div className="login-page-wrapper">
            {/* Left Section - Logo */}
            <div className="login-left-section">
                <img
                    src={leftImage || "/img/logo.png"}
                    alt="Logo"
                    className="login-left-logo"
                />
            </div>

            {/* Right Section - Form */}
            <div
                className="login-right-section"
                style={{
                    backgroundImage: rightBackgroundImage
                        ? `url(${rightBackgroundImage})`
                        : undefined,
                }}
            >
                {children}
            </div>
        </div>
    );
}
