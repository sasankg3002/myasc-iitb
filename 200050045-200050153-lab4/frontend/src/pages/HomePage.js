import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router";
import { Container, Jumbotron } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
// import { useState } from "react";

const HomePage = () => {
    const [user, setUser] = useState([]);
    // const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [curr_courses_data, setCurr_courses_data] = useState([]);
    const [prev_courses_data, setPrev_courses_data] = useState([]);
    const [dropStatus, setDropStatus] = useState(['None']);
    const navigate = useNavigate();
    var jsonData;
    const getData = async () => {
        try {
            const cookie = document.cookie;
            const cookieArray = cookie.split(";");
            const cookieExists = cookieArray.some((item) => item.trim().startsWith("nameOfCookie="));
            console.log('checking cookie');
            console.log(cookieExists);
            const response = await fetch("http://localhost:5000/home", {
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
                            setUser(data['tables']);
                            setAuthed(data['authenticated']);
                            setCurr_courses_data(data['curr_courses']);
                            setPrev_courses_data(data['prev_courses']);
                        }
                        else {
                            navigate('/login');
                            setAuthed(data['authenticated']);
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
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/logout", {
                method: "GET",
                credentials: 'include'
            });
            window.location.replace('http://localhost:3000/login');
        } catch (error) {
            console.error(error.message);
        }
    };
    useEffect(() => {
        getData();

    }, []);

    const listItems = user.map((d) =>
        <li key={d.toString()}>
            {d.course_id} : <button onClick={() => navigate(`/course/${d.course_id}`)}>View</button>
        </li>
    );

    const handleDrop = async (id, course_id) => {
        try {
            const body = { id, course_id };
            const response = await fetch("http://localhost:5000/drop", {
                credentials: 'include',
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((res) => res.json()).then(window.location.replace('http://localhost:3000/home'));
            console.log("hi");
            console.log(`Successfully dropped the course ${course_id}`);
            // window.location.replace('http://localhost:3000/home');
            setDropStatus("Successful");
            // window.location.reload();
            // window.location.href = window.location.href;
            setTimeout(()=>{
                window.location.reload(true);
              });
        } catch (error) {
            console.error(error.message);
            setDropStatus("failure");
        }

    }
    // useEffect(() => {
    //     console.log(dropStatus);
    // }, [handleDrop]);
    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
      };
    return loading ? <p></p> : (
        <>
            <NavigationBar />
            {/* <h1 align='center'>Welcome {JSON.stringify(user[0]['name'])}</h1> */}
            {/* <h2>Name : {user[0]['name']}</h2>
            <h2>ID : {user[0]['id']}</h2>
            <h2>Dept_name : {user[0]['dept_name']}</h2>
            <h2>Total Credits : {user[0]['tot_cred']}</h2> */}

<div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
            <div align='center' style={{ fontSize: 30, fontFamily:'fantasy' }}>
                <ul style={flexContainer}>
                    <li class="list-group-item" >Name : <b>{user[0]['name']}</b></li>
                    <li class="list-group-item">ID : <b>{user[0]['id']}</b></li>
                    <li class="list-group-item">Deptartment : <b>{user[0]['dept_name']}</b></li>
                    <li class="list-group-item">Total Credits : <b>{user[0]['tot_cred']}</b></li>
                </ul>
            </div>
            </div>

            <h3 align='center'>Running Courses</h3>
            {curr_courses_data['tables'].length != 0 ?
                <>
                    <h4 align='center'>Year : {curr_courses_data['year']}  Semester : {curr_courses_data['semester']}</h4>
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th>Course ID</th>
                                <th>Title</th>
                                <th>Credits</th>
                                <th>Grade</th>
                                <th>Drop</th>
                            </tr>
                        </thead>
                        <tbody>
                            {curr_courses_data['tables'].map(d => (
                                <tr>
                                    <td><a href={`http://localhost:3000/course/${d['course_id']}`}>{d['course_id']}</a></td>
                                    <td>
                                        {d['title']}
                                    </td>
                                    <td>
                                        {d['credits']}
                                    </td>
                                    <td>
                                        NA
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Please Refresh after Dropping" data-content="And here's some amazing content. It's very engaging. Right?" onClick={() => handleDrop(d['id'], d['course_id'])}>Drop</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </> : <h2>No running courses got registered</h2>
            }
            <h3 align='center'>Previous Courses</h3>
            {prev_courses_data.map(d_sem => (
                <>
                    <h4 align='center'>Year : {d_sem['year']}  Semester : {d_sem['semester']}</h4>
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th>Course ID</th>
                                <th>Title</th>
                                <th>Credits</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d_sem['tables'].map(d => (
                                <tr scope="row">
                                    <td><a href={`http://localhost:3000/course/${d['course_id']}`}>{d['course_id']}</a></td>
                                    <td>
                                        {d['title']}
                                    </td>
                                    <td>
                                        {d['credits']}
                                    </td>
                                    <td>
                                        {d['grade']}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ))}
            <h1> </h1>
        </>
    );
};

export default HomePage;