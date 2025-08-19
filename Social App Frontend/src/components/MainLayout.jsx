import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx";
import PostListProvider from "../store/postListContext.jsx";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <PostListProvider>
      <div className="itemContainer">
        <Sidebar />
        <div className="content">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </div>
    </PostListProvider>
  );
}

export default MainLayout;
