import { TiUser } from "react-icons/ti";
import {Link, withRouter} from "react-router-dom"
import "./index.css"
import Popup from 'reactjs-popup';
import Cookies from "js-cookie"

const Header = (props) => {

    const logout = () => {
        Cookies.remove('jwt_token')
        const { history } = props;
        history.replace('/login');

    }

    return(
        <div className="header-container">
            <div className="header-content">
                <Link className = "link" to ="/">
                    <div className="header-logo-container">
                        <img src = "https://res.cloudinary.com/deonwh9i9/image/upload/v1763832923/Gemini_Generated_Image_l0w2w7l0w2w7l0w2-removebg-preview_gues99.png" className="header-logo" alt = "header logo"/>
                    </div>
                </Link>

                <div className="header-r">
                    <Link className = "link black" to = "/employees">
                            <p>Employees</p>
                </Link>
                    <Link className = "link black" to = "/teams">
                            <p>Teams</p>
                </Link>
                <Popup trigger={<div className="header-profile-icon">
                                    <TiUser style={{ color: '#BDBDBD', fontSize: '30px' }} />
                                </div>} 
                                position="bottom right" offsetY={20} contentStyle={{ width: 'fit-content', height: "fit-content", borderRadius: '10px', padding: '15px' }}>
                                
                   <div className="header-popup">
                    <button className="logs-button primary" onClick = {logout}>Log out</button>
                        <Link to= "/logs"><button className="logs-button">Logs</button></Link>
                    </div>
                </Popup>
                </div>
            </div>
        </div>
    )
}
export default withRouter(Header)