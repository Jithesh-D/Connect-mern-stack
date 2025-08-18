import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          {" "}
          {/* It's good practice to add an href to the brand link */}
          CampusConnect
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* This ul with me-auto pushes everything after it to the right */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                {" "}
                {/* Add hrefs to links */}
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">
                {" "}
                {/* Add hrefs to links */}
                Profile
              </a>
            </li>
          </ul>

          {/* Right-aligned items */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <div className="ms-3 d-flex gap-2">
            <a href="/login" className="btn btn-primary">
              Login
            </a>
            <a href="/signup" className="btn btn-outline-primary">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
