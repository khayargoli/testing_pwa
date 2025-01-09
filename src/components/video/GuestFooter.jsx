import React from "react";
import { SignupButton } from "../misc/SignupButton";
import { LoginButton } from "../misc/LoginButton";

const GuestFooter = () => {
  return (
    <div style={{height:'56px'}} className="bottom">
      <SignupButton /> <LoginButton />
    </div>
  );
};

export default GuestFooter;
