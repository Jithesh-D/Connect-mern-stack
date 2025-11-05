import Header from "./header.jsx";
import DeveloperInfoCard from "./footer.jsx";
import Sidebar from "./sidebar.jsx";
import RightSidebar from "./RightSidebar.jsx";
import PostListProvider from "../store/postListContext.jsx";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

function MainLayout() {
  return (
    <PostListProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-200">
        {/* HEADER */}
        <Header />

        {/* MIDDLE SECTION: Left Sidebar + Main Content + Right Sidebar */}
        <div className="flex flex-1 relative">
          {/* LEFT SIDEBAR */}
          <aside
            className="hidden lg:block w-64 sticky top-16 self-start transition-colors duration-200"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            <div className="overflow-y-auto h-full">
              <Sidebar />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0 p-4 bg-white dark:bg-black transition-colors duration-200">
            <Outlet />
          </main>

          {/* RIGHT SIDEBAR */}
          <RightSidebar />
        </div>

        {/* FOOTER */}
        <DeveloperInfoCard />

        {/* Persistent mobile bottom navigation */}
        <BottomNav />
      </div>
    </PostListProvider>
  );
}

export default MainLayout;
