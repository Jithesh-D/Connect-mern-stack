import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import "./App.css";
import Sidebar from "./components/sidebar.jsx";
import PostListProvider from "./store/postListContext.jsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
