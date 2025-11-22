import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { withRouter } from "react-router-dom";
import "./index.css";
import { FaUserEdit } from "react-icons/fa";
import Popup from "reactjs-popup";
import { MdDelete, MdErrorOutline } from "react-icons/md";
import { TailSpin } from 'react-loader-spinner';

class SingleEmployeeDetails extends Component {
  state = {
    employeeDetails: {},
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    updateResult: "",
    isLoading: false,
    isError: false,
    isEditLoading: false,
    isDeleteLoading: false
  };

  componentDidMount() {
    this.getEmployeeDetails();
  }

  getEmployeeDetails = async () => {
    this.setState({ isLoading: true, isError: false });
    const { id } = this.props.match.params;
    const jwtToken = Cookies.get("jwt_token");
    const url = `https://hrms-backend-m0q3.onrender.com/api/employees/${id}`;
    const options = {
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const employee = await response.json();
        this.setState({
          employeeDetails: employee,
          firstName: employee.first_name,
          lastName: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false, isError: true });
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      this.setState({ isLoading: false, isError: true });
    }
  };

  initializeEditState = () => {
    const { employeeDetails } = this.state;
    this.setState({
      firstName: employeeDetails.first_name,
      lastName: employeeDetails.last_name,
      email: employeeDetails.email,
      phone: employeeDetails.phone,
      updateResult: ""
    });
  }

  edit = async (closePopup) => {
    const { firstName, lastName, email, phone } = this.state;
    const { id } = this.props.match.params;

    this.setState({ isEditLoading: true }); 

    if (firstName === "" || lastName === "" || email === "" || phone === "" || phone.length !== 10) {
      this.setState({ updateResult: "Please fill all fields correctly (Phone must be 10 digits)", isEditLoading: false });
      return;
    }

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://hrms-backend-m0q3.onrender.com/api/employees/${id}`;

    const updatedDetails = { firstName, lastName, email, phone };

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedDetails)
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        await this.getEmployeeDetails();
        closePopup();
        this.setState({ updateResult: "", isEditLoading: false });
        alert("Employee updated successfully");
      } else {
        this.setState({ updateResult: "Failed to update employee", isEditLoading: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({ updateResult: "Network error", isEditLoading: false });
    }
  };

  editingFirstname = (e) => this.setState({ firstName: e.target.value, updateResult: "" });
  editingLastname = (e) => this.setState({ lastName: e.target.value, updateResult: "" });
  editingEmail = (e) => this.setState({ email: e.target.value, updateResult: "" });
  editingPhone = (e) => this.setState({ phone: e.target.value, updateResult: "" });

  delete = async (closePopup) => {
    const { id } = this.props.match.params;
    const { history } = this.props;
    
    this.setState({ isDeleteLoading: true }); 

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://hrms-backend-m0q3.onrender.com/api/employees/${id}`;
    const options = { method: "DELETE", headers: { Authorization: `Bearer ${jwtToken}` } }

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        
        closePopup();
        alert("Employee deleted successfully");
        history.goBack();
      } else {
        this.setState({ isDeleteLoading: false });
        alert("Failed to delete employee");
      }
    }
    catch (error) {
      console.log("Error deleting:", error);
      this.setState({ isDeleteLoading: false });
    }
  };

  render() {
    const { 
      employeeDetails, firstName, lastName, email, phone, 
      updateResult, isLoading, isError, 
      isEditLoading, isDeleteLoading 
    } = this.state;

    const {
      img_url = "",
      role = "",
      teams = "No teams",
      created_at = "",
      gender = "",
      first_name = "",
      last_name = "",
      email: savedEmail = "",
      phone: savedPhone = "",
    } = employeeDetails || {};

    return (
      <>
        <Header />
        <div>
          <div className="employee-details-container">
            {isLoading ? (
              
              <div className='body-loaders' style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                <TailSpin height="30" width="30" color="#3b82f6" />
              </div>
            ) : isError ? (
             
              <div className="error-view" style={{textAlign: 'center', marginTop: '50px'}}>
                  <MdErrorOutline size={40} color="red" />
                  <p>Failed to load employee details</p>
              </div>
            ) : (
              <div className="employee-details">
                <div className="employee-detail-img-container">
                  <img src={img_url} className="employee-detail-img" alt="Employee-details-image" />
                </div>
                <div className="vertical-line"></div>
                <div className="employee-detail">
                  <div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Full name:</p>
                      <p className="employee-detail-answer">{first_name}</p>
                      <p className="employee-detail-answer">{last_name}</p>
                    </div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Role:</p>
                      <p className="employee-detail-answer">{role}</p>
                    </div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Teams:</p>
                      <p className="employee-detail-answer">{teams}</p>
                    </div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Joined at:</p>
                      <p className="employee-detail-answer">
                        {created_at ? created_at.split(" ")[0] : ""}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Email:</p>
                      <p className="employee-detail-answer">{savedEmail}</p>
                    </div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Phone:</p>
                      <p className="employee-detail-answer">{savedPhone}</p>
                    </div>
                    <div className="employee-detail-item">
                      <p className="employee-detail-title">Gender:</p>
                      <p className="employee-detail-answer">{gender}</p>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <div className="edit-user">
                    <Popup
                      trigger={<button className="edit-btn-trigger"><FaUserEdit className="edit-icon" /></button>}
                      modal
                      nested
                      onOpen={this.initializeEditState}
                      contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                    >
                      {(close) => (
                        <div className="employee-edit-popup">
                          <h2>Edit Employee</h2>
                          <div className="employee-edit-container">
                            <div className="add-input-group">
                              <label className="add-input-label" htmlFor="firstname">Firstname</label>
                              <input
                                type="text"
                                id="firstname"
                                value={firstName}
                                className="add-input-field"
                                onChange={this.editingFirstname}
                              />
                            </div>
                            <div className="add-input-group">
                              <label className="add-input-label" htmlFor="lastname">Lastname</label>
                              <input type="text" id="lastname" value={lastName} className="add-input-field" onChange={this.editingLastname} />
                            </div>
                            <div className="add-input-group">
                              <label className="add-input-label" htmlFor="email">Email</label>
                              <input type="email" id="email" value={email} className="add-input-field" onChange={this.editingEmail} />
                            </div>
                            <div className="add-input-group">
                              <label className="add-input-label" htmlFor="phone">Phone</label>
                              <input type="text" id="phone" value={phone} className="add-input-field" onChange={this.editingPhone} />
                            </div>

                            {updateResult && <p className="error-msg" style={{color: 'red', fontSize: '12px'}}>{updateResult}</p>}

                            <div className="popup-buttons">
                              <button className="cancel-btn" onClick={close}>Cancel</button>
                              
                             
                              <button 
                                className="submit-btn" 
                                disabled={isEditLoading}
                                style={{minWidth: '60px', display: 'flex', justifyContent: 'center'}}
                                onClick={() => this.edit(close)}
                              >
                                {isEditLoading ? <TailSpin height="15" width="15" color="white" /> : "Edit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Popup>
                  </div>

                  <div className="delete-user">
                    <Popup
                      trigger={<button className="edit-btn-trigger"><MdDelete className="edit-icon delete-user" /></button>}
                      modal nested contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' }}
                    >
                      {(close) => (
                        <div className="employee-edit-popup delete-popup">
                          <h2>Delete Employee</h2>
                          <div className="delete-container">
                            <p className="delete-confirmation-text">Are you sure you want to delete this employee?</p>
                            <div className="delete-popup-buttons">
                              <button className="delete-cancel cancel-btn" onClick={close}>Cancel</button>
                              
                              
                              <button 
                                className="submit-btn delete" 
                                disabled={isDeleteLoading}
                                style={{minWidth: '60px', display: 'flex', justifyContent: 'center'}}
                                onClick={() => this.delete(close)}
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
              </div>

            )}
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(SingleEmployeeDetails);