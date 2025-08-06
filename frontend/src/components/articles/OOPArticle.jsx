import React from "react"
import { useTheme } from "../context/ThemeContext"
import { BookOpen, Clock, User, Code, Shield, Eye, Lock, ArrowRight, CheckCircle } from "lucide-react"

const OOPArticle = () => {
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
            Object-Oriented Programming
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Complete Guide to OOP Concepts, Principles, and Design Patterns
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>25 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comprehensive Guide</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Advanced Concepts</span>
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
              What is Object-Oriented Programming?
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Object-Oriented Programming (OOP) is a methodology or paradigm to design a program using classes and objects. 
              It simplifies software development and maintenance by organizing code into reusable, modular components. 
              OOP enables code reusability through inheritance, provides data security through encapsulation, 
              simplifies complex problem solving through abstraction, and supports flexible and extensible code architecture.
            </p>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Think of OOP like building with LEGO blocks - each piece (object) has specific properties and can be combined 
              with other pieces to create complex structures. This approach makes code more organized, reusable, and easier to understand.
            </p>
            
            <div className={`mt-6 p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                Key Benefits of OOP:
              </h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• Enables code reusability through inheritance</li>
                <li>• Provides data security through encapsulation</li>
                <li>• Simplifies complex problem solving through abstraction</li>
                <li>• Supports flexible and extensible code architecture</li>
              </ul>
            </div>
          </section>

          {/* Class Concept */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Understanding Classes
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              A class is a user-defined data type which defines its properties and its functions. It is a logical 
              representation of data. A class does not occupy any memory space until an object is instantiated.
            </p>
            
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                Real-World Analogy:
              </h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <strong>Human being is a class.</strong> The body parts are its properties, and the actions performed by the body parts are its functions.
                For example: Eyes (property) can see (function), Ears (property) can hear (function).
              </p>
            </div>

            <div className="mt-6">
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                Class Components:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Data Members (Attributes)
                  </h4>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Variables that store the state of an object. They represent the properties or characteristics of the class.
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    Member Functions (Methods)
                  </h4>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Functions that operate on the data members. They define the behavior or actions that objects can perform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Objects */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Understanding Objects
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              An object is an instance of a class. When a class is defined, no memory is allocated until an object 
              of that class is created. Objects are the actual entities that exist in memory and can perform operations.
            </p>
            
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                Object Characteristics:
              </h4>
              <ul className={`text-sm space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• <strong>State:</strong> Represented by attributes (data members)</li>
                <li>• <strong>Behavior:</strong> Represented by methods (member functions)</li>
                <li>• <strong>Identity:</strong> Each object has a unique identity even if attributes are same</li>
                <li>• <strong>Responsibility:</strong> Objects are responsible for specific tasks</li>
              </ul>
            </div>
          </section>

          {/* Core Principles */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              The Four Pillars of OOP
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  1. Encapsulation
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Encapsulation is the practice of keeping data and methods that operate on that data within one unit (class). 
                  It's the mechanism of hiding data implementation by restricting access to public methods. 
                  Instance variables are kept private and accessor methods are made public to achieve encapsulation.
                </p>
                
                <div className={`grid md:grid-cols-2 gap-4 mb-4`}>
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-green-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      Advantages:
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Data hiding and security</li>
                      <li>• Increased flexibility</li>
                      <li>• Easy to maintain</li>
                      <li>• Code reusability</li>
                    </ul>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-blue-50"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      Implementation:
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Private data members</li>
                      <li>• Public getter/setter methods</li>
                      <li>• Access modifiers</li>
                      <li>• Data validation in methods</li>
                    </ul>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Real-world Example:</strong> A bank account class that keeps the balance private and only allows access through deposit() and withdraw() methods. 
                    The internal implementation of how balance is stored and calculated is hidden from the user.
                  </p>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  2. Inheritance
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Inheritance is the mechanism where one class (child/derived class) acquires the properties and methods 
                  of another class (parent/base class). It represents the IS-A relationship between classes and promotes code reusability.
                </p>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      Types of Inheritance:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Single Inheritance:</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>One child class inherits from one parent class</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Multiple Inheritance:</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>One child class inherits from multiple parent classes</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Multilevel Inheritance:</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Child class inherits from parent, which inherits from grandparent</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Hierarchical Inheritance:</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Multiple child classes inherit from one parent class</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <strong>Example:</strong> Vehicle (parent) → Car (child). Car inherits properties like speed, fuel from Vehicle, 
                      while adding car-specific features like number of doors, air conditioning.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  3. Abstraction
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Abstraction means hiding complex implementation details while showing only the essential features. 
                  It focuses on what an object does rather than how it does it. Abstraction can be achieved through 
                  abstract classes and interfaces.
                </p>

                <div className="space-y-4">
                  <div className={`grid md:grid-cols-2 gap-4`}>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                        Abstract Classes:
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Cannot be instantiated</li>
                        <li>• Can have abstract and concrete methods</li>
                        <li>• Used as base classes</li>
                        <li>• Provide partial implementation</li>
                      </ul>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                        Interfaces:
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Pure abstraction</li>
                        <li>• Only method signatures</li>
                        <li>• Multiple inheritance support</li>
                        <li>• Contract for implementation</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <strong>Example:</strong> TV remote control - you press buttons (interface) without knowing the internal 
                      electronics (implementation). Shape abstract class defining draw() method implemented differently by Circle, Rectangle, Triangle.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  4. Polymorphism
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Polymorphism allows objects of different classes to be treated as objects of a common base class. 
                  The same interface can be used for different underlying data types. It enables a single interface 
                  to represent different types of objects.
                </p>

                <div className="space-y-4">
                  <div className={`grid md:grid-cols-2 gap-4`}>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                        Compile-time Polymorphism:
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Method Overloading</li>
                        <li>• Operator Overloading</li>
                        <li>• Resolved at compile time</li>
                        <li>• Static binding</li>
                      </ul>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                        Runtime Polymorphism:
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Method Overriding</li>
                        <li>• Virtual functions</li>
                        <li>• Resolved at runtime</li>
                        <li>• Dynamic binding</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <strong>Example:</strong> Animal class with makeSound() method. Dog class overrides it to bark(), 
                      Cat class overrides it to meow(), Bird class overrides it to chirp(). Same method name, different behaviors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Classes and Objects */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Classes and Objects in Detail
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Class Definition and Structure
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  A class is a blueprint or template for creating objects. It defines properties (attributes) and methods (functions) 
                  that the objects will have. Think of it as a cookie cutter - it defines the shape, but doesn't create the actual cookie.
                </p>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                  <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Class Components:
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>1. Access Modifiers:</p>
                      <ul className={`text-sm ml-4 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• <strong>Public:</strong> Accessible from anywhere</li>
                        <li>• <strong>Private:</strong> Accessible only within the same class</li>
                        <li>• <strong>Protected:</strong> Accessible within class and its subclasses</li>
                      </ul>
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>2. Data Members:</p>
                      <ul className={`text-sm ml-4 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Instance variables (unique to each object)</li>
                        <li>• Static/Class variables (shared by all objects)</li>
                      </ul>
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>3. Member Functions:</p>
                      <ul className={`text-sm ml-4 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>• Constructors (initialize objects)</li>
                        <li>• Destructors (cleanup when object is destroyed)</li>
                        <li>• Regular methods (define behavior)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Object Creation and Lifecycle
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  An object is an instance of a class. It's the actual "thing" created from the class blueprint. 
                  If a class is a house plan, then objects are the actual houses built from that plan.
                </p>
                
                <div className={`grid md:grid-cols-2 gap-4`}>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      Object Creation Steps:
                    </h4>
                    <ol className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>1. Memory allocation</li>
                      <li>2. Constructor execution</li>
                      <li>3. Object initialization</li>
                      <li>4. Reference assignment</li>
                    </ol>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                      Object Destruction:
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Destructor called</li>
                      <li>• Memory deallocation</li>
                      <li>• Resource cleanup</li>
                      <li>• Reference removal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Constructors and Destructors */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Constructors and Destructors
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Constructors
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  A constructor is a special method that is automatically called when an object is created. 
                  It initializes the object's data members and sets up the object's initial state.
                </p>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      Types of Constructors:
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Default Constructor:</p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No parameters, provides default values</p>
                      </div>
                      <div>
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Parameterized Constructor:</p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Takes parameters to initialize with specific values</p>
                      </div>
                      <div>
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Copy Constructor:</p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Creates object by copying another object</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      Constructor Rules:
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Same name as the class</li>
                      <li>• No return type (not even void)</li>
                      <li>• Automatically called during object creation</li>
                      <li>• Can be overloaded</li>
                      <li>• Cannot be inherited</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  Destructors
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  A destructor is a special method that is automatically called when an object is destroyed or goes out of scope. 
                  It performs cleanup operations and deallocates resources used by the object.
                </p>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                    Destructor Characteristics:
                  </h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>• Same name as class but preceded by tilde (~)</li>
                    <li>• No parameters and no return type</li>
                    <li>• Only one destructor per class</li>
                    <li>• Automatically called when object is destroyed</li>
                    <li>• Used for cleanup (memory, file handles, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Method Overloading and Overriding */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Method Overloading vs Method Overriding
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Method Overloading
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Multiple methods with the same name but different parameters in the same class.
                </p>
                
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>Characteristics:</h4>
                <ul className={`text-sm space-y-1 mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Same method name</li>
                  <li>• Different parameter list</li>
                  <li>• Compile-time polymorphism</li>
                  <li>• Within same class</li>
                  <li>• Static binding</li>
                </ul>
                
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>Example:</h4>
                <div className={`text-xs p-3 rounded ${isDarkMode ? "bg-gray-900" : "bg-white"} ${isDarkMode ? "text-green-300" : "text-gray-800"}`}>
                  <code>
                    add(int a, int b)<br/>
                    add(float a, float b)<br/>
                    add(int a, int b, int c)
                  </code>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Method Overriding
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Child class provides specific implementation of method already defined in parent class.
                </p>
                
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-300" : "text-green-500"}`}>Characteristics:</h4>
                <ul className={`text-sm space-y-1 mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Same method signature</li>
                  <li>• Parent-child relationship</li>
                  <li>• Runtime polymorphism</li>
                  <li>• Different classes</li>
                  <li>• Dynamic binding</li>
                </ul>
                
                <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-300" : "text-green-500"}`}>Example:</h4>
                <div className={`text-xs p-3 rounded ${isDarkMode ? "bg-gray-900" : "bg-white"} ${isDarkMode ? "text-green-300" : "text-gray-800"}`}>
                  <code>
                    Animal: makeSound()<br/>
                    Dog: makeSound() // bark<br/>
                    Cat: makeSound() // meow
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Comprehensive Benefits of OOP
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Development Benefits:
                </h3>
                <ul className="space-y-2">
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Code Reusability:</strong> Write once, use many times through inheritance and composition</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Modularity:</strong> Code is organized into separate, interchangeable components</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Easier Maintenance:</strong> Changes in one part don't affect the entire system</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Scalability:</strong> Easy to add new features without disrupting existing code</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Security & Quality Benefits:
                </h3>
                <ul className="space-y-2">
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Data Security:</strong> Encapsulation protects data from unauthorized access</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Problem Solving:</strong> Complex problems broken into manageable objects</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Code Quality:</strong> Better organization leads to fewer bugs and cleaner code</span>
                  </li>
                  <li className={`flex items-start gap-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></span>
                    <span><strong>Team Collaboration:</strong> Multiple developers can work on different classes simultaneously</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? "bg-gray-800" : "bg-green-50"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                Why OOP is Industry Standard:
              </h4>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                OOP principles align with how humans naturally think about problems, making code more intuitive. 
                Large software projects become manageable when broken down into objects that mirror real-world entities 
                and their interactions.
              </p>
            </div>
          </section>

          {/* Design Patterns */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Common OOP Design Patterns
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Singleton Pattern
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Ensures a class has only one instance and provides global access to it. 
                    Useful for database connections, logging, caching.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    Factory Pattern
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Creates objects without specifying exact classes. Useful when you need to create 
                    different types of objects based on conditions.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                    Observer Pattern
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    One object notifies multiple dependent objects of state changes. 
                    Common in event handling and model-view architectures.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                    Strategy Pattern
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Defines a family of algorithms and makes them interchangeable. 
                    Allows switching between different algorithms at runtime.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                    Decorator Pattern
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Adds new functionality to objects without altering their structure. 
                    Useful for extending functionality dynamically.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SOLID Principles */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              SOLID Principles of OOP
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  S - Single Responsibility Principle
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  A class should have only one reason to change. Each class should have a single, well-defined responsibility.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  O - Open/Closed Principle
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Classes should be open for extension but closed for modification. You should be able to extend behavior without changing existing code.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  L - Liskov Substitution Principle
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Objects of a superclass should be replaceable with objects of its subclasses without breaking functionality.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  I - Interface Segregation Principle
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Clients should not be forced to depend on interfaces they don't use. Create specific, focused interfaces.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  D - Dependency Inversion Principle
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  High-level modules should not depend on low-level modules. Both should depend on abstractions.
                </p>
              </div>
            </div>
          </section>

          {/* Real-world Examples */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Comprehensive Real-World Applications
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Banking System
                  </h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Complex financial system with multiple account types and transaction processing.
                  </p>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p><strong>Classes:</strong> Account (base), SavingsAccount, CheckingAccount, Customer, Transaction</p>
                    <p><strong>Concepts:</strong> Inheritance (account types), Encapsulation (balance protection), Polymorphism (different interest calculations)</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    E-commerce Platform
                  </h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Online shopping system with products, customers, orders, and payment processing.
                  </p>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p><strong>Classes:</strong> Product, Electronics, Clothing, Cart, Order, Customer, Payment</p>
                    <p><strong>Concepts:</strong> Inheritance (product categories), Abstraction (payment interface), Encapsulation (customer data)</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                    Game Development
                  </h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Video game with characters, weapons, levels, and game mechanics.
                  </p>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p><strong>Classes:</strong> Character, Player, Enemy, NPC, Weapon, Level, GameObject</p>
                    <p><strong>Concepts:</strong> Polymorphism (different character abilities), Inheritance (character types), Composition (character has weapons)</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                    Social Media Platform
                  </h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Social networking application with users, posts, comments, and messaging.
                  </p>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p><strong>Classes:</strong> User, Post, Comment, Message, Timeline, Notification</p>
                    <p><strong>Concepts:</strong> Encapsulation (private messages), Inheritance (different user types), Observer pattern (notifications)</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-yellow-50 border-yellow-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                    Healthcare System
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Patient management with appointments, medical records, doctors, and treatments.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-pink-50 border-pink-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
                    Inventory Management
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Warehouse system with products, suppliers, orders, and stock tracking.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-indigo-50 border-indigo-200"}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    Educational Platform
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Learning management system with courses, students, teachers, and assessments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Concepts */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Advanced OOP Concepts
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    Composition vs Inheritance
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>Composition (HAS-A):</h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Objects contain other objects as parts. More flexible than inheritance.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}>Inheritance (IS-A):</h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Classes inherit from other classes. Creates hierarchical relationships.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    Association vs Aggregation
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-green-300" : "text-green-500"}`}>Association:</h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Loose relationship between objects. Both can exist independently.
                      </p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-green-300" : "text-green-500"}`}>Aggregation:</h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        "Whole-part" relationship where parts can exist without the whole.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Static vs Instance Members
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? "text-purple-300" : "text-purple-500"}`}>Static Members:</h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Belong to class, not instances</li>
                      <li>• Shared by all objects</li>
                      <li>• Accessed using class name</li>
                      <li>• Memory allocated once</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? "text-purple-300" : "text-purple-500"}`}>Instance Members:</h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <li>• Belong to specific object</li>
                      <li>• Unique for each instance</li>
                      <li>• Accessed using object reference</li>
                      <li>• Memory allocated per object</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Programming Languages and OOP */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              OOP in Different Programming Languages
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Java
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Pure OOP language</li>
                  <li>• Single inheritance</li>
                  <li>• Interface support</li>
                  <li>• Automatic memory management</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  C++
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Hybrid language</li>
                  <li>• Multiple inheritance</li>
                  <li>• Operator overloading</li>
                  <li>• Manual memory management</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  Python
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Dynamic typing</li>
                  <li>• Multiple inheritance</li>
                  <li>• Duck typing</li>
                  <li>• Flexible syntax</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  C#
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• .NET framework</li>
                  <li>• Properties and events</li>
                  <li>• Generics support</li>
                  <li>• Garbage collection</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  JavaScript
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Prototype-based OOP</li>
                  <li>• ES6 class syntax</li>
                  <li>• Dynamic nature</li>
                  <li>• Functional programming mix</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-yellow-50 border-yellow-200"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                  Ruby
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Everything is an object</li>
                  <li>• Single inheritance + mixins</li>
                  <li>• Metaprogramming</li>
                  <li>• Dynamic features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Key Takeaways
            </h2>
            <p className={`text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Object-Oriented Programming is a powerful paradigm that helps organize code in a way that's intuitive, 
              maintainable, and scalable. By understanding the four pillars of OOP - encapsulation, inheritance, 
              abstraction, and polymorphism - you can write better, more efficient code that's easier to understand and modify.
            </p>
            <p className={`text-base leading-relaxed mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Remember, OOP is not just about syntax and keywords - it's about thinking in terms of objects and their 
              interactions, modeling real-world problems in a way that makes sense both to humans and computers.
            </p>
          </section>

        </article>
      </div>
    </div>
  )
}

export default OOPArticle
