import React from "react"
import { useTheme } from "../context/ThemeContext"
import { BookOpen, Clock, User, Network } from "lucide-react"

const ComputerNetworksArticle = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
    }`}>
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Computer Networks
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Understanding how computers communicate and share information across the globe
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>20 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Technical Guide</span>
            </div>
            <div className="flex items-center gap-2">
              <Network size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Networking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <article className={`prose prose-lg max-w-none ${
          isDarkMode ? "prose-invert" : ""
        }`}>
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              What are Computer Networks?
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A computer network is a collection of interconnected devices that can communicate and share resources with each other. 
              These devices can include computers, servers, routers, switches, and mobile devices connected through wired or wireless links.
            </p>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Think of computer networks like a postal system - messages (data) are packaged, addressed, and sent through various 
              routes to reach their destination. Just like mail, data travels through multiple intermediary points before reaching its final destination.
            </p>
          </section>

          {/* OSI Model */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              The OSI Model
            </h2>
            <p className={`text-base leading-relaxed mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              The Open Systems Interconnection (OSI) model is a conceptual framework that describes how data communication occurs between devices in a network. It consists of seven layers:
            </p>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Layer 7: Application Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Provides network services directly to end-users. Examples: HTTP, HTTPS, FTP, SMTP, DNS
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Layer 6: Presentation Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Handles data formatting, encryption, and compression. Examples: SSL/TLS, JPEG, GIF
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Layer 5: Session Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Manages sessions between applications. Examples: NetBIOS, RPC, SQL sessions
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Layer 4: Transport Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Ensures reliable data delivery and error correction. Examples: TCP, UDP
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  Layer 3: Network Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Handles routing and logical addressing. Examples: IP, ICMP, routing protocols
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-yellow-50 border-yellow-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                  Layer 2: Data Link Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Manages node-to-node data transfer and error detection. Examples: Ethernet, WiFi, switches
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Layer 1: Physical Layer
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Deals with physical transmission of data. Examples: cables, wireless signals, hubs
                </p>
              </div>
            </div>
          </section>

          {/* TCP/IP Model */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              TCP/IP Protocol Suite
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  TCP (Transmission Control Protocol)
                </h3>
                <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  TCP is a connection-oriented protocol that ensures reliable data transmission. It provides error checking, 
                  flow control, and guarantees that data arrives in the correct order.
                </p>
                <div className={`mt-3 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Key Features:</strong> Connection-oriented, reliable delivery, error correction, flow control
                  </p>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  IP (Internet Protocol)
                </h3>
                <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  IP is responsible for addressing and routing data packets across networks. It provides a unique address 
                  for each device and determines the best path for data to travel.
                </p>
                <div className={`mt-3 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Versions:</strong> IPv4 (32-bit addresses) and IPv6 (128-bit addresses)
                  </p>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  UDP (User Datagram Protocol)
                </h3>
                <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  UDP is a connectionless protocol that provides fast, but unreliable data transmission. 
                  It's ideal for applications where speed is more important than reliability.
                </p>
                <div className={`mt-3 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Use Cases:</strong> Video streaming, online gaming, DNS queries, live broadcasts
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Network Devices */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Network Devices
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Router
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Connects different networks and determines the best path for data packets. 
                  Operates at Layer 3 (Network Layer) of the OSI model.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Switch
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Connects devices within the same network and forwards data based on MAC addresses. 
                  Operates at Layer 2 (Data Link Layer).
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Hub
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  A simple device that repeats data to all connected devices. 
                  Operates at Layer 1 (Physical Layer) and largely obsolete today.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Firewall
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Security device that monitors and controls network traffic based on predetermined rules. 
                  Can operate at multiple layers of the OSI model.
                </p>
              </div>
            </div>
          </section>

          {/* Network Topologies */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Network Topologies
            </h2>
            
            <ul className="space-y-3">
              <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                <span><strong>Star Topology:</strong> All devices connect to a central hub or switch. Easy to manage but single point of failure.</span>
              </li>
              <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                <span><strong>Bus Topology:</strong> All devices share a single communication line. Simple but collision-prone.</span>
              </li>
              <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                <span><strong>Ring Topology:</strong> Devices form a closed loop. Data travels in one direction around the ring.</span>
              </li>
              <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                <span><strong>Mesh Topology:</strong> Every device connects to every other device. Highly reliable but complex and expensive.</span>
              </li>
              <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                <span><strong>Hybrid Topology:</strong> Combination of two or more topologies. Flexible but complex to design.</span>
              </li>
            </ul>
          </section>

          {/* Common Protocols */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Common Network Protocols
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h4 className={`font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>HTTP/HTTPS</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Web browsing and data transfer</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h4 className={`font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>FTP/SFTP</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>File transfer between systems</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h4 className={`font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>SMTP/POP3/IMAP</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Email communication</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h4 className={`font-semibold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>DNS</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Domain name resolution</p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Key Takeaways
            </h2>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Computer networks form the backbone of modern communication and information sharing. Understanding 
              the OSI model, TCP/IP protocols, network devices, and topologies is essential for anyone working 
              in technology today.
            </p>
            <p className={`text-base leading-relaxed mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Whether you're developing web applications, managing IT infrastructure, or simply curious about 
              how the internet works, these networking fundamentals provide the foundation for deeper learning 
              and practical application in the field.
            </p>
          </section>

        </article>
      </div>
    </div>
  )
}

export default ComputerNetworksArticle
