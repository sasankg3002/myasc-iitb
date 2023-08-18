import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import NavigationBar from "./NavigationBar";
const CoursePage = () => {
    const navigate = useNavigate();
    const [fdata, setData] = useState(["abc"]);
    const [authed, setAuthed] = useState(false);
    const { course_id } = useParams();
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/course/${course_id}`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        console.log('home_page got no response from backend');
                        setAuthed(data['authenticated']);
                        setLoading(true);
                    }
                    else {
                        console.log('home_page got response from backend');
                        console.log(data);
                        if (data['authenticated']) {
                            console.log("erri");
                            setData(data['tables']);
                            setAuthed(data['authenticated']);
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
                    setLoading(true);
                })
        } catch (err) {
            console.error(err.message);
        }
    };
    useEffect(() => {
        getData();
    }, []);

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    };
    return loading ? <p></p> : (
        <>
            <NavigationBar />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div align='center' style={{ fontSize: 30, fontFamily: 'fantasy' }}>
                    <ul style={flexContainer}>
                        <li class="list-group-item" >Name : <b>{fdata[0][0]['title']}</b></li>
                        <li class="list-group-item">Course ID : <b>{fdata[0][0]['course_id']}</b></li>
                        <li class="list-group-item">Credits : <b>{fdata[0][0]['credits']}</b></li>
                    </ul>
                </div>
            </div>
            <h3><ul class='list-group'><li class="list-group-item"><a>Instructors: </a>
                {fdata.length > 1 && fdata[2].map(d => (
                    <a><button class="btn btn-info" onClick={() => window.location.replace(`http://localhost:3000/instructor/${d['id']}`)}>{d['name']}</button>{' '}</a>
                ))}</li></ul></h3>

            <h3 align='center'>Prerequisites</h3>
            {(fdata.length > 1) && (fdata[1].length > 0) ? <>
                <h3><ul class='list-group'>{fdata[1].map(d => (
                    <li class="list-group-item" key={d.toString()}> <a href={`/course/${d.prereq_id}`}>{d.prereq_id}</a></li>
                ))}</ul></h3>
            </> : <h3><ul class='list-group'><li class="list-group-item">None</li></ul></h3>}
        </>
    )
}
export default CoursePage;