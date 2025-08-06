import React from "react"
import { useTheme } from "../context/ThemeContext"
import { BookOpen, Clock, User, Database } from "lucide-react"

const SQLArticle = () => {
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
            SQL and Database Management
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Complete Guide to SQL, Database Design, and DBMS Concepts
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>30 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comprehensive Guide</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-blue-500" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Database</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <article className={`prose prose-lg max-w-none ${
          isDarkMode ? "prose-invert" : ""
        }`}>
          
          {/* Introduction to SQL */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Introduction to SQL
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              SQL (Structured Query Language) is a standardized programming language used for managing and manipulating relational databases. 
              It's essential for data management, analysis, and application development.
            </p>

            <div className={`mt-6 p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                Key SQL Operations:
              </h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li>• DDL - Data Definition Language (CREATE, ALTER, DROP)</li>
                <li>• DML - Data Manipulation Language (SELECT, INSERT, UPDATE, DELETE)</li>
                <li>• DCL - Data Control Language (GRANT, REVOKE)</li>
                <li>• TCL - Transaction Control Language (COMMIT, ROLLBACK)</li>
              </ul>
            </div>
          </section>

          {/* Database Design */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Database Design Concepts
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Good database design is crucial for efficient data management and application performance. It involves 
              understanding relationships between data and organizing them effectively.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Entity Relationship Model
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Entities and Attributes</li>
                  <li>• Relationships (1:1, 1:N, M:N)</li>
                  <li>• Primary and Foreign Keys</li>
                  <li>• Cardinality and Participation</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Normalization Forms
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• First Normal Form (1NF)</li>
                  <li>• Second Normal Form (2NF)</li>
                  <li>• Third Normal Form (3NF)</li>
                  <li>• BCNF and beyond</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SQL Queries */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              SQL Query Types
            </h2>
            
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Basic Queries
                </h3>
                <div className="space-y-2">
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>SELECT:</strong> Retrieve data from tables
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>INSERT:</strong> Add new records to tables
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>UPDATE:</strong> Modify existing records
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>DELETE:</strong> Remove records from tables
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Advanced Queries
                </h3>
                <div className="space-y-2">
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>JOINS:</strong> Combine data from multiple tables
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>Subqueries:</strong> Nested queries within queries
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>Aggregations:</strong> GROUP BY, HAVING clauses
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>Window Functions:</strong> Advanced data analysis
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Database Management */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Database Management System (DBMS)
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                    ACID Properties
                  </h3>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>• Atomicity - All or nothing</li>
                    <li>• Consistency - Valid state transitions</li>
                    <li>• Isolation - Concurrent transaction handling</li>
                    <li>• Durability - Permanent changes</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"}`}>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                    Concurrency Control
                  </h3>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>• Locking mechanisms</li>
                    <li>• Transaction isolation levels</li>
                    <li>• Deadlock prevention</li>
                    <li>• Recovery management</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Database Security */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Database Security
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-red-50 border-red-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  Access Control
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• User authentication</li>
                  <li>• Role-based access</li>
                  <li>• Privileges management</li>
                  <li>• Security policies</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-yellow-50 border-yellow-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                  Data Protection
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Encryption at rest</li>
                  <li>• Encryption in transit</li>
                  <li>• Backup and recovery</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Database Performance */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Performance Optimization
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Query Optimization
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Indexing strategies</li>
                  <li>• Query execution plans</li>
                  <li>• Statistics and analysis</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-green-50 border-green-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Database Tuning
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Configuration optimization</li>
                  <li>• Memory management</li>
                  <li>• Disk I/O optimization</li>
                  <li>• Connection pooling</li>
                </ul>
              </div>
            </div>
          </section>

          {/* NoSQL and Modern Trends */}
          <section className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Modern Database Trends
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-purple-50 border-purple-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  NoSQL Databases
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Document stores (MongoDB)</li>
                  <li>• Key-value stores (Redis)</li>
                  <li>• Column-family stores (Cassandra)</li>
                  <li>• Graph databases (Neo4j)</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-indigo-50 border-indigo-200"}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  Modern Features
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <li>• Cloud databases</li>
                  <li>• Distributed systems</li>
                  <li>• Data warehousing</li>
                  <li>• Big data integration</li>
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
              Understanding SQL and database management is crucial for modern software development. From basic CRUD operations 
              to advanced optimization techniques, mastering these concepts enables you to build efficient, scalable, and 
              secure applications.
            </p>
          </section>

        </article>
      </div>
    </div>
  )
}

export default SQLArticle
