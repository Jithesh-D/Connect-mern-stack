import PostList from "./postList.jsx";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-2xl mx-auto p-4">
        <PostList />
      </main>

      {/* RIGHT SIDEBAR (New Trending / Events Section) */}
      <aside className="hidden lg:block w-80 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Trending</h2>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition">
            🚀 RVU Hackathon starts in 2 days!
          </div>
          <div className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition">
            💼 Infosys placed 20 students this week!
          </div>
          <div className="p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition">
            🎉 RVU Cultural Fest announced!
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;