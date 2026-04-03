import q from "../images/Q&A Ss.png";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={q} />
      </div>
      <div className="nav-links">
        <a href="#">Features</a>
        <a href="#">Docs</a>
        <a href="#">Api</a>
        <a href="#">Privacy</a>
      </div>
      <div className="nav-btn">
        <button>Upload Docs</button>
      </div>
    </div>
  );
}
export default Navbar;
