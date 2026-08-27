import "./Loader.css";

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner"></div>
      <p className="loader-text">Loading contacts...</p>
    </div>
  );
}

export default Loader;