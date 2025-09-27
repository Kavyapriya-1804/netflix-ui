import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "./login.scss";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = (e) => {
    // Check if the blur is caused by clicking the password toggle button
    if (e.relatedTarget && e.relatedTarget.className.includes('password-toggle')) {
      return; // Don't hide the icon if clicking the toggle button
    }
    // Use setTimeout to allow click event to register before hiding the icon
    setTimeout(() => {
      setIsPasswordFocused(false);
    }, 150);
  };
  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div className="formInputGroup">
            <div className="form-label-group">
              <input type="email" id="email" placeholder="Email or mobile number" required />
              <label htmlFor="email">Email or mobile number</label>
            </div>
            <div className="form-label-group password-group">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="Password" 
                required 
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              <label htmlFor="password">Password</label>
              {isPasswordFocused && (
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              )}
            </div>
            <button type="submit" className="loginButton">Sign In</button>
            <div className="divider">OR</div>
            <button className="signInCodeButton">Use a sign-in code</button>
            <button type="button" className="forgotPassword" onClick={() => {/* Add forgot password logic */}}>Forgot password?</button>
            <div className="rememberMe">
              <div className="customCheckbox">
                <input type="checkbox" id="rememberMe" className="rememberCheckbox" />
                <label htmlFor="rememberMe" className="checkboxLabel">
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>
            </div>
          </div>
          <span className="newToNetflix">
            New to Netflix? <b className="signUpLink" onClick={handleSignUp}>Sign up now.</b>
          </span>
          <small className="captchaDesc">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <a href="https://www.google.com/recaptcha/about/" target="_blank" rel="noopener noreferrer">Learn more.</a>
          </small>
        </form>
      </div>
    </div>
  );
}
