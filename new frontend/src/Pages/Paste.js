import { useState } from "react";

const BACKEND_URL = "https://code-review-ai-sw33.onrender.com";

function Paste() {
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!code && !file) {
      setError("Please provide code or upload a file");

      setTimeout(() => {
        setError("");
      }, 3000);

      return;
    }

    const formData = new FormData();
    if (code) formData.append("code", code);
    if (file) formData.append("file", file);
    formData.append("language", language);

    setLoading(true);
    setReview(null);

    try {
      const res = await fetch(`${BACKEND_URL}/review`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setReview(data);
    } catch (err) {
      console.error(err);

      setError("Error reviewing code");

      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="paste"
      id="review"
      style={{ padding: "40px", textAlign: "center" }}
    >
      <h1>Paste or Upload Your Code</h1>

      {error && <div className="review-error">{error}</div>}

      <textarea
        placeholder="Paste your code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "80%",
          maxWidth: "700px",
          height: "150px",
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontFamily: "monospace",
        }}
      ></textarea>

      <div style={{ marginBottom: "20px" }}>
        <label className="upload-btn">
          Upload Code File
          <input type="file" onChange={handleFileChange} hidden />
        </label>

        {file && <p style={{ marginTop: "10px" }}>Selected: {file.name}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "12px 25px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#745fff",
          color: "white",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {loading ? "Reviewing..." : "Upload & Review"}
      </button>

      <div className="language-options" style={{ marginBottom: "20px" }}>
        <p style={{ marginBottom: "10px" }}>Language</p>

        <div className="lang-buttons">
          {["English", "Spanish", "French", "German"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={language === lang ? "lang-active" : "lang-btn"}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {review && (
        <div
          className="review-box"
          style={{
            marginTop: "20px",
            textAlign: "left",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "15px",
            maxWidth: "800px",
            margin: "20px auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>Review Result</h2>
          <pre>{JSON.stringify(review, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Paste;
