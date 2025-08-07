import React from "react";

const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-auto">
    <div className="container text-center">
      <span>
        &copy; {new Date().getFullYear()} SocialApp. All rights reserved.
      </span>
    </div>
  </footer>
);

export default Footer;
