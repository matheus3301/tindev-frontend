import React, { useEffect, useState} from 'react';

import io from 'socket.io-client';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import deslike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';


import './Main.css';

import api from '../services/api';


export default function Main({match}){
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(false);


    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs',{
                headers:{
                    user:match.params.id,
                }
            });

            setUsers(response.data);
           
        }

        loadUsers();

    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333',{
            query: {
                user : match.params.id
            }
        });

        socket.on('match', dev => {
            console.log(dev);
            setMatchDev(dev);
        })
        
        

    }, [match.params.id]);

    async function handleLike(id){
        console.log(`like ${id}`);

        await api.post(`/devs/${id}/like`,null,{
            headers:{
                user:match.params.id
            }
        });

        setUsers(users.filter(user => user._id !== id));

    }

    async function handleDeslike(id){
        console.log(`deslike ${id}`);

        await api.post(`/devs/${id}/deslike`,null,{
            headers:{user:match.params.id}
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return(
        <div className="main-container">
            <img src={logo} alt="logo"/>
                {users.length > 0 ? (
                    <ul>
                          {users.map(user =>(
                            <li key={user._id}>
                            <img src={user.avatar} alt={user.name}/>
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                                

                            </footer>
                            <div className="buttons">
                                    <button type="button" onClick={() => {handleDeslike(user._id)} }>
                                        <img src={deslike} alt="Deslike"/>
                                    </button>
                                    <button type="button" onClick={() => {handleLike(user._id)}}>
                                        <img src={like} alt="Like"/>    
                                    </button>
                                </div>
                    
                        </li>
                        ))}
                
  
                    </ul>
                ):(<div className="empty">
                    Acabou :'(
                </div> )}

                {matchDev && (
                    <div className="match-container">
                        <img src={itsamatch} alt="MATCH"/>
                        <img className="avatar" src={matchDev.avatar} alt={matchDev.user}/>
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        <button type='button' onClick={() => setMatchDev(null)}>FECHAR</button>

                    </div>
                )}
               
        </div>
    );
}