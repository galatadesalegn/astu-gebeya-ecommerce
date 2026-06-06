import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Landing from '../components/Landing';

const Home = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'Seller') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/collection', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 animate-pulse">Initializing Atelier</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Landing />;
    }

    return null;
};

export default Home;
