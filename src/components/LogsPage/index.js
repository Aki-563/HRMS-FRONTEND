import { Component } from 'react';
import "./index.css"
import Header from "../Header"
import Cookies from "js-cookie"

import { TailSpin } from 'react-loader-spinner';
import { MdErrorOutline } from "react-icons/md";

class LogsPage extends Component {
    state = { 
        logsList: [],
        isLoading: true,
        isError: false 
    }

    componentDidMount() {
        this.getLogs()
    }

    getLogs = async () => {
        this.setState({ isLoading: true, isError: false });
        
        const jwtToken = Cookies.get("jwt_token");
        const url = "https://hrms-backend-turso.vercel.app/api/logs"
        const option = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            }
        }
        try {
            const response = await fetch(url, option);
            if (response.ok) {
                const data = await response.json() 
                this.setState({ 
                    logsList: data,
                    isLoading: false 
                });
            } else {
                
                this.setState({ isLoading: false, isError: true });
            }
        } catch (error) {
            console.error(error);
            this.setState({ isLoading: false, isError: true });
        }
    }

    render() {
        const { logsList, isLoading, isError } = this.state;

        return (
            <>
                <Header/>
                <div className="logs-container">
                    <div className='logs-heading'><h1>Logs</h1></div>
                    
                    {isLoading ? (
                        
                        <div className="loader-container" style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                            <TailSpin height="50" width="50" color="#3b82f6" />
                        </div>
                    ) : isError ? (
                        
                        <div className="error-view" style={{textAlign: 'center', marginTop: '100px'}}>
                            <MdErrorOutline size={50} color="red" />
                            <h2>Failed to load logs</h2>
                            <button 
                                onClick={this.getLogs} 
                                style={{
                                    marginTop: '10px', 
                                    padding: '8px 16px', 
                                    cursor:'pointer', 
                                    backgroundColor: '#3b82f6', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                       
                        <ul className='logs-item-container'>
                            {logsList.length > 0 ? (
                                logsList.map((log) => (
                                    <li key={log.id}> 
                                        <div className='logs'>
                                            <p>{log.timestamp}--</p>
                                            <p>--{log.action}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p style={{textAlign: 'center', color: 'gray'}}>No logs available.</p>
                            )}
                        </ul>
                    )}
                </div>
            </>
        );
    }
}

export default LogsPage;