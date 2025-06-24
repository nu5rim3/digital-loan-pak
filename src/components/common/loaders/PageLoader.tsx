import React, { useState, useEffect } from "react";
import Logo2 from '../../../assets/full_logo_black.png';

const PageLoader = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 300); // 300ms delay
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="w-screen h-screen backdrop-blur-sm bg-primary-50/70 flex justify-center items-center bg-transparent">
            <img className="w-20 mb-10 animate-ping" src={Logo2} alt="Loading..." />
        </div>
    );
};

export default PageLoader;