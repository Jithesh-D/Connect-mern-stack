import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx";
import PostListProvider from "../store/postListContext.jsx";
import { Outlet } from "react-router-dom";
import FloatingChatbot from "./FloatingBot";

function MainLayout() {
  return (
    <PostListProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-dark transition-colors duration-200">
        {/* HEADER */}
        <Header />

        {/* MIDDLE SECTION: Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block w-64 bg-white dark:bg-dark shadow-lg transition-colors duration-200">
            <Sidebar />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 p-4 overflow-auto bg-white dark:bg-dark transition-colors duration-200">
            <Outlet />
          </main>
        </div>

        {/* FOOTER */}
        <Footer />

        {/* FLOATING CHATBOT */}
        <FloatingChatbot />
      </div>
    </PostListProvider>
  );
}

export default MainLayout;
