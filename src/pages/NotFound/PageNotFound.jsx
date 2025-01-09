import { Link } from "react-router-dom";
import { BeeuLogo } from "../../components/misc/BeeuLogo";

const PageNotFound = () => {
  return (
    <div className="welcome">
      <BeeuLogo to="about" text="about" />
      <h1>Page not found!</h1>
      <Link to="/">
        <u>Return to Home</u>
      </Link>
    </div>
  );
};

export default PageNotFound;
