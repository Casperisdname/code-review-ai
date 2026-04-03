import { useState } from "react";

function Paste() {
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!code && !file) {
      alert("Please provide code or upload a file");
      return;
    }

    const formData = new FormData();
    if (code) formData.append("code", code);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/review", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setReview(data);
    } catch (err) {
      console.error(err);
      alert("Error reviewing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paste">
      <h1>Paste your Content</h1>
      <textarea
        placeholder="Paste your caption, tweet, blog or code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <div className="dropdown-container">
        <input type="file" onChange={handleFileChange} />
        <button className="b3" onClick={handleSubmit}>
          {loading ? "Reviewing..." : "Upload Files/Codes"}
        </button>
      </div>

      <select className="dropdown">
        <option>Language</option>
        <option value="english">English</option>
        <option value="spanish">Spanish</option>
        <option value="french">French</option>
        <option value="german">German</option>
      </select>

      {review && (
        <div className="box1">
          <h2>Review Result</h2>
          <pre className="t1">{JSON.stringify(review, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Paste;
