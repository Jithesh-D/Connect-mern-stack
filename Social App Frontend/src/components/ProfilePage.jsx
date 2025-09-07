import { User, Settings, LogOut, Moon } from "lucide-react";

function ProfilePage() {
  return (
    <div className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto bg-white min-h-screen">
      {/* Blue Background Section */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-500 px-6 md:px-12 lg:px-16 pb-20 pt-8 md:pt-12 lg:pt-16">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-pink-200 overflow-hidden border-4 border-white shadow-lg">
            <img src="" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white -mt-12 md:-mt-16 lg:-mt-20 rounded-t-3xl px-6 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-6 md:mb-8 lg:mb-10">
            Jithesh.D
          </h1>

          {/* Contact Info */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8 mb-8 md:mb-12 lg:mb-16 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm md:text-base lg:text-lg">
                Phone
              </span>
              <span className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                935****45
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm md:text-base lg:text-lg">
                Mail
              </span>
              <span className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                jitheshd0006@gmail.com
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center py-4 md:py-6 lg:py-8 border-t border-gray-100 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600" />
              <span className="text-gray-900 text-sm md:text-base lg:text-lg">
                Dark mode
              </span>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-11 h-6 md:w-14 md:h-7 lg:w-16 lg:h-8 bg-gray-200 rounded-full shadow-inner"></div>
              <div className="absolute left-1 top-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-white rounded-full shadow transform transition-transform"></div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mt-4 md:mt-6 lg:mt-8 max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <button className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-gray-50 rounded-lg px-2 md:px-3 lg:px-4">
              <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600" />
              <span className="text-gray-900 text-sm md:text-base lg:text-lg">
                Profile details
              </span>
            </button>

            <button className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-gray-50 rounded-lg px-2 md:px-3 lg:px-4">
              <Settings className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600" />
              <span className="text-gray-900 text-sm md:text-base lg:text-lg">
                Settings
              </span>
            </button>

            <button className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full py-4 md:py-5 lg:py-6 text-left hover:bg-gray-50 rounded-lg px-2 md:px-3 lg:px-4">
              <LogOut className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-600" />
              <span className="text-gray-900 text-sm md:text-base lg:text-lg">
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
