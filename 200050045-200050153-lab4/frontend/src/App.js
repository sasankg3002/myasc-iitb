import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import InstructorPage from './pages/InstructorPage';
import CoursePage from './pages/CoursePage';
import RunningDeptPage from './pages/RunningDeptPage';
import RunningCoursePage from './pages/RunningCoursePage';
import RegistrationPage from './pages/RegistrationPage';
import SlashPage from './pages/SlashPage';
import { useNavigate } from "react-router";


function App() {
  // const navigate = useNavigate();
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SlashPage/>}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/home' element={<HomePage />}></Route>
        <Route path='/home/registration' element={<RegistrationPage />}></Route>
        <Route path='/course/running' element={<RunningDeptPage />}></Route>
        <Route path='/instructor/:instructor_id' element={<InstructorPage />} component={InstructorPage}></Route>
        <Route path='/course/:course_id' element={<CoursePage />} component={CoursePage}></Route>
        <Route path='/course/running/:dept_name' element={<RunningCoursePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
