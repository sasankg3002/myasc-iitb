import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";
import background from "./banner-2.jpg";

const SlashPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
    navigate('/login');
    // }
  }, []);
}
export default SlashPage;