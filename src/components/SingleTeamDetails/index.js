import { Component } from "react"
import "./index.css"
import Cookies from "js-cookie"
import Header from "../Header"
import EmployeeListItemForTeam from "../EmployeeListItemForTeam"
import Popup from "reactjs-popup";
import EmpList from "../List"
import { MdDelete, MdErrorOutline } from "react-icons/md"; 
import { FaEdit, FaPlus } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner'; 
import { RiTeamFill } from "react-icons/ri";


const API_BASE_URL = "https://hrms-backend-turso.vercel.app/api";

class SingleTeamDetails extends Component {
    state = {
        teamData: {},
        description: "",
        employees: [],
        img_url: "",
        name: "",
        editName: "",
        editDescription: "",
        editImgUrl: "",
        updateError: "",
        checkedIds: [],
        employeesOutside: [],
        employeesToAdd: [],
        isLoading: true,
        isError: false,
        isEditLoading: false,
        isDeleteLoading: false,
        isUnassignLoading: false,
        isAssignLoading: false
    }

    componentDidMount() {
        this.getAllData();
    }

    getAllData = async () => {
        this.setState({ isLoading: true, isError: false });
        try {
          
            await this.getTeamDetails();
            await this.getEmployeesNotInTeam();
            
    
            if (!this.state.isError) {
                 this.setState({ isLoading: false });
            }
        } catch (error) {
            this.setState({ isLoading: false, isError: true });
        }
    }

    getEmployeesNotInTeam = async () => {
        const { id } = this.props.match.params;
        const jwtToken = Cookies.get("jwt_token");
        const url = `${API_BASE_URL}/teams/${id}/available-employees`;

        const options = {
            headers: { Authorization: `Bearer ${jwtToken}` },
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const employeesList = await response.json();
                this.setState({ employeesOutside: employeesList });
            }
        } catch (error) {
            console.error("Error fetching available employees:", error);
        }
    }

    getTeamDetails = async () => {
        const { id } = this.props.match.params;
        const jwtToken = Cookies.get("jwt_token");
        const url = `${API_BASE_URL}/teams/${id}`;

        const options = {
            headers: { Authorization: `Bearer ${jwtToken}` },
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const team = await response.json();
                this.setState({
                    teamData: team,
                    description: team.description,
                    employees: team.employees,
                    img_url: team.img_url,
                    name: team.name,
                    editName: team.name,
                    editDescription: team.description,
                    editImgUrl: team.img_url,
                    isError: false 
                });
            } else {
                this.setState({ isError: true, isLoading: false });
            }
        } catch (error) {
            console.error("Error fetching team details:", error);
            this.setState({ isError: true, isLoading: false });
        }
    }

    handleEditInput = (event) => {
        this.setState({ [event.target.name]: event.target.value, updateError: "" });
    }

    updateTeam = async (close) => {
        const { id } = this.props.match.params;
        const { editName, editDescription, editImgUrl } = this.state;
        const jwtToken = Cookies.get("jwt_token");

        this.setState({ isEditLoading: true });

        if (editName === "" || editDescription === "") {
            this.setState({ updateError: "Name and Description are required", isEditLoading: false });
            return;
        }

        const teamDetails = {
            name: editName,
            description: editDescription,
            imgUrl: editImgUrl
        };

        const url = `${API_BASE_URL}/teams/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(teamDetails),
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                await this.getTeamDetails();
                this.setState({ isEditLoading: false });
                close();
            } else {
                const data = await response.json();
                this.setState({ updateError: data.error_msg || "Failed to update team", isEditLoading: false });
            }
        } catch (error) {
            this.setState({ updateError: "Network Error", isEditLoading: false });
        }
    }

    deleteTeam = async (close) => {
        const { id } = this.props.match.params;
        const { history } = this.props;
        const jwtToken = Cookies.get("jwt_token");

        this.setState({ isDeleteLoading: true });

        const url = `${API_BASE_URL}/teams/${id}`;
        const options = {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwtToken}` }
        }

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                close();
                alert("Team deleted successfully");
                history.goBack();
            } else {
                this.setState({ isDeleteLoading: false });
                alert("Failed to delete Team");
            }
        } catch (error) {
            this.setState({ isDeleteLoading: false });
            console.log("Error deleting:", error);
        }
    };

    checked = (id) => {
        this.setState(prev => ({
            checkedIds: prev.checkedIds.includes(id)
                ? prev.checkedIds.filter(each => each !== id)
                : [...prev.checkedIds, id]
        }));
    };

    unassign = async () => {
        const { id } = this.props.match.params;
        const { checkedIds } = this.state;
        const jwtToken = Cookies.get("jwt_token");

        this.setState({ isUnassignLoading: true });

        const ids = { employeeIds: checkedIds };
        const url = `${API_BASE_URL}/teams/${id}/unassign`;

        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(ids),
        }

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                await this.getTeamDetails();
                await this.getEmployeesNotInTeam(); 
                this.setState({ checkedIds: [], isUnassignLoading: false });
            } else {
                const data = await response.json();
                alert(data.error_msg || "Failed to unassign");
                this.setState({ isUnassignLoading: false });
            }
        } catch (error) {
            console.error(error);
            alert("Network Error");
            this.setState({ isUnassignLoading: false });
        }
    }

    addEmpIds = (id) => {
        this.setState(prev => ({
            employeesToAdd: prev.employeesToAdd.includes(id)
                ? prev.employeesToAdd.filter(each => each !== id)
                : [...prev.employeesToAdd, id]
        }));
    }

    addEmployeesToTeam = async (close) => {
        const { employeesToAdd } = this.state;
        
        if(employeesToAdd.length === 0) {
            alert("Please select at least one employee");
            return;
        }

        this.setState({ isAssignLoading: true });

        const { id } = this.props.match.params;
        const jwtToken = Cookies.get("jwt_token");

        const ids = { employeeIds: employeesToAdd };
        const url = `${API_BASE_URL}/teams/${id}/assign`;

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(ids),
        }
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                await this.getTeamDetails();
                this.setState({ employeesToAdd: [], isAssignLoading: false });
                await this.getEmployeesNotInTeam();
                
                if (close) close(); 
            } else {
                const data = await response.json();
                alert(data.error_msg || "Failed to assign");
                this.setState({ isAssignLoading: false });
            }
        } catch (error) {
            console.error(error);
            alert("Network Error");
            this.setState({ isAssignLoading: false });
        }
    }

    render() {
        const { 
            employeesToAdd, description, employees, img_url, name, 
            editName, editDescription, editImgUrl, updateError, 
            checkedIds, employeesOutside, teamData,
            isLoading, isError, isEditLoading, isDeleteLoading, isUnassignLoading, isAssignLoading
        } = this.state;

        

        if (isLoading) {
            return (
                <>
                    <Header />
                    <div className="loader-container" style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                        <TailSpin height="50" width="50" color="#3b82f6" />
                    </div>
                </>
            );
        }

 
        if (isError) {
            return (
                <>
                    <Header />
                    <div className="error-view" style={{textAlign: 'center', marginTop: '100px'}}>
                        <MdErrorOutline size={50} color="red" />
                        <h2>Failed to Load Team Details</h2>
                        
                    </div>
                </>
            )
        }

        return (
            <>
                <Header />
                <div className="team-container">
                    <div className="team-action-container">
                        

                        <div className="edit-team">
                            <Popup
                                trigger={<button className="edit-btn-trigger"><FaEdit className="edit-icon grey-color" /></button>}
                                modal nested
                                contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                            >
                                {(close) => (
                                    <div className="employee-edit-popup">
                                        <h2>Edit Team</h2>
                                        <div className="employee-edit-container">
                                            <div className="add-input-group">
                                                <label className="add-input-label">Team Name</label>
                                                <input name="editName" value={editName} onChange={this.handleEditInput} className="add-input-field" type="text" />
                                            </div>
                                            <div className="add-input-group">
                                                <label className="add-input-label">Description</label>
                                                <textarea name="editDescription" value={editDescription} onChange={this.handleEditInput} className="add-input-field" rows="3" style={{ height: 'auto', resize: 'vertical' }} />
                                            </div>
                                            <div className="add-input-group">
                                                <label className="add-input-label">Image URL</label>
                                                <input name="editImgUrl" value={editImgUrl} onChange={this.handleEditInput} className="add-input-field" type="text" />
                                            </div>
                                            {updateError && <p style={{ color: 'red', fontSize: '12px' }}>{updateError}</p>}
                                            <div className="popup-buttons">
                                                <button className="cancel-btn" onClick={() => {
                                                    close();
                                                    this.setState({ editName: name, editDescription: description, editImgUrl: img_url, updateError: "" });
                                                }}>Cancel</button>
                                                
                                                <button 
                                                    className="submit-btn" 
                                                    onClick={() => this.updateTeam(close)}
                                                    disabled={isEditLoading}
                                                    style={{minWidth: '60px', display: 'flex', justifyContent: 'center'}}
                                                >
                                                    {isEditLoading ? <TailSpin height="15" width="15" color="white" /> : "Update"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </div>

                        <div className="delete-team">
                            <Popup
                                trigger={<button className="edit-btn-trigger"><MdDelete className="edit-icon delete-user grey-color" /></button>}
                                modal nested
                                contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                            >
                                {(close) => (
                                    <div className="employee-edit-popup delete-popup">
                                        <h2>Delete Team</h2>
                                        <div className="delete-container">
                                            <p className="delete-confirmation-text">Are you sure you want to delete this Team?</p>
                                            <div className="delete-popup-buttons">
                                                <button className="delete-cancel cancel-btn" onClick={close}>Cancel</button>
                                                <button 
                                                    className="submit-btn delete" 
                                                    onClick={() => this.deleteTeam(close)}
                                                    disabled={isDeleteLoading}
                                                    style={{minWidth: '60px', display: 'flex', justifyContent: 'center'}}
                                                >
                                                    {isDeleteLoading ? <TailSpin height="15" width="15" color="white" /> : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>

                    <div className="team-details">
                        <div className="team-img-container">
                            {img_url.length > 20? <img src={img_url} alt="team img" className="team-img" />: <RiTeamFill  className="teams-icon"/>}
                        </div>
                        <div className="team-details-text-container">
                            <div className="team-details-container1">
                                <h1 className="team-name">{name}</h1>
                            </div>
                            <div className="team-details-container2">
                                <p className="team-des">{description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="unassign-container">
                        {checkedIds.length !== 0 && (
                            <button 
                                className="unassign-button" 
                                onClick={this.unassign}
                                disabled={isUnassignLoading}
                               
                            >
                                {isUnassignLoading? (<TailSpin height="15" width="15" color="white" />):("Unassign from Team")}
                                
                            </button>
                        )}
                    </div>

                    {(employees && employees.length > 0) ?<ul className="team-employees-list">
                        {employees && employees.map(eachEmp => (
                            <li key={eachEmp.id}>
                                <EmployeeListItemForTeam
                                    eachEmp={eachEmp}
                                    checked={this.checked}
                                    checkedIds={checkedIds}
                                />
                            </li>
                        ))}
                    </ul>:  <div className="no-employees-view">
                                                <RiTeamFill  size={40} color="#BDBDBD" />
                                                <p className="no-employees-text">No Employees assigned</p>
                                            </div>}


                    <Popup
                        trigger={
                            <button className='add-employee-button'>
                                <FaPlus /> Assign Employee
                            </button>
                        }
                        modal nested
                        contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                        className="add-popup-overlay"
                    >
                        {close => (
                            <div className='add-employee-popup-container'>
                                <h2 className='add-employee-title'>{`Add People to ${teamData.name ? teamData.name.split(" ")[0] : "Team"}`} </h2>
                                <p style={{fontSize:'8px', color:'gray', textAlign:'center'}}>*Employees not in this team</p>
                                
                                <div>
                                    <ul className="emplist-container">
                                        {employeesOutside.length > 0 ? (
                                            employeesOutside.map(item => (
                                                <li key={item.id}>
                                                    <EmpList item={item} addEmpIds={this.addEmpIds} />
                                                </li>
                                            ))
                                        ) : (
                                            <p style={{textAlign: 'center', padding: '20px'}}>No available employees found.</p>
                                        )}
                                    </ul>
                                </div>

                                <div className='add-popup-buttons'>
                                    <button className='cancel-btn' onClick={() => {
                                        this.setState({ employeesToAdd: [] }); 
                                        close();
                                    }}>Cancel</button>
                                    
                                    <button 
                                        className='submit-btn' 
                                        onClick={() => this.addEmployeesToTeam(close)}
                                        disabled={isAssignLoading}
                                        style={{minWidth: '80px', display: 'flex', justifyContent: 'center'}}
                                    >
                                        {isAssignLoading ? <TailSpin height="15" width="15" color="white" /> : `Add (${(employeesToAdd.length)})`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </>
        )
    }
}

export default SingleTeamDetails;