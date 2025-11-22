import { Component } from "react";
import "./index.css";
import Cookies from "js-cookie";
import Popup from 'reactjs-popup'; 
import 'reactjs-popup/dist/index.css'; 
import { FaPlus, FaDatabase } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner'; 
import { MdErrorOutline } from "react-icons/md";
import TeamsCard from "../TeamsCard";
import Header from "../Header"

class Teams extends Component {
    state = {
        teamsList: [],
        addName: "",
        addDescription: "",
        addImgUrl: "",
        addErrorMsg: "",
        isLoading: false,
        isError: false,
        isAddLoading: false
    }

    componentDidMount() {
        this.getTeams();
    }

    getTeams = async () => {
        this.setState({ isLoading: true, isError: false });
        const jwtToken = Cookies.get('jwt_token');
        const url = `https://hrms-backend-m0q3.onrender.com/api/teams`;
        const options = {
            headers: { Authorization: `Bearer ${jwtToken}` }
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const teams = await response.json();
                this.setState({ teamsList: teams, isLoading: false });
            } else {
                this.setState({ isLoading: false, isError: true });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            this.setState({ isLoading: false, isError: true });
        }
    }


    handleAddInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }


    addNewTeam = async (close) => {
        const { addName, addDescription, addImgUrl } = this.state;
        const jwtToken = Cookies.get('jwt_token');
        
        this.setState({ isAddLoading: true });

        if (addName === "" || addDescription === "") {
            this.setState({ addErrorMsg: "Name and Description are required", isAddLoading: false });
            return;
        }

        const teamDetails = {
            name: addName,
            description: addDescription,
            imgUrl: addImgUrl
        };

        const url = `https://hrms-backend-m0q3.onrender.com/api/teams`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(teamDetails),
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                this.getTeams();
                this.setState({
                    addName: "",
                    addDescription: "",
                    addImgUrl: "",
                    addErrorMsg: "",
                    isAddLoading: false
                });
                close();
            } else {
                const data = await response.json();
                this.setState({ addErrorMsg: data.error_msg || "Failed to add team", isAddLoading: false });
            }
        } catch (error) {
            this.setState({ addErrorMsg: "Network Error", isAddLoading: false });
        }
    }

    render() {
        const { teamsList, addName, addDescription, addImgUrl, addErrorMsg, isLoading, isError, isAddLoading } = this.state;

        const showTeams = teamsList.length > 0;

        return (
            <>
                <Header />
                <div className="teams-container">
                    
                
                    {showTeams && (
                         <div className="teams-header-actions" style={{marginBottom: '20px', textAlign: 'right', width: '90%', maxWidth: '1110px', margin: '20px auto'}}>
                           
                         </div>
                    )}
                    
                    {isLoading ? (
                        <div className='body-loaders' style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                            <TailSpin height="40" width="40" color="#3b82f6" />
                        </div>
                    ) : isError ? (
                        <div className="error-view" style={{textAlign: 'center', marginTop: '50px'}}>
                            <MdErrorOutline size={40} color="red" />
                            <p>Failed to load teams</p>
                        </div>
                    ) : !showTeams ? (
                        
                        <div className="no-teams-view">
                            <FaDatabase size={40} color="#64748b" />
                            <p className="no-teams-text">No Teams Found</p>
                        </div>
                    ) : (
                       
                        <ul className="teams-list-container">
                            {teamsList.map(item => (
                                <li key={item.id || item.team_id}><TeamsCard item={item} /></li>
                            ))}
                        </ul>
                    )}
                </div>

               
                <Popup
                    trigger={
                        <button className='add-employee-button'>
                            <FaPlus /> Add Team
                        </button>
                    }
                    modal
                    nested
                    contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                    className="add-popup-overlay"
                >
                    {close => (
                        <div className='add-employee-popup-container'>
                            <h2 className='add-employee-title'>Add New Team</h2>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Team Name</label>
                                <input
                                    name="addName"
                                    value={addName}
                                    onChange={this.handleAddInput}
                                    className='add-input-field'
                                    type="text"
                                    placeholder="e.g. Marketing"
                                />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Description</label>
                                <textarea
                                    name="addDescription"
                                    value={addDescription}
                                    onChange={this.handleAddInput}
                                    className='add-input-field'
                                    rows="3"
                                    placeholder="e.g. Handles all social media..."
                                    style={{height: 'auto', resize: 'vertical'}} 
                                />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Image URL</label>
                                <input
                                    name="addImgUrl"
                                    value={addImgUrl}
                                    onChange={this.handleAddInput}
                                    className='add-input-field'
                                    type="text"
                                    placeholder="Image Link"
                                />
                            </div>

                            {addErrorMsg && <p style={{ color: 'red', fontSize: '12px' }}>{addErrorMsg}</p>}

                            <div className='add-popup-buttons'>
                                <button className='cancel-btn' onClick={() => {
                                    close();
                                    this.setState({ addErrorMsg: "" });
                                }}>Cancel</button>
                                
                                <button 
                                    className='submit-btn' 
                                    onClick={() => this.addNewTeam(close)}
                                    disabled={isAddLoading} 
                                    style={{ minWidth: '80px', display: 'flex', justifyContent: 'center' }}
                                >
                                    {isAddLoading ? (
                                        <TailSpin height="18" width="18" color="white" />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </>
        )
    }
}

export default Teams;