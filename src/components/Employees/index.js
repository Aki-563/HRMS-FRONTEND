import { Component } from 'react';
import Cookies from "js-cookie";
import Popup from 'reactjs-popup';
import "./index.css";
import { MdSort } from "react-icons/md";
import Header from "../Header";
import EmployeeListItem from "../EmployeeListItem";
import { FaPlus, FaDatabase } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { TailSpin } from 'react-loader-spinner'

class Employees extends Component {
    state = {
        emplyeesList: [],
        sortBy: "",
        gender: "",
        search: "",
        addFirstName: "",
        addLastName: "",
        addEmail: "",
        addPhone: "",
        addGender: "male",
        addImgUrl: "",
        addRole: "",
        addErrorMsg: "",
        isLoading: false,
        isError: false,
        addLoading: false,
    }

    componentDidMount() {
        this.getEmployees();
    }

    all = () => { this.setState({ gender: "" }, this.getEmployees) }
    male = () => { this.setState({ gender: "male" }, this.getEmployees) }
    female = () => { this.setState({ gender: "female" }, this.getEmployees) }

    handleSortChange = (e) => { this.setState({ sortBy: e.target.value }, this.getEmployees); }
    clearSort = () => { this.setState({ sortBy: "", search: "" },this.getEmployees) }
    searching = (e) => { this.setState({ search: e.target.value }, this.getEmployees) }

    getEmployees = async () => {
        this.setState({ isLoading: true, isError: false })
        const { gender, sortBy, search } = this.state;
        const jwtToken = Cookies.get('jwt_token');
        const url = `https://hrms-backend-turso.vercel.app/api/employees?sort=${sortBy}&gender=${gender}&search=${search}`;
        const options = {
            headers: { Authorization: `Bearer ${jwtToken}` }
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const employees = await response.json();
                this.setState({ emplyeesList: employees, isLoading: false });
            } else {
                this.setState({ isError: true, isLoading: false })
            }
        } catch (error) {
            console.error("Fetch error:", error);
            this.setState({ isError: true, isLoading: false });
        }
    }

    handleAddInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    addNewEmployee = async (closePopup) => {
        const { addFirstName, addLastName, addEmail, addPhone, addGender, addImgUrl, addRole } = this.state;
        this.setState({ addLoading: true })
        if (!addFirstName || !addEmail || !addPhone || !addRole) {
            this.setState({ addErrorMsg: "Please fill in all required fields.", addLoading: false });
            return;
        }

        const newEmployeeData = {
            firstName: addFirstName,
            lastName: addLastName,
            email: addEmail,
            phone: addPhone,
            gender: addGender,
            imgUrl: addImgUrl,
            role: addRole
        };

        const jwtToken = Cookies.get('jwt_token');
        const url = `https://hrms-backend-turso.vercel.app/api/employees`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newEmployeeData)
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                this.setState({
                    addFirstName: "", addLastName: "", addEmail: "",
                    addPhone: "", addGender: "Male", addImgUrl: "", addRole: "", addErrorMsg: "", addLoading: false
                });
                closePopup();
                this.getEmployees();
                alert("Employee Added Successfully!");
            } else {
                this.setState({ addErrorMsg: "Failed to add employee. Check network.", addLoading: false });
            }
        } catch (error) {
            console.error(error);
            this.setState({ addErrorMsg: "Something went wrong.", addLoading: false });
        }
    }

    render() {
        const { isError, isLoading, addLoading, emplyeesList, sortBy, gender, search, addFirstName, addLastName, addEmail, addPhone, addGender, addImgUrl, addRole, addErrorMsg } = this.state;
        
        const showEmployees = emplyeesList.length > 0;
        
        const showFilterBar = showEmployees || search !== "" || gender !== "";

        return (
            <>
                <Header />
                {showFilterBar && (
                        <div className='employee-filter-bar'>
                            <div className='emp-fil-cont'>
                                <div className='search-cont'>
                                <input type="search" onChange={this.searching} value={search} className='employee-search-box' placeholder="Search Employee" />
                                </div>

                                <div className='filter-right'>
                                <Popup
                                    trigger={
                                        <div className='employee-filter-left'>
                                            <p className='filter-text'>Sort</p>
                                            <MdSort />
                                        </div>
                                    }
                                    contentStyle={{ width: '250px', borderRadius: '10px', padding: '0px' }}
                                    position="bottom right"
                                >
                                    
                                    {close => (
                                        <div className='filter-popup'>
                                            <div className='sort-container'>
                                                <div className='sort-item'>
                                                    <input type="radio" id="new" value="date_new" checked={sortBy === "date_new"} name="sortGroup1" onChange={this.handleSortChange} />
                                                    <label htmlFor='new'>Recently Joined</label>
                                                </div>
                                                <div className='sort-item'>
                                                    <input type="radio" id="old" value="date_old" checked={sortBy === "date_old"} name="sortGroup1" onChange={this.handleSortChange} />
                                                    <label htmlFor='old'>Longest Serving</label>
                                                </div>
                                            </div>
                                            <div className='sort-container'>
                                                <div className='sort-item'>
                                                    <input type="radio" id="a" value="name_asc" checked={sortBy === "name_asc"} name="sortGroup1" onChange={this.handleSortChange} />
                                                    <label htmlFor='a'>A-Z</label>
                                                </div>
                                                <div className='sort-item'>
                                                    <input type="radio" id="z" value="name_desc" checked={sortBy === "name_desc"} name="sortGroup1" onChange={this.handleSortChange} />
                                                    <label htmlFor='z'>Z-A</label>
                                                </div>
                                            </div>
                                            <div className='clear-filter-button-container'>
                                                {sortBy !== "" && (
                                                    <button 
                                                        className='clear-filter-button' 
                                                        onClick={() => {
                                                            this.clearSort();
                                                            close();
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Popup>

                                <div className='gender-filter-buttons-container'>
                                    <button className={`gender-filter-1 ${gender === "" ? "selected-gender" : ""}`} onClick={this.all}>All</button>
                                    <button className={`gender-filter-2 ${gender === "male" ? "selected-gender" : ""}`} onClick={this.male}>Male</button>
                                    <button className={`gender-filter-3 ${gender === "female" ? "selected-gender" : ""}`} onClick={this.female}>Female</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                <div className='employees-container'>
                    
                    


                    {isLoading ? (
                        <div className='body-loaders'>
                            <TailSpin type="TailSpin" height="30" width="30" color="#3b82f6" />
                        </div>
                    ) : isError ? (
                        <div className="error-view">
                            <MdErrorOutline size={30} color="red" />
                            <p>Failed to load employees</p>
                        </div>
                    ) : !showEmployees ? (
                        <div className="no-employees-view">
                            <FaDatabase size={40} color="#BDBDBD" />
                            <p className="no-employees-text">No Employees Found</p>
                        </div>
                    ) : (
                        <ul className='employee-list'>
                            {emplyeesList.map(eachEmp => (
                                <li key={eachEmp.id}>
                                    <EmployeeListItem eachEmp={eachEmp} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <Popup
                    trigger={
                        <button className='add-employee-button'>
                            <FaPlus /> Add Employee
                        </button>
                    }
                    modal
                    nested
                    contentStyle={{ width: '400px', borderRadius: '10px', padding: '0px' , zIndex: 1001}}
                    className="add-popup-overlay"
                >
                    {close => (
                        <div className='add-employee-popup-container'>
                            <h2 className='add-employee-title'>Add New Employee</h2>

                            <div className='add-input-group'>
                                <label className='add-input-label'>First Name</label>
                                <input name="addFirstName" value={addFirstName} onChange={this.handleAddInput} className='add-input-field' type="text" placeholder="e.g. John" />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Last Name</label>
                                <input name="addLastName" value={addLastName} onChange={this.handleAddInput} className='add-input-field' type="text" placeholder="e.g. Doe" />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Email</label>
                                <input name="addEmail" value={addEmail} onChange={this.handleAddInput} className='add-input-field' type="email" placeholder="e.g. john@example.com" />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Phone</label>
                                <input name="addPhone" value={addPhone} onChange={this.handleAddInput} className='add-input-field' type="text" placeholder="e.g. 9876543210" />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Gender</label>
                                <select name="addGender" value={addGender} onChange={this.handleAddInput} className='add-input-field'>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>

                                </select>
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Role</label>
                                <input name="addRole" value={addRole} onChange={this.handleAddInput} className='add-input-field' type="text" placeholder="e.g. Frontend Developer" />
                            </div>

                            <div className='add-input-group'>
                                <label className='add-input-label'>Image URL</label>
                                <input name="addImgUrl" value={addImgUrl} onChange={this.handleAddInput} className='add-input-field' type="text" placeholder="Image Link" />
                            </div>

                            {addErrorMsg && <p style={{ color: 'red', fontSize: '12px' }}>{addErrorMsg}</p>}

                            <div className='add-popup-buttons'>
                                <button className='cancel-btn' onClick={() => {
                                    close();
                                    this.setState({ addErrorMsg: "" });
                                }}>Cancel</button>
                                <button className='submit-btn' disabled={addLoading} onClick={() => this.addNewEmployee(close)}>{addLoading ? (<TailSpin
                                    height="18"
                                    width="18"
                                    color="white" />
                                ) : ("Submit")}</button>
                            </div>
                        </div>
                    )}
                </Popup>
            </>
        )
    }
}
export default Employees;