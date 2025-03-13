import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#090e1a]  text-white py-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Zidio Branding */}
        <div className="md:col-span-2 animate-fadeIn">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Zidio
          </h2>
          <p className="text-gray-400 mt-2">Streamline your tasks, boost productivity.</p>
        </div>

        {/* Features */}
        <div className="animate-slideUp">
          <h3 className="text-xl font-semibold text-gray-300 hover:text-blue-400 transition">
            Features
          </h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li className="hover:text-green-400 transition">Task Management</li>
            <li className="hover:text-yellow-400 transition">Collaboration Tools</li>
            <li className="hover:text-purple-400 transition">Real-time Analytics</li>
            <li className="hover:text-red-400 transition">AI Smart Reminders</li>
          </ul>
        </div>

        {/* Support */}
        <div className="animate-slideUp">
          <h3 className="text-xl font-semibold text-gray-300 hover:text-green-400 transition">
            Support
          </h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li className="hover:text-blue-400 transition">Help Center</li>
            <li className="hover:text-purple-400 transition">FAQs</li>
            <li className="hover:text-yellow-400 transition">Contact Us</li>
            <li className="hover:text-red-400 transition">Community Forum</li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="animate-slideUp">
          <h3 className="text-xl font-semibold text-gray-300 hover:text-pink-400 transition">
            Subscribe
          </h3>
          <p className="text-gray-400 mt-2">Get the latest updates and features.</p>
          <div className="mt-3 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 bg-gray-800 text-white rounded-l-md focus:outline-none"
            />
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition px-4 py-2 rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Social Media & Links */}
      <div className="mt-10 border-t border-gray-700 pt-5 flex flex-col md:flex-row items-center justify-between px-6 lg:px-20 animate-fadeIn">
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-blue-500 transition transform hover:scale-110">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-sky-400 transition transform hover:scale-110">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition transform hover:scale-110">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300 transition transform hover:scale-110">
            <FaGithub size={20} />
          </a>
        </div>

        {/* Quick Links */}
        <div className="mt-4 md:mt-0">
          <ul className="flex space-x-6 text-gray-400 text-sm">
            <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Terms of Service</li>
            <li className="hover:text-green-400 transition cursor-pointer">Cookies Policy</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-5">
        © {new Date().getFullYear()} Zidio. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
