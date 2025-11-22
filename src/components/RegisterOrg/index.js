import {Component} from 'react'
import { Redirect, Link } from 'react-router-dom'
import {TailSpin} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

class RegisterOrg extends Component {
  state = {
    orgName: "", adminName : "",

    email: '',
    password: '',
    showPass: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
    loginSuccess: false,
  }

 handleEmail = event => {
  this.setState({ email: event.target.value })
}

handlePassword = event => {
  this.setState({ password: event.target.value })
}

handleOrg = event => {
  this.setState({ orgName: event.target.value })
}

handleAdmin = event => {
  this.setState({ adminName: event.target.value })
}


  checkbox = event => {
    if (event.target.checked) {
      this.setState({showPass: true})
    } else {
      this.setState({showPass: false})
    }
  }

  register = async () => {
    this.setState({isLoading: true})
    const {orgName, adminName, email, password} = this.state
    const userData = {
        orgName,
        adminName,
      email,
      password,
    }
    const url = 'https://hrms-backend-m0q3.onrender.com/api/auth/register'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }
    const res = await fetch(url, options)
    const data = await res.json()

    if (res.ok) {
      const {token} = data
      Cookies.set('jwt_token', token, {expires: 6/24})
        const {history} = this.props
        history.replace('/')
    } else {
      this.setState({isLoading: false, isError: true, errorMsg: data.error})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {orgName, adminName, email, password, showPass, isLoading, isError, errorMsg} =
      this.state

    return (
      <>
        <div className="login-page-container">
          <div className="login-container register">
            <img
              src="https://res.cloudinary.com/deonwh9i9/image/upload/v1763734880/Gemini_Generated_Image_war1dxwar1dxwar1_f6hvgp.png"
              alt="login website logo"
              className="login-logo"
            /> 
            <div className="text-inputs-container">
                <div className="text-inputs">
                <label htmlFor="o" className="label">
                  ORGANISATION NAME
                </label>
                <input
                  id="o"
                  type="text"
                  className="textbox"
                  placeholder="Organisation"
                  onChange={this.handleOrg}
                  value={orgName}
                />
              </div>
              <div className="text-inputs">
                <label htmlFor="a" className="label">
                  ADMIN NAME
                </label>
                <input
                  id="a"
                  type="text"
                  className="textbox"
                  placeholder="Admin"
                  onChange={this.handleAdmin}
                  value={adminName}
                />
              </div>
              <div className="text-inputs">
                <label htmlFor="u" className="label">
                  EMAIL
                </label>
                <input
                  id="u"
                  type="email"
                  className="textbox"
                  placeholder="Email"
                  onChange={this.handleEmail}
                  value={email}
                />
              </div>
              <div className="text-inputs">
                <label htmlFor="p" className="label">
                  PASSWORD
                </label>
                <input
                  id="p"
                  type={showPass ? 'text' : 'password'}
                  className="textbox"
                  placeholder="Password"
                  onChange={this.handlePassword}
                  value={password}
                />
                <div className="checkbox-container">
                  <input
                    id="s"
                    type="checkbox"
                    className="checkbox"
                    onChange={this.checkbox}
                  />
                  <label htmlFor="s" className="label">
                    Show Password
                  </label>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button
                disabled={isLoading}
                className="login-button"
                onClick={this.register}
              >
                {isLoading ? (
                  <TailSpin
                    type="TailSpin"
                    height="18"
                    width="18"
                    color="white"
                  />
                ) : (
                  'Register'
                )}
              </button>
              {isError ? <p className="error-text">*{errorMsg}</p> : null}
            </div>
            <div className='register-text'>
                <p>Already have an account?</p>
              <Link className = "link b" to="/login">
                Login
              </Link>
              
              </div>
          
          </div>
        </div>
      </>
    )
  }
}

export default RegisterOrg
