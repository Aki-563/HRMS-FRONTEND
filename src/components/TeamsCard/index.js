import "./index.css"
import {Link} from "react-router-dom"
import { RiTeamFill } from "react-icons/ri";

const TeamsCard = (props) => {
    const {item} = props
    const {id, employee_count, img_url, name} = item
    return (
        <Link className = "link" to={`/teams/${id}`}>
            
            <div className="team-card-container">
            <div className="team-card-img-container">
                {img_url.length > 20? <img src = {img_url} alt = "team img" className="team-card-img"/>: <RiTeamFill className="teams-icon"/>}
            </div>
            <div className="team-card-details">
                <p className="teams-name">{name}</p>
                <p className="teams-count">{`${employee_count} ${employee_count===1 ? "employee": "employees"}`}</p>
            </div>
        </div>
        </Link>
    )
}
export default TeamsCard