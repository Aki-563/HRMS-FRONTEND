import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Login from './components/Login';
import RegisterOrg from "./components/RegisterOrg"
import ProtectedRoute from './components/ProtectedRoute';
import Employees from './components/Employees';
import SingleEmployeeDetails from "./components/SingleEmployeeDetails"
import Teams from "./components/Teams"
import SingleTeamDetails from "./components/SingleTeamDetails"
import LogsPage from "./components/LogsPage"
import NotFound from './components/NotFound'
import "./index.css"

function App() {
  return (
    <>
    <div className="mobile-blocker">
           <img 
             src="https://assets.ccbp.in/frontend/react-js/not-found-img.png" 
             alt="mobile blocked" 
             style={{width: '300px'}}
           />
           <h1>Desktop Only</h1>
           <p>Please open this application on a Laptop or Desktop.</p>
        </div>
    <div className='app-content'>
      <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={RegisterOrg}/>
        <ProtectedRoute exact path="/" component={Employees} />
         <ProtectedRoute exact path="/employees" component={Employees} />
        <ProtectedRoute exact  path="/employees/:id" component={SingleEmployeeDetails}/>
        <ProtectedRoute exact path="/teams" component={Teams}/>
        <ProtectedRoute exact  path="/teams/:id" component={SingleTeamDetails}/>
        <ProtectedRoute exact path="/logs" component={LogsPage}/>
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;