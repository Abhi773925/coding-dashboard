import React, { useState } from "react"
import { 
  Box, 
  Layers, 
  Shield, 
  Code, 
  Settings, 
  Eye, 
  Lock,
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Zap,
  CheckCircle,
  Target,
  FileText,
  Monitor,
  Database,
  Key,
  Search,
  Link,
  Activity,
  AlertTriangle,
  ArrowRight,
  Star,
  TrendingUp,
  Copy,
  Users,
  Cpu,
  Puzzle,
  Grid
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const oopData = {
  "OOP Fundamentals": {
    icon: Box,
    color: "from-blue-500 to-cyan-500",
    content: {
      "Introduction to OOP": {
        definition: "Object-Oriented Programming is a methodology or paradigm to design a program using classes and objects. It simplifies software development and maintenance.",
        keyPoints: [
          "Enables code reusability through inheritance",
          "Provides data security through encapsulation",
          "Simplifies complex problem solving through abstraction",
          "Supports flexible and extensible code architecture"
        ]
      },
      "Class Concept": {
        definition: "A class is a user-defined data type which defines its properties and its functions. It is a logical representation of data. A class does not occupy any memory space until an object is instantiated.",
        exampleAnalogy: "Human being is a class. The body parts are its properties, and the actions performed by the body parts are its functions.",
        syntax: {
          language: "C++",
          code: [
            "class student{",
            "public:",
            "  int id; // data member",
            "  int mobile;",
            "  string name;",
            "  int add(int x, int y){ // member functions",
            "    return x + y;",
            "  }",
            "};"
          ]
        }
      },
      "Object Concept": {
        definition: "An object is a run-time entity and an instance of a class. It can represent a person, place, or any other item. An object can operate on both data members and member functions.",
        syntax: {
          language: "C++",
          code: "student s = new student();"
        },
        memoryAllocationNote: "When an object is created using the 'new' keyword, space is allocated in the heap, and the starting address is stored in the stack. If created without 'new', space is not allocated in the heap, and the object contains a null value in the stack."
      }
    }
  },
  "Core Concepts": {
    icon: Layers,
    color: "from-purple-500 to-pink-500",
    content: {
      "Inheritance": {
        definition: "A process in which one object acquires all the properties and behaviors of its parent object automatically. This allows for reusing, extending, or modifying attributes and behaviors defined in other classes.",
        terminology: "In C++, the class that inherits is the 'derived class', and the class whose members are inherited is the 'base class'. The derived class is a specialized version of the base class.",
        syntax: "class derived_class:: visibility-mode base_class;",
        visibilityModes: ["private", "protected", "public"],
        types: [
          {"name": "Single Inheritance", "description": "When one class inherits another class."},
          {"name": "Multiple Inheritance", "description": "Deriving a new class that inherits attributes from two or more classes."},
          {"name": "Hierarchical Inheritance", "description": "Deriving more than one class from a single base class."},
          {"name": "Multilevel Inheritance", "description": "Deriving a class from another derived class."},
          {"name": "Hybrid Inheritance", "description": "A combination of simple, multiple, and hierarchical inheritance."}
        ]
      },
      "Encapsulation": {
        definition: "The process of combining data and functions into a single unit called a class. Data is not accessed directly but through functions within the class.",
        implementation: "Attributes of the class are kept private, and public getter and setter methods are provided to manipulate them.",
        relatedConcept: {
          name: "Data Hiding",
          description: "A language feature to restrict access to members of an object, reducing negative effects due to dependencies (e.g., using 'private', 'protected'). Encapsulation makes data hiding possible."
        }
      },
      "Abstraction": {
        definition: "The process of obtaining an abstract view, model, or structure of a real-life problem by reducing its unnecessary details. It identifies the data affected and the operations involved to create a standard solution for similar problems."
      }
    }
  },
  "Polymorphism": {
    icon: Grid,
    color: "from-green-500 to-emerald-500",
    content: {
      "Polymorphism Overview": {
        definition: "The ability to present the same interface for differing underlying forms (data types). The name means 'many forms' (Poly-morphism).",
        example: "Different shape classes (Point, Circle, Square) can have different underlying data (coordinates, radius), but share a common interface."
      },
      "Compile Time Polymorphism": {
        definition: "Polymorphism that is implemented at compile time. Also known as Static Polymorphism.",
        example: "Method Overloading",
        methodOverloading: {
          definition: "A technique allowing more than one function with the same name but with different functionality.",
          basis: [
            "The return type of the overloaded function",
            "The type of the parameters passed to the function",
            "The number of parameters passed to the function"
          ],
          codeExample: {
            language: "C++",
            code: [
              "class Add {",
              "public:",
              "  int add(int a, int b){ return (a+b); }",
              "  int add(int a, int b, int c){ return (a+b+c); }",
              "};",
              "int main(){",
              "  Add obj;",
              "  int res1, res2;",
              "  res1 = obj.add(2,3);",
              "  res2 = obj.add(2,3,4);",
              "  cout << res1 << \" \" << res2 << endl;",
              "  return 0;",
              "}"
            ],
            output: "5 9"
          }
        }
      },
      "Runtime Polymorphism": {
        definition: "Also known as dynamic polymorphism, where the call to an overridden function is determined at runtime.",
        example: "Function Overriding",
        functionOverriding: {
          definition: "Occurs when a child class contains a method that is already present in the parent class, effectively overriding it. Both classes have the same function with a different definition.",
          codeExample: {
            language: "C++",
            code: [
              "class Base_class{",
              "public:",
              "  virtual void show(){ cout << \"Apni Kaksha base\" << endl; }",
              "};",
              "class Derived_class: public Base_class{",
              "public:",
              "  void show(){ cout << \"Apni Kaksha derived\" << endl; }",
              "};",
              "int main(){",
              "  Base_class* b;",
              "  Derived_class d;",
              "  b = &d;",
              "  b->show();",
              "  return 0;",
              "}"
            ],
            output: "Apni Kaksha derived"
          }
        }
      }
    }
  },
  "Special Functions": {
    icon: Settings,
    color: "from-red-500 to-pink-500",
    content: {
      "Constructor": {
        definition: "A special method invoked automatically at the time of object creation, generally used to initialize data members. It has the same name as the class.",
        types: [
          {"name": "Default Constructor", "description": "A constructor with no arguments, invoked at the time of creating an object."},
          {"name": "Parameterized Constructor", "description": "A constructor with parameters, used to provide different values to distinct objects."},
          {"name": "Copy Constructor", "description": "An overloaded constructor used to declare and initialize an object from another object."}
        ],
        example: {
          language: "C++",
          code: [
            "class go {",
            "public:",
            "  int x;",
            "  go(int a){ x=a; } // parameterized constructor",
            "  go(go &i){ x=i.x; } // copy constructor",
            "};",
            "int main(){",
            "  go a1(20); // Calling the parameterized constructor.",
            "  go a2(a1); // Calling the copy constructor.",
            "  cout << a2.x << endl;",
            "  return 0;",
            "}"
          ],
          output: "20"
        }
      },
      "Destructor": {
        definition: "Works opposite to a constructor; it destructs objects of classes and is invoked automatically. It can be defined only once in a class and must have the same name as the class, prefixed with a tilde (~)."
      },
      "This Pointer": {
        definition: "A keyword that refers to the current instance of the class.",
        uses: [
          "To pass the current object as a parameter to another method",
          "To refer to the current class instance variable",
          "To declare indexers"
        ]
      },
      "Friend Function": {
        definition: "A non-member function that can access the private and protected members of a class. It must be listed in the class definition.",
        notes: [
          "A friend function cannot access private members directly; it must use an object name and dot operator",
          "A friend function uses objects as arguments"
        ]
      }
    }
  },
  "Virtual Functions": {
    icon: Eye,
    color: "from-indigo-500 to-purple-500",
    content: {
      "Virtual Function": {
        definition: "A member function in a base class, redefined by a derived class, and declared with the 'virtual' keyword. It's used to replace the implementation provided by the base class.",
        binding: "When a function is virtual, C++ determines at run-time which function to call based on the type of the object pointed to by the base class pointer.",
        keyPoints: [
          "Virtual functions cannot be static",
          "A class may have a virtual destructor but cannot have a virtual constructor"
        ],
        example: {
          language: "C++",
          code: [
            "class base {",
            "public:",
            "  virtual void print(){ cout << \"print base class\" << endl; }",
            "  void show(){ cout << \"show base class\" << endl; }",
            "};",
            "class derived: public base {",
            "public:",
            "  void print(){ cout << \"print derived class\" << endl; }",
            "  void show(){ cout << \"show derived class\" << endl; }",
            "};",
            "int main(){",
            "  base* bptr; derived d; bptr = &d;",
            "  bptr->print(); // virtual function, binded at runtime",
            "  bptr->show(); // Non-virtual function, binded at compile time",
            "}"
          ],
          output: [
            "print derived class",
            "show base class"
          ]
        }
      },
      "Pure Virtual Function": {
        definition: "A function declared in a base class that has no definition relative to the base class and only serves as a placeholder.",
        syntax: "virtual void display() = 0;",
        properties: [
          "A class containing a pure virtual function is known as an 'abstract base class' and cannot be used to declare objects of its own",
          "Its main objective is to provide traits to derived classes and to create a base pointer for runtime polymorphism"
        ]
      }
    }
  },
  "Advanced Concepts": {
    icon: Code,
    color: "from-orange-500 to-red-500",
    content: {
      "Data Binding": {
        definition: "A process of binding the application UI and business logic. Any change in the business logic will reflect directly in the application UI."
      },
      "Aggregation": {
        definition: "A process in which one class defines another class as an entity reference. It represents a 'HAS-A' relationship and is another way to reuse a class."
      },
      "Abstract Classes": {
        definition: "In C++, a class is made abstract by declaring at least one of its functions as a pure virtual function ('= 0'). Its implementation must be provided by derived classes."
      },
      "Namespaces": {
        definition: "A logical division of code designed to stop naming conflicts by defining a scope for identifiers like variables, classes, and functions.",
        purpose: "The main purpose is to remove ambiguity, which occurs when different tasks have the same name (e.g., two functions named 'add()').",
        standardNamespace: "C++ has a standard namespace, 'std', which contains inbuilt classes and functions. The 'using namespace std;' statement includes it in a program."
      },
      "Access Specifiers": {
        definition: "Used to define how functions and variables can be accessed outside the class.",
        types: [
          {"name": "Private", "rule": "Can be accessed only within the same class."},
          {"name": "Public", "rule": "Can be accessed from anywhere."},
          {"name": "Protected", "rule": "Cannot be accessed outside the class except by a child class; generally used in inheritance."}
        ]
      }
    }
  },
  "Key Summary": {
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    content: {
      "Memory Management": {
        note: "'Delete' is used to release a unit of memory, while 'delete[]' is used to release an array."
      },
      "Virtual Inheritance": {
        note: "Virtual inheritance allows you to create only one copy of an object even if it appears more than once in the hierarchy."
      },
      "Overloading vs Overriding": {
        note: "Overloading is static binding, whereas Overriding is dynamic binding. Overloading involves the same method name with different arguments in the same class. Overriding involves the same method name with the same arguments and return types in a class and its child class."
      },
      "Operator Overloading": {
        note: "A standard operator can be redefined to have a different meaning when applied to instances of a class."
      }
    }
  }
}

const ObjectOrientedProgramming = () => {
  const { isDarkMode } = useTheme()
  const [openAccordion, setOpenAccordion] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [completedTopics, setCompletedTopics] = useState(new Set())

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  const markTopicComplete = (topicId) => {
    const newCompleted = new Set(completedTopics)
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId)
    } else {
      newCompleted.add(topicId)
    }
    setCompletedTopics(newCompleted)
  }

  const renderExpandedContent = (title, content, categoryKey) => {
    const { icon: Icon, color } = oopData[categoryKey]
    
    return (
      <div className={`border rounded-xl overflow-hidden ${
        isDarkMode ? "border-gray-700 bg-zinc-900/50" : "border-gray-200 bg-white/50"
      }`}>
        {/* Category Header */}
        <div className={`p-6 bg-gradient-to-br ${color}`}>
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-slate-300/80">Explore {Object.keys(content).length} key concepts</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all"
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
    const { icon: Icon, color } = oopData[categoryKey]
    
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

        {/* Example Analogy */}
        {content.exampleAnalogy && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Puzzle size={16} className="text-purple-500" />
              Example Analogy
            </h5>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm leading-relaxed">{content.exampleAnalogy}</p>
            </div>
          </div>
        )}

        {/* Syntax */}
        {content.syntax && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Code size={16} className="text-green-500" />
              Syntax ({content.syntax.language || "Code"})
            </h5>
            <div className={`p-4 rounded-lg border font-mono text-sm ${
              isDarkMode ? ""bg-zinc-900"/50 border-gray-600 text-green-400" : ""bg-zinc-900" border-gray-200 text-green-400"
            }`}>
              {Array.isArray(content.syntax.code) ? (
                content.syntax.code.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))
              ) : (
                <div>{content.syntax.code}</div>
              )}
            </div>
          </div>
        )}

        {/* Memory Allocation Note */}
        {content.memoryAllocationNote && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Database size={16} className="text-orange-500" />
              Memory Allocation
            </h5>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm leading-relaxed">{content.memoryAllocationNote}</p>
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

        {/* Types - Table */}
        {content.types && Array.isArray(content.types) && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Layers size={16} className="text-blue-500" />
              Types
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Type</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Description</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
                  {content.types.map((type, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{type.name}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{type.description || type.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Uses */}
        {content.uses && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Activity size={16} className="text-purple-500" />
              Uses
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Use Case</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
                  {content.uses.map((use, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{idx + 1}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {content.notes && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <FileText size={16} className="text-yellow-500" />
              Important Notes
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Note</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
                  {content.notes.map((note, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{idx + 1}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties */}
        {content.properties && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Settings size={16} className="text-blue-500" />
              Properties
            </h5>
            <div className={`overflow-hidden rounded-lg border ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}>
              <table className="w-full">
                <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Property</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? "bg-zinc-900/30" : "bg-white"}>
                  {content.properties.map((property, idx) => (
                    <tr key={idx} className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{idx + 1}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{property}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Code Example */}
        {content.example && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Code size={16} className="text-green-500" />
              Code Example ({content.example.language})
            </h5>
            <div className={`p-4 rounded-lg border font-mono text-sm ${
              isDarkMode ? ""bg-zinc-900"/50 border-gray-600 text-green-400" : ""bg-zinc-900" border-gray-200 text-green-400"
            }`}>
              {content.example.code.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            {content.example.output && (
              <div className="mt-2">
                <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Output:</p>
                <div className={`p-3 rounded-lg border font-mono text-sm ${
                  isDarkMode ? "bg-zinc-900/30 border-gray-600 text-blue-400" : "bg-gray-50 border-gray-200 text-blue-600"
                }`}>
                  {Array.isArray(content.example.output) ? (
                    content.example.output.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))
                  ) : (
                    <div>{content.example.output}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Method Overloading specific content */}
        {content.methodOverloading && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Code size={16} className="text-purple-500" />
              Method Overloading
            </h5>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm leading-relaxed mb-4">{content.methodOverloading.definition}</p>
              
              {content.methodOverloading.basis && (
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Based on:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {content.methodOverloading.basis.map((basis, idx) => (
                      <li key={idx} className="text-sm">{basis}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.methodOverloading.codeExample && (
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Code Example ({content.methodOverloading.codeExample.language}):
                  </p>
                  <div className={`p-4 rounded-lg border font-mono text-sm ${
                    isDarkMode ? ""bg-zinc-900"/50 border-gray-600 text-green-400" : ""bg-zinc-900" border-gray-200 text-green-400"
                  }`}>
                    {content.methodOverloading.codeExample.code.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                  {content.methodOverloading.codeExample.output && (
                    <div className="mt-2">
                      <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Output:</p>
                      <div className={`p-3 rounded-lg border font-mono text-sm ${
                        isDarkMode ? "bg-zinc-900/30 border-gray-600 text-blue-400" : "bg-gray-50 border-gray-200 text-blue-600"
                      }`}>
                        {content.methodOverloading.codeExample.output}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Function Overriding specific content */}
        {content.functionOverriding && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              <Code size={16} className="text-indigo-500" />
              Function Overriding
            </h5>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-zinc-900/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <p className="text-sm leading-relaxed mb-4">{content.functionOverriding.definition}</p>
              
              {content.functionOverriding.codeExample && (
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Code Example ({content.functionOverriding.codeExample.language}):
                  </p>
                  <div className={`p-4 rounded-lg border font-mono text-sm ${
                    isDarkMode ? ""bg-zinc-900"/50 border-gray-600 text-green-400" : ""bg-zinc-900" border-gray-200 text-green-400"
                  }`}>
                    {content.functionOverriding.codeExample.code.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                  {content.functionOverriding.codeExample.output && (
                    <div className="mt-2">
                      <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Output:</p>
                      <div className={`p-3 rounded-lg border font-mono text-sm ${
                        isDarkMode ? "bg-zinc-900/30 border-gray-600 text-blue-400" : "bg-gray-50 border-gray-200 text-blue-600"
                      }`}>
                        {content.functionOverriding.codeExample.output}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render any other properties as generic content */}
        {Object.entries(content).map(([key, value]) => {
          // Skip already rendered properties
          const skipKeys = [
            'definition', 'keyPoints', 'types', 'uses', 'notes', 'properties', 
            'example', 'methodOverloading', 'functionOverriding', 'exampleAnalogy', 
            'syntax', 'memoryAllocationNote'
          ]
          
          if (skipKeys.includes(key) || typeof value === 'string') {
            return null
          }

          return (
            <div key={key} className="mb-6">
              <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                <FileText size={16} className="text-gray-500" />
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </h5>
              {Array.isArray(value) ? (
                <div className={`overflow-hidden rounded-lg border ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}>
                  <table className="w-full">
                    <thead className={`${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>#</th>
                        <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Value</th>
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
          )
        })}
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDarkMode 
        ? ""bg-zinc-900"" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>
      {/* Header */}
      <div className={`relative z-10 pt-20 pb-12 ${
        isDarkMode ? "bg-zinc-900/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-slate-300 shadow-lg">
              <Box size={32} />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent`}>
              Object-Oriented Programming
            </h1>
          </div>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Master the fundamentals of OOP including classes, objects, inheritance, encapsulation, 
            abstraction, and polymorphism with comprehensive examples and explanations.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8">
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? "bg-zinc-900" : "bg-white/70 border-gray-200"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
            <Search size={20} className="text-blue-500" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {Object.entries(oopData).map(([title, data]) => {
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
            {Object.entries(oopData)
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
            {Object.entries(oopData).map(([title, data]) => 
              renderContent(title, data.content, title)
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-10">
        <div className={`max-w-4xl mx-auto p-6 rounded-xl border ${
          isDarkMode ? "bg-zinc-900" : "bg-white/70 border-gray-200"
        }`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen size={20} className="text-blue-500" />
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Interactive OOP Learning Guide
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

export default ObjectOrientedProgramming