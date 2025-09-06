import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx";
import PostListProvider from "../store/postListContext.jsx";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <PostListProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white shadow-lg">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </PostListProvider>
  );
}

export default MainLayout;
