import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import NavigationBar from "./NavigationBar";
const RunningCoursePage = () => {
    const navigate = useNavigate();
    const [fdata, setData] = useState(["abc"]);
    const { dept_name } = useParams();
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/running_courses/${dept_name}`, {
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
                if(data['authenticated']){
                            setData(data['tables']);
                            setAuthed(data['authenticated']);
                        }
                        else{
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
    // getData();
    useEffect(() => {
        getData();
    //     if (!authed) {
    // // Redirect to login page
    //     console.log("Home");
    //     navigate('/login');
    // }
    }, []);
    console.log("suman");
    console.log(fdata);
    const handleButton = async (c_id) => {
        navigate(`/course/${c_id}`);
    };

    

    const listItems = fdata.map((d) =>
        <li class="list-group-item" key={d.toString()}>
            <a href={`/course/${d.course_id}`}>{d.course_id}</a> : {d.title}
        </li>
    ); 
    return loading ? <p>loading ...</p> : (
        <>
        <NavigationBar/>
        <h1 align='center'>Running Courses in {dept_name}</h1>
        <h3><ul class='list-group'>{listItems}</ul></h3>
            </>
    );
}
export default RunningCoursePage;