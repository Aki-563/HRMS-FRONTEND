import "./index.css";
import {Link} from "react-router-dom"
import { TiUser } from "react-icons/ti";


const EmployeeListItemForTeam = (props) => {
  const { eachEmp, checked , checkedIds} = props;
  const {id, first_name, last_name, img_url, role } = eachEmp;
  let color;
  switch(role.toLowerCase()){
    case "designer":{
        color = "green"
        break
    }
    case "intern":{
        color = "blue"
        break
    }
    case "associate":{
        color = "orange"
        break
    }
    case "manager":{
        color = "pink"
        break
    }
    case "director":{
        color = "violet"
        break
    }
    case "lead":{
        color = "red"
        break
    }
    case "senior manager":{
        color = "yellow"
        break
    }
    case "senior associate":{
        color = "brown"
        break
    }
    default:{
        color = "gold"
        break
    }
  }
  
  const Handlecheck = () => {
    checked(id)
  }
  
  return(
       
        <div className="employee-list-item">
            
        <div className="employee-name-img"  >
            <label class="custom-checkbox">
                <input type="checkbox" checked={checkedIds.includes(id)} onClick = {Handlecheck}/>
                <span class="checkmark"></span>
            </label>
            <div className="employee-list-image-container">
                            {img_url.length > 20? <img src={img_url} alt="employee img" className="employee-list-image"/> : <TiUser className="employee-alt-list-image"/>}
                        </div>
            <div className="employee-list-name-container">
                <p className="employee-list-name">{first_name}</p>
                <p className="employee-list-name">{last_name}</p>
            </div>
        </div>

        <div className="employee-list-right">
            <p className={`employee-list-role ${color}`}>{role}</p>
            <Link className = "link" to={`/employees/${id}`}>
                <button className="employee-list-button">View profile</button>
            </Link>
        </div>
    </div>
       
  )
}
export default EmployeeListItemForTeam;