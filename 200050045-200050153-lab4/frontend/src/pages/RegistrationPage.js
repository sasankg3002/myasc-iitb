import React from 'react'
import { useState, useEffect } from "react";
import '../App.js'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useNavigate } from "react-router";
import NavigationBar from "./NavigationBar";

const RegistrationPage = () => {
    // note: the id field is mandatory
    const navigate = useNavigate();
    const [authed, setAuthed] = useState(false);
    const [fdata, setData] = useState(["abc"]);
    const [check, setCheck] = useState([]);
    const items = fdata[0];
    const [searched_data, setSearched_data] = useState([])
    const [cid, setCourse_id] = useState("");
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [status, setStatus] = useState("None");
    const [selectedSection, setSelectedSection] = useState("1");
    const [sections, setSections] = useState(["Personal Information", "Contact Information", "Payment"]);

    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/registration`, {
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
                            setData(data['tables']);
                            setAuthed(data['authenticated']);
                            setSections(data['tables'][1]);
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
    // getData();
    useEffect(() => {
        getData();
    }, []);
    const handleOnSearch = (string, results) => {
        setStatus("None");
        setSearched_data(results);
        console.log("searched data is : ")
        console.log(searched_data);

    }

    const handleOnHover = (result) => {
        // the item hovered
        console.log(result);
        setSearched_data([result]);

    }

    const handleOnSelect = (item) => {
        // the item selected
        console.log(item);
        setSearched_data([item]);
    }

    const handleOnFocus = () => {
        console.log('Focused')
    }
    const handleRegister = async (course_id, sec_id) => {
        try {
            console.log("inside handleregister");
            console.log(fdata[1][course_id][0]['sec_id']);
            console.log(sec_id['selectedSection']);
            console.log("inside handleregister");
            if (fdata[1][course_id][0]['sec_id'] != sec_id['selectedSection']) {
                if (fdata[1][course_id].length > 1 && fdata[1][course_id][0]['sec_id'] == sec_id['selectedSection']) {
                    setCourse_id(course_id);
                    sec_id = sec_id['selectedSection']
                    const body = { course_id, sec_id };
                    console.log("Section is present");
                    const response = await fetch("http://localhost:5000/register_check", {
                        credentials: 'include',
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    }).then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                console.log('home_page got no response from backend');
                                setLoading1(true);
                            }
                            else {
                                console.log('home_page got response from backend');
                                console.log(data);
                                setCheck(data);
                                setLoading1(false);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            setLoading(true);
                        })
                }
                else {
                    console.log("Section not present");
                    setStatus("Section unavailable");
                }
            }
            else {
                setCourse_id(course_id);
                sec_id = sec_id['selectedSection']
                const body = { course_id, sec_id };
                console.log("Section is present");
                const response = await fetch("http://localhost:5000/register_check", {
                    credentials: 'include',
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }).then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            console.log('home_page got no response from backend');
                            setLoading1(true);
                        }
                        else {
                            console.log('home_page got response from backend');
                            console.log(data);
                            setCheck(data);
                            setLoading1(false);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setLoading(true);
                    })
            }
        } catch (error) {
            console.error(error.message);
        }

    }
    useEffect(() => {
        console.log(check);

        if (check[2]) {
            console.log(`Can't be registered. Course already taken`);
            setStatus(`Can't be registered. Course already taken`);
            document.getElementById('searchbar').inputSearchString = "";
        }
        else if (!check[0] && !check[1]) {
            console.log(`Can't be registered. Slot clash occurred and Prerequisites not satisfied`);

        }
        else if (!check[0]) {
            console.log(`Can't be registered. Slot clash occurred`);
            setStatus(`Can't be registered. Slot clash occurred`);
            document.getElementById('searchbar').inputSearchString = "";
        }
        else if (!check[1]) {
            console.log(`Can't be registered. Prerequisites not satisfied`);
            setStatus(`Can't be registered. Prerequisites not satisfied`);
            document.getElementById('searchbar').inputSearchString = "";
        }
        else {
            console.log(`Successfully registered for course ${cid}`);
            setStatus(`Successfully registered for course ${cid}`);
            document.getElementById('searchbar').inputSearchString = "";
        }
    }, [check]);
    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }} >{item.course_id}  &emsp; {item.title}</span>
            </>
        )
    }

    return loading ? <p>loading...</p> : (
        <>
            <NavigationBar />
            <div >
                <header>
                    <div id='searchbar' style={{ width: 1000 }}>
                        <ReactSearchAutocomplete
                            items={items}
                            fuseOptions={{ keys: ["course_id", "title"] }}
                            // necessary, otherwise the results will be blank
                            resultStringKeyName={"course_id"}
                            onSearch={handleOnSearch}
                            onHover={handleOnHover}
                            onSelect={handleOnSelect}
                            onFocus={handleOnFocus}
                            onClear={() => setStatus("None")}
                            autoFocus
                            formatResult={formatResult}
                            placeholder="select the course and section to register"
                        />
                    </div>
                </header>
                {searched_data &&
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-dark">
                            <tr>
                                <th>Course ID</th>
                                <th>Title</th>
                                <th>Section</th>
                                <th>Register</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searched_data.map(d => (
                                <tr>
                                    <td><a href={`http://localhost:3000/course/${d['course_id']}`}>{d['course_id']}</a></td>
                                    <td>
                                        {d['title']}
                                    </td>
                                    <td>
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-primary">Choose Section</button>
                                            <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu">
                                                {/* <button onClick={() => { setSelectedSection('1'); setStatus(`selected section : 1`) }} class="dropdown-item" >1</button>
                                                <button onClick={() => { setSelectedSection('2'); setStatus(`selected section : 2`) }} class="dropdown-item" >2</button>
                                                <button onClick={() => { setSelectedSection('3'); setStatus(`selected section : 3`) }} class="dropdown-item" >3</button>
                                                <button onClick={() => { setSelectedSection('4'); setStatus(`selected section : 4`) }} class="dropdown-item" >4</button> */}

                                            {fdata[1][d['course_id']].map(s => (
                                                <button onClick={() => { setSelectedSection(s['sec_id']); setStatus(`selected section : ${s['sec_id']}`) }} class="dropdown-item" >{s['sec_id']}</button>
                                            ))}

                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn btn-primary" onClick={() => handleRegister(d['course_id'], { selectedSection })}>Register</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
            <h5>Registration status : {status}</h5>
        </>
    )
}

export default RegistrationPage;