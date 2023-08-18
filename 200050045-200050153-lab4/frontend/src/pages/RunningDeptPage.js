import React from "react";
import { useContext, useState, useEffect } from "react";
// import { useParams } from "react-router";
import { useNavigate } from "react-router";
import NavigationBar from "./NavigationBar";
const RunningDeptPage = () => {
    const navigate = useNavigate();
    const [fdata, setData] = useState([""]);
    const [authed, setAuthed] = useState(false);
    // const { course_id } = useParams();
    const [loading, setLoading] = useState(true);
    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/running_departments`, {
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
    }, []);

    

    const handleButton = async (d_name) => {
        navigate(`/course/running/${d_name}`);
    };
    const listItems = fdata.map((d) =>
        <li class="list-group-item" key={d.toString()}>
             <a href={`/course/running/${d.dept_name}`}>{d.dept_name}</a>
        </li>
    );

    

    return loading ? <p></p> : (
        <>
        <NavigationBar/>
            <h1 align='center'>Running Departments</h1>
            <h3><ul class='list-group'>{listItems}</ul></h3>
        </>
    )
}
export default RunningDeptPage;