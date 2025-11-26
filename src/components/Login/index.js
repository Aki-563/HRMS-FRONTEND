import {Component} from 'react'
import { Redirect , Link} from 'react-router-dom'
import {TailSpin} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    showPass: false,
    isLoading: false,
    isError: false,
    errorMsg: '',
    loginSuccess: false,
  }

  email = event => {
    this.setState({email: event.target.value})
  }

  password = event => {
    this.setState({password: event.target.value})
  }

  checkbox = event => {
    if (event.target.checked) {
      this.setState({showPass: true})
    } else {
      this.setState({showPass: false})
    }
  }

  login = async () => {
    this.setState({isLoading: true})
    const {email, password} = this.state
    const userData = {
      email,
      password,
    }
    const url = 'https://hrms-backend-turso.vercel.app/api/auth/login'
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
    const {email, password, showPass, isLoading, isError, errorMsg} =
      this.state

    return (
      <>
        <div className="login-page-container">
          <div className="login-container">
            <img
              src="https://res.cloudinary.com/deonwh9i9/image/upload/v1763734880/Gemini_Generated_Image_war1dxwar1dxwar1_f6hvgp.png"
              alt="login website logo"
              className="login-logo"
            />
            <div className="text-inputs-container">
              <div className="text-inputs">
                <label htmlFor="u" className="label">
                  EMAIL
                </label>
                <input
                  id="u"
                  type="text"
                  className="textbox"
                  placeholder="Email"
                  onChange={this.email}
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
                  onChange={this.password}
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
                onClick={this.login}
              >
                {isLoading ? (
                  <TailSpin
                    type="TailSpin"
                    height="18"
                    width="18"
                    color="white"
                  />
                ) : (
                  'Login'
                )}
              </button>
              {isError ? <p className="error-text">*{errorMsg}</p> : null}
            </div>
            <div className='register-text'>
              <Link className = "link b" to="/register">
                Register
              </Link>
              <p>your organisation</p>
              </div>
          </div>
        </div>
      </>
    )
  }
}

export default Login
