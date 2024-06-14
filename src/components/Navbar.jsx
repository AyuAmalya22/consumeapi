import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false);
    const [authUser, setAuthUser] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.get('http://localhost:8000/profile', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            })
            .then(res => {
                console.log('Profile Data:', res.data); // Tambahkan log ini
                setIsLogin(true);
                setAuthUser(res.data.data);
                if (location.pathname === '/login') {
                    navigate('/Profile');
                }
            })
            .catch(err => {
                console.error('Error:', err); // Tambahkan log ini
                setIsLogin(false);
                if (err.response && err.response.status === 401 && location.pathname !== '/login') {
                    navigate('/login?message=' + encodeURIComponent('Anda belum login'));
                }
            });
        } else {
            if (location.pathname !== '/login') {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        }
    }, [navigate, location]);

    return (
        <div className="bg-blue-600 py-2">
            <div className="grid grid-cols-12">
                <section className="col-span-10 col-start-2">
                    <div className="flex items-center">
                        <div>
                            <Link className="mr-2 text-sm font-semibold uppercase text-white" to="/Dashboard">
                                INVENTARIS APP
                            </Link>
                            <Link to="/login"><small className="text-white">Login</small></Link>
                            {isLogin ? (
                                authUser.role === 'admin' ? (
                                    <>
                                        <Link to="/stuffs"><small className="text-white ms-3">Stuffs</small></Link>
                                        <Link to="/inbound-stuffs"><small className="text-white ms-3">Inbound</small></Link>
                                        <Link to="/lending"><small className="text-white ms-3">Lending</small></Link>
                                        <Link to="/user"><small className="text-white ms-3">User</small></Link>
                                    </>
                                ) : (
                                    <Link to="/lending"><small className="text-white ms-3">Lending</small></Link>
                                )
                            ) : ''}
                        </div>
                        {isLogin && <Link to="/profile"><small className="text-white">Profile</small></Link>}
                    </div>
                </section>
            </div>
        </div>
    );
}
