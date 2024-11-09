import React, { useState } from "react";
import { toast } from "react-toastify";
import { addData } from "../services/task";
import {Link} from "react-router-dom"

function Header(props) {
  const urlRegexpatter =
    /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*)?/;
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setUrl(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url === "") {
      toast.dismiss();
      toast.error("This field is required");
      return;
    }
    if (!urlRegexpatter.test(url)) {
      toast.dismiss();
      toast.error("Invalid url");

      return;
    }
    const data = {
      url: url,
    };
    try {
      const result = await addData(data);
      if (result.status) {
        toast.dismiss();
        toast.success(result.message);
        props?.setRefresh(!props?.refresh);
        setUrl("");
      } else {
        toast.dismiss();
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      return;
    }
  };
 
  return (
    <div className="topnav">
      <div className=" row">
        <div className="col-md-3">
          <div className="search_box position-relative mb-3 mb-md-0">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Enter domain name" onChange={handleChange} value={url}/>
          </div>
        </div>
        <div className="col-md-2">
          <button className="btn btn1 ms-md-3 w100" onClick={handleSubmit}>Fetch & Save Details</button>
        </div>
      </div>
      {props?.name && <nav class="breadcrumbs mt-3">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li class="current">{props?.name}</li>
        </ol>
      </nav> }
      
    </div>
  );
}

export default Header;
