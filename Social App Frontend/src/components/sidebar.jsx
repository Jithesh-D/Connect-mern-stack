const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end"
      style={{ width: "220px", minHeight: "82.5vh" }}
    >
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark">
        <span className="fs-4 fw-bold">Menu</span>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button onClick={() => setSelectedTab("Home")} className="nav-link">
            Home
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setSelectedTab("CreatePost")}
            className="nav-link "
          >
            Create Post
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

{
  /* ${ selectedTab === "CreatePost"
 ? "active bg-dark text-white"
 : "text-dark"}` */
}

/*{${selectedTab === "Home" ? "active bg-dark text-white" : "text-dark"}} */
