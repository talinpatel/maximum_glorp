import React from "react"
import { Helmet } from "react-helmet";
import "./CssFiles/Profile.css"
import profile_photo from "./images/profile_photo.png"

// const profile_photo = require('./images/profile_photo.png');

export default function Profile() {

  return (
    <>
    <Helmet>
        <title>Your profile</title>
    </Helmet>
    <div className="profile-container">
        <div className="profile-box">
            <div className="profile-text-container">
                <h1 className="profile-title">
                    Hello __User__
                </h1>
                <p className="profile-text">name</p>
                <p className="profile-text">location</p>
                <p className="profile-text">social credits</p>
                <p className="profile-text">info</p>
                <p className="profile-text">notable contributions</p>
            </div>

            <div className="profile-img-container">
                <img src={profile_photo}/>
            </div>

        </div>
    </div>
    </>
  );
}