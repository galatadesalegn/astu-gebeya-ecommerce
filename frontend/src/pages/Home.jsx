import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Landing from '../components/Landing';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'Seller') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/collection', { replace: true });
            }
        }
    }, [user, navigate]);

    if (!user) {
        return <Landing />;
    }

    return null; // Will redirect via useEffect
};

export default Home;
