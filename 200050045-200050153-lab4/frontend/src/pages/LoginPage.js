import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";
import background from "./banner-2.jpg";
// import { useCookies } from 'react-cookie';
const LoginPage = () => {
  // const { setUser } = useContext(AccountContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error_msg, setError_msg] = useState("");
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(null);
  // var error_msg = "(Password valid or invalid message)";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { username, password };
      const response = await fetch("http://localhost:5000/  ", {
        credentials: 'include',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      console.log(`Username : ${username} Password : ${password}`)
      const jsonData = await response.json();
      console.log(`response in login : ${jsonData.loggedIn}`);
      if (jsonData.loggedIn) {
        navigate('/home');
      }
      else {
        setUsername("");
        setPassword("");
        setError_msg("Invalid Username or Password");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getData = async () => {
    try {
      const cookie = document.cookie;
      const cookieArray = cookie.split(";");
      const cookieExists = cookieArray.some((item) => item.trim().startsWith("nameOfCookie="));
      console.log('checking cookie');
      console.log(cookieExists);
      const response = await fetch("http://localhost:5000/login", {
        method: "GET",
        credentials: 'include'
      }).then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log('home_page got no response from backend');
            // setAuthed(data['authenticated']);
            setLoading(true);
          }
          else {
            console.log('home_page got response from backend');
            console.log(data);
            if (data['authenticated']) {
              navigate('/home');
              // setAuthed(data['authenticated']);
            }
            else {
              // setAuthed(data['authenticated']);
            }
            setLoading(false);
          }

        })
        .catch((error) => {
          console.error(error);
          // setAuthed(data['authenticated']);
          setLoading(true);
        })
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
    //     if (authed) {
    // // Redirect to login page
    //     console.log("Home");
    //     navigate('/home');
    // }
  }, []);



  return loading ? <p></p> : (
    <>
      <div style={{ backgroundImage: `url(${background})`,
      height:'100vh',
      backgroundRepeat:'no-repeat',
      backgroundSize: 'cover',
    }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
          <div className="card shadow-sm border-0 px-3 rounded-5 mb-3 py-4 mx-auto mt-5 bg-light">
            <h1 align='center'>IITBASC</h1>
            <div className="card-header bg-transparent border-0 text-center text-uppercase"><h3>Student Login</h3></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="mb-0">Email<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="uname" required value={username}
                    onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="mb-0">Password<span className="text-danger">*</span></label>
                  <input type="password" className="form-control" name="pass" required value={password}
                    onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="text">{error_msg}</div>
                <p className="text-center mb-0"><input type="submit" className="btn btn-success" value="Login" /></p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;