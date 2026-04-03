import Frame from "../images/Frame19.png";
import Frame1 from "../images/Frame20.png";
import Frame2 from "../images/Frame21.png";

function Footer() {
  return (
    <div className="footer">
      <div className="footer1">
        <div>
          <div className="ffree">FreelancerAI</div>
          <div className="ffree1">the working AI proposal</div>
          <div className="ffree2">
            <div>
              <img src={Frame} alt="Frame" />
            </div>
            <div>
              <img src={Frame1} alt="Frame" />
            </div>
            <div>
              <img src={Frame2} alt="Frame" />
            </div>
          </div>
        </div>

        <div>
          <div className="fquick">Quicklinks</div>
          <div className="flinks1">
            <a href="#">
              <li>Home</li>
            </a>
            <a href="#how-it-works">
              <li>Features</li>
            </a>
            <a href="#how-it-works">
              <li>how it works</li>
            </a>
            <a href="#how-it-works">
              <li>Use Case</li>
            </a>
          </div>
        </div>

        <div>
          <div className="fquick">Support</div>
          <div className="flinks1">
            <a href="#how-it-works">
              <li>Contact</li>
            </a>
            <a href="#how-it-works">
              <li>Help Center</li>
            </a>
            <a href="#how-it-works">
              <li>Email</li>
            </a>
          </div>
        </div>
      </div>
      <div className="footer2">
        <p>@ BuildON Inc. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
