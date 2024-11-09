import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDataById } from "../services/task";
import Header from "./Header";

function Detail() {
  const { id } = useParams();
  const [record, setRecord] = useState({});
  const [email, setemail] = useState([])
  const [mobileNumber, setmobileNumber] = useState([])
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    try {
      const result = await getDataById(id);
      if (result.status) {
        setRecord(result.data[0]);
        setmobileNumber(JSON.parse(result.data[0].mobile_number))
        setemail(JSON.parse(result.data[0].email))
      } else {
        setRecord({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header name={record?.name} />
      <section className="section pt-2 pb-4">
        <div className="container-fluid">
          <div className="border_box p-md-4 p-3">
            <div className="row">
              <div className="col-12 col-md-auto mb-3 mb-md-0">
                <img src={record?.logo} alt="logo" className="logo" />
              </div>
              <div className="col-12 col-md-4 border_right  pe-md-5">
                <h2 className="helveticabold">{record?.name}</h2>
                <h5 className="icon_name"><i className="bi bi-info-circle "></i> Description</h5>
                <p className="h6">{record?.description}</p>
              </div>
              <div className="col-12 col-md-4 ps-md-5">
                <h5 className="icon_name"><i className="bi bi-telephone-x"></i> Phone</h5>
                {
                  mobileNumber?.map((list, i) => <p className="h6" key={i}>{list}</p>)
                }
                <h5 className="icon_name mt-3 mt-md-4"><i className="bi bi-envelope"></i> Email</h5>
                {
                  email?.map((list, i) => <p className="h6" key={i}>{list}</p>)
                }

              </div>
            </div>
          </div>
          <div className="row m8">
            <div className="col-md-4 p8">
              <div className="border_box p-md-4 p-3">
                <h4 className="mb-3 helveticabold">Company Details</h4>
                <h5 className="icon_name"><i className="bi bi-globe"></i> Website</h5>
                <p className="h6 mb-4">{record?.website}</p>
                <h5 className="icon_name"><i className="bi bi-info-circle "></i> Description</h5>
                <p className="h6 mb-4">{record?.description}</p>
                <h5 className="icon_name mt-3"><i className="bi bi-envelope"></i> Email</h5>
                {
                  email?.map((list, i) => <p className="h6 mb-4" key={i}>{list}</p>)
                }

                {
                  record?.facebook_url && <>
                    <h5 className="icon_name mt-3"><i className="bi bi-facebook"></i> Facebook </h5>
                    <p className="h6 mb-4 color1">{record?.facebook_url}</p>
                  </>
                }
                {
                  record?.instagram_url && <>
                    <h5 className="icon_name mt-3"><i className="bi bi-instagram"></i> Instagram </h5>
                    <p className="h6 mb-4 color1">{record?.instagram_url}</p>
                  </>
                }
                {
                  record?.twitter_url && <>
                    <h5 className="icon_name mt-3"><i className="bi bi-twitter-x"></i> Twitter </h5>
                    <p className="h6 mb-4 color1">{record?.twitter_url}</p>
                  </>
                }
                {
                  record?.linkedin_url && <>
                    <h5 className="icon_name mt-3"><i className="bi bi-linkedin"></i> Linkedin </h5>
                    <p className="h6 mb-4 color1">{record?.linkedin_url}</p>
                  </>
                }

                <h5 className="icon_name mt-3"><i className="bi bi-geo-alt"></i> Address </h5>
                <p className="h6 mb-4 color1">{record?.address}</p>
              </div>
            </div>
            <div className="col-md-8 p8">
              <div className="border_box p-md-4 p-3">
                <h4 className="mb-3 helveticabold"><i className="bi bi-camera me-2"></i> Screenshot of Webpage</h4>
                <img src={record?.screen_shot} alt="netilx" className="w100" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Detail;
