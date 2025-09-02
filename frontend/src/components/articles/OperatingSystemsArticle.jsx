import React from "react"
import { useTheme } from "../context/ThemeContext"
import { BookOpen, Clock, User, Cpu, HardDrive, Shield, Zap, Network, Settings } from "lucide-react"

const OperatingSystemsArticle = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? "bg-zinc-900 text-gray-100" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
    }`}>
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? "text-slate-300" : "text-gray-900"
          }`}>
            Operating Systems
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Complete Guide to Operating System Concepts, Process Management, Memory Management, and System Design
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>35 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comprehensive Guide</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>System Software</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <article className={`prose prose-lg max-w-none ${
          isDarkMode ? "prose-invert" : ""
        }`}>
          
          {/* Table of Contents */}
          <section className="mb-8">
            <div className={`p-6 rounded-xl border ${
              isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-blue-50 border-blue-200"
            }`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                📚 Table of Contents
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div>1. Introduction to Operating Systems</div>
                  <div>2. Types of Operating Systems</div>
                  <div>3. Process Management</div>
                  <div>4. Process Scheduling</div>
                  <div>5. Inter-Process Communication</div>
                  <div>6. Threads and Multithreading</div>
                  <div>7. Process Synchronization</div>
                  <div>8. Deadlocks</div>
                </div>
                <div className="space-y-2">
                  <div>9. Memory Management</div>
                  <div>10. Virtual Memory</div>
                  <div>11. File Systems</div>
                  <div>12. I/O Systems</div>
                  <div>13. Security and Protection</div>
                  <div>14. Distributed Systems</div>
                  <div>15. Case Studies</div>
                  <div>16. Modern OS Trends</div>
                </div>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              1. Introduction to Operating Systems
            </h2>
            
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              What is an Operating System?
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              An Operating System (OS) is a collection of software that manages computer hardware resources and provides 
              common services for computer programs. It acts as an intermediary between users and the computer hardware, 
              making the computer system convenient to use.
            </p>

            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                Key Definitions:
              </h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• <strong>System Software:</strong> Programs that control and coordinate the operations of computer hardware</li>
                <li>• <strong>Resource Manager:</strong> Manages CPU, memory, storage, and I/O devices efficiently</li>
                <li>• <strong>Extended Machine:</strong> Provides a virtual machine that is easier to program than raw hardware</li>
                <li>• <strong>Control Program:</strong> Controls execution of programs to prevent errors and improper use</li>
              </ul>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              Functions of Operating System
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  <Cpu className="inline mr-2" size={16} />
                  Process Management
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Creating, scheduling, terminating processes, and handling process synchronization and communication.
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  <HardDrive className="inline mr-2" size={16} />
                  Memory Management
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Allocating and deallocating memory space, keeping track of memory usage, and implementing virtual memory.
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  <HardDrive className="inline mr-2" size={16} />
                  File Management
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Creating, deleting, reading, writing files and directories, and managing file permissions and security.
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  <Settings className="inline mr-2" size={16} />
                  Device Management
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Managing I/O devices through device drivers, handling interrupts, and controlling device access.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Operating Systems */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              2. Types of Operating Systems
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Based on User Interface
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      Command Line Interface (CLI)
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Text-based interface where users type commands. Examples: MS-DOS, Unix shell, Linux terminal.
                      <br /><strong>Advantages:</strong> Fast, less memory usage, powerful for experts
                      <br /><strong>Disadvantages:</strong> Difficult for beginners, requires memorizing commands
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                      Graphical User Interface (GUI)
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Visual interface with windows, icons, menus. Examples: Windows, macOS, Ubuntu Desktop.
                      <br /><strong>Advantages:</strong> User-friendly, intuitive, easy to learn
                      <br /><strong>Disadvantages:</strong> More memory usage, slower than CLI
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Based on Processing
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-zinc-900" : "bg-blue-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      Batch Operating System
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Jobs are processed in batches without user interaction. Similar jobs are grouped together.
                      <br /><strong>Features:</strong> No direct interaction, automatic job sequencing, efficient resource utilization
                      <br /><strong>Examples:</strong> IBM's OS/360, Early mainframe systems
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? "bg-zinc-900" : "bg-green-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      Time-Sharing Operating System
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Multiple users share CPU time through time slicing. Each user gets a time quantum.
                      <br /><strong>Features:</strong> Interactive computing, multi-user support, rapid response time
                      <br /><strong>Examples:</strong> Unix, Linux, Windows Server
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? "bg-zinc-900" : "bg-purple-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                      Real-Time Operating System (RTOS)
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Provides guaranteed response times for critical applications.
                      <br /><strong>Hard Real-Time:</strong> Strict deadlines (missile guidance, pacemakers)
                      <br /><strong>Soft Real-Time:</strong> Flexible deadlines (multimedia systems, gaming)
                      <br /><strong>Examples:</strong> VxWorks, QNX, FreeRTOS
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-l-4 border-orange-500 ${isDarkMode ? "bg-zinc-900" : "bg-orange-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                      Distributed Operating System
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Manages a collection of independent computers that appear as a single system.
                      <br /><strong>Features:</strong> Resource sharing, fault tolerance, scalability
                      <br /><strong>Examples:</strong> Google's Android (distributed apps), Cluster computing systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Management */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              3. Process Management
            </h2>
            
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              What is a Process?
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A process is a program in execution. It includes the program code, its current activity, program counter, 
              stack, data section, and heap. A process is more than just program code (text section).
            </p>

            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                Process vs Program:
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Program:</strong>
                  <ul className={`mt-1 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>• Passive entity (code on disk)</li>
                    <li>• Static collection of instructions</li>
                    <li>• Does not require resources</li>
                    <li>• Stored in secondary memory</li>
                  </ul>
                </div>
                <div>
                  <strong>Process:</strong>
                  <ul className={`mt-1 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>• Active entity (program in execution)</li>
                    <li>• Dynamic entity with state changes</li>
                    <li>• Requires CPU, memory, I/O resources</li>
                    <li>• Loaded in main memory</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              Process States
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A process can be in one of several states during its lifetime:
            </p>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-zinc-900" : "bg-blue-50"}`}>
                <strong>New:</strong> Process is being created and initialized
              </div>
              <div className={`p-3 rounded-lg border-l-4 border-green-500 ${isDarkMode ? "bg-zinc-900" : "bg-green-50"}`}>
                <strong>Ready:</strong> Process is ready to run but waiting for CPU allocation
              </div>
              <div className={`p-3 rounded-lg border-l-4 border-yellow-500 ${isDarkMode ? "bg-zinc-900" : "bg-yellow-50"}`}>
                <strong>Running:</strong> Process is currently being executed by CPU
              </div>
              <div className={`p-3 rounded-lg border-l-4 border-red-500 ${isDarkMode ? "bg-zinc-900" : "bg-red-50"}`}>
                <strong>Blocked/Waiting:</strong> Process is waiting for some event (I/O completion, signal)
              </div>
              <div className={`p-3 rounded-lg border-l-4 border-gray-500 ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
                <strong>Terminated:</strong> Process has finished execution and is being removed
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
              Process Control Block (PCB)
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Each process is represented by a Process Control Block (PCB) containing:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Process Identification</h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Process ID (PID)</li>
                  <li>• Parent Process ID (PPID)</li>
                  <li>• User ID</li>
                  <li>• Group ID</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Process State Information</h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Current state</li>
                  <li>• Program counter</li>
                  <li>• CPU registers</li>
                  <li>• Stack pointer</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Process Control Information</h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Priority</li>
                  <li>• Scheduling information</li>
                  <li>• Memory management info</li>
                  <li>• I/O status information</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>Resource Information</h4>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Open files</li>
                  <li>• Allocated devices</li>
                  <li>• Memory allocation</li>
                  <li>• Accounting information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Process Scheduling */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              4. Process Scheduling
            </h2>
            
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Process scheduling is the activity of the process manager that handles the removal of the running process 
              from the CPU and the selection of another process based on a particular strategy.
            </p>

            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Types of Schedulers
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Long-Term Scheduler (Job Scheduler)
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Determines which programs are admitted to the system for processing. Controls the degree of multiprogramming.
                  Selects processes from the job pool and loads them into memory for execution.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Short-Term Scheduler (CPU Scheduler)
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Selects which process should be executed next and allocates CPU. Also called dispatcher.
                  Invoked frequently (milliseconds) - must be fast.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Medium-Term Scheduler
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Performs swapping - removes processes from memory and reduces degree of multiprogramming.
                  Later, the process can be reintroduced into memory and execution continues.
                </p>
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
              CPU Scheduling Algorithms
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-zinc-900" : "bg-blue-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  First-Come, First-Served (FCFS)
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Simplest scheduling algorithm. Process that requests CPU first is allocated CPU first.
                </p>
                <div className="text-xs">
                  <strong>Advantages:</strong> Simple to implement, fair in terms of arrival time<br />
                  <strong>Disadvantages:</strong> Poor performance, convoy effect, no preemption<br />
                  <strong>Average Waiting Time:</strong> Generally high for short processes
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? "bg-zinc-900" : "bg-green-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Shortest Job First (SJF)
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Process with smallest execution time is selected for execution next.
                </p>
                <div className="text-xs">
                  <strong>Preemptive:</strong> Shortest Remaining Time First (SRTF)<br />
                  <strong>Non-preemptive:</strong> Once CPU given, process runs to completion<br />
                  <strong>Advantage:</strong> Minimum average waiting time<br />
                  <strong>Disadvantage:</strong> Difficult to predict burst time, starvation of long processes
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? "bg-zinc-900" : "bg-purple-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Round Robin (RR)
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Each process gets a small unit of CPU time (time quantum), usually 10-100ms.
                </p>
                <div className="text-xs">
                  <strong>Time Quantum:</strong> If too large → FCFS, if too small → overhead increases<br />
                  <strong>Advantages:</strong> Fair allocation, no starvation, good for time-sharing<br />
                  <strong>Disadvantages:</strong> Higher average turnaround time, context switching overhead
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-orange-500 ${isDarkMode ? "bg-zinc-900" : "bg-orange-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Priority Scheduling
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  CPU is allocated to the process with highest priority. Equal priority processes are scheduled in FCFS order.
                </p>
                <div className="text-xs">
                  <strong>Preemptive:</strong> Higher priority process can preempt lower priority<br />
                  <strong>Non-preemptive:</strong> Once CPU allocated, runs until completion<br />
                  <strong>Problem:</strong> Starvation - low priority processes may never execute<br />
                  <strong>Solution:</strong> Aging - gradually increase priority of waiting processes
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-red-500 ${isDarkMode ? "bg-zinc-900" : "bg-red-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  Multilevel Queue Scheduling
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Ready queue is partitioned into separate queues based on process characteristics.
                </p>
                <div className="text-xs">
                  <strong>Queue Types:</strong> System processes, Interactive processes, Batch processes<br />
                  <strong>Each queue:</strong> Has its own scheduling algorithm<br />
                  <strong>Scheduling:</strong> Fixed priority scheduling between queues<br />
                  <strong>Problem:</strong> No movement between queues - starvation possible
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-indigo-500 ${isDarkMode ? "bg-zinc-900" : "bg-indigo-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  Multilevel Feedback Queue
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Allows processes to move between queues. Aging can be implemented this way.
                </p>
                <div className="text-xs">
                  <strong>Parameters:</strong> Number of queues, scheduling algorithms, method to determine when to upgrade/demote<br />
                  <strong>Advantage:</strong> Very flexible, can be configured to match specific system<br />
                  <strong>Example:</strong> All new processes start in highest priority queue, demoted if they use too much CPU time
                </div>
              </div>
            </div>
          </section>

          {/* Continue with remaining sections... */}
          
          {/* Inter-Process Communication */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              5. Inter-Process Communication (IPC)
            </h2>
            
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Processes executing concurrently may be independent or cooperating. Cooperating processes need to 
              communicate and synchronize their actions.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Shared Memory
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Processes share a common memory region. Fast communication but requires synchronization.
                  Examples: POSIX shared memory, System V shared memory.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Message Passing
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Communication through sending and receiving messages. Slower but easier synchronization.
                  Examples: Pipes, Message queues, Sockets.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Pipes
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Anonymous pipes for parent-child communication. Named pipes (FIFOs) for unrelated processes.
                  Unidirectional communication channel.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Sockets
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Communication endpoint for networking. Can be used for local or network communication.
                  TCP sockets (reliable) or UDP sockets (fast).
                </p>
              </div>
            </div>
          </section>

          {/* Threads */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              6. Threads and Multithreading
            </h2>
            
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              What are Threads?
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A thread is a basic unit of CPU utilization within a process. Multiple threads can exist within the same process, 
              sharing the same memory space but having separate execution paths.
            </p>

            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                Thread Components:
              </h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• <strong>Thread ID:</strong> Unique identifier for the thread</li>
                <li>• <strong>Program Counter:</strong> Current instruction being executed</li>
                <li>• <strong>Register Set:</strong> CPU register values</li>
                <li>• <strong>Stack:</strong> Local variables and function call information</li>
              </ul>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              Benefits of Multithreading
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Responsiveness</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Program can continue running even if part of it is blocked or performing lengthy operations.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Resource Sharing</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Threads share memory and resources of the process, making communication easier and faster.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Economy</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Creating and switching threads is cheaper than creating and switching processes.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>Scalability</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Multithreading can take advantage of multicore architectures for parallel execution.
                </p>
              </div>
            </div>
          </section>

          {/* Memory Management */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              9. Memory Management
            </h2>
            
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Memory management involves keeping track of which parts of memory are being used and by whom, 
              deciding which processes to load when memory becomes available, and allocating and deallocating memory space.
            </p>

            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Memory Allocation Strategies
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-zinc-900" : "bg-blue-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Contiguous Memory Allocation
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Each process is allocated a single contiguous block of memory.
                </p>
                <div className="text-xs">
                  <strong>Fixed Partitioning:</strong> Memory divided into fixed-size partitions<br />
                  <strong>Dynamic Partitioning:</strong> Partitions created dynamically based on process size<br />
                  <strong>Problems:</strong> Internal fragmentation (fixed), External fragmentation (dynamic)
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? "bg-zinc-900" : "bg-green-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Paging
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Physical memory divided into fixed-size blocks called frames. Logical memory divided into same-size blocks called pages.
                </p>
                <div className="text-xs">
                  <strong>Advantages:</strong> No external fragmentation, easy allocation<br />
                  <strong>Disadvantages:</strong> Internal fragmentation possible, memory overhead for page tables<br />
                  <strong>Page Table:</strong> Maps logical pages to physical frames
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? "bg-zinc-900" : "bg-purple-50"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Segmentation
                </h4>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Memory divided into variable-size segments based on logical divisions of the program.
                </p>
                <div className="text-xs">
                  <strong>Segments:</strong> Code, data, stack, heap<br />
                  <strong>Advantages:</strong> Logical organization, sharing and protection<br />
                  <strong>Disadvantages:</strong> External fragmentation, complex memory management
                </div>
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
              Virtual Memory
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Virtual memory allows execution of processes that may not be completely in memory. It separates logical 
              memory from physical memory, enabling very large virtual address spaces.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Demand Paging
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Pages are loaded into memory only when they are accessed. Uses valid/invalid bit in page table.
                  Page fault occurs when accessing invalid page.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Page Replacement
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  When memory is full, must replace pages. Algorithms: FIFO, LRU, Optimal, Clock.
                  Goal: minimize page fault rate.
                </p>
              </div>
            </div>
          </section>

          {/* File Systems */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              11. File Systems
            </h2>
            
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A file system provides the mechanism for on-line storage and access of both data and programs. 
              It manages files and directories, providing operations like create, delete, read, write.
            </p>

            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              File System Structure
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  File Allocation Methods:
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Contiguous:</strong>
                    <ul className={`mt-1 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Fast access</li>
                      <li>• External fragmentation</li>
                      <li>• Difficult to grow files</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Linked:</strong>
                    <ul className={`mt-1 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• No external fragmentation</li>
                      <li>• Sequential access only</li>
                      <li>• Pointer overhead</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Indexed:</strong>
                    <ul className={`mt-1 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Direct access</li>
                      <li>• Index block overhead</li>
                      <li>• Used in Unix/Linux</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              Directory Structure
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Single-Level Directory
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  All files in same directory. Simple but naming problems and no grouping.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Two-Level Directory
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Separate directory for each user. Solves naming problem but no grouping.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Tree-Structured Directory
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Hierarchical structure. Efficient searching, grouping capability. Most common today.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Acyclic-Graph Directory
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Allows shared subdirectories and files. More complex but flexible.
                </p>
              </div>
            </div>
          </section>

          {/* Security and Protection */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              13. Security and Protection
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Protection
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Internal mechanism controlling access to resources within the system.
                </p>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Access Control Lists (ACL)</li>
                  <li>• Capability-based systems</li>
                  <li>• Role-based access control</li>
                  <li>• Mandatory vs Discretionary access control</li>
                </ul>
              </div>
              
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Security
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Defense against external threats and attacks.
                </p>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Authentication (passwords, biometrics)</li>
                  <li>• Encryption and cryptography</li>
                  <li>• Intrusion detection systems</li>
                  <li>• Virus protection and firewalls</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Modern OS Trends */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              16. Modern Operating System Trends
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Virtualization
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Running multiple OS instances on single hardware. Hypervisors, containers, cloud computing.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Mobile Operating Systems
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Android, iOS - optimized for mobile devices, touch interfaces, power management.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Cloud Computing
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as a Service (SaaS).
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Microkernel Architecture
                </h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Minimal kernel with services in user space. Better modularity, reliability, security.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
              Key Takeaways
            </h2>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Operating systems are the foundation of modern computing, providing essential services that enable 
              applications to run efficiently and securely. Understanding concepts like process management, 
              memory management, file systems, and scheduling algorithms is crucial for any computer science professional.
            </p>
            <p className={`text-base leading-relaxed mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              From scheduling algorithms to synchronization mechanisms, these concepts directly impact system 
              performance and reliability. Whether you're developing applications, managing systems, or designing 
              software architecture, OS knowledge provides the foundation for making informed technical decisions.
            </p>
            
            <div className={`mt-6 p-6 rounded-xl border ${
              isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-blue-50 border-blue-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                🎯 Study Tips for Operating Systems
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• Practice scheduling algorithm calculations and examples</li>
                <li>• Understand the trade-offs between different memory management techniques</li>
                <li>• Study real-world case studies of popular operating systems</li>
                <li>• Implement simple versions of OS concepts in programming languages</li>
                <li>• Focus on understanding the "why" behind design decisions</li>
                <li>• Connect theoretical concepts to practical system administration</li>
              </ul>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

export default OperatingSystemsArticle;

    