import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx";
import PostListProvider from "../store/postListContext.jsx";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <PostListProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* HEADER */}
        <Header />

        {/* MIDDLE SECTION: Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block w-64 bg-white shadow-lg">
            <Sidebar />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 p-4 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </PostListProvider>
  );
}

export default MainLayout;
