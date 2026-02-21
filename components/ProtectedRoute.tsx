import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validateToken } from '../src/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('chuvisco_auth_token');
            const isValid = await validateToken(token);
            setIsAuthorized(isValid);
        };
        checkAuth();
    }, [location.pathname]);

    // Enquanto valida a assinatura do token, mostra um loading discreto
    if (isAuthorized === null) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#f8faf7]">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        // Remove token inválido se existir
        localStorage.removeItem('chuvisco_auth_token');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
