import { User, Settings, LogOut, Moon } from "lucide-react";

function ProfilePage() {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">AP</span>
          </div>
          <span className="text-gray-600 text-sm">Mark Parchell</span>
        </div>
        <button className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm">
          Following
        </button>
      </div>


      <div className="flex justify-between items-center px-4 py-2 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
            <rect
              x="1"
              y="3"
              width="22"
              height="10"
              rx="2"
              stroke="black"
              strokeWidth="1"
              fill="none"
            />
            <rect x="23" y="6" width="2" height="4" rx="1" fill="black" />
            <rect x="3" y="5" width="18" height="6" rx="1" fill="black" />
          </svg>
        </div>
      </div> */}

      {/* Purple Background Section */}
      <div className="bg-gradient-to-b from-purple-300 to-purple-400 px-6 pb-20 pt-8">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-pink-200 overflow-hidden border-4 border-white shadow-lg">
            <img src="" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white -mt-12 rounded-t-3xl px-6 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Jithesh.D
          </h1>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Phone</span>
              <span className="text-gray-900 font-medium">935****45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Mail</span>
              <span className="text-gray-900 font-medium">
                jitheshd0006@gmail.com
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center py-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Dark mode</span>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mt-4">
            <button className="flex items-center gap-3 w-full py-4 text-left hover:bg-gray-50 rounded-lg px-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Profile details</span>
            </button>

            <button className="flex items-center gap-3 w-full py-4 text-left hover:bg-gray-50 rounded-lg px-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Settings</span>
            </button>

            <button className="flex items-center gap-3 w-full py-4 text-left hover:bg-gray-50 rounded-lg px-2">
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
