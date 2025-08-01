import React, { useState } from "react"
import { 
  Network, 
  Layers, 
  Shield, 
  Globe, 
  Router, 
  Wifi, 
  Server, 
  Lock,
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Code,
  Zap,
  Eye,
  CheckCircle,
  MapPin,
  Settings,
  Target,
  FileText,
  Monitor,
  Cloud,
  Database,
  Key,
  Search,
  Link,
  Activity,
  AlertTriangle,
  ArrowRight,
  Star,
  TrendingUp,
  Copy
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const computerNetworkingData = {
  "Network Fundamentals": {
    icon: Network,
    color: "from-blue-500 to-cyan-500",
    content: {
      "Introduction to Networks": {
        definition: "A network is a collection of devices connected to each other through physical media to allow the sharing of data. In a network, two or more nodes are connected by a physical link, or two or more networks are connected by one or more nodes.",
        keyPoints: [
          "Enables resource sharing between devices",
          "Facilitates communication and data exchange", 
          "Provides centralized data management",
          "Supports collaborative work environments"
        ]
      },
      "Network Types": {
        definition: "Networks are classified based on their geographical coverage and scope.",
        types: [
          {
            name: "PAN (Personal Area Network)",
            range: "Up to 10 meters",
            description: "Created for personal use to connect devices like computers, telephones, fax, printers, etc."
          },
          {
            name: "LAN (Local Area Network)", 
            description: "Used for a small geographical location like an office, hospital, or school."
          },
          {
            name: "HAN (House Area Network)",
            description: "A LAN used within a house to connect personal computers, phones, printers, etc."
          },
          {
            name: "CAN (Campus Area Network)",
            description: "Connects devices within a campus area, linking different departments of an organization."
          },
          {
            name: "MAN (Metropolitan Area Network)",
            description: "Connects devices that span large cities or a wide geographical area."
          },
          {
            name: "WAN (Wide Area Network)",
            description: "Used over a wide geographical location that may range from connecting cities to countries."
          },
          {
            name: "GAN (Global Area Network)",
            description: "Uses satellites to connect devices over a global area."
          }
        ]
      },
      "Network Topologies": {
        definition: "Network topology specifies the layout of a computer network, showing how devices and cables are connected to each other.",
        topologies: [
          {
            name: "Star Topology",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Star_network.svg/1200px-Star_network.svg.png",
            description: "In a Star topology, all nodes are connected to a single central device.",
            characteristics: [
              "Requires more cable compared to other topologies",
              "It is more robust, as a failure in one cable will only disconnect a specific computer",
              "If the central device is damaged, the whole network fails",
              "It is very easy to install, manage, and troubleshoot",
              "Commonly used in office and home networks"
            ]
          },
          {
            name: "Ring Topology",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Ring_network.svg/1200px-Ring_network.svg.png",
            description: "In a Ring topology, nodes are connected to exactly two other nodes, forming a single continuous path for data transmission.",
            characteristics: [
              "Does not need a central server to control connectivity",
              "If a single node is damaged, the entire network fails",
              "It is very rarely used as it is expensive and difficult to install and manage",
              "Examples include SONET and SDH networks"
            ]
          },
          {
            name: "Bus Topology",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Bus_network.svg/1200px-Bus_network.svg.png",
            description: "In a Bus topology, all nodes are connected to a single central cable known as the bus.",
            characteristics: [
              "Acts as a shared communication medium; data sent over the bus is received by all attached devices",
              "Useful for a small number of devices",
              "If the central bus is damaged, the entire network fails"
            ]
          },
          {
            name: "Mesh Topology",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Mesh_network.svg/1200px-Mesh_network.svg.png",
            description: "In a Mesh topology, all nodes are individually connected to other nodes.",
            types: [
              {
                name: "Fully Connected Mesh",
                description: "In this topology, all the nodes are connected to each other."
              },
              {
                name: "Partially Connected Mesh",
                description: "In this topology, all the nodes are not connected to each other."
              }
            ],
            characteristics: [
              "Does not need any central switch or hub",
              "It is robust, as a failure in one cable will only disconnect the specific computer connected to it",
              "Rarely used because installation and configuration are difficult as connectivity increases",
              "Cabling cost is high due to the amount of wiring required"
            ]
          },
          {
            name: "Tree Topology",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tree_network.svg/1200px-Tree_network.svg.png",
            description: "A Tree topology is a combination of star and bus topologies, also known as an expanded star topology. All star networks are connected to a single bus.",
            characteristics: [
              "Uses the Ethernet protocol",
              "The network is divided into segments (star networks) which can be easily maintained",
              "If one segment is damaged, there is no effect on other segments",
              "The entire network depends on the 'main bus'; if it breaks, the whole network gets damaged"
            ]
          },
          {
            name: "Hybrid Topology",
            description: "A Hybrid topology is a combination of different topologies to form a new resulting topology.",
            characteristics: [
              "If a star topology is connected with another star topology, it remains a star topology",
              "If a star topology is connected with a different topology, it becomes a Hybrid topology",
              "It provides flexibility as it can be implemented in different network environments"
            ]
          }
        ]
      }
    }
  },
  "OSI Model": {
    icon: Layers,
    color: "from-purple-500 to-pink-500",
    content: {
      "OSI Model Overview": {
        definition: "A network architecture model based on ISO standards. It's called the OSI model because it deals with connecting systems that are open for communication with other systems. It has seven layers.",
        principles: [
          "Create a new layer if a different abstraction is needed",
          "Each layer should have a well-defined function",
          "The function of each layer is chosen based on internationally standardized protocols"
        ]
      },
      "OSI Layers (1-4)": {
        definition: "The lower four layers of the OSI model handle data transmission and network connectivity.",
        layers: [
          {
            layer: 1,
            name: "Physical Layer",
            description: "The lowest layer, used for the transmission of an unstructured raw bit stream over a physical medium. It transmits data in electrical, optical, or mechanical form and handles the physical connection between devices.",
            media: "twisted-pair cable, fibre-optic, wireless transmission"
          },
          {
            layer: 2,
            name: "DataLink Layer", 
            description: "Used for transferring data from one node to another. It receives data from the network layer, converts it into data frames, attaches the physical address, and sends it to the physical layer. It enables error-free data transfer.",
            functions: [
              "Frame synchronization: Ensures the destination can recognize the start and end of each frame",
              "Flow control: Controls the data flow within the network",
              "Error control: Detects and corrects errors during transmission",
              "Addressing: Attaches the physical address (MAC) to data frames",
              "Link management: Manages the initiation, maintenance, and termination of the link"
            ]
          },
          {
            layer: 3,
            name: "Network Layer",
            description: "Converts the logical address into a physical address and determines the best route for packets to travel from source to destination.",
            functions: [
              "Routing: Determines the best route from source to destination",
              "Logical addressing: Defines an addressing scheme to uniquely identify each device",
              "Packetizing: Converts data from the upper layer into packets",
              "Internetworking: Provides a logical connection between different types of networks",
              "Fragmentation: Divides packets into smaller fragments"
            ]
          },
          {
            layer: 4,
            name: "Transport Layer",
            description: "Delivers the message through the network and provides error checking so that no error occurs during the transfer of data.",
            services: [
              {
                type: "Connection-oriented transmission",
                description: "The receiver sends an acknowledgement to the sender after a packet is received"
              },
              {
                type: "Connectionless transmission", 
                description: "The receiver does not send an acknowledgement"
              }
            ]
          }
        ]
      },
      "OSI Layers (5-7)": {
        definition: "The upper three layers of the OSI model handle application-level services and user interfaces.",
        layers: [
          {
            layer: 5,
            name: "Session Layer",
            description: "Responsible for beginning, maintaining, and ending the communication between devices. It establishes and maintains the session and reports errors from upper layers."
          },
          {
            layer: 6,
            name: "Presentation Layer",
            description: "Also known as the Translation layer. It translates data from the application layer format to a common format on the sender's side, and from the common format to the application layer format on the receiver's side.",
            functions: [
              "Character code translation",
              "Data conversion",
              "Data compression",
              "Data encryption"
            ]
          },
          {
            layer: 7,
            name: "Application Layer",
            description: "The topmost layer that enables the user to access the network. It includes protocols like FTP, SMTP, and DNS. The most widely used protocol is HTTP, which users use to send requests for web pages."
          }
        ]
      }
    }
  },
  "TCP/IP Model": {
    icon: Globe,
    color: "from-green-500 to-emerald-500",
    content: {
      "TCP/IP Overview": {
        definition: "A compressed version of the OSI model with only 4 layers, developed by the US Department of Defence (DoD). Its name is based on two standard protocols: TCP and IP.",
        layers: [
          {
            name: "Link",
            description: "Decides which links, such as serial lines or classic Ethernet, must be used to meet the needs of the connectionless internet layer.",
            examples: "SONET, Ethernet"
          },
          {
            name: "Internet",
            description: "The most important layer, holding the whole architecture together. It delivers IP packets where they are supposed to be delivered.",
            examples: "IP, ICMP"
          },
          {
            name: "Transport",
            description: "Functionality is almost the same as the OSI transport layer. It enables peer entities on the network to carry on a conversation.",
            examples: "TCP, UDP"
          },
          {
            name: "Application",
            description: "Contains all the higher-level protocols.",
            examples: "HTTP, SMTP, RTP, DNS"
          }
        ]
      },
      "TCP vs UDP": {
        title: "TCP vs UDP",
        tcp: {
          name: "Transmission Control Protocol",
          connectionType: "Connection-oriented",
          speed: "Comparatively slower than UDP",
          errorChecking: "Provides extensive error checking mechanisms, flow control, and acknowledgment of data",
          reliability: "Retransmission of lost data packets is only possible with TCP"
        },
        udp: {
          name: "User Datagram Protocol",
          connectionType: "Connectionless",
          speed: "A much faster, simpler, and efficient protocol",
          errorChecking: "Has only the basic error checking mechanism using checksums",
          reliability: "Retransmission of lost data packets is not possible"
        }
      },
      "IPv4 Addressing": {
        definition: "An IP address is a 32-bit dynamic address of a node in the network. An IPv4 address has 4 octets of 8-bits each, with each number having a value up to 255. Classes are differentiated based on the number of hosts the network supports.",
        classes: [
          {
            class: "A",
            startAddress: "0.0.0.0",
            endAddress: "127.255.255.255",
            usage: "Used for Large Network"
          },
          {
            class: "B",
            startAddress: "128.0.0.0",
            endAddress: "191.255.255.255",
            usage: "Used for Medium Size Network"
          },
          {
            class: "C",
            startAddress: "192.0.0.0",
            endAddress: "223.255.255.255",
            usage: "Used for Local Area Network"
          },
          {
            class: "D",
            startAddress: "224.0.0.0",
            endAddress: "239.255.255.255",
            usage: "Reserved for Multicasting"
          },
          {
            class: "E",
            startAddress: "240.0.0.0",
            endAddress: "255.255.255.254",
            usage: "Study and R&D"
          }
        ]
      }
    }
  },
  "Network Protocols": {
    icon: FileText,
    color: "from-orange-500 to-red-500",
    content: {
      "Protocol Basics": {
        definition: "A protocol is a set of rules used to govern all the aspects of information communication.",
        elements: [
          {
            name: "Syntax",
            description: "Specifies the structure or format of the data and the order in which they are presented."
          },
          {
            name: "Semantics",
            description: "Specifies the meaning of each section of bits."
          },
          {
            name: "Timing",
            description: "Specifies two characteristics: When data should be sent and how fast it can be sent."
          }
        ]
      },
      "Web Protocols": {
        definition: "Protocols used for web communication and data transfer.",
        protocols: [
          {
            name: "HTTP",
            fullName: "HyperText Transfer Protocol",
            description: "Defines the set of rules and standards for how information can be transmitted on the World Wide Web (WWW). It helps web browsers and web servers to communicate. It is a 'stateless protocol' where each command is independent. It is an application layer protocol built on TCP.",
            port: 80
          },
          {
            name: "HTTPS",
            fullName: "HyperText Transfer Protocol Secure",
            description: "An advanced and secured version of HTTP. It uses SSL/TLS protocol on top of HTTP to provide security. It enables secure transactions by encrypting communication and helps identify network servers securely.",
            port: 443
          },
          {
            name: "DNS",
            fullName: "Domain Name System",
            introduction: "Introduced by Paul Mockapetris and Jon Postel in 1983. It is a naming system for all resources over the internet, including physical nodes and applications, used to locate resources easily.",
            function: "An internet service that maps domain names to their associated IP addresses. Without DNS, users would need to know the IP address of the web page they want to access.",
            working: "When a user types a domain name (e.g., https://www.shaurya.com), the DNS translates it into an IP address that the computer can interpret to locate the requested web page.",
            forwarder: "A DNS forwarder is used with a DNS server to forward DNS queries that cannot be resolved locally to external DNS servers for resolution."
          }
        ]
      },
      "System Protocols": {
        definition: "Core protocols for network operations and system communication.",
        protocols: [
          {
            name: "SMTP",
            fullName: "Simple Mail Transfer Protocol",
            description: "Sets the rules for communication between servers, helping software to transmit emails over the internet. It supports both End-to-End and Store-and-Forward methods.",
            port: 25,
            mode: "Always-listening"
          },
          {
            name: "DHCP",
            fullName: "Dynamic Host Configuration Protocol",
            layer: "Application Layer",
            description: "Used to auto-configure devices on IP networks, enabling them to use TCP and UDP-based protocols. DHCP servers auto-assign IPs, subnet masks, and other network configurations, and help resolve DNS.",
            port: 67
          },
          {
            name: "FTP",
            fullName: "File Transfer Protocol",
            layer: "Application Layer",
            description: "Used to transfer files and data reliably and efficiently between hosts. It can also be used to download files from remote servers to your computer.",
            port: 27
          },
          {
            name: "ICMP",
            fullName: "Internet Control Message Protocol",
            layer: "Network Layer",
            description: "Used for error handling. It is mainly used by network devices like routers for diagnosing network connection issues and is crucial for error reporting and testing if data is reaching the preferred destination in time.",
            port: 7
          }
        ]
      }
    }
  },
  "Network Security": {
    icon: Shield,
    color: "from-red-500 to-pink-500",
    content: {
      "VPN Technology": {
        definition: "A private Wide Area Network (WAN) built on the internet. It allows the creation of a secured tunnel between different networks using the public internet. By using a VPN, a client can connect to an organization's network remotely.",
        advantages: [
          "Used to connect offices in different geographical locations remotely and is cheaper compared to WAN connections",
          "Used for secure transactions and confidential data transfer",
          "Keeps an organization's information secured against potential threats by using virtualization",
          "Encrypts internet traffic and disguises online identity"
        ],
        types: [
          {
            name: "Access VPN",
            description: "Used to provide connectivity to remote mobile users and telecommuters as a low-cost alternative to dial-up or ISDN connections."
          },
          {
            name: "Site-to-Site VPN",
            description: "Also known as Router-to-Router VPN, it is commonly used in large companies to connect the network of one office to another in different locations.",
            subCategories: [
              {
                name: "Intranet VPN",
                description: "Connects remote offices in different geographical locations using shared infrastructure with the same accessibility policies as a private WAN."
              },
              {
                name: "Extranet VPN",
                description: "Uses shared infrastructure over an intranet to connect suppliers, customers, partners, and other entities using dedicated connections."
              }
            ]
          }
        ]
      },
      "Network Security Devices": {
        definition: "Hardware and software components that protect network infrastructure.",
        devices: [
          {
            name: "Firewall",
            description: "The firewall is a network security system that is used to monitor the incoming and outgoing traffic and blocks the same based on the firewall security policies. It acts as a wall between the internet (public network) and the networking devices (a private network). It is either a hardware device, software program, or a combination of both."
          },
          {
            name: "NIC (Network Interface Card)",
            description: "It is a peripheral card attached to the PC to connect to a network. Every NIC has its own MAC address that identifies the PC on the network. It provides a wireless connection to a local area network."
          }
        ]
      },
      "Address Types": {
        definition: "Different addressing schemes used in networking.",
        addresses: [
          {
            title: "MAC Address vs IP Address",
            summary: "Both are used to uniquely define a device on the internet.",
            macAddress: {
              provider: "NIC Card's Manufacturer",
              purpose: "To ensure the physical address of a computer. It uniquely identifies the devices on a network."
            },
            ipAddress: {
              provider: "Internet Service Provider",
              purpose: "To uniquely identify the connection of a network with that device taking part in a network."
            }
          },
          {
            title: "Private IP vs Public IP",
            privateIp: {
              description: "There are three ranges of IP addresses that have been reserved for IP addresses that are not valid for use on the internet. A proxy or NAT server must be used to access the internet on these private IPs."
            },
            publicIp: {
              description: "A public IP address is an address taken by the Internet Service Provider which facilitates communication on the internet."
            }
          }
        ]
      }
    }
  },
  "Network Operations": {
    icon: Settings,
    color: "from-indigo-500 to-purple-500",
    content: {
      "Network Devices Comparison": {
        definition: "Understanding the differences between key networking devices.",
        comparisons: [
          {
            title: "Hub vs Switch",
            hub: {
              description: "A networking device which is used to transmit the signal to each port (except one port) to respond from which the signal was received.",
              layer: "Physical Layer",
              filtering: "In this packet filtering is not available",
              types: "Active Hub, Passive Hub"
            },
            switch: {
              description: "Switch is a network device which is used to enable the connection establishment and connection termination on the basis of need.",
              layer: "Data link layer", 
              filtering: "In this packet filtering is available",
              mode: "Full duplex transmission mode",
              aka: "An efficient bridge"
            }
          },
          {
            title: "Gateway vs Router",
            sharedFunction: "A node that is connected to two or more networks is commonly known as a gateway. It is also known as a router. It is used to forward messages from one network to another and regulate traffic in the network.",
            difference: "A router sends the data between two similar networks while gateway sends the data between two dissimilar networks."
          }
        ]
      },
      "Network Utilities": {
        definition: "Command-line tools for network troubleshooting and configuration.",
        utilities: [
          {
            title: "ipconfig vs ifconfig",
            ipconfig: {
              name: "Internet Protocol Configuration",
              os: "Microsoft operating systems",
              purpose: "To view and configure network interfaces."
            },
            ifconfig: {
              name: "Interface Configuration", 
              os: "MAC, Linux, UNIX operating systems",
              purpose: "To view and configure network interfaces."
            }
          },
          {
            name: "Netstat",
            description: "It is a command line utility program. It gives useful information about the current TCP/IP setting of a connection."
          },
          {
            name: "Ping",
            description: "The 'ping' is a utility program that allows you to check the connectivity between the network devices. You can ping devices using its IP address or name."
          }
        ]
      },
      "Data Transmission Types": {
        definition: "Different methods of sending data across networks.",
        types: [
          {
            name: "Unicasting",
            description: "If the message is sent to a single node from the source then it is known as unicasting. This is commonly used in networks to establish a new connection."
          },
          {
            name: "Anycasting",
            description: "If the message is sent to any of the nodes from the source then it is known as anycasting. It is mainly used to get the content from any of the servers in the Content Delivery System."
          },
          {
            name: "Multicasting",
            description: "If the message is sent to a subset of nodes from the source then it is known as multicasting. Used to send the same data to multiple receivers."
          },
          {
            name: "Broadcasting",
            description: "If the message is sent to all the nodes in a network from a source then it is known as broadcasting. DHCP and ARP in the local network use broadcasting."
          }
        ]
      }
    }
  },
  "Advanced Concepts": {
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
    content: {
      "Google Search Process": {
        title: "What happens when you enter google.com in the web browser?",
        steps: [
          "Check the browser cache first if the content is fresh and present in the cache display the same",
          "If not, the browser checks if the IP of the URL is present in the cache (browser and OS)",
          "if not then requests the OS to do a DNS lookup using UDP to get the corresponding IP address of the URL from the DNS server to establish a new TCP connection",
          "A new TCP connection is set between the browser and the server using three-way handshaking",
          "An HTTP request is sent to the server using the TCP connection",
          "The web servers running on the Servers handle the incoming HTTP request and send the HTTP response",
          "The browser processes the HTTP response sent by the server and may close the TCP connection or reuse the same for future requests",
          "If the response data is cacheable then browsers cache the same",
          "Browser decodes the response and renders the content"
        ]
      },
      "Network Quality Metrics": {
        definition: "Factors that determine network reliability and effectiveness.",
        reliability: [
          {
            name: "Downtime",
            description: "The downtime is defined as the required time to recover."
          },
          {
            name: "Failure Frequency",
            description: "It is the frequency when it fails to work the way it is intended."
          },
          {
            name: "Catastrophe",
            description: "It indicates that the network has been attacked by some unexpected event such as fire, earthquake."
          }
        ],
        effectiveness: [
          {
            name: "Performance",
            description: "performance can be measured in many ways like transmit time and response time."
          },
          {
            name: "Reliability",
            description: "reliability is measured by frequency of failure."
          },
          {
            name: "Robustness",
            description: "robustness specifies the quality or condition of being strong and in good condition."
          },
          {
            name: "Security",
            description: "It specifies how to protect data from unauthorized access and viruses."
          }
        ]
      },
      "Advanced Technologies": {
        definition: "Modern networking concepts and technologies.",
        concepts: [
          {
            name: "Subnet",
            description: "A subnet is a network inside a network achieved by the process called subnetting which helps divide a network into subnets. It is used for getting a higher routing efficiency and enhances the security of the network. It reduces the time to extract the host address from the routing table."
          },
          {
            name: "Node and Link",
            description: "A network is a connection setup of two or more computers directly connected by some physical mediums like optical fiber or coaxial cable. This physical medium of connection is known as a link, and the computers that it is connected to are known as nodes."
          },
          {
            name: "RAID",
            fullName: "Redundant Array of Inexpensive/Independent Disks",
            description: "It is a method to provide Fault Tolerance by using multiple Hard Disc Drives."
          },
          {
            name: "Peer-to-Peer (P2P)",
            description: "The processes on each machine that communicate at a given layer are called peer-peer processes."
          }
        ]
      }
    }
  }
}

const ComputerNetworks = () => {
  const { isDarkMode } = useTheme()
  const [openAccordion, setOpenAccordion] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [completedTopics, setCompletedTopics] = useState(new Set())

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key)
  }

  const markTopicComplete = (topic) => {
    const newCompleted = new Set(completedTopics)
    if (newCompleted.has(topic)) {
      newCompleted.delete(topic)
    } else {
      newCompleted.add(topic)
    }
    setCompletedTopics(newCompleted)
  }

  const renderExpandedContent = (title, content, categoryKey) => {
    const { icon: Icon, color } = computerNetworkingData[categoryKey]
    
    return (
      <div className="w-full">
        {/* Header for expanded view */}
        <div className={`mb-8 p-6 rounded-xl border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <div>
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  {title}
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {Object.keys(content).length} topics • Interactive learning mode
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* Full width content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(content).map(([subTitle, subContent]) => (
            <div key={subTitle} className={`border rounded-xl overflow-hidden ${
              isDarkMode ? "border-gray-700 bg-gray-800/30" : "border-gray-200 bg-white/50"
            }`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAccordion(`${categoryKey}-${subTitle}`)}
                  className={`w-full text-left p-6 flex items-center justify-between transition-all ${
                    isDarkMode ? "hover:bg-gray-700/50 text-gray-200" : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">{subTitle}</span>
                    {completedTopics.has(`${categoryKey}-${subTitle}`) && (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markTopicComplete(`${categoryKey}-${subTitle}`)
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        completedTopics.has(`${categoryKey}-${subTitle}`)
                          ? "text-green-500 bg-green-100 dark:bg-green-900/30"
                          : isDarkMode ? "text-gray-400 hover:text-green-400 hover:bg-gray-700" : "text-gray-500 hover:text-green-600 hover:bg-gray-100"
                      }`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <ChevronRight size={18} className={`transition-transform duration-200 ${
                      openAccordion === `${categoryKey}-${subTitle}` ? "rotate-90" : ""
                    }`} />
                  </div>
                </button>
              </div>
              
              {openAccordion === `${categoryKey}-${subTitle}` && (
                <div className={`p-6 border-t ${
                  isDarkMode 
                    ? "bg-gray-800/50 border-gray-700 text-gray-300" 
                    : "bg-gray-50/50 border-gray-200 text-gray-700"
                }`}>
                  {renderSubContent(subContent, color)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderContent = (title, content, categoryKey) => {
    const { icon: Icon, color } = computerNetworkingData[categoryKey]
    
    return (
      <div
        key={categoryKey}
        className={`group relative overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-105 cursor-pointer`}
        onClick={() => setSelectedCategory(categoryKey)}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-2 h-2 bg-gradient-to-br ${color} rounded-full opacity-30 animate-pulse`}
               style={{ top: "10%", left: "20%" }} />
          <div className={`absolute w-1 h-1 bg-gradient-to-br ${color} rounded-full opacity-50 animate-ping`}
               style={{ top: "70%", right: "30%", animationDelay: "1s" }} />
          <div className={`absolute w-1.5 h-1.5 bg-gradient-to-br ${color} rounded-full opacity-40 animate-pulse`}
               style={{ bottom: "20%", left: "10%", animationDelay: "2s" }} />
        </div>

        <div className={`relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
          isDarkMode 
            ? "bg-gray-800/80 border-gray-700/50 hover:bg-gray-800/90" 
            : "bg-white/80 border-gray-200/50 hover:bg-white/90"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon size={20} />
              </div>
              <h3 className={`text-xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {title}
              </h3>
            </div>
            <div className={`transition-transform duration-300`}>
              <ChevronRight size={20} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
            </div>
          </div>

          {/* Preview content */}
          <div className="opacity-80">
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Click to explore {Object.keys(content).length} key topics in {title.toLowerCase()}...
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.keys(content).slice(0, 3).map((topic, idx) => (
                <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}>
                  {topic}
                </span>
              ))}
              {Object.keys(content).length > 3 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                }`}>
                  +{Object.keys(content).length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSubContent = (content, color) => {
    if (typeof content === 'string') {
      return <p className="text-sm leading-relaxed">{content}</p>
    }

    return (
      <div className="space-y-6">
        {/* Definition */}
        {content.definition && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <BookOpen size={16} className={`text-blue-500`} />
              Definition
            </h5>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm leading-relaxed">{content.definition}</p>
            </div>
          </div>
        )}

        {/* Key Points - Table */}
        {content.keyPoints && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Target size={16} className="text-green-500" />
              Key Points
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Key Point</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.keyPoints.map((point, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{idx + 1}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Network Types - Table */}
        {content.types && Array.isArray(content.types) && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Network size={16} className="text-blue-500" />
              Network Types
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Type</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Range</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.types.map((type, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{type.name}</td>
                      <td className={`px-4 py-3 text-sm text-blue-500`}>{type.range || "Variable"}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{type.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Network Topologies - Table */}
        {content.topologies && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <MapPin size={16} className="text-purple-500" />
              Network Topologies
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Topology</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Key Characteristics</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.topologies.map((topology, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        <div className="flex items-center gap-2">
                          <Router size={14} className="text-indigo-500" />
                          {topology.name}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{topology.description}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {topology.characteristics && (
                          <ul className="space-y-1">
                            {topology.characteristics.slice(0, 2).map((char, charIdx) => (
                              <li key={charIdx} className="flex items-start gap-1">
                                <span className="text-green-400">•</span>
                                <span className="text-xs">{char}</span>
                              </li>
                            ))}
                            {topology.characteristics.length > 2 && (
                              <li className="text-xs text-gray-500">+{topology.characteristics.length - 2} more...</li>
                            )}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OSI Layers - Table */}
        {content.layers && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Layers size={16} className="text-purple-500" />
              {content.layers[0]?.layer ? "OSI Model Layers" : "Protocol Layers"}
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    {content.layers[0]?.layer && <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Layer</th>}
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Name</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Examples</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.layers.map((layer, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      {layer.layer && (
                        <td className={`px-4 py-3 text-sm font-bold text-purple-500`}>
                          Layer {layer.layer}
                        </td>
                      )}
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {layer.name}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {layer.description}
                      </td>
                      <td className={`px-4 py-3 text-sm text-orange-500`}>
                        {layer.examples || layer.media || "Various"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TCP vs UDP Comparison - Table */}
        {content.tcp && content.udp && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Globe size={16} className="text-green-500" />
              Protocol Comparison
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Feature</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-green-600`}>TCP</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-blue-600`}>UDP</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  <tr className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Connection Type</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.tcp.connectionType}</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.udp.connectionType}</td>
                  </tr>
                  <tr className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Speed</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.tcp.speed}</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.udp.speed}</td>
                  </tr>
                  <tr className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Error Checking</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.tcp.errorChecking}</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.udp.errorChecking}</td>
                  </tr>
                  <tr className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Reliability</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.tcp.reliability}</td>
                    <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{content.udp.reliability}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IP Classes - Table */}
        {content.classes && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Database size={16} className="text-indigo-500" />
              IP Address Classes
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Class</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Start Address</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>End Address</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Usage</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.classes.map((ipClass, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-bold text-indigo-500`}>Class {ipClass.class}</td>
                      <td className={`px-4 py-3 text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{ipClass.startAddress}</td>
                      <td className={`px-4 py-3 text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{ipClass.endAddress}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{ipClass.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Protocol Elements - Table */}
        {content.elements && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Settings size={16} className="text-orange-500" />
              Protocol Elements
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Element</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.elements.map((element, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{element.name}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{element.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Protocols List - Table */}
        {content.protocols && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Globe size={16} className="text-blue-500" />
              Network Protocols
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Protocol</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Full Name</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Port</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Layer</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                  {content.protocols.map((protocol, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        <div className="flex items-center gap-2">
                          <Code size={14} className="text-blue-500" />
                          {protocol.name}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{protocol.fullName || "N/A"}</td>
                      <td className={`px-4 py-3 text-sm`}>
                        {protocol.port ? (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">{protocol.port}</span>
                        ) : (
                          <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>N/A</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-sm`}>
                        {protocol.layer ? (
                          <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">{protocol.layer}</span>
                        ) : (
                          <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generic content for other fields */}
        {Object.entries(content).filter(([key]) => 
          !['definition', 'keyPoints', 'types', 'topologies', 'layers', 'tcp', 'udp', 'classes', 'elements', 'protocols'].includes(key)
        ).map(([key, value]) => (
          <div key={key} className="mb-6">
            <h5 className={`font-semibold mb-3 capitalize flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <FileText size={14} className="text-gray-500" />
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h5>
            {Array.isArray(value) ? (
              <div className={`overflow-hidden rounded-lg border ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              }`}>
                <table className="w-full">
                  <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Item</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "bg-gray-800/30" : "bg-white"}>
                    {value.map((item, idx) => (
                      <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{idx + 1}</td>
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                          {typeof item === 'string' ? item : JSON.stringify(item)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}>
                <p className="text-sm leading-relaxed">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Header */}
      <div className={`relative z-10 pt-20 pb-12 ${
        isDarkMode ? "bg-slate-900/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="text-center max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 shadow-2xl">
            <Network className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            Computer Networks
          </h1>
          <p className={`text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Master comprehensive networking fundamentals for technical interviews with detailed explanations, practical examples, and interactive learning
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-blue-500">{Object.keys(computerNetworkingData).length}</div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Categories</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-green-500">
                {Object.values(computerNetworkingData).reduce((total, category) => 
                  total + Object.keys(category.content).length, 0
                )}
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Topics</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-purple-500">{completedTopics.size}</div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Completed</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-orange-500">
                {Math.round((completedTopics.size / Object.values(computerNetworkingData).reduce((total, category) => 
                  total + Object.keys(category.content).length, 0
                )) * 100) || 0}%
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Progress</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className={`w-full h-3 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(completedTopics.size / Object.values(computerNetworkingData).reduce((total, category) => 
                    total + Object.keys(category.content).length, 0
                  )) * 100}%` 
                }}
              />
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {completedTopics.size} of {Object.values(computerNetworkingData).reduce((total, category) => 
                total + Object.keys(category.content).length, 0
              )} topics completed
            </p>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mt-8" />
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8">
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
            <Search size={20} className="text-blue-500" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {Object.entries(computerNetworkingData).map(([title, data]) => {
              const { icon: Icon, color } = data
              const isActive = selectedCategory === title
              return (
                <button
                  key={title}
                  onClick={() => setSelectedCategory(isActive ? null : title)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${color} text-white border-transparent shadow-lg`
                      : isDarkMode 
                        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon size={20} className={`mx-auto mb-2 ${isActive ? 'text-white' : ''}`} />
                  <div className="text-xs font-medium text-center">{title.split(' ')[0]}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {selectedCategory ? (
          // Full width expanded view when a category is selected
          <div className="w-full">
            {Object.entries(computerNetworkingData)
              .filter(([title]) => title === selectedCategory)
              .map(([title, data]) => (
                <div key={title} className="w-full">
                  {renderExpandedContent(title, data.content, title)}
                </div>
              ))
            }
          </div>
        ) : (
          // Grid view when no category is selected
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(computerNetworkingData).map(([title, data]) => 
              renderContent(title, data.content, title)
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-10">
        <div className={`max-w-4xl mx-auto p-6 rounded-xl border ${
          isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
        }`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen size={20} className="text-blue-500" />
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Interactive Learning Guide
            </p>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Click on any section to explore detailed concepts • Mark topics as complete to track your progress • Use quick navigation to jump between sections
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Mark Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight size={14} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Expand Topic</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={14} className="text-purple-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Interview Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComputerNetworks