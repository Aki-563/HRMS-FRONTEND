import "./index.css"
import { TiUser } from "react-icons/ti";

const EmpList = (props) => {
    const { item,addEmpIds } = props
    const { img_url,  id, email } = item

    

    return (
        <div className="emplist-item" onChange={() => addEmpIds(id)}>
            <input type="checkbox" id={email} />
            <div className="l-i-c">
                {img_url.length > 20? <img src = {img_url} className="l-i" alt="profile img"/> : <TiUser className="emplist-icon"/>}
            </div>
            <label className="email-list" htmlFor={email}>{email}</label>
        </div>
    )
}

export default EmpList
