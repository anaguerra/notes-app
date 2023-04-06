import React from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, ...props }) => {
  return (
    <Togglable buttonLabel='Show loginn'>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type='text'
            value={props.username}
            name='Username'
            placeholder='Username'
            onChange={props.handleUsernameChange}
          />
        </div>

        <input
          type='password'
          value={props.password}
          name='Password'
          placeholder='Password'
          onChange={props.handlePasswordChange}
        />
        <button>Login</button>
      </form>
    </Togglable>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm
