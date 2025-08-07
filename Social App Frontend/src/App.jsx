import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import "./App.css";
import Sidebar from "./components/sidebar.jsx";
import CreatePost from "./components/createPost.jsx";
import PostListProvider from "./store/postListContext.jsx";
import PostList from "./components/postList.jsx";
import { Outlet } from "react-router-dom";
function App() {
  const [selectedTab, setSelectedTab] = useState("Home");
  return (
    <>
      <PostListProvider>
        <div className="itemContainer">
          <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="content">
            <Header />
            {/* {selectedTab === "Home" ? <PostList /> : <CreatePost />} */}
            <Outlet />
            <Footer />
          </div>
        </div>
      </PostListProvider>
    </>
  );
}

export default App;
