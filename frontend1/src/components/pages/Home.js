import React, { useState, useEffect } from "react";
import { deleteData, getData } from "../services/task";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";
import * as XLSX from "xlsx";
import moment from "moment";
import Header from "./Header";
import {Link} from "react-router-dom"

function Home() {
  const [record, setRecord] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [deleteIds, setDeleteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    getAllData();
  }, [refresh]);

  const getAllData = async () => {
    const result = await getData();
    if (result.status) {
      setRecord(result.data);
    } else {
      setRecord([]);
    }
  };


  const handleMultiDelete = async () => {
    if (deleteIds.length === 0) {
      toast.dismiss();
      toast.error("Please select atleast one row");
      return;
    }
    const data = {
      ids: deleteIds,
    };
    try {
      const result = await deleteData(data);
      if (result.status) {
        toast.dismiss();
        toast.success(result.message);
        setRefresh(!refresh);
        setDeleteIds([])
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

  const handleDelete = async (id) => {
    const data = {
      ids: [id],
    };
    try {
      const result = await deleteData(data);
      if (result.status) {
        toast.dismiss();
        toast.success(result.message);
        setRefresh(!refresh);
        setDeleteIds([])
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

  const deleteAlert = (id) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handlechecked = (id) => {
    // Check if the id is already in the array
    const index = deleteIds.indexOf(id);

    if (index !== -1) {
      // If id is already present, remove it
      const updatedIds = [...deleteIds];
      updatedIds.splice(index, 1);
      setDeleteIds(updatedIds);
    } else {
      setDeleteIds([...deleteIds, id]);
    }
  };

  function exportToExcel(jsonData, fileName) {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  const handleExcel = () => {
    if (record.length > 0) {
      exportToExcel(
        record,
        `data_${moment(new Date()).format("DD-MM-YYYY,HH:mm:ss")}`
      );
    } else {
      let arr = [
        {
          id: "",
          email: "",
          name: "",
          mobile_number: "",
          logo: "",
          description: "",
          address: "",
          screen_shot: "",
          facebook_url: "",
          twitter_url: "",
          linkedin_url: "",
          instagram_url: "",
        },
      ];
      exportToExcel(
        arr,
        `data_${moment(new Date()).format("DD-MM-YYYY,HH:mm:ss")}`
      );
    }
  };

  const totalPages = Math.ceil(record && record?.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Get the data for the current page
  const currentPageData = record && record?.slice(startIndex, endIndex);

  const handleAllSelect = (e) => {
    if (isAllSelected) {
      // Deselect all, clear deleteIds
      setDeleteIds([]);
    } else {
      // Select all, add all ids to deleteIds
      const data = record.map((list) => list.id);
      setDeleteIds(data);
    }
    // Toggle the state of isAllSelected
    setIsAllSelected(!isAllSelected);
  };


  return (
    <>
        <Header refresh={refresh} setRefresh={setRefresh} />
        <section className="section pt-2 pb-4">
          <div className="container-fluid">
            <div className="border_box">
              <div className=" d-flex     align-items-center p-3">
                <span className="me-3">{deleteIds?.length} selected</span>
                <button className="border_btn me-3" onClick={handleMultiDelete}>Delete</button>
                <button className="border_btn" onClick={handleExcel}><i className="bi bi-card-list me-1"></i> Export as CSV</button>
              </div>
              <div className="table-responsive ">
                <table className="table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" onChange={(e)=>handleAllSelect(e)} checked={record.length>0 && deleteIds.length===record.length}/></th>
                      <th>Logo</th>
                      <th>Company</th>
                      <th>Social PROFILES</th>
                      <th>Description</th>
                   
                      <th>Phone No.</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData?.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No record found
                        </td>
                      </tr>
                    )}
                    {currentPageData?.map((list, index) => {
                      const mobile_number=JSON.parse(list.mobile_number)
                      const email=JSON.parse(list.email)
                      return (
                        <tr key={list.id}>
                          <td> <input type="checkbox" checked={deleteIds.includes(list.id)} onChange={()=>{handlechecked(list.id)}}/></td>

                          <td>
                           <Link to={`detail/${list.id}`}><img src={list.logo} alt="" /></Link> 
                          </td>
                          <td><Link to={`detail/${list.id}`}>{list.name}</Link></td>
                          <td>
                            {list.facebook_url && <Link to={list.facebook_url}><i className="bi bi-facebook social"></i></Link>}
                            {list.linkedin_url && <Link to={list.linkedin_url} className="ms-1"><i className="bi bi-linkedin social"></i></Link>}
                            {list.twitter_url && <Link to={list.twitter_url} className="ms-1"><i className="bi bi-twitter social" ></i></Link>}
                            {list.instagram_url && <Link to={list.instagram_url} className="ms-1"><i className="bi bi-instagram social"></i></Link>}
                          </td>
                          <td>{list.description}</td>
                          <td>{mobile_number?.map((list,i)=>{
                             return <p key={i}>{list}</p>
                          })}</td>
                          <td>{email?.map((list,i)=>{
                             return <p key={i}>{list}</p>
                          })}</td>
                          <td>{list.address}</td>
                          <td><i className="bi bi-trash" onClick={()=>{deleteAlert(list.id)}}></i></td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
              <div className="p-3 d-flex align-items-center">
               
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default Home;
