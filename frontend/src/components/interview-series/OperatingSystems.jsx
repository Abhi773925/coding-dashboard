import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Search,
  BookOpen,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Zap,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Star,
  Filter,
  Grid3X3,
  List,
  Eye,
  EyeOff
} from 'lucide-react';

const OperatingSystems = () => {
  const { isDarkMode, colors, schemes, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(0);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDelay(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleFavorite = (sectionId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(sectionId)) {
        newFavorites.delete(sectionId);
      } else {
        newFavorites.add(sectionId);
      }
      return newFavorites;
    });
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction to Operating Systems',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'basics',
      difficulty: 'easy',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'osTypes',
      title: 'Types of Operating Systems',
      icon: <Grid3X3 className="w-6 h-6" />,
      category: 'basics',
      difficulty: 'easy',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'processesThreads',
      title: 'Processes and Threads',
      icon: <Cpu className="w-6 h-6" />,
      category: 'core',
      difficulty: 'medium',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'scheduling',
      title: 'CPU Scheduling',
      icon: <Zap className="w-6 h-6" />,
      category: 'core',
      difficulty: 'medium',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'synchronization',
      title: 'Process Synchronization',
      icon: <Lock className="w-6 h-6" />,
      category: 'advanced',
      difficulty: 'hard',
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'memoryManagement',
      title: 'Memory Management',
      icon: <HardDrive className="w-6 h-6" />,
      category: 'core',
      difficulty: 'medium',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'diskScheduling',
      title: 'Disk Scheduling',
      icon: <HardDrive className="w-6 h-6" />,
      category: 'advanced',
      difficulty: 'hard',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'computerNetworks',
      title: 'Computer Networks',
      icon: <Network className="w-6 h-6" />,
      category: 'networking',
      difficulty: 'medium',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'keyTerms',
      title: 'Important Terms',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'reference',
      difficulty: 'easy',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Topics', count: sections.length },
    { id: 'basics', label: 'Basics', count: sections.filter(s => s.category === 'basics').length },
    { id: 'core', label: 'Core Concepts', count: sections.filter(s => s.category === 'core').length },
    { id: 'advanced', label: 'Advanced', count: sections.filter(s => s.category === 'advanced').length },
    { id: 'networking', label: 'Networking', count: sections.filter(s => s.category === 'networking').length },
    { id: 'favorites', label: 'Favorites', count: favorites.size }
  ];

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                     section.category === activeTab || 
                     (activeTab === 'favorites' && favorites.has(section.id));
    return matchesSearch && matchesTab;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'medium': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'hard': return isDarkMode ? 'text-red-400' : 'text-red-600';
      default: return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const osData = {
    introduction: {
      definition: "An Operating System can be defined as an interface between the user and hardware. It is responsible for the execution of all processes, Resource Allocation, CPU management, File Management, and many other tasks. The purpose of an operating system is to provide an environment in which a user can execute programs in a convenient and efficient manner."
    },
    osTypes: [
      {
        name: "Batch OS",
        description: "A set of similar jobs are stored in the main memory for execution. A job gets assigned to the CPU only when the execution of the previous job completes."
      },
      {
        name: "Multiprogramming OS",
        description: "The main memory consists of jobs waiting for CPU time. The OS selects one of the processes and assigns it to the CPU. Whenever the executing process needs to wait for any other operation (like I/O), the OS selects another process from the job queue and assigns it to the CPU. This way, the CPU is never kept idle."
      },
      {
        name: "Multitasking OS",
        description: "Multitasking OS combines the benefits of Multiprogramming OS and CPU scheduling to perform quick switches between jobs. The switch is so quick that the user can interact with each program as it runs."
      },
      {
        name: "Time Sharing OS",
        description: "Time-sharing systems require interaction with the user to instruct the OS to perform various tasks. The OS responds with an output, and instructions are usually given through an input device like a keyboard."
      },
      {
        name: "Real Time OS",
        description: "Real-Time OS are usually built for dedicated systems to accomplish a specific set of tasks within deadlines."
      }
    ],
    processesAndThreads: {
      process: {
        definition: "A process is a program under execution. The value of the program counter (PC) indicates the address of the next instruction of the process being executed. Each process is represented by a Process Control Block (PCB)."
      },
      thread: {
        definition: "A thread is a lightweight process and forms the basic unit of CPU utilization. A process can perform more than one task at the same time by including multiple threads.",
        properties: {
          own: [
            "Program counter",
            "Register set",
            "Stack"
          ],
          shared: [
            "Code section",
            "Data section",
            "Files",
            "Signals"
          ]
        },
        types: [
          {
            name: "User threads",
            description: "Implemented by users."
          },
          {
            name: "Kernel threads",
            description: "Implemented by the OS."
          }
        ],
        forkSystemCall: {
          note: "A new thread, or a child process of a given process, can be introduced by using the fork() system call. A process with n fork() system calls generates 2^n - 1 child processes."
        }
      }
    },
    scheduling: {
      processSchedulingMetrics: [
        {
          name: "Arrival Time",
          description: "Time at which the process arrives in the ready queue."
        },
        {
          name: "Completion Time",
          description: "Time at which process completes its execution."
        },
        {
          name: "Burst Time",
          description: "Time required by a process for CPU execution."
        },
        {
          name: "Turn Around Time",
          description: "Time Difference between completion time and arrival time.",
          formula: "Turn Around Time = Completion Time - Arrival Time"
        },
        {
          name: "Waiting Time (WT)",
          description: "Time Difference between turn around time and burst time.",
          formula: "Waiting Time = Turnaround Time - Burst Time"
        }
      ],
      schedulingAlgorithms: [
        {
          name: "First Come First Serve (FCFS)",
          description: "Simplest scheduling algorithm that schedules according to arrival times of processes."
        },
        {
          name: "Shortest Job First (SJF)",
          description: "Processes which have the shortest burst time are scheduled first."
        },
        {
          name: "Shortest Remaining Time First (SRTF)",
          description: "It is a preemptive mode of the SJF algorithm in which jobs are scheduled according to the shortest remaining time."
        },
        {
          name: "Round Robin (RR) Scheduling",
          description: "Each process is assigned a fixed time in a cyclic way."
        },
        {
          name: "Priority Based scheduling (Non Preemptive)",
          description: "Processes are scheduled according to their priorities, i.e., the highest priority process is scheduled first. If priorities of two processes match, then scheduling is according to the arrival time."
        },
        {
          name: "Highest Response Ratio Next (HRRN)",
          description: "Processes with the highest response ratio are scheduled. This algorithm avoids starvation.",
          formula: "Response Ratio = (Waiting Time + Burst time) / Burst time"
        },
        {
          name: "Multilevel Queue Scheduling (MLQ)",
          description: "Processes are placed in different queues according to their priority. Generally, high priority processes are placed in the top-level queue. Lower level queued processes are scheduled only after the completion of processes from the top-level queue."
        },
        {
          name: "Multilevel Feedback Queue (MLFQ) Scheduling",
          description: "It allows the process to move in between queues. The idea is to separate processes according to the characteristics of their CPU bursts. If a process uses too much CPU time, it is moved to a lower-priority queue."
        }
      ]
    },
    synchronizationAndDeadlocks: {
      criticalSectionProblem: {
        title: "The Critical Section Problem",
        definitions: [
          {
            term: "Critical Section",
            description: "The portion of the code in the program where shared variables are accessed and/or updated."
          },
          {
            term: "Remainder Section",
            description: "The remaining portion of the program excluding the Critical Section."
          },
          {
            term: "Race around Condition",
            description: "The final output of the code depends on the order in which the variables are accessed."
          }
        ],
        solutionConditions: [
          {
            name: "Mutual Exclusion",
            description: "If a process Pi is executing in its critical section, then no other process is allowed to enter into the critical section."
          },
          {
            name: "Progress",
            description: "If no process is executing in the critical section, then the decision of a process to enter a critical section cannot be made by any other process that is executing in its remainder section. The selection of the process cannot be postponed indefinitely."
          },
          {
            name: "Bounded Waiting",
            description: "There exists a bound on the number of times other processes can enter into the critical section after a process has made a request to access the critical section and before the request is granted."
          }
        ]
      },
      synchronizationTools: [
        {
          name: "Semaphore",
          description: "A protected variable or abstract data type that is used to lock the resource being used. The value of the semaphore indicates the status of a common resource.",
          types: [
            {
              name: "Binary semaphores",
              description: "Take only 0 and 1 as value and are used to implement mutual exclusion and synchronize concurrent processes."
            },
            {
              name: "Counting semaphores",
              description: "An integer variable whose value can range over an unrestricted domain."
            }
          ]
        },
        {
          name: "Mutex",
          description: "A mutex provides mutual exclusion; either a producer or consumer can have the key (mutex) and proceed with their work. As long as the buffer is filled by the producer, the consumer needs to wait, and vice versa. At any point in time, only one thread can work with the entire buffer."
        }
      ],
      deadlocks: {
        title: "Deadlocks",
        description: "A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.",
        necessaryConditions: [
          {
            name: "Mutual Exclusion",
            description: "One or more than one resource is non-sharable (Only one process can use at a time)."
          },
          {
            name: "Hold and Wait",
            description: "A process is holding at least one resource and waiting for resources."
          },
          {
            name: "No Preemption",
            description: "A resource cannot be taken from a process unless the process releases the resource."
          },
          {
            name: "Circular Wait",
            description: "A set of processes are waiting for each other in circular form."
          }
        ],
        handlingMethods: [
          {
            name: "Deadlock prevention or avoidance",
            description: "The idea is to not let the system into a deadlock state."
          },
          {
            name: "Deadlock detection and recovery",
            description: "Let deadlock occur, then do preemption to handle it once occurred."
          },
          {
            name: "Ignore the problem altogether",
            description: "If deadlock is very rare, then let it happen and reboot the system. This is the approach that both Windows and UNIX take."
          }
        ],
        bankersAlgorithm: "The Banker's algorithm is used to avoid deadlock. It is a deadlock-avoidance method named after the banking system where a bank never allocates available cash in such a manner that it can no longer satisfy the requirements of all of its customers."
      }
    },
    memoryManagement: {
      introduction: "These techniques allow the memory to be shared among multiple processes.",
      techniques: [
        {
          name: "Overlays",
          description: "The memory should contain only those instructions and data that are required at a given time."
        },
        {
          name: "Swapping",
          description: "In multiprogramming, the instructions that have used the time slice are swapped out from the memory."
        }
      ],
      partitionAllocation: {
        singlePartition: "The memory is divided into two parts. One part is for the OS and the other is for users.",
        multiplePartition: {
          fixed: "The memory is divided into fixed-size partitions.",
          variable: {
            description: "The memory is divided into variable-sized partitions.",
            allocationSchemes: [
              {
                name: "First Fit",
                description: "The arriving process is allotted the first hole of memory in which it fits completely."
              },
              {
                name: "Best Fit",
                description: "The arriving process is allotted the hole of memory in which it fits the best by leaving the minimum memory empty."
              },
              {
                name: "Worst Fit",
                description: "The arriving process is allotted the hole of memory in which it leaves the maximum gap."
              }
            ]
          }
        }
      },
      fragmentationIssues: {
        note1: "Best fit does not necessarily give the best results for memory allocation.",
        note2: "The cause of external fragmentation is the condition in Fixed and Variable partitioning saying that the entire process should be allocated in a contiguous memory location. Therefore Paging is used."
      },
      advancedTechniques: [
        {
          name: "Paging",
          description: "The physical memory is divided into equal-sized frames. The main memory is divided into fixed-size pages. The size of a physical memory frame is equal to the size of a virtual memory frame."
        },
        {
          name: "Segmentation",
          description: "Implemented to give users a view of memory. The logical address space is a collection of segments. Segmentation can be implemented with or without the use of paging."
        }
      ],
      pageReplacement: {
        pageFault: "A page fault is a type of interrupt, raised by the hardware when a running program accesses a memory page that is mapped into the virtual address space, but not loaded in physical memory.",
        algorithms: [
          {
            name: "First In First Out (FIFO)",
            description: "The OS keeps track of all pages in memory in a queue; the oldest page is at the front. When a page needs to be replaced, the page at the front of the queue is selected for removal.",
            beladysAnomaly: "Proves that it is possible to have more page faults when increasing the number of page frames while using the FIFO page replacement algorithm."
          },
          {
            name: "Optimal Page replacement",
            description: "Pages are replaced which are not used for the longest duration of time in the future. It is perfect, but not possible in practice as an OS cannot know future requests. It is used to set up a benchmark."
          },
          {
            name: "Least Recently Used (LRU)",
            description: "The page will be replaced with the one which is least recently used."
          }
        ]
      }
    },
    diskScheduling: {
      introduction: "Disk scheduling is done by operating systems to schedule I/O requests arriving for disk. It is also known as I/O scheduling.",
      metrics: [
        {
          name: "Seek Time",
          description: "Time taken to locate the disk arm to a specified track where the data is to be read or written."
        },
        {
          name: "Rotational Latency",
          description: "Time taken by the desired sector of disk to rotate into a position so that it can access the read/write heads."
        },
        {
          name: "Transfer Time",
          description: "Time to transfer the data. It depends on the rotating speed of the disk and number of bytes to be transferred."
        },
        {
          name: "Disk Access Time",
          formula: "Seek Time + Rotational Latency + Transfer Time"
        },
        {
          name: "Disk Response Time",
          description: "The average time spent by a request waiting to perform its I/O operation."
        }
      ],
      algorithms: [
        {
          name: "FCFS",
          description: "The simplest Disk Scheduling Algorithm where requests are addressed in the order they arrive in the disk queue."
        },
        {
          name: "SSTF (Shortest Seek Time First)",
          description: "Requests having the shortest seek time are executed first. The seek time of every request is calculated in advance, and they are scheduled accordingly. The request near the disk arm will get executed first."
        },
        {
          name: "SCAN",
          description: "The disk arm moves in a particular direction, servicing requests in its path. After reaching the end of the disk, it reverses its direction. This algorithm works like an elevator and is also known as the elevator algorithm."
        },
        {
          name: "CSCAN",
          description: "Similar to SCAN, but after reversing direction, the disk arm may not service requests on its way back, potentially leaving requests waiting at the other end."
        },
        {
          name: "LOOK",
          description: "Similar to SCAN, but the disk arm only goes to the last request to be serviced in its path before reversing direction, preventing unnecessary traversal to the end of the disk."
        },
        {
          name: "CLOOK",
          description: "Similar to CSCAN, but the disk arm only goes to the last request in its path, then jumps to the last request at the other end, preventing unnecessary traversal."
        }
      ]
    },
    keyTerms: [
      {
        term: "Real-time system",
        definition: "Used when rigid time requirements have been placed on the operation of a processor; it contains well-defined and fixed time constraints."
      },
      {
        term: "Monolithic kernel",
        definition: "A kernel which includes all operating system code in a single executable image."
      },
      {
        term: "Micro kernel",
        definition: "A kernel which runs minimal performance-affecting services for the operating system; all other operations are performed by the processor."
      },
      {
        term: "Macro Kernel",
        definition: "A combination of micro and monolithic kernel."
      },
      {
        term: "Re-entrancy",
        definition: "A memory-saving technique for multi-programmed time-sharing systems, allowing multiple users to share a single copy of a program. The program code cannot modify itself, and local data for each user must be stored separately."
      },
      {
        term: "Demand paging",
        definition: "Specifies that if an area of memory is not currently being used, it is swapped to disk to make room for an application's need."
      },
      {
        term: "Virtual memory",
        definition: "A memory management technique that enables processes to execute outside of memory, especially used when a program cannot fit in physical memory."
      },
      {
        term: "RAID",
        definition: "Stands for Redundant Array of Independent Disks. It is used to store the same data redundantly to improve overall performance. There are 7 RAID levels."
      },
      {
        term: "Logical vs Physical Address Space",
        definition: "Logical address space specifies the address generated by the CPU, while physical address space specifies the address seen by the memory unit."
      },
      {
        term: "Fragmentation",
        definition: "A phenomenon of memory wastage that reduces capacity and performance. Internal fragmentation occurs in systems with fixed-size allocation units, and external fragmentation occurs in systems with variable-size allocation units."
      },
      {
        term: "Spooling",
        definition: "A process where data is temporarily gathered to be used by a device or program. It is associated with printing, where jobs are kept in a disk file and queued for the printer."
      },
      {
        term: "Starvation",
        definition: "A resource management problem where a waiting process does not get the resources it needs for a long time because they are allocated to other processes."
      },
      {
        term: "Aging",
        definition: "A technique used to avoid starvation in a resource scheduling system."
      },
      {
        term: "Advantages of multithreaded programming",
        definition: "Includes enhancing responsiveness to users, resource sharing within the process, being economical, and fully utilizing multiprocessing architecture."
      },
      {
        term: "Thrashing",
        definition: "A phenomenon in virtual memory schemes when the processor spends most of its time swapping pages, rather than executing instructions."
      }
    ]
  };

  const filteredContent = searchTerm
    ? Object.entries(osData).filter(([key, value]) => {
        const searchText = JSON.stringify(value).toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      })
    : Object.entries(osData);

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'introduction':
        return (
          <div className="space-y-6">
            {/* Hero Introduction */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-blue-600/80 to-purple-600/80' 
                : 'bg-gradient-to-br from-blue-600 to-purple-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3" />
                What is an Operating System?
              </h4>
              <p className="text-lg leading-relaxed">
                {osData.introduction.definition}
              </p>
            </div>

            {/* Key Functions Grid */}
            <div>
              <h4 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Core Functions of Operating Systems
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Process Management", icon: "⚙️", color: "from-green-500 to-emerald-600" },
                  { name: "Memory Management", icon: "🧠", color: "from-blue-500 to-cyan-600" },
                  { name: "File System Management", icon: "📁", color: "from-orange-500 to-red-600" },
                  { name: "Device Management", icon: "💾", color: "from-purple-500 to-pink-600" },
                  { name: "Security & Protection", icon: "🔒", color: "from-red-500 to-rose-600" },
                  { name: "User Interface", icon: "🖥️", color: "from-indigo-500 to-blue-600" }
                ].map((func, idx) => (
                  <div key={idx} className={`
                    bg-gradient-to-r ${func.color} text-white p-4 rounded-xl
                    transform hover:scale-105 transition-all duration-300 cursor-pointer
                    shadow-lg hover:shadow-xl
                  `}>
                    <div className="text-2xl mb-2">{func.icon}</div>
                    <h5 className="font-semibold text-lg">{func.name}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'osTypes':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-green-600/80 to-teal-600/80' 
                : 'bg-gradient-to-br from-green-600 to-teal-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2">Types of Operating Systems</h4>
              <p className="text-lg opacity-90">
                Different OS types designed for specific computing environments and requirements.
              </p>
            </div>

            {/* OS Types Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {osData.osTypes.map((osType, index) => (
                <div key={index} className={`
                  ${isDarkMode 
                    ? 'bg-slate-800/70 border border-slate-700/50' 
                    : 'bg-white border border-gray-200'
                  }
                  p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                  transition-all duration-300 group
                `}>
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 
                    flex items-center justify-center text-white font-bold text-lg mb-4
                    group-hover:rotate-12 transition-transform duration-300
                  `}>
                    {index + 1}
                  </div>
                  <h5 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {osType.name}
                  </h5>
                  <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {osType.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'processesThreads':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-orange-600/80 to-red-600/80' 
                : 'bg-gradient-to-br from-orange-600 to-red-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <Cpu className="w-6 h-6 mr-3" />
                Processes and Threads
              </h4>
              <p className="text-lg opacity-90">
                Understanding the fundamental units of execution in operating systems.
              </p>
            </div>

            {/* Process Section */}
            <div className={`
              ${isDarkMode 
                ? 'bg-slate-800/70 border border-slate-700/50' 
                : 'bg-white border border-gray-200'
              }
              p-6 rounded-2xl shadow-lg
            `}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold mr-4">
                  P
                </div>
                <h5 className={`text-xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Process
                </h5>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {osData.processesAndThreads.process.definition}
              </p>
            </div>

            {/* Thread Section */}
            <div className={`
              ${isDarkMode 
                ? 'bg-slate-800/70 border border-slate-700/50' 
                : 'bg-white border border-gray-200'
              }
              p-6 rounded-2xl shadow-lg
            `}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold mr-4">
                  T
                </div>
                <h5 className={`text-xl font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                  Thread
                </h5>
              </div>
              <p className={`leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {osData.processesAndThreads.thread.definition}
              </p>
              
              {/* Thread Properties */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className={`
                  ${isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'}
                  p-4 rounded-xl
                `}>
                  <h6 className={`font-bold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ✅ Own Properties
                  </h6>
                  <ul className={`space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {osData.processesAndThreads.thread.properties.own.map((prop, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`
                  ${isDarkMode ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}
                  p-4 rounded-xl
                `}>
                  <h6 className={`font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    🔗 Shared Properties
                  </h6>
                  <ul className={`space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {osData.processesAndThreads.thread.properties.shared.map((prop, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {prop}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Thread Types */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {osData.processesAndThreads.thread.types.map((type, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode ? 'bg-purple-900/30 border border-purple-700/50' : 'bg-purple-50 border border-purple-200'}
                    p-4 rounded-xl
                  `}>
                    <h6 className={`font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {type.name}
                    </h6>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Fork System Call */}
              <div className={`
                ${isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                }
                text-white p-4 rounded-xl
              `}>
                <h6 className="font-bold mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Fork System Call
                </h6>
                <p className="text-sm leading-relaxed">
                  {osData.processesAndThreads.thread.forkSystemCall.note}
                </p>
              </div>
            </div>
          </div>
        );

      case 'scheduling':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-purple-600/80 to-pink-600/80' 
                : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <Zap className="w-6 h-6 mr-3" />
                CPU Scheduling
              </h4>
              <p className="text-lg opacity-90">
                Algorithms and metrics for efficient CPU time allocation to processes.
              </p>
            </div>

            {/* Scheduling Metrics */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Process Scheduling Metrics
              </h5>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osData.scheduling.processSchedulingMetrics.map((metric, index) => (
                  <div key={index} className={`
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600/80 to-blue-600/80' 
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                    }
                    text-white p-5 rounded-xl shadow-lg
                    transform hover:scale-105 transition-all duration-300 cursor-pointer
                  `}>
                    <h6 className="font-bold text-lg mb-3">{metric.name}</h6>
                    <p className="text-sm leading-relaxed mb-3 opacity-90">
                      {metric.description}
                    </p>
                    {metric.formula && (
                      <div className="bg-white/20 p-3 rounded-lg font-mono text-sm">
                        {metric.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduling Algorithms */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔄 Scheduling Algorithms
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                {osData.scheduling.schedulingAlgorithms.map((algorithm, index) => (
                  <div key={index} className={`
                    ${isDarkMode 
                      ? 'bg-slate-800/70 border border-slate-700/50' 
                      : 'bg-white border border-gray-200'
                    }
                    p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                    transition-all duration-300 group
                  `}>
                    <div className={`
                      w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 
                      flex items-center justify-center text-white font-bold text-sm mb-4
                      group-hover:rotate-12 transition-transform duration-300
                    `}>
                      {index + 1}
                    </div>
                    <h6 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {algorithm.name}
                    </h6>
                    <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {algorithm.description}
                    </p>
                    {algorithm.formula && (
                      <div className={`
                        mt-4 p-3 rounded-lg font-mono text-sm
                        ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}
                      `}>
                        {algorithm.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'synchronization':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-red-600/80 to-rose-600/80' 
                : 'bg-gradient-to-br from-red-600 to-rose-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <Lock className="w-6 h-6 mr-3" />
                Process Synchronization & Deadlocks
              </h4>
              <p className="text-lg opacity-90">
                Mechanisms to coordinate processes and prevent deadlock situations.
              </p>
            </div>

            {/* Critical Section Problem */}
            <div className={`
              ${isDarkMode 
                ? 'bg-slate-800/70 border border-slate-700/50' 
                : 'bg-white border border-gray-200'
              }
              p-6 rounded-2xl shadow-lg
            `}>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                🔒 Critical Section Problem
              </h5>
              
              {/* Definitions */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {osData.synchronizationAndDeadlocks.criticalSectionProblem.definitions.map((def, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-50 border border-red-200'}
                    p-4 rounded-xl
                  `}>
                    <h6 className={`font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {def.term}
                    </h6>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {def.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Solution Conditions */}
              <h6 className={`font-bold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                ✅ Solution Conditions
              </h6>
              <div className="grid md:grid-cols-3 gap-4">
                {osData.synchronizationAndDeadlocks.criticalSectionProblem.solutionConditions.map((condition, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'}
                    p-4 rounded-xl
                  `}>
                    <h6 className={`font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {condition.name}
                    </h6>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {condition.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Synchronization Tools */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🛠️ Synchronization Tools
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                {osData.synchronizationAndDeadlocks.synchronizationTools.map((tool, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600/80 to-blue-600/80' 
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                    }
                    text-white p-6 rounded-2xl shadow-lg
                  `}>
                    <h6 className="font-bold text-lg mb-3">{tool.name}</h6>
                    <p className="text-sm leading-relaxed mb-4 opacity-90">
                      {tool.description}
                    </p>
                    {tool.types && (
                      <div className="space-y-2">
                        <h6 className="font-semibold text-sm opacity-80">Types:</h6>
                        {tool.types.map((type, typeIdx) => (
                          <div key={typeIdx} className="bg-white/20 p-3 rounded-lg">
                            <div className="font-semibold text-sm">{type.name}</div>
                            <div className="text-xs opacity-90 mt-1">{type.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'memoryManagement':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-indigo-600/80 to-blue-600/80' 
                : 'bg-gradient-to-br from-indigo-600 to-blue-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <HardDrive className="w-6 h-6 mr-3" />
                Memory Management
              </h4>
              <p className="text-lg opacity-90">
                {osData.memoryManagement.introduction}
              </p>
            </div>

            {/* Techniques */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔧 Memory Management Techniques
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                {osData.memoryManagement.techniques.map((technique, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-slate-800/70 border border-slate-700/50' 
                      : 'bg-white border border-gray-200'
                    }
                    p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                    transition-all duration-300
                  `}>
                    <div className={`
                      w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 
                      flex items-center justify-center text-white font-bold mb-4
                    `}>
                      {idx + 1}
                    </div>
                    <h6 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {technique.name}
                    </h6>
                    <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Techniques */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🚀 Advanced Techniques
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                {osData.memoryManagement.advancedTechniques.map((technique, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-teal-600/80 to-blue-600/80' 
                      : 'bg-gradient-to-br from-teal-600 to-blue-600'
                    }
                    text-white p-6 rounded-2xl shadow-lg
                  `}>
                    <h6 className="font-bold text-lg mb-3">{technique.name}</h6>
                    <p className="text-sm leading-relaxed opacity-90">
                      {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'diskScheduling':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-teal-600/80 to-cyan-600/80' 
                : 'bg-gradient-to-br from-teal-600 to-cyan-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <HardDrive className="w-6 h-6 mr-3" />
                Disk Scheduling
              </h4>
              <p className="text-lg opacity-90">
                {osData.diskScheduling.introduction}
              </p>
            </div>

            {/* Metrics */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📈 Disk Scheduling Metrics
              </h5>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osData.diskScheduling.metrics.map((metric, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-slate-800/70 border border-slate-700/50' 
                      : 'bg-white border border-gray-200'
                    }
                    p-5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                    transition-all duration-300
                  `}>
                    <h6 className={`font-bold mb-3 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                      {metric.name}
                    </h6>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {metric.description}
                    </p>
                    {metric.formula && (
                      <div className={`
                        mt-3 p-3 rounded-lg font-mono text-sm
                        ${isDarkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-50 text-teal-700'}
                      `}>
                        {metric.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithms */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔄 Disk Scheduling Algorithms
              </h5>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osData.diskScheduling.algorithms.map((algorithm, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-orange-600/80 to-red-600/80' 
                      : 'bg-gradient-to-br from-orange-600 to-red-600'
                    }
                    text-white p-5 rounded-xl shadow-lg transform hover:scale-105 
                    transition-all duration-300 cursor-pointer
                  `}>
                    <h6 className="font-bold text-lg mb-3">{algorithm.name}</h6>
                    <p className="text-sm leading-relaxed opacity-90">
                      {algorithm.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'computerNetworks':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80' 
                : 'bg-gradient-to-br from-cyan-600 to-blue-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <Network className="w-6 h-6 mr-3" />
                Computer Networks
              </h4>
              <p className="text-lg opacity-90">
                Computer Networks enable communication and resource sharing between multiple computing devices. They form the backbone of modern computing infrastructure.
              </p>
            </div>

            {/* Network Types */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🌐 Network Types
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Personal Area Network (PAN)", range: "1-10 meters", description: "Covers a very small area, typically within 10 meters. Examples include Bluetooth connections.", color: "from-red-500 to-pink-600", icon: "📱" },
                  { name: "Local Area Network (LAN)", range: "Up to a few kilometers", description: "Connects devices within a building or campus. High speed and low latency.", color: "from-green-500 to-teal-600", icon: "🏢" },
                  { name: "Metropolitan Area Network (MAN)", range: "Up to 100 kilometers", description: "Covers a city or metropolitan area. Often used by ISPs.", color: "from-yellow-500 to-orange-600", icon: "🏙️" },
                  { name: "Wide Area Network (WAN)", range: "Unlimited", description: "Covers large geographical areas. The Internet is the largest WAN.", color: "from-blue-500 to-purple-600", icon: "🌍" }
                ].map((network, idx) => (
                  <div key={idx} className={`
                    ${isDarkMode 
                      ? 'bg-slate-800/70 border border-slate-700/50' 
                      : 'bg-white border border-gray-200'
                    }
                    p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                    transition-all duration-300 group
                  `}>
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-r ${network.color} 
                      flex items-center justify-center text-2xl mb-4
                      group-hover:rotate-12 transition-transform duration-300
                    `}>
                      {network.icon}
                    </div>
                    <h6 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {network.name}
                    </h6>
                    <p className={`leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {network.description}
                    </p>
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-medium
                      ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}
                    `}>
                      Range: {network.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* OSI Model */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 OSI Model (7 Layers)
              </h5>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { layer: 7, name: "Application Layer", color: "from-red-500 to-red-600", icon: "📱" },
                  { layer: 6, name: "Presentation Layer", color: "from-orange-500 to-orange-600", icon: "🎨" },
                  { layer: 5, name: "Session Layer", color: "from-yellow-500 to-yellow-600", icon: "🔗" },
                  { layer: 4, name: "Transport Layer", color: "from-green-500 to-green-600", icon: "🚚" },
                  { layer: 3, name: "Network Layer", color: "from-blue-500 to-blue-600", icon: "🌐" },
                  { layer: 2, name: "Data Link Layer", color: "from-purple-500 to-purple-600", icon: "📡" },
                  { layer: 1, name: "Physical Layer", color: "from-gray-500 to-gray-600", icon: "🔌" }
                ].reverse().map((layer, idx) => (
                  <div key={idx} className={`
                    bg-gradient-to-r ${layer.color} text-white p-4 rounded-xl
                    transform hover:scale-105 transition-all duration-300 cursor-pointer
                    shadow-lg hover:shadow-xl
                  `}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{layer.icon}</span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                        {layer.layer}
                      </div>
                    </div>
                    <h6 className="font-bold text-sm mb-1">Layer {layer.layer}</h6>
                    <p className="text-xs opacity-90">{layer.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Protocols */}
            <div>
              <h5 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔒 Key Protocols & Security
              </h5>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "TCP", description: "Reliable, connection-oriented protocol", icon: "🛡️", color: "from-blue-600 to-indigo-600" },
                  { name: "UDP", description: "Fast, connectionless protocol", icon: "⚡", color: "from-purple-600 to-pink-600" },
                  { name: "HTTP/HTTPS", description: "Web communication protocols", icon: "🌐", color: "from-green-600 to-teal-600" },
                  { name: "VPN", description: "Virtual Private Network security", icon: "🔒", color: "from-red-600 to-orange-600" }
                ].map((protocol, idx) => (
                  <div key={idx} className={`
                    bg-gradient-to-r ${protocol.color} text-white p-4 rounded-xl
                    transform hover:scale-105 transition-all duration-300 cursor-pointer
                    shadow-lg hover:shadow-xl
                  `}>
                    <div className="text-2xl mb-2">{protocol.icon}</div>
                    <h6 className="font-bold mb-2">{protocol.name}</h6>
                    <p className="text-xs opacity-90 leading-relaxed">{protocol.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'keyTerms':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className={`
              ${isDarkMode 
                ? 'bg-gradient-to-br from-violet-600/80 to-purple-600/80' 
                : 'bg-gradient-to-br from-violet-600 to-purple-600'
              }
              text-white p-6 rounded-2xl shadow-lg
            `}>
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <BookOpen className="w-6 h-6 mr-3" />
                Important Terms & Concepts
              </h4>
              <p className="text-lg opacity-90">
                Essential terminology and concepts in operating systems.
              </p>
            </div>

            {/* Terms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {osData.keyTerms.map((term, idx) => (
                <div key={idx} className={`
                  ${isDarkMode 
                    ? 'bg-slate-800/70 border border-slate-700/50' 
                    : 'bg-white border border-gray-200'
                  }
                  p-5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                  transition-all duration-300 group
                `}>
                  <div className={`
                    w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 
                    flex items-center justify-center text-white font-bold text-sm mb-4
                    group-hover:rotate-12 transition-transform duration-300
                  `}>
                    {idx + 1}
                  </div>
                  <h6 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                    {term.term}
                  </h6>
                  <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Content for this section is being prepared...</p>
          </div>
        );
    }
  };

  const SectionCard = ({ title, children, sectionId }) => (
    <div className={`
      ${isDarkMode ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-gray-200/50'}
      border rounded-xl shadow-xl backdrop-blur-sm
      mb-5 overflow-hidden transition-all duration-300
    `}>
      <div 
        onClick={() => toggleSection(sectionId)}
        className={`
          cursor-pointer flex justify-between items-center p-4
          ${expandedSections[sectionId] ? (isDarkMode ? 'border-b border-slate-700/50' : 'border-b border-gray-200/50') : ''}
          ${isDarkMode ? 'bg-slate-700/30 hover:bg-slate-600/30' : 'bg-gray-50/50 hover:bg-gray-100/50'}
          transition-colors duration-200
        `}
      >
        <h3 className={`text-xl font-semibold m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <span className={`text-lg transition-transform duration-200 ${
          isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
        } ${expandedSections[sectionId] ? 'rotate-90' : ''}`}>
          {expandedSections[sectionId] ? '▼' : '▶'}
        </span>
      </div>
      {expandedSections[sectionId] && (
        <div className="p-5 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );

  const FormulaBox = ({ formula }) => (
    <div className={`
      ${isDarkMode 
        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
        : 'bg-gradient-to-r from-indigo-600 to-blue-600'
      }
      p-4 rounded-xl my-3 text-white font-mono text-center text-base font-bold
      shadow-lg transform hover:scale-105 transition-all duration-200
    `}>
      {formula}
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${schemes.pageBackground(isDarkMode)}`}>
      {/* Floating Header */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl md:text-3xl font-bold ${schemes.brandGradient(isDarkMode)} bg-clip-text text-transparent`}>
                Operating Systems
              </h1>
              <div className="hidden md:flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                  Interactive Guide
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? (isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? (isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showFilters 
                    ? (isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
                    : (isDarkMode ? 'bg-slate-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900')
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search topics, concepts, algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-slate-800' 
                  : 'bg-white/50 border border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white'
              } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? (isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white')
                    : (isDarkMode ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700' : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200')
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-white/20' 
                    : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300')
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Panel */}
        {showFilters && (
          <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'} animate-slideInUp`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
            <div className="flex flex-wrap gap-3">
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${getDifficultyColor(difficulty)}`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Cards */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredSections.map((section, index) => (
            <div
              key={section.id}
              className={`group animate-fadeIn hover-lift ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`
                ${isDarkMode ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-gray-200/50'}
                border rounded-2xl backdrop-blur-sm transition-all duration-300
                ${viewMode === 'list' ? 'w-full flex items-center p-4' : 'p-6'}
                hover:shadow-2xl hover:scale-105 cursor-pointer
                ${expandedSections[section.id] ? 'ring-2 ring-indigo-500/50' : ''}
              `}>
                {/* Card Header */}
                <div className={`${viewMode === 'list' ? 'flex items-center flex-1' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex items-center space-x-4 flex-1' : ''}`}>
                    {/* Icon and Gradient */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-white
                      bg-gradient-to-r ${section.color} shadow-lg
                      ${viewMode === 'list' ? '' : 'mb-4'}
                    `}>
                      {section.icon}
                    </div>

                    {/* Title and Difficulty */}
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${viewMode === 'list' ? '' : 'mb-2'}`}>
                        {section.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                          {section.difficulty}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {section.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex items-center space-x-2 ${viewMode === 'list' ? '' : 'mt-4'}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(section.id);
                      }}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        favorites.has(section.id)
                          ? 'text-yellow-500 bg-yellow-500/10'
                          : (isDarkMode ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-500')
                      }`}
                    >
                      <Star className={`w-4 h-4 ${favorites.has(section.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isDarkMode ? 'text-gray-400 hover:text-white bg-slate-700/50' : 'text-gray-500 hover:text-gray-900 bg-gray-100/50'
                      }`}
                    >
                      {expandedSections[section.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedSections[section.id] && (
                  <div className={`${viewMode === 'list' ? 'w-full mt-4' : 'mt-6'} animate-slideInUp`}>
                    <div className={`
                      p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50/50'}
                      ${viewMode === 'list' ? 'w-full' : ''}
                    `}>
                      {renderSectionContent(section.id)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <div className={`w-20 h-20 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
              <Search className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No topics found
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatingSystems;