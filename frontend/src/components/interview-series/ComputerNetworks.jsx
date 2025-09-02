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
        definition: "A computer network is a collection of interconnected devices that can communicate and share resources with each other. These devices include computers, servers, routers, switches, and other networking equipment connected through wired or wireless transmission media.",
        keyPoints: [
          "Enables resource sharing between devices (printers, files, internet connection)",
          "Facilitates communication and data exchange across distances", 
          "Provides centralized data management and backup solutions",
          "Supports collaborative work environments and remote access",
          "Reduces costs by sharing expensive resources among multiple users",
          "Enables scalability and flexibility in adding new devices"
        ],
        advantages: [
          "Resource Sharing: Multiple users can share hardware, software, and data",
          "Communication: Email, instant messaging, video conferencing capabilities",
          "Cost Effectiveness: Shared resources reduce individual costs",
          "Centralized Management: Easier administration and maintenance",
          "Backup and Recovery: Centralized data backup and disaster recovery",
          "Scalability: Easy to add or remove devices from the network"
        ],
        disadvantages: [
          "Security Vulnerabilities: Networks are susceptible to various attacks",
          "Dependency: Network failure affects all connected devices",
          "Cost of Setup: Initial infrastructure investment can be high",
          "Maintenance: Requires skilled personnel for network management",
          "Performance Issues: Network congestion can slow down operations"
        ]
      },
      "Network Types": {
        definition: "Networks are classified based on their geographical coverage, ownership, and connection methods.",
        types: [
          {
            name: "PAN (Personal Area Network)",
            range: "1-10 meters",
            description: "A network for personal devices within a small area, typically around an individual person.",
            examples: "Bluetooth connections between smartphone and headphones, USB connections",
            advantages: ["Low cost", "Easy to set up", "Portable"],
            disadvantages: ["Limited range", "Low data transfer rates"]
          },
          {
            name: "LAN (Local Area Network)", 
            range: "10 meters to 1 kilometer",
            description: "A network that connects devices within a limited geographical area like an office, school, or building.",
            examples: "Office networks, school computer labs, home Wi-Fi networks",
            advantages: ["High data transfer rates", "Low cost", "Easy to manage"],
            disadvantages: ["Limited geographical coverage", "Requires physical infrastructure"]
          },
          {
            name: "MAN (Metropolitan Area Network)",
            range: "5-50 kilometers",
            description: "A network that spans a city or large campus, connecting multiple LANs.",
            examples: "City-wide Wi-Fi networks, cable TV networks, university campus networks",
            advantages: ["Covers larger area than LAN", "High bandwidth"],
            disadvantages: ["Higher cost than LAN", "Complex management"]
          },
          {
            name: "WAN (Wide Area Network)",
            range: "Unlimited (countries/continents)",
            description: "A network that covers a large geographical area, often spanning cities, countries, or continents.",
            examples: "Internet, corporate networks spanning multiple cities, satellite networks",
            advantages: ["Global connectivity", "Resource sharing across distances"],
            disadvantages: ["High cost", "Complex setup", "Security challenges"]
          },
          {
            name: "CAN (Campus Area Network)",
            range: "1-5 kilometers",
            description: "A network that connects multiple buildings within a campus or corporate facility.",
            examples: "University campus networks, corporate campuses, hospital networks"
          },
          {
            name: "HAN (Home Area Network)",
            range: "Within a home",
            description: "A network connecting devices within a home environment.",
            examples: "Smart home devices, home Wi-Fi, IoT devices"
          },
          {
            name: "GAN (Global Area Network)",
            range: "Worldwide",
            description: "A network that spans multiple WANs across the globe, often using satellite communications.",
            examples: "Satellite internet, global mobile networks"
          }
        ]
      },
      "Network Topologies": {
        definition: "Network topology refers to the physical and logical arrangement of devices and connections in a computer network. It defines how different nodes in a network are connected and communicate with each other.",
        importance: "Understanding network topology is crucial for network design, troubleshooting, performance optimization, and security planning.",
        topologies: [
          {
            name: "Star Topology",
            description: "All devices are connected to a central hub or switch. Data passes through the central device to reach its destination.",
            characteristics: [
              "Central point of failure - if hub fails, entire network goes down",
              "Easy to install and manage",
              "Easy to detect faults and troubleshoot",
              "Individual device failure doesn't affect the network",
              "Requires more cable length compared to other topologies",
              "Performance depends on the central device capacity"
            ],
            advantages: [
              "Easy to set up and configure",
              "Centralized management",
              "Easy to add or remove devices",
              "Good performance with moderate traffic"
            ],
            disadvantages: [
              "Single point of failure at the hub",
              "Higher cable cost",
              "Hub/switch capacity limits performance"
            ],
            applications: ["Office networks", "Home networks", "Small to medium enterprises"]
          },
          {
            name: "Ring Topology",
            description: "Devices are connected in a circular fashion where each device is connected to exactly two other devices, forming a ring.",
            characteristics: [
              "Data travels in one or both directions around the ring",
              "Each device acts as a repeater",
              "No collision detection needed",
              "Equal access to the network for all devices",
              "Difficult to troubleshoot",
              "Adding/removing devices affects the entire network"
            ],
            advantages: [
              "No collision detection required",
              "Equal access for all nodes",
              "Can handle high traffic loads",
              "Predictable performance"
            ],
            disadvantages: [
              "Single point of failure in the ring",
              "Difficult to add or remove devices",
              "Troubleshooting is complex",
              "Higher latency for distant nodes"
            ],
            applications: ["Token Ring networks", "FDDI networks", "Some industrial networks"]
          },
          {
            name: "Bus Topology",
            description: "All devices are connected to a single central cable (backbone) that serves as a shared communication medium.",
            characteristics: [
              "Uses a single backbone cable",
              "Terminators at both ends prevent signal reflection",
              "All devices share the same communication medium",
              "Uses CSMA/CD for collision detection",
              "Limited cable length and number of devices",
              "Difficult to isolate faults"
            ],
            advantages: [
              "Cost-effective for small networks",
              "Easy to set up",
              "Requires less cable than star topology",
              "Easy to extend"
            ],
            disadvantages: [
              "Single point of failure at the backbone",
              "Performance degrades with more devices",
              "Difficult to troubleshoot",
              "Collision domain issues"
            ],
            applications: ["Early Ethernet networks", "Small office networks"]
          },
          {
            name: "Mesh Topology",
            description: "Devices are interconnected, with multiple paths between any two devices. Can be full mesh or partial mesh.",
            types: [
              {
                name: "Full Mesh",
                description: "Every device is connected to every other device",
                formula: "For n nodes: n(n-1)/2 connections required"
              },
              {
                name: "Partial Mesh",
                description: "Some devices are connected to multiple devices, but not all"
              }
            ],
            characteristics: [
              "Multiple paths between devices provide redundancy",
              "Self-healing capabilities",
              "Complex wiring and configuration",
              "High reliability and fault tolerance",
              "Expensive due to multiple connections",
              "Difficult to manage and maintain"
            ],
            advantages: [
              "High reliability and redundancy",
              "Multiple paths prevent single point of failure",
              "Good performance and load distribution",
              "Security through multiple paths"
            ],
            disadvantages: [
              "Very expensive to implement",
              "Complex installation and maintenance",
              "Requires more physical space",
              "Difficult to configure"
            ],
            applications: ["Critical military networks", "Backbone internet infrastructure", "High-availability systems"]
          },
          {
            name: "Tree Topology",
            description: "A hybrid topology combining characteristics of star and bus topologies. Also known as hierarchical topology.",
            characteristics: [
              "Hierarchical structure with root node at top",
              "Parent-child relationship between nodes",
              "Uses hub, switch, or router as intermediate nodes",
              "Scalable architecture",
              "Point-to-point wiring for individual segments",
              "Easy to expand and manage"
            ],
            advantages: [
              "Hierarchical organization is intuitive",
              "Easy to expand and manage",
              "Error detection and correction is easy",
              "Fault isolation is possible"
            ],
            disadvantages: [
              "If root/backbone fails, network segments get isolated",
              "More cable required than bus or ring",
              "Difficult to configure",
              "Dependence on root hub"
            ],
            applications: ["Large corporate networks", "WAN connections", "Cable TV networks"]
          },
          {
            name: "Hybrid Topology",
            description: "A combination of two or more different topologies to form a resulting topology that has good points of all constituent topologies.",
            characteristics: [
              "Combines benefits of different topologies",
              "Flexible and scalable",
              "Complex design and implementation",
              "Can be customized based on requirements",
              "Expensive to implement",
              "Requires expertise to design and maintain"
            ],
            examples: [
              "Star-Bus: Multiple star networks connected via bus",
              "Star-Ring: Multiple star networks connected in ring fashion",
              "Tree-Star: Tree topology with star sub-networks"
            ],
            advantages: [
              "Flexible and reliable",
              "Fault tolerance",
              "Scalable",
              "Combines best features"
            ],
            disadvantages: [
              "Complex design",
              "Expensive",
              "Difficult to manage",
              "Requires skilled technicians"
            ]
          }
        ]
      },
      "Network Components": {
        definition: "Essential hardware and software components that enable network communication and functionality.",
        components: [
          {
            name: "Network Interface Card (NIC)",
            description: "A hardware component that connects a computer to a network",
            functions: [
              "Converts data between computer and network formats",
              "Provides unique MAC address identification",
              "Handles physical layer communication",
              "Manages data transmission speeds"
            ],
            types: ["Ethernet NIC", "Wireless NIC", "USB NIC", "PCIe NIC"]
          },
          {
            name: "Hub",
            description: "A basic networking device that connects multiple devices in a star topology",
            characteristics: [
              "Operates at Physical Layer (Layer 1)",
              "Creates single collision domain",
              "Half-duplex communication",
              "No MAC address table",
              "Broadcasts data to all ports"
            ],
            types: ["Active Hub", "Passive Hub", "Intelligent Hub"]
          },
          {
            name: "Switch",
            description: "An intelligent networking device that connects devices and makes forwarding decisions based on MAC addresses",
            characteristics: [
              "Operates at Data Link Layer (Layer 2)",
              "Creates separate collision domains",
              "Full-duplex communication",
              "Maintains MAC address table",
              "Forwards data only to intended recipient"
            ],
            advantages: [
              "Eliminates collisions",
              "Better performance than hubs",
              "Security through unicast transmission",
              "VLAN support"
            ]
          },
          {
            name: "Router",
            description: "A network device that forwards data packets between different networks based on IP addresses",
            characteristics: [
              "Operates at Network Layer (Layer 3)",
              "Connects different networks",
              "Makes routing decisions",
              "Maintains routing table",
              "Provides NAT functionality"
            ],
            functions: [
              "Packet forwarding between networks",
              "Path determination using routing protocols",
              "Network address translation (NAT)",
              "Firewall capabilities",
              "DHCP server functionality"
            ]
          },
          {
            name: "Gateway",
            description: "A device that acts as an entry/exit point between two networks using different protocols",
            types: [
              "Protocol Gateway: Converts between different protocols",
              "Application Gateway: Operates at application layer",
              "Circuit Gateway: Operates at session layer"
            ]
          },
          {
            name: "Repeater",
            description: "A device that amplifies and regenerates signals to extend network range",
            functions: [
              "Signal amplification",
              "Signal regeneration",
              "Distance extension",
              "Noise reduction"
            ]
          },
          {
            name: "Bridge",
            description: "A device that connects two or more network segments and filters traffic based on MAC addresses",
            types: ["Transparent Bridge", "Source Routing Bridge", "Translation Bridge"]
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
        definition: "The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a communication system into seven distinct layers. Developed by the International Organization for Standardization (ISO), it provides a reference for understanding network communication.",
        purpose: [
          "Standardize network communication protocols",
          "Enable interoperability between different vendors",
          "Simplify network troubleshooting and development",
          "Provide a common reference for network professionals"
        ],
        principles: [
          "Create a new layer if a different abstraction is needed",
          "Each layer should have a well-defined function",
          "Layer boundaries should be chosen to minimize information flow",
          "The number of layers should be large enough for distinct functions but small enough to keep the architecture manageable",
          "Each layer should interact only with adjacent layers"
        ],
        benefits: [
          "Modular approach to network design",
          "Easier troubleshooting and fault isolation",
          "Standardized interfaces between layers",
          "Technology independence at each layer",
          "Reduced complexity through layered approach"
        ]
      },
      "Physical Layer (Layer 1)": {
        definition: "The lowest layer of the OSI model responsible for the actual physical transmission of raw data bits over a physical medium.",
        functions: [
          "Bit transmission: Converting digital data into electrical, optical, or radio signals",
          "Physical topology: Defining the physical layout of the network",
          "Hardware specifications: Defining cables, connectors, and network cards",
          "Data encoding: Converting bits into signals",
          "Synchronization: Ensuring sender and receiver are synchronized"
        ],
        characteristics: [
          "Deals with raw bit stream transmission",
          "Defines electrical and physical specifications",
          "No error detection or correction",
          "Transmission medium dependent",
          "Hardware-focused layer"
        ],
        components: [
          "Cables (Copper, Fiber optic, Wireless)",
          "Connectors (RJ45, BNC, SC, ST)",
          "Network Interface Cards (NICs)",
          "Hubs and Repeaters",
          "Modems and Transceivers"
        ],
        protocols: ["Ethernet physical standards", "Wi-Fi physical specifications", "Bluetooth", "USB"],
        transmissionMedia: [
          {
            type: "Guided Media",
            examples: ["Twisted Pair Cable", "Coaxial Cable", "Fiber Optic Cable"]
          },
          {
            type: "Unguided Media", 
            examples: ["Radio Waves", "Microwaves", "Infrared", "Satellite"]
          }
        ]
      },
      "Data Link Layer (Layer 2)": {
        definition: "Responsible for reliable data transfer between two directly connected nodes and provides error detection and correction for the physical layer.",
        functions: [
          "Frame synchronization: Identifying frame boundaries",
          "Error detection and correction: Using checksums and CRC",
          "Flow control: Managing data transmission rate",
          "Access control: Managing shared medium access",
          "Physical addressing: Using MAC addresses"
        ],
        subLayers: [
          {
            name: "Logical Link Control (LLC)",
            description: "Manages communication between upper layers and MAC sublayer",
            functions: ["Flow control", "Error control", "Multiplexing"]
          },
          {
            name: "Media Access Control (MAC)",
            description: "Controls access to the transmission medium",
            functions: ["Frame creation", "Physical addressing", "Channel access"]
          }
        ],
        protocols: ["Ethernet", "Wi-Fi (802.11)", "PPP", "HDLC", "Frame Relay"],
        devices: ["Switches", "Bridges", "Network Interface Cards"],
        errorDetection: [
          "Parity Check: Simple odd/even bit counting",
          "Checksum: Sum of data bytes",
          "Cyclic Redundancy Check (CRC): Polynomial division"
        ],
        frameStructure: [
          "Preamble: Synchronization pattern",
          "Destination Address: Target MAC address",
          "Source Address: Sender MAC address", 
          "Length/Type: Frame size or protocol type",
          "Data: Actual payload",
          "Frame Check Sequence: Error detection"
        ]
      },
      "Network Layer (Layer 3)": {
        definition: "Responsible for routing data packets between different networks and providing logical addressing through IP addresses.",
        functions: [
          "Logical addressing: Using IP addresses for identification",
          "Routing: Determining best path for data packets",
          "Path determination: Finding optimal routes",
          "Packet forwarding: Moving packets toward destination",
          "Fragmentation and reassembly: Breaking large packets into smaller ones",
          "Congestion control: Managing network traffic"
        ],
        protocols: [
          {
            name: "IP (Internet Protocol)",
            versions: ["IPv4: 32-bit addressing", "IPv6: 128-bit addressing"]
          },
          {
            name: "ICMP (Internet Control Message Protocol)",
            purpose: "Error reporting and diagnostics"
          },
          {
            name: "ARP (Address Resolution Protocol)",
            purpose: "Maps IP addresses to MAC addresses"
          },
          {
            name: "OSPF (Open Shortest Path First)",
            purpose: "Link-state routing protocol"
          },
          {
            name: "BGP (Border Gateway Protocol)",
            purpose: "Inter-domain routing protocol"
          }
        ],
        devices: ["Routers", "Layer 3 Switches", "Multilayer Switches"],
        routingAlgorithms: [
          "Distance Vector: Uses hop count (RIP)",
          "Link State: Uses network topology (OSPF)",
          "Path Vector: Uses path information (BGP)"
        ],
        addressingSchemes: [
          "Classful Addressing: Traditional IP classes (A, B, C, D, E)",
          "Classless Addressing: CIDR notation",
          "Subnetting: Dividing networks into smaller subnets",
          "VLSM: Variable Length Subnet Masking"
        ]
      },
      "Transport Layer (Layer 4)": {
        definition: "Provides reliable data delivery services to upper layers and manages end-to-end communication between applications.",
        functions: [
          "Segmentation and reassembly: Breaking data into manageable segments",
          "Connection management: Establishing and terminating connections",
          "Error detection and recovery: Ensuring data integrity",
          "Flow control: Managing data transmission rate",
          "Multiplexing: Multiple applications sharing network connection"
        ],
        protocols: [
          {
            name: "TCP (Transmission Control Protocol)",
            characteristics: [
              "Connection-oriented protocol",
              "Reliable data delivery",
              "Error detection and correction",
              "Flow control and congestion control",
              "Ordered data delivery",
              "Full-duplex communication"
            ],
            features: [
              "Three-way handshake for connection establishment",
              "Sequence numbers for ordering",
              "Acknowledgments for reliability",
              "Sliding window for flow control"
            ]
          },
          {
            name: "UDP (User Datagram Protocol)",
            characteristics: [
              "Connectionless protocol",
              "Fast transmission",
              "No guarantee of delivery",
              "No error recovery",
              "Minimal overhead",
              "Best-effort delivery"
            ],
            applications: ["DNS queries", "DHCP", "Streaming media", "Online gaming"]
          }
        ],
        portNumbers: [
          "Well-known ports: 0-1023 (HTTP: 80, HTTPS: 443, FTP: 21)",
          "Registered ports: 1024-49151",
          "Dynamic/Private ports: 49152-65535"
        ],
        connectionTypes: [
          "Connection-oriented: Reliable, ordered delivery (TCP)",
          "Connectionless: Fast, no guarantees (UDP)"
        ]
      },
      "Upper OSI Layers (5-7)": {
        definition: "The upper three layers of the OSI model focus on application-level services, data presentation, and user interaction.",
        layers: [
          {
            layer: 5,
            name: "Session Layer",
            description: "Manages sessions between applications and provides dialog control services.",
            functions: [
              "Session establishment, maintenance, and termination",
              "Dialog management (half-duplex or full-duplex)",
              "Session checkpointing and recovery",
              "Authentication and authorization",
              "Data synchronization"
            ],
            protocols: ["NetBIOS", "RPC", "SQL", "NFS", "SMB"],
            services: [
              "Full-duplex: Both directions simultaneously",
              "Half-duplex: One direction at a time",
              "Simplex: One direction only"
            ],
            examples: [
              "Web browser session with web server",
              "Database connection sessions",
              "Video conferencing sessions"
            ]
          },
          {
            layer: 6,
            name: "Presentation Layer",
            description: "Handles data formatting, encryption, compression, and translation between different data representations.",
            functions: [
              "Data encryption and decryption",
              "Data compression and decompression",
              "Character set translation (ASCII, EBCDIC, Unicode)",
              "Data format conversion",
              "Syntax conversion"
            ],
            protocols: ["SSL/TLS", "MIME", "XDR", "JPEG", "MPEG", "GIF"],
            services: [
              "Encryption: Securing data transmission",
              "Compression: Reducing data size",
              "Translation: Converting between formats"
            ],
            examples: [
              "HTTPS encryption",
              "File compression (ZIP, RAR)",
              "Image format conversion",
              "Character encoding"
            ]
          },
          {
            layer: 7,
            name: "Application Layer",
            description: "Provides network services directly to end-users and applications.",
            functions: [
              "Network virtual terminal",
              "File transfer and management",
              "Electronic mail services",
              "Directory services",
              "Network management"
            ],
            protocols: [
              "HTTP/HTTPS: Web browsing",
              "SMTP: Email sending",
              "POP3/IMAP: Email retrieval",
              "FTP/SFTP: File transfer",
              "DNS: Domain name resolution",
              "DHCP: IP address assignment",
              "SNMP: Network management",
              "Telnet/SSH: Remote access"
            ],
            services: [
              "Email services",
              "File sharing",
              "Web browsing",
              "Remote access",
              "Network management"
            ]
          }
        ]
      },
      "OSI vs TCP/IP Comparison": {
        definition: "A comparison between the theoretical OSI model and the practical TCP/IP model used in real networks.",
        differences: [
          {
            aspect: "Number of Layers",
            osi: "7 layers",
            tcpip: "4 layers"
          },
          {
            aspect: "Development",
            osi: "Theoretical model by ISO",
            tcpip: "Practical model by DARPA"
          },
          {
            aspect: "Approach",
            osi: "Top-down approach",
            tcpip: "Bottom-up approach"
          },
          {
            aspect: "Usage",
            osi: "Reference model",
            tcpip: "Implementation model"
          },
          {
            aspect: "Protocols",
            osi: "Generic protocols",
            tcpip: "Specific protocols"
          }
        ],
        layerMapping: [
          {
            tcpLayer: "Application",
            osiLayers: ["Application", "Presentation", "Session"],
            description: "Combines top three OSI layers"
          },
          {
            tcpLayer: "Transport",
            osiLayers: ["Transport"],
            description: "Direct mapping"
          },
          {
            tcpLayer: "Internet",
            osiLayers: ["Network"],
            description: "Direct mapping"
          },
          {
            tcpLayer: "Link",
            osiLayers: ["Data Link", "Physical"],
            description: "Combines bottom two OSI layers"
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
        definition: "The TCP/IP model, also known as the Internet Protocol Suite, is a practical networking model that forms the foundation of the modern internet. Developed by DARPA, it consists of four layers and focuses on end-to-end connectivity and internetworking.",
        history: [
          "Developed by DARPA in the 1970s",
          "Based on practical implementation rather than theory",
          "Became the standard for internet communication",
          "Continuously evolved with internet growth"
        ],
        layers: [
          {
            name: "Application Layer",
            description: "Combines the functionality of OSI Application, Presentation, and Session layers. Provides network services directly to user applications.",
            protocols: [
              "HTTP/HTTPS: Web communication",
              "SMTP: Email transmission",
              "POP3/IMAP: Email retrieval", 
              "FTP/SFTP: File transfer",
              "DNS: Domain name resolution",
              "DHCP: Dynamic IP assignment",
              "SNMP: Network management",
              "Telnet/SSH: Remote access"
            ],
            functions: [
              "Application communication",
              "Data formatting and encryption",
              "Session management",
              "User interface provision"
            ]
          },
          {
            name: "Transport Layer",
            description: "Provides end-to-end communication services and data flow control. Maps directly to OSI Transport layer.",
            protocols: [
              "TCP: Reliable, connection-oriented communication",
              "UDP: Fast, connectionless communication",
              "SCTP: Stream Control Transmission Protocol"
            ],
            functions: [
              "Segmentation and reassembly",
              "Error detection and recovery",
              "Flow control",
              "Multiplexing"
            ]
          },
          {
            name: "Internet Layer",
            description: "Handles logical addressing and routing of packets across networks. Equivalent to OSI Network layer.",
            protocols: [
              "IP: Internet Protocol (IPv4/IPv6)",
              "ICMP: Internet Control Message Protocol",
              "ARP: Address Resolution Protocol",
              "RARP: Reverse Address Resolution Protocol"
            ],
            functions: [
              "Logical addressing",
              "Routing and path determination",
              "Packet forwarding",
              "Fragmentation and reassembly"
            ]
          },
          {
            name: "Network Access Layer",
            description: "Combines OSI Physical and Data Link layers. Handles physical transmission and local network access.",
            protocols: [
              "Ethernet: Wired LAN standard",
              "Wi-Fi: Wireless LAN standard",
              "PPP: Point-to-Point Protocol",
              "Frame Relay: WAN protocol"
            ],
            functions: [
              "Physical addressing (MAC)",
              "Frame formatting",
              "Error detection",
              "Media access control"
            ]
          }
        ]
      },
      "TCP Protocol Details": {
        definition: "Transmission Control Protocol (TCP) is a connection-oriented, reliable transport layer protocol that ensures ordered and error-free delivery of data.",
        characteristics: [
          "Connection-oriented: Requires connection establishment",
          "Reliable: Guarantees data delivery",
          "Ordered: Data arrives in correct sequence",
          "Flow control: Manages transmission rate",
          "Error recovery: Retransmits lost data",
          "Full-duplex: Bidirectional communication"
        ],
        features: [
          {
            name: "Three-Way Handshake",
            description: "Connection establishment process",
            steps: [
              "Client sends SYN packet",
              "Server responds with SYN-ACK",
              "Client sends ACK to complete connection"
            ]
          },
          {
            name: "Sequence Numbers",
            description: "Used for ordering and acknowledging data segments"
          },
          {
            name: "Sliding Window",
            description: "Flow control mechanism that manages data transmission rate"
          },
          {
            name: "Congestion Control",
            description: "Algorithms to prevent network congestion"
          }
        ],
        applications: [
          "Web browsing (HTTP/HTTPS)",
          "Email (SMTP, POP3, IMAP)",
          "File transfer (FTP)",
          "Remote access (SSH, Telnet)"
        ]
      },
      "UDP Protocol Details": {
        definition: "User Datagram Protocol (UDP) is a connectionless, lightweight transport layer protocol that provides fast but unreliable data transmission.",
        characteristics: [
          "Connectionless: No connection establishment required",
          "Unreliable: No guarantee of data delivery",
          "Fast: Minimal overhead",
          "Simple: Basic functionality",
          "No flow control: Sends data at maximum rate",
          "No error recovery: Lost data is not retransmitted"
        ],
        advantages: [
          "Low latency",
          "Minimal protocol overhead",
          "Suitable for real-time applications",
          "Broadcast and multicast support",
          "Simple implementation"
        ],
        disadvantages: [
          "No reliability guarantees",
          "No flow control",
          "No congestion control",
          "No ordering guarantees",
          "No error recovery"
        ],
        applications: [
          "DNS queries",
          "DHCP configuration",
          "Video streaming",
          "Online gaming",
          "Voice over IP (VoIP)",
          "Network management (SNMP)"
        ]
      },
      "TCP vs UDP Comparison": {
        definition: "A detailed comparison between TCP and UDP protocols, highlighting their differences in reliability, performance, and use cases.",
        comparison: [
          {
            feature: "Connection Type",
            tcp: "Connection-oriented (requires handshake)",
            udp: "Connectionless (no handshake required)"
          },
          {
            feature: "Reliability",
            tcp: "Reliable (guarantees delivery)",
            udp: "Unreliable (best-effort delivery)"
          },
          {
            feature: "Speed",
            tcp: "Slower due to overhead",
            udp: "Faster with minimal overhead"
          },
          {
            feature: "Error Checking",
            tcp: "Extensive error checking and recovery",
            udp: "Basic error checking only"
          },
          {
            feature: "Data Ordering",
            tcp: "Maintains data order",
            udp: "No ordering guarantee"
          },
          {
            feature: "Flow Control",
            tcp: "Implements flow control",
            udp: "No flow control"
          },
          {
            feature: "Congestion Control",
            tcp: "Implements congestion control",
            udp: "No congestion control"
          },
          {
            feature: "Header Size",
            tcp: "20-60 bytes (larger)",
            udp: "8 bytes (smaller)"
          },
          {
            feature: "Broadcasting",
            tcp: "Not supported",
            udp: "Supports broadcast/multicast"
          }
        ],
        useCases: [
          {
            protocol: "TCP",
            scenarios: [
              "Web browsing (HTTP/HTTPS)",
              "Email transmission",
              "File transfers",
              "Database connections",
              "Any application requiring reliability"
            ]
          },
          {
            protocol: "UDP",
            scenarios: [
              "Video/audio streaming",
              "Online gaming",
              "DNS queries",
              "DHCP",
              "Real-time applications"
            ]
          }
        ]
      },
      "IP Addressing": {
        definition: "Internet Protocol (IP) addressing is a logical addressing scheme used to identify devices on a network. It enables routing of data packets across interconnected networks.",
        versions: [
          {
            version: "IPv4",
            addressLength: "32 bits",
            format: "Dotted decimal notation (e.g., 192.168.1.1)",
            totalAddresses: "4.3 billion (2^32)",
            headerSize: "20-60 bytes"
          },
          {
            version: "IPv6", 
            addressLength: "128 bits",
            format: "Hexadecimal notation (e.g., 2001:db8::1)",
            totalAddresses: "340 undecillion (2^128)",
            headerSize: "40 bytes (fixed)"
          }
        ],
        ipv4Classes: [
          {
            class: "A",
            range: "1.0.0.0 to 126.255.255.255",
            networkBits: "8 bits",
            hostBits: "24 bits",
            defaultMask: "255.0.0.0 (/8)",
            networks: "126",
            hostsPerNetwork: "16,777,214",
            usage: "Large organizations and ISPs"
          },
          {
            class: "B", 
            range: "128.0.0.0 to 191.255.255.255",
            networkBits: "16 bits",
            hostBits: "16 bits",
            defaultMask: "255.255.0.0 (/16)",
            networks: "16,384",
            hostsPerNetwork: "65,534",
            usage: "Medium-sized organizations"
          },
          {
            class: "C",
            range: "192.0.0.0 to 223.255.255.255", 
            networkBits: "24 bits",
            hostBits: "8 bits",
            defaultMask: "255.255.255.0 (/24)",
            networks: "2,097,152",
            hostsPerNetwork: "254",
            usage: "Small networks and LANs"
          },
          {
            class: "D",
            range: "224.0.0.0 to 239.255.255.255",
            usage: "Multicast addressing",
            description: "Reserved for multicast group communications"
          },
          {
            class: "E",
            range: "240.0.0.0 to 255.255.255.255",
            usage: "Experimental and research",
            description: "Reserved for future use and research"
          }
        ],
        specialAddresses: [
          {
            address: "0.0.0.0",
            purpose: "Default route or unknown address"
          },
          {
            address: "127.0.0.1",
            purpose: "Loopback address (localhost)"
          },
          {
            address: "255.255.255.255",
            purpose: "Limited broadcast address"
          },
          {
            address: "169.254.x.x",
            purpose: "Link-local addresses (APIPA)"
          }
        ],
        privateAddresses: [
          {
            class: "A",
            range: "10.0.0.0 to 10.255.255.255",
            cidr: "10.0.0.0/8"
          },
          {
            class: "B", 
            range: "172.16.0.0 to 172.31.255.255",
            cidr: "172.16.0.0/12"
          },
          {
            class: "C",
            range: "192.168.0.0 to 192.168.255.255",
            cidr: "192.168.0.0/16"
          }
        ]
      },
      "Subnetting": {
        definition: "Subnetting is the process of dividing a single network into multiple smaller sub-networks (subnets). It improves network efficiency, security, and management.",
        benefits: [
          "Improved network performance by reducing broadcast traffic",
          "Enhanced security through network segmentation",
          "Better resource utilization",
          "Easier network management and troubleshooting",
          "Efficient IP address allocation"
        ],
        concepts: [
          {
            term: "Subnet Mask",
            definition: "A 32-bit number that identifies the network and host portions of an IP address"
          },
          {
            term: "CIDR Notation",
            definition: "Classless Inter-Domain Routing notation using /n to indicate network bits"
          },
          {
            term: "VLSM",
            definition: "Variable Length Subnet Masking allows different subnet sizes within the same network"
          }
        ],
        examples: [
          {
            network: "192.168.1.0/24",
            subnets: [
              "192.168.1.0/26 (64 hosts)",
              "192.168.1.64/26 (64 hosts)", 
              "192.168.1.128/26 (64 hosts)",
              "192.168.1.192/26 (64 hosts)"
            ]
          }
        ]
      }
    }
  },
  "Network Protocols": {
    icon: FileText,
    color: "from-orange-500 to-red-500",
    content: {
      "Protocol Fundamentals": {
        definition: "A network protocol is a set of established rules and conventions that determine how devices in a network communicate with each other. Protocols define the format, timing, sequencing, and error control of data transmission.",
        importance: [
          "Enables interoperability between different devices and vendors",
          "Ensures reliable and efficient data communication",
          "Provides standardization across networks",
          "Facilitates troubleshooting and network management"
        ],
        elements: [
          {
            name: "Syntax",
            description: "Defines the structure and format of data, including bit patterns, signal levels, and frame formats"
          },
          {
            name: "Semantics", 
            description: "Specifies the meaning of each section of bits and the actions to be taken"
          },
          {
            name: "Timing",
            description: "Defines when data should be sent, how fast it can be sent, and synchronization requirements"
          }
        ],
        characteristics: [
          "Well-defined message format and rules",
          "Agreed-upon procedures for communication", 
          "Error detection and correction mechanisms",
          "Flow control and congestion management",
          "Security and authentication features"
        ]
      },
      "Application Layer Protocols": {
        definition: "Protocols that provide network services directly to end-users and applications.",
        protocols: [
          {
            name: "HTTP",
            fullName: "HyperText Transfer Protocol",
            port: 80,
            description: "Foundation of data communication on the World Wide Web. Stateless protocol for transferring hypertext documents.",
            features: [
              "Request-response model",
              "Stateless communication",
              "Support for various media types",
              "Caching mechanisms",
              "Virtual hosting"
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"]
          },
          {
            name: "HTTPS",
            fullName: "HyperText Transfer Protocol Secure", 
            port: 443,
            description: "Secure version of HTTP that uses SSL/TLS encryption for secure communication.",
            features: [
              "End-to-end encryption",
              "Data integrity verification",
              "Server authentication",
              "Client authentication (optional)",
              "Protection against eavesdropping"
            ]
          },
          {
            name: "FTP",
            fullName: "File Transfer Protocol",
            ports: "20 (data), 21 (control)",
            description: "Protocol for transferring files between computers over a network.",
            modes: [
              "Active Mode: Server initiates data connection",
              "Passive Mode: Client initiates data connection"
            ],
            features: [
              "Binary and ASCII transfer modes",
              "Directory navigation",
              "User authentication",
              "Resume capability"
            ]
          },
          {
            name: "SMTP",
            fullName: "Simple Mail Transfer Protocol",
            port: 25,
            description: "Protocol for sending email messages between servers.",
            process: [
              "Connection establishment",
              "Sender identification", 
              "Recipient specification",
              "Message transmission",
              "Connection termination"
            ],
            commands: ["HELO/EHLO", "MAIL FROM", "RCPT TO", "DATA", "QUIT"]
          },
          {
            name: "POP3",
            fullName: "Post Office Protocol version 3",
            port: 110,
            description: "Protocol for retrieving email from a mail server to a client.",
            characteristics: [
              "Download-and-delete model",
              "Single device access",
              "Offline email reading",
              "Limited server storage"
            ]
          },
          {
            name: "IMAP",
            fullName: "Internet Message Access Protocol",
            port: 143,
            description: "Protocol for accessing email messages stored on a mail server.",
            advantages: [
              "Multi-device synchronization",
              "Server-side message storage",
              "Selective downloading",
              "Folder management"
            ]
          },
          {
            name: "DNS",
            fullName: "Domain Name System",
            port: 53,
            description: "Hierarchical naming system that translates domain names to IP addresses.",
            recordTypes: [
              "A: Maps domain to IPv4 address",
              "AAAA: Maps domain to IPv6 address",
              "CNAME: Canonical name alias",
              "MX: Mail exchange server",
              "NS: Name server",
              "PTR: Reverse DNS lookup"
            ],
            hierarchy: ["Root servers", "TLD servers", "Authoritative servers", "Local DNS servers"]
          }
        ]
      },
      "Network Management Protocols": {
        definition: "Protocols used for monitoring, configuring, and managing network devices and services.",
        protocols: [
          {
            name: "SNMP",
            fullName: "Simple Network Management Protocol",
            port: 161,
            description: "Protocol for collecting and organizing information about managed devices on IP networks.",
            components: [
              "SNMP Manager: Monitoring system",
              "SNMP Agent: Software on managed device",
              "MIB: Management Information Base"
            ],
            versions: [
              "SNMPv1: Basic functionality, community-based security",
              "SNMPv2c: Enhanced performance, same security",
              "SNMPv3: Advanced security with authentication and encryption"
            ]
          },
          {
            name: "DHCP",
            fullName: "Dynamic Host Configuration Protocol",
            ports: "67 (server), 68 (client)",
            description: "Protocol that automatically assigns IP addresses and network configuration to devices.",
            process: [
              "DHCP Discover: Client requests configuration",
              "DHCP Offer: Server offers configuration",
              "DHCP Request: Client requests specific offer",
              "DHCP Acknowledgment: Server confirms assignment"
            ],
            options: [
              "IP address assignment",
              "Subnet mask configuration",
              "Default gateway setting",
              "DNS server assignment",
              "Lease time management"
            ]
          },
          {
            name: "NTP",
            fullName: "Network Time Protocol",
            port: 123,
            description: "Protocol for synchronizing clocks of computer systems over packet-switched networks.",
            features: [
              "Hierarchical time synchronization",
              "Accuracy within milliseconds",
              "Fault tolerance",
              "Security mechanisms"
            ]
          }
        ]
      },
      "Security Protocols": {
        definition: "Protocols designed to provide secure communication and data protection in networks.",
        protocols: [
          {
            name: "SSL/TLS",
            fullName: "Secure Sockets Layer / Transport Layer Security",
            description: "Cryptographic protocols for secure communication over networks.",
            features: [
              "Data encryption in transit",
              "Server authentication",
              "Data integrity verification",
              "Perfect forward secrecy"
            ],
            handshake: [
              "Client Hello",
              "Server Hello",
              "Certificate exchange",
              "Key exchange",
              "Finished messages"
            ]
          },
          {
            name: "SSH",
            fullName: "Secure Shell",
            port: 22,
            description: "Protocol for secure remote access and command execution.",
            features: [
              "Encrypted communication",
              "Strong authentication",
              "Data integrity",
              "Port forwarding",
              "File transfer capability"
            ]
          },
          {
            name: "IPSec",
            fullName: "Internet Protocol Security",
            description: "Suite of protocols for securing IP communications through authentication and encryption.",
            modes: [
              "Transport Mode: Encrypts payload only",
              "Tunnel Mode: Encrypts entire IP packet"
            ],
            protocols: [
              "AH: Authentication Header",
              "ESP: Encapsulating Security Payload"
            ]
          }
        ]
      }
    }
  },
  "Network Security": {
    icon: Shield,
    color: "from-red-500 to-pink-500",
    content: {
      "Security Fundamentals": {
        definition: "Network security encompasses all activities designed to protect the integrity, confidentiality, and availability of computer networks and the data transmitted over them.",
        goals: [
          {
            name: "Confidentiality",
            description: "Ensuring that information is accessible only to authorized users"
          },
          {
            name: "Integrity", 
            description: "Maintaining accuracy and completeness of data during transmission and storage"
          },
          {
            name: "Availability",
            description: "Ensuring that network resources are accessible to authorized users when needed"
          },
          {
            name: "Authentication",
            description: "Verifying the identity of users and devices accessing the network"
          },
          {
            name: "Non-repudiation",
            description: "Preventing denial of actions performed by authenticated users"
          }
        ],
        threats: [
          "Unauthorized access and data breaches",
          "Malware and virus infections",
          "Denial of Service (DoS) attacks",
          "Man-in-the-middle attacks",
          "Social engineering attacks",
          "Insider threats",
          "Advanced Persistent Threats (APTs)"
        ]
      },
      "Common Network Attacks": {
        definition: "Various methods used by attackers to compromise network security and gain unauthorized access to systems and data.",
        attacks: [
          {
            name: "DoS/DDoS Attacks",
            fullName: "Denial of Service / Distributed Denial of Service",
            description: "Attacks designed to overwhelm network resources and make services unavailable to legitimate users.",
            types: [
              "Volume-based: Consume bandwidth with massive traffic",
              "Protocol-based: Exploit protocol weaknesses",
              "Application-based: Target specific applications or services"
            ],
            mitigation: [
              "Rate limiting and traffic filtering",
              "DDoS protection services",
              "Load balancing and redundancy",
              "Network monitoring and alerting"
            ]
          },
          {
            name: "Man-in-the-Middle (MITM)",
            description: "Attacker intercepts and potentially alters communication between two parties.",
            methods: [
              "ARP spoofing",
              "DNS spoofing",
              "SSL/TLS interception",
              "Rogue access points"
            ],
            prevention: [
              "Strong encryption protocols",
              "Certificate pinning",
              "VPN usage",
              "Network monitoring"
            ]
          },
          {
            name: "Phishing and Social Engineering",
            description: "Attacks that manipulate humans to divulge confidential information or perform actions that compromise security.",
            types: [
              "Email phishing",
              "Spear phishing",
              "Whaling (targeting executives)",
              "Vishing (voice phishing)",
              "Smishing (SMS phishing)"
            ],
            prevention: [
              "Security awareness training",
              "Email filtering systems",
              "Multi-factor authentication",
              "Verification procedures"
            ]
          },
          {
            name: "Malware Attacks",
            description: "Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
            types: [
              "Viruses: Self-replicating code that attaches to files",
              "Worms: Self-propagating malware that spreads across networks",
              "Trojans: Malicious software disguised as legitimate programs",
              "Ransomware: Encrypts data and demands payment for decryption",
              "Rootkits: Hide malicious activity at the system level"
            ],
            protection: [
              "Antivirus and anti-malware software",
              "Regular system updates",
              "Network segmentation",
              "Backup and recovery procedures"
            ]
          }
        ]
      },
      "Security Technologies": {
        definition: "Hardware and software solutions designed to protect networks from various security threats.",
        technologies: [
          {
            name: "Firewalls",
            description: "Network security devices that monitor and filter incoming and outgoing network traffic based on predetermined security rules.",
            types: [
              "Packet-filtering: Examines packets based on source/destination addresses and ports",
              "Stateful inspection: Tracks connection states and context",
              "Application-level: Deep packet inspection at application layer",
              "Next-generation: Advanced threat detection and prevention"
            ],
            deployment: [
              "Network firewalls: Protect entire network segments",
              "Host-based firewalls: Protect individual devices",
              "Cloud firewalls: Protect cloud-based resources"
            ]
          },
          {
            name: "Intrusion Detection Systems (IDS)",
            description: "Security tools that monitor network traffic and system activities for malicious activity and policy violations.",
            types: [
              "Network-based IDS (NIDS): Monitors network traffic",
              "Host-based IDS (HIDS): Monitors individual hosts",
              "Signature-based: Detects known attack patterns",
              "Anomaly-based: Detects deviations from normal behavior"
            ],
            limitations: [
              "Cannot prevent attacks (detection only)",
              "May generate false positives",
              "Requires regular signature updates"
            ]
          },
          {
            name: "Intrusion Prevention Systems (IPS)",
            description: "Active security devices that can detect and automatically block suspicious activities in real-time.",
            advantages: [
              "Real-time attack prevention",
              "Automated response capabilities",
              "Integration with other security tools",
              "Reduced response time"
            ],
            deployment: [
              "Inline deployment for active blocking",
              "Out-of-band for monitoring only",
              "Hybrid approaches for flexibility"
            ]
          }
        ]
      },
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
      "Encryption and Authentication": {
        definition: "Cryptographic methods and identity verification systems used to secure network communications.",
        encryption: [
          {
            name: "Symmetric Encryption",
            description: "Uses the same key for both encryption and decryption.",
            advantages: [
              "Fast processing speed",
              "Efficient for large data volumes",
              "Lower computational requirements"
            ],
            disadvantages: [
              "Key distribution challenges",
              "Key management complexity",
              "Scalability issues"
            ],
            algorithms: ["AES", "DES", "3DES", "Blowfish"]
          },
          {
            name: "Asymmetric Encryption",
            description: "Uses a pair of keys (public and private) for encryption and decryption.",
            advantages: [
              "Secure key exchange",
              "Digital signatures",
              "Better scalability",
              "No pre-shared keys needed"
            ],
            disadvantages: [
              "Slower processing",
              "Higher computational overhead",
              "More complex implementation"
            ],
            algorithms: ["RSA", "ECC", "DSA", "ElGamal"]
          }
        ],
        authentication: [
          {
            name: "Single-Factor Authentication",
            description: "Uses one method to verify identity.",
            methods: ["Password", "PIN", "Smart card", "Biometrics"]
          },
          {
            name: "Multi-Factor Authentication (MFA)",
            description: "Uses multiple independent methods to verify identity.",
            factors: [
              "Something you know (password, PIN)",
              "Something you have (token, smart card)",
              "Something you are (biometrics)",
              "Somewhere you are (location-based)",
              "Something you do (behavioral patterns)"
            ]
          },
          {
            name: "Digital Certificates",
            description: "Electronic documents that verify the identity of entities in digital communications.",
            components: [
              "Subject information",
              "Public key",
              "Digital signature",
              "Validity period",
              "Certificate authority details"
            ]
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
        definition: "Understanding the differences between key networking devices and their operational characteristics.",
        comparisons: [
          {
            title: "Hub vs Switch",
            hub: {
              description: "A networking device which is used to transmit the signal to each port (except one port) to respond from which the signal was received.",
              layer: "Physical Layer",
              filtering: "In this packet filtering is not available",
              types: "Active Hub, Passive Hub",
              characteristics: [
                "Operates in half-duplex mode",
                "Single collision domain",
                "Broadcasts to all ports",
                "No MAC address table",
                "Cannot prevent collisions"
              ],
              limitations: [
                "High collision rates",
                "Poor security",
                "Limited bandwidth sharing",
                "No VLAN support"
              ]
            },
            switch: {
              description: "Switch is a network device which is used to enable the connection establishment and connection termination on the basis of need.",
              layer: "Data link layer", 
              filtering: "In this packet filtering is available",
              mode: "Full duplex transmission mode",
              aka: "An efficient bridge",
              characteristics: [
                "Maintains MAC address table",
                "Each port is separate collision domain",
                "Unicast, multicast, and broadcast support",
                "VLAN support available",
                "Store-and-forward operation"
              ],
              advantages: [
                "Eliminates collisions",
                "Better security",
                "Efficient bandwidth utilization",
                "Port-based VLANs"
              ]
            }
          },
          {
            title: "Router vs Gateway",
            router: {
              description: "A networking device that forwards data packets between computer networks. It operates at the Network Layer (Layer 3).",
              functions: [
                "Path determination",
                "Packet forwarding",
                "Network segmentation",
                "Protocol translation"
              ],
              types: [
                "Static routing: Manual route configuration",
                "Dynamic routing: Automatic route discovery",
                "Default routing: Route of last resort"
              ]
            },
            gateway: {
              description: "A node that is connected to two or more networks and serves as an entry/exit point. It can operate at multiple layers.",
              difference: "A router sends the data between two similar networks while gateway sends the data between two dissimilar networks.",
              functions: [
                "Protocol conversion",
                "Data format translation",
                "Network interconnection",
                "Security enforcement"
              ]
            }
          },
          {
            title: "Bridge vs Router",
            bridge: {
              description: "A network device that connects two or more network segments at the Data Link Layer.",
              characteristics: [
                "Operates at Layer 2",
                "MAC address-based forwarding",
                "Transparent to network protocols",
                "Learning bridge functionality"
              ]
            },
            router: {
              description: "Operates at Layer 3, making routing decisions based on IP addresses.",
              characteristics: [
                "IP address-based forwarding",
                "Logical addressing",
                "Routing protocol support",
                "Network layer services"
              ]
            }
          }
        ]
      },
      "Network Troubleshooting Tools": {
        definition: "Command-line and software tools used for network diagnosis, configuration, and monitoring.",
        utilities: [
          {
            title: "ipconfig vs ifconfig",
            ipconfig: {
              name: "Internet Protocol Configuration",
              os: "Microsoft operating systems (Windows)",
              purpose: "To view and configure network interfaces",
              commands: [
                "ipconfig: Display basic IP configuration",
                "ipconfig /all: Display detailed configuration",
                "ipconfig /release: Release IP address",
                "ipconfig /renew: Renew IP address",
                "ipconfig /flushdns: Clear DNS cache"
              ]
            },
            ifconfig: {
              name: "Interface Configuration", 
              os: "MAC, Linux, UNIX operating systems",
              purpose: "To view and configure network interfaces",
              commands: [
                "ifconfig: Display all interfaces",
                "ifconfig eth0: Display specific interface",
                "ifconfig eth0 up: Enable interface",
                "ifconfig eth0 down: Disable interface",
                "ifconfig eth0 192.168.1.10: Assign IP address"
              ]
            }
          },
          {
            name: "Ping",
            description: "The 'ping' is a utility program that allows you to check the connectivity between the network devices. You can ping devices using its IP address or name.",
            functionality: [
              "Tests network connectivity",
              "Measures round-trip time",
              "Checks packet loss",
              "Verifies DNS resolution"
            ],
            options: [
              "ping -t: Continuous ping",
              "ping -n count: Specify number of packets",
              "ping -l size: Specify packet size",
              "ping -f: Don't fragment packets"
            ]
          },
          {
            name: "Traceroute/Tracert",
            description: "Shows the path that packets take from source to destination, including all intermediate hops.",
            purpose: [
              "Identify network path",
              "Locate network bottlenecks",
              "Troubleshoot routing issues",
              "Measure hop-by-hop latency"
            ],
            operation: [
              "Sends packets with increasing TTL values",
              "Records each router that responds",
              "Shows hop-by-hop timing information",
              "Identifies routing loops"
            ]
          },
          {
            name: "Netstat",
            description: "It is a command line utility program. It gives useful information about the current TCP/IP setting of a connection.",
            capabilities: [
              "Display active connections",
              "Show listening ports",
              "Display routing table",
              "Show network interface statistics"
            ],
            options: [
              "netstat -a: Show all connections",
              "netstat -n: Show numerical addresses",
              "netstat -r: Display routing table",
              "netstat -s: Show protocol statistics"
            ]
          },
          {
            name: "Nslookup/Dig",
            description: "DNS lookup tools for querying domain name system records.",
            functions: [
              "Forward DNS lookup (domain to IP)",
              "Reverse DNS lookup (IP to domain)",
              "Query specific record types",
              "Test DNS server functionality"
            ],
            recordTypes: [
              "A: IPv4 address",
              "AAAA: IPv6 address", 
              "MX: Mail exchange",
              "NS: Name server",
              "CNAME: Canonical name"
            ]
          },
          {
            name: "Wireshark/TCPDump",
            description: "Network packet analyzers for capturing and examining network traffic.",
            capabilities: [
              "Real-time packet capture",
              "Protocol analysis",
              "Traffic pattern identification",
              "Security analysis"
            ],
            uses: [
              "Network troubleshooting",
              "Performance analysis",
              "Security monitoring",
              "Protocol development"
            ]
          }
        ]
      },
      "Data Transmission Types": {
        definition: "Different methods of sending data across networks based on the number of recipients.",
        types: [
          {
            name: "Unicasting",
            description: "If the message is sent to a single node from the source then it is known as unicasting. This is commonly used in networks to establish a new connection.",
            characteristics: [
              "One-to-one communication",
              "Most common transmission type",
              "Efficient bandwidth usage",
              "Direct point-to-point delivery"
            ],
            examples: [
              "Web browsing (HTTP requests)",
              "Email transmission",
              "File transfers (FTP)",
              "Remote access (SSH, Telnet)"
            ]
          },
          {
            name: "Broadcasting",
            description: "If the message is sent to all the nodes in a network from a source then it is known as broadcasting. DHCP and ARP in the local network use broadcasting.",
            characteristics: [
              "One-to-all communication",
              "Limited to local network segment",
              "High network overhead",
              "Not routed across subnets"
            ],
            examples: [
              "DHCP discovery messages",
              "ARP requests",
              "Wake-on-LAN packets",
              "Network announcements"
            ],
            limitations: [
              "Creates network congestion",
              "Security concerns",
              "Scalability issues",
              "Broadcast storms possible"
            ]
          },
          {
            name: "Multicasting",
            description: "If the message is sent to a subset of nodes from the source then it is known as multicasting. Used to send the same data to multiple receivers.",
            characteristics: [
              "One-to-many communication",
              "Efficient for group communication",
              "Reduces network traffic",
              "Requires multicast-enabled infrastructure"
            ],
            applications: [
              "Video streaming",
              "Audio conferencing",
              "Stock market data feeds",
              "Software updates"
            ],
            protocols: [
              "IGMP: Internet Group Management Protocol",
              "PIM: Protocol Independent Multicast",
              "DVMRP: Distance Vector Multicast Routing"
            ]
          },
          {
            name: "Anycasting",
            description: "If the message is sent to any of the nodes from the source then it is known as anycasting. It is mainly used to get the content from any of the servers in the Content Delivery System.",
            characteristics: [
              "One-to-nearest communication",
              "Automatic failover capability",
              "Load distribution",
              "Geographic optimization"
            ],
            uses: [
              "Content Delivery Networks (CDNs)",
              "DNS root servers",
              "Load balancing",
              "Service discovery"
            ],
            benefits: [
              "Improved performance",
              "High availability",
              "Fault tolerance",
              "Reduced latency"
            ]
          }
        ]
      },
      "Network Performance Monitoring": {
        definition: "Tools and techniques for measuring and optimizing network performance.",
        metrics: [
          {
            name: "Bandwidth",
            description: "The maximum amount of data that can be transmitted over a network connection in a given time period.",
            measurement: "Measured in bits per second (bps), kilobits per second (Kbps), megabits per second (Mbps), or gigabits per second (Gbps)",
            factors: [
              "Physical medium capacity",
              "Network congestion",
              "Protocol overhead",
              "Hardware limitations"
            ]
          },
          {
            name: "Latency",
            description: "The time delay between sending a packet and receiving a response.",
            types: [
              "Propagation delay: Time for signal to travel",
              "Processing delay: Time for packet processing",
              "Queuing delay: Time spent in buffers",
              "Transmission delay: Time to send packet"
            ],
            measurement: "Measured in milliseconds (ms)",
            impact: "Affects real-time applications like VoIP and video conferencing"
          },
          {
            name: "Throughput",
            description: "The actual amount of data successfully transmitted over a network in a given time period.",
            difference: "Throughput is often less than bandwidth due to network overhead and congestion",
            factors: [
              "Network congestion",
              "Protocol efficiency",
              "Error rates",
              "Hardware performance"
            ]
          },
          {
            name: "Packet Loss",
            description: "The percentage of packets that fail to reach their destination.",
            causes: [
              "Network congestion",
              "Hardware failures",
              "Buffer overflow",
              "Routing errors"
            ],
            impact: "Affects application performance and user experience"
          }
        ]
      }
    }
  },
  "Advanced Concepts": {
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
    content: {
      "Modern Networking Technologies": {
        definition: "Contemporary networking concepts and technologies that are shaping the future of network communications.",
        technologies: [
          {
            name: "Software-Defined Networking (SDN)",
            description: "An approach to networking that uses software-based controllers or APIs to communicate with underlying hardware infrastructure and direct traffic on a network.",
            characteristics: [
              "Centralized network control",
              "Programmable network behavior",
              "Separation of control and data planes",
              "Dynamic network configuration"
            ],
            benefits: [
              "Improved network flexibility",
              "Simplified network management",
              "Reduced operational costs",
              "Enhanced automation capabilities"
            ]
          },
          {
            name: "Network Function Virtualization (NFV)",
            description: "A network architecture concept that virtualizes entire classes of network node functions into building blocks that can be connected together.",
            applications: [
              "Virtual firewalls",
              "Virtual load balancers",
              "Virtual routers",
              "Virtual network appliances"
            ],
            advantages: [
              "Reduced hardware costs",
              "Faster service deployment",
              "Improved scalability",
              "Enhanced service agility"
            ]
          },
          {
            name: "Edge Computing",
            description: "A distributed computing paradigm that brings computation and data storage closer to sources of data.",
            benefits: [
              "Reduced latency",
              "Improved bandwidth efficiency",
              "Enhanced security",
              "Better user experience"
            ],
            applications: [
              "IoT data processing",
              "Content delivery",
              "Real-time analytics",
              "Autonomous vehicles"
            ]
          },
          {
            name: "5G Networks",
            description: "Fifth-generation wireless technology that provides faster speeds, lower latency, and greater connectivity than previous generations.",
            features: [
              "Enhanced mobile broadband (eMBB)",
              "Ultra-reliable low-latency communications (URLLC)",
              "Massive machine-type communications (mMTC)",
              "Network slicing capabilities"
            ],
            specifications: [
              "Speeds up to 10 Gbps",
              "Latency as low as 1ms",
              "Connection density up to 1 million devices per km²",
              "99.999% reliability"
            ]
          }
        ]
      },
      "Cloud Networking": {
        definition: "Network infrastructure and services delivered through cloud computing platforms.",
        concepts: [
          {
            name: "Virtual Private Cloud (VPC)",
            description: "A logically isolated section of the cloud where you can launch resources in a virtual network that you define.",
            components: [
              "Subnets: Subdivisions of IP address ranges",
              "Route tables: Define traffic routing rules",
              "Security groups: Virtual firewalls",
              "Network ACLs: Subnet-level security"
            ]
          },
          {
            name: "Content Delivery Network (CDN)",
            description: "A geographically distributed group of servers that work together to provide fast delivery of internet content.",
            benefits: [
              "Reduced latency",
              "Improved website performance",
              "Decreased server load",
              "Enhanced availability"
            ],
            components: [
              "Edge servers",
              "Origin servers",
              "Pop (Point of Presence)",
              "Caching mechanisms"
            ]
          },
          {
            name: "Load Balancing",
            description: "The process of distributing network traffic across multiple servers to ensure optimal resource utilization.",
            types: [
              "Layer 4 (Transport): Based on IP and port",
              "Layer 7 (Application): Based on content",
              "Global: Across multiple data centers",
              "Regional: Within a geographic area"
            ],
            algorithms: [
              "Round Robin",
              "Least Connections",
              "Weighted Round Robin",
              "IP Hash"
            ]
          }
        ]
      },
      "Network Quality and Performance": {
        definition: "Factors that determine network reliability, effectiveness, and user experience.",
        reliability: [
          {
            name: "Downtime",
            description: "The downtime is defined as the required time to recover from failures or maintenance activities."
          },
          {
            name: "Failure Frequency",
            description: "It is the frequency when the network fails to work as intended, affecting service availability."
          },
          {
            name: "Catastrophe Recovery",
            description: "The network's ability to recover from unexpected events such as natural disasters, cyber attacks, or major hardware failures."
          },
          {
            name: "Mean Time Between Failures (MTBF)",
            description: "Average time between system failures, indicating reliability."
          },
          {
            name: "Mean Time To Repair (MTTR)",
            description: "Average time required to repair a failed system and restore service."
          }
        ],
        effectiveness: [
          {
            name: "Performance",
            description: "Performance can be measured in many ways like transmit time, response time, throughput, and bandwidth utilization.",
            metrics: [
              "Throughput: Data transfer rate",
              "Latency: Response time",
              "Jitter: Variation in packet delay",
              "Packet loss: Failed transmissions"
            ]
          },
          {
            name: "Reliability",
            description: "Reliability is measured by frequency of failure and system uptime.",
            measurements: [
              "Availability percentage (99.9%, 99.99%)",
              "Error rates",
              "Service level agreements (SLAs)",
              "Redundancy factors"
            ]
          },
          {
            name: "Robustness",
            description: "Robustness specifies the quality or condition of being strong and resilient under various conditions.",
            factors: [
              "Fault tolerance",
              "Load handling capacity",
              "Recovery mechanisms",
              "Scalability"
            ]
          },
          {
            name: "Security",
            description: "It specifies how to protect data from unauthorized access, viruses, and other security threats.",
            aspects: [
              "Data encryption",
              "Access control",
              "Threat detection",
              "Incident response"
            ]
          }
        ]
      },
      "Web Request Process": {
        title: "What happens when you enter google.com in the web browser?",
        description: "Detailed breakdown of the complete process from URL entry to page rendering.",
        steps: [
          {
            step: 1,
            action: "URL Parsing and Cache Check",
            description: "Browser parses the URL and checks if the content is fresh and present in the browser cache. If found and valid, displays the cached content."
          },
          {
            step: 2,
            action: "DNS Resolution",
            description: "If not cached, browser checks if the IP address of the URL is present in local DNS cache (browser and OS). If not found, requests the OS to perform DNS lookup."
          },
          {
            step: 3,
            action: "DNS Query Process",
            description: "DNS resolver queries DNS servers hierarchically (root servers → TLD servers → authoritative servers) to get the IP address corresponding to the domain name."
          },
          {
            step: 4,
            action: "TCP Connection Establishment",
            description: "Browser establishes a new TCP connection with the server using three-way handshaking (SYN → SYN-ACK → ACK)."
          },
          {
            step: 5,
            action: "TLS Handshake (for HTTPS)",
            description: "If HTTPS, browser and server perform TLS handshake to establish secure encrypted communication."
          },
          {
            step: 6,
            action: "HTTP Request",
            description: "Browser sends HTTP request to the server using the established TCP connection, including headers, methods, and any data."
          },
          {
            step: 7,
            action: "Server Processing",
            description: "Web servers handle the incoming HTTP request, process it (may involve application servers, databases), and prepare HTTP response."
          },
          {
            step: 8,
            action: "HTTP Response",
            description: "Server sends HTTP response back to the browser, including status codes, headers, and content (HTML, CSS, JavaScript)."
          },
          {
            step: 9,
            action: "Content Processing",
            description: "Browser processes the HTTP response, may cache the data if cacheable, and begins parsing the content."
          },
          {
            step: 10,
            action: "Rendering",
            description: "Browser decodes the response, constructs DOM tree, applies CSS, executes JavaScript, and renders the final webpage."
          }
        ],
        additionalConcepts: [
          "Keep-alive connections for reusing TCP connections",
          "HTTP/2 multiplexing for concurrent requests",
          "Content compression (gzip, brotli)",
          "Progressive loading and lazy loading"
        ]
      },
      "Advanced Network Concepts": {
        definition: "Specialized networking concepts essential for modern network operations.",
        concepts: [
          {
            name: "Subnetting and VLSM",
            fullName: "Variable Length Subnet Masking",
            description: "A subnet is a network inside a network achieved by the process called subnetting which helps divide a network into subnets. VLSM allows for different subnet sizes within the same network.",
            benefits: [
              "Efficient IP address utilization",
              "Improved routing efficiency",
              "Enhanced network security",
              "Better network organization"
            ],
            concepts: [
              "Subnet masks and CIDR notation",
              "Supernetting and route aggregation",
              "Hierarchical addressing",
              "Address space optimization"
            ]
          },
          {
            name: "Network Address Translation (NAT)",
            description: "A method of remapping one IP address space into another by modifying network address information in packet headers.",
            types: [
              "Static NAT: One-to-one mapping",
              "Dynamic NAT: Pool of public addresses",
              "PAT (Port Address Translation): Many-to-one with ports",
              "Double NAT: Multiple NAT layers"
            ],
            benefits: [
              "IP address conservation",
              "Enhanced security",
              "Network isolation",
              "Simplified network management"
            ]
          },
          {
            name: "Quality of Service (QoS)",
            description: "A set of technologies that work on a network to guarantee its ability to dependably run high-priority applications and traffic.",
            mechanisms: [
              "Traffic classification and marking",
              "Queuing and scheduling",
              "Traffic shaping and policing",
              "Congestion avoidance"
            ],
            models: [
              "Best Effort: No guarantees",
              "Integrated Services (IntServ): Per-flow reservations",
              "Differentiated Services (DiffServ): Class-based treatment"
            ]
          },
          {
            name: "RAID Technology",
            fullName: "Redundant Array of Inexpensive/Independent Disks",
            description: "It is a method to provide Fault Tolerance by using multiple Hard Disc Drives for data redundancy and performance improvement.",
            levels: [
              "RAID 0: Striping (performance, no redundancy)",
              "RAID 1: Mirroring (redundancy, no performance gain)",
              "RAID 5: Striping with parity (performance + redundancy)",
              "RAID 10: Combination of mirroring and striping"
            ]
          },
          {
            name: "Peer-to-Peer Networks",
            description: "Network model where each node (peer) acts as both client and server, sharing resources directly with other peers.",
            characteristics: [
              "Decentralized architecture",
              "Resource sharing among peers",
              "Self-organizing network",
              "Fault tolerance through redundancy"
            ],
            applications: [
              "File sharing networks",
              "Blockchain networks",
              "Distributed computing",
              "Communication systems"
            ]
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
          isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-slate-300 shadow-lg`}>
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
                isDarkMode ? "hover:bg-zinc-900 text-gray-400" : "hover:bg-gray-100 text-gray-600"
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
              isDarkMode ? "border-gray-700 bg-zinc-900/30" : "border-gray-200 bg-white/50"
            }`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAccordion(`${categoryKey}-${subTitle}`)}
                  className={`w-full text-left p-6 flex items-center justify-between transition-all ${
                    isDarkMode ? "hover:bg-zinc-900/50 text-gray-200" : "hover:bg-gray-50 text-gray-800"
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
                          : isDarkMode ? "text-gray-400 hover:text-green-400 hover:bg-zinc-900" : "text-gray-500 hover:text-green-600 hover:bg-gray-100"
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
                    ? "bg-zinc-900/50 border-gray-700 text-gray-300" 
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
            ? "bg-zinc-900/80 border-gray-700/50 hover:bg-zinc-900" 
            : "bg-white/80 border-gray-200/50 hover:bg-white/90"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-slate-300 shadow-lg`}>
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
                  isDarkMode ? "bg-zinc-900 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}>
                  {topic}
                </span>
              ))}
              {Object.keys(content).length > 3 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? "bg-zinc-900 text-gray-400" : "bg-gray-100 text-gray-500"
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
              isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Key Point</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Type</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Range</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Topology</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Key Characteristics</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    {content.layers[0]?.layer && <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Layer</th>}
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Name</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Examples</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Feature</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-green-600`}>TCP</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-blue-600`}>UDP</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Class</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Start Address</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>End Address</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Usage</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Element</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Protocol</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Full Name</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Port</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Layer</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                          <span className="px-2 py-1 bg-blue-500 text-slate-300 text-xs rounded">{protocol.port}</span>
                        ) : (
                          <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>N/A</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-sm`}>
                        {protocol.layer ? (
                          <span className="px-2 py-1 bg-purple-500 text-slate-300 text-xs rounded">{protocol.layer}</span>
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
                  <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Item</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
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
                isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
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
        ? "bg-zinc-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Header */}
      <div className={`relative z-10 pt-20 pb-12 ${
        isDarkMode ? "bg-zinc-900/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="text-center max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 shadow-2xl">
            <Network className="w-10 h-10 text-slate-300" />
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
              isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-blue-500">{Object.keys(computerNetworkingData).length}</div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Categories</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-green-500">
                {Object.values(computerNetworkingData).reduce((total, category) => 
                  total + Object.keys(category.content).length, 0
                )}
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Topics</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
            }`}>
              <div className="text-2xl font-bold text-purple-500">{completedTopics.size}</div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Completed</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
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
            <div className={`w-full h-3 rounded-full ${isDarkMode ? "bg-zinc-900" : "bg-gray-200"}`}>
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
          isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
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
                      ? `bg-gradient-to-br ${color} text-slate-300 border-transparent shadow-lg`
                      : isDarkMode 
                        ? "bg-zinc-900/50 border-gray-600 hover:bg-zinc-900 text-gray-300" 
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon size={20} className={`mx-auto mb-2 ${isActive ? 'text-slate-300' : ''}`} />
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
          isDarkMode ? bg-zinc-900 : "bg-white/70 border-gray-200"
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