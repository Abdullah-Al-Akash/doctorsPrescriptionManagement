import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <Link to="/">Patients</Link> |{" "}
      <Link to="/ot">OT</Link> |{" "}
      <Link to="/prescription">Prescription</Link> |{" "}
      <Link to="/reports">Reports</Link>
    </div>
  );
}