import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import NavigationBar from "./NavigationBar";
const InstructorPage = () => {
    const navigate = useNavigate();
    const [fdata, setData] = useState([[], []]);
    const { instructor_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [no_curr_courses, setNocurrcourses] = useState(true);
    const [no_prev_courses, setNoprevcourses] = useState(true);

    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/instructor/${instructor_id}`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        console.log('home_page got no response from backend');
                        setLoading(true);
                    }
                    else {
                        console.log('home_page got response from backend');
                        console.log(data);
                        if (data['authenticated']) {
                            // console.log("erri");
                            setData(data['tables']);
                            // setAuthed(data['authenticated']);
                        }
                        else {
                            navigate('/login');
                            // setAuthed(data['authenticated']);
                        }
                        setLoading(false);
                    }

                })
                .catch((error) => {
                    console.error(error);
                    setLoading(true);
                })
        } catch (err) {
            console.error(err.message);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        if (fdata[0].length) {
            console.log("in fdata[0]")
            console.log(fdata[0], fdata[1])
            setNocurrcourses(false);
        }
        if (fdata[1].length) {
            console.log("in fdata[1]")
            console.log(fdata[0], fdata[1])
            setNoprevcourses(false);
        }
        if (fdata[0].length || fdata[1].length) {
            setLoading1(false);
        }
        console.log(no_curr_courses, no_prev_courses, loading1);
    }, [fdata]);
    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    };
    return loading || loading1 ? <p>loading...</p> : (
        <>
            <NavigationBar />
            {!no_curr_courses ? <>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div align='center' style={{ fontSize: 30, fontFamily: 'fantasy' }}>
                        <ul style={flexContainer}>
                            <li class="list-group-item" >Instructor Name : <b>{fdata[0][0]['name']}</b></li>
                            <li class="list-group-item">Instructor ID : <b>{fdata[0][0]['id']}</b></li>
                            <li class="list-group-item">Deptartment : <b>{fdata[0][0]['dept_name']}</b></li>
                        </ul>
                    </div>
                </div>
            </> : null}
            {no_curr_courses ? <>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div align='center' style={{ fontSize: 30, fontFamily: 'fantasy' }}>
                        <ul style={flexContainer}>
                            <li class="list-group-item" >Instructor Name : <b>{fdata[1][0]['name']}</b></li>
                            <li class="list-group-item">Instructor ID : <b>{fdata[1][0]['id']}</b></li>
                            <li class="list-group-item">Deptartment : <b>{fdata[1][0]['dept_name']}</b></li>
                        </ul>
                    </div>
                </div>
            </> : null}
            <h2 align='center'>Running Courses</h2>
            {!no_curr_courses ? <>
                <h3><ul class='list-group'>{fdata[0].map(d => (
                    
                    <li class="list-group-item" key={d.toString()}> <a href={`/course/${d.course_id}`}>{d.course_id}</a> : {d.title}</li>
            
                ))}</ul></h3>
            </> : <h4><ul class='list-group'><li class="list-group-item">No Current Courses</li></ul></h4>}
            <h2 align='center'>Previous Courses</h2>
            {!no_prev_courses ? <>
                <h3>
                    <table class="table table-striped table-bordered table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th display='flex' >Year and Semester</th>
                            <th>Course</th>
                        </tr>
                    </thead>
                    <tbody>
                    {fdata[1].map(d => (
                            <tr>
                                <td>
                                {d['year']} - {d['semester']}
                                </td>
                                <td>
                                <a href={`/course/${d.course_id}`}>{d.course_id}</a> : {d.title}
                                </td>
                            </tr>
                    ))}
                
                    </tbody>
                </table>
                </h3>
            </> : <h4><ul class='list-group'><li class="list-group-item">No Current Courses</li></ul></h4>}
        </>
    )
}
export default InstructorPage;