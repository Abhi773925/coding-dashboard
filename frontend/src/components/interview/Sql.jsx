"use client"
import { useState } from "react"
import {
  Database,
  Code,
  Type,
  List,
  Key,
  Lock,
  Filter,
  Calculator,
  FunctionSquare,
  GitMerge,
  Combine,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  Zap,
  Layers,
  Box,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const sqlData = {
  Database: {
    Definition:
      "A database is an organized collection of structured information or data, typically stored electronically in a computer system.",
    Purpose: "To efficiently store, retrieve, and manage data.",
    DBMS: {
      Definition: "Database Management System is software that uses a standard method to store and organize data.",
      Types: {
        Relational: "Stores data in tables with rows and columns. Uses SQL for operations.",
        "Non-relational (NoSQL)":
          "Stores data in formats like key-value, document, graph, or column. Suitable for big data and real-time web apps.",
      },
    },
  },
  SQL: {
    "Full Form": "Structured Query Language",
    Definition:
      "A domain-specific language used in programming and designed for managing data held in a relational database management system (RDBMS).",
    Features: [
      "Enables users to create, read, update, and delete data.",
      "Allows creation and modification of database structures.",
      "Supports user access controls and transaction management.",
    ],
    "CRUD Operations": {
      Create: "Adds new records or structures (tables/databases).",
      Read: "Retrieves data from one or more tables.",
      Update: "Modifies existing records.",
      Delete: "Removes records from tables.",
    },
  },
  DataTypes: {
    "Integer Types": {
      TINYINT: {
        Signed: "-128 to 127",
        Unsigned: "0 to 255",
      },
      SMALLINT: {
        Signed: "-32,768 to 32,767",
        Unsigned: "0 to 65,535",
      },
      INT: {
        Signed: "-2,147,483,648 to 2,147,483,647",
        Unsigned: "0 to 4,294,967,295",
      },
    },
    "Floating Types": ["FLOAT", "DOUBLE"],
    "Date & Time Types": ["DATE", "TIME", "DATETIME", "TIMESTAMP"],
    "String Types": ["CHAR", "VARCHAR", "TEXT"],
  },
  SQL_Commands: {
    "DDL (Data Definition Language)": ["CREATE", "ALTER", "RENAME", "TRUNCATE", "DROP"],
    "DML (Data Manipulation Language)": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "DCL (Data Control Language)": ["GRANT", "REVOKE"],
    "DQL (Data Query Language)": ["SELECT"],
    "TCL (Transaction Control Language)": ["START TRANSACTION", "COMMIT", "ROLLBACK"],
  },
  Database_Queries: {
    CREATE: "Creates a new database.",
    DROP: "Deletes an existing database.",
    "SHOW DATABASES": "Lists all databases on the server.",
    "IF NOT EXISTS": "Conditionally create a database only if it doesn't exist.",
  },
  Table_Queries: {
    Create: "CREATE TABLE table_name (column_name datatype constraint, ...);",
    Insert: "INSERT INTO table_name (col1, col2) VALUES (val1, val2);",
    Select: "SELECT * FROM table_name;",
    Update: "UPDATE table_name SET col1 = val1 WHERE condition;",
    Delete: "DELETE FROM table_name WHERE condition;",
    Alter: {
      "Add Column": "ALTER TABLE table_name ADD COLUMN column_name datatype constraint;",
      "Drop Column": "ALTER TABLE table_name DROP COLUMN column_name;",
      "Rename Table": "ALTER TABLE table_name RENAME TO new_table_name;",
      "Modify Column": "ALTER TABLE table_name MODIFY col_name datatype constraint;",
      "Change Column": "ALTER TABLE table_name CHANGE COLUMN old_name new_name datatype constraint;",
    },
    Truncate: "TRUNCATE TABLE table_name; (Deletes all data quickly without logging individual row deletions)",
  },
  Keys: {
    "Primary Key": "A column or group of columns that uniquely identify a row in a table. Must be unique and NOT NULL.",
    "Foreign Key": "A column or group of columns in one table that refers to the PRIMARY KEY in another table.",
    Cascading: {
      "ON DELETE CASCADE": "Deletes dependent records when the referenced record is deleted.",
      "ON UPDATE CASCADE": "Updates dependent records when the referenced key is changed.",
    },
  },
  Constraints: {
    "NOT NULL": "Column cannot contain NULL values.",
    UNIQUE: "All values in column must be different.",
    "PRIMARY KEY": "Combines NOT NULL and UNIQUE.",
    "FOREIGN KEY": "Ensures referential integrity between tables.",
    DEFAULT: "Provides default value if none specified.",
    CHECK: "Validates values against condition.",
  },
  Clauses: {
    WHERE: "Filters records that satisfy the condition.",
    LIMIT: "Restricts the number of rows returned.",
    "ORDER BY": "Sorts data in ASC or DESC order based on column(s).",
    "GROUP BY": "Groups rows with same values.",
    HAVING: "Applies filter condition after GROUP BY.",
  },
  Operators: {
    Arithmetic: ["+ (Addition)", "- (Subtraction)", "* (Multiplication)", "/ (Division)", "% (Modulus)"],
    Comparison: [
      "= (Equals)",
      "!= (Not Equal)",
      "> (Greater Than)",
      ">= (Greater Than or Equal To)",
      "< (Less Than)",
      "<= (Less Than or Equal To)",
    ],
    Logical: ["AND", "OR", "NOT", "IN", "BETWEEN", "LIKE", "ANY", "ALL"],
    Bitwise: ["& (AND)", "| (OR)"],
  },
  Aggregate_Functions: {
    "COUNT()": "Returns the number of records.",
    "MAX()": "Returns the highest value.",
    "MIN()": "Returns the lowest value.",
    "SUM()": "Returns the total sum.",
    "AVG()": "Returns the average value.",
  },
  Joins: {
    "Inner Join": "Returns rows where there is a match in both tables.",
    "Left Join": "Returns all records from left table and matched ones from right.",
    "Right Join": "Returns all records from right table and matched ones from left.",
    "Full Join": "Returns records when there is a match in either table.",
    "Self Join": "Joins a table to itself.",
  },
  Union: {
    Definition: "Combines result sets of two or more SELECT queries, removing duplicates.",
    Rules: [
      "Each SELECT must return the same number of columns.",
      "Columns must have the same data types.",
      "Columns must be in the same order.",
    ],
  },
  Subqueries: {
    Definition: "A query nested inside another query.",
    Uses: ["Used with WHERE to filter based on another query.", "Can be used in SELECT, FROM, or WHERE clauses."],
    Examples: [
      "Find students scoring above average.",
      "Find students from specific city.",
      "Nested queries to retrieve conditional data.",
    ],
  },
  Views: {
    Definition: "A virtual table that provides a way to look at data from one or more tables.",
    Advantages: [
      "Simplifies complex queries.",
      "Provides data abstraction.",
      "Ensures data security by exposing only selected columns.",
    ],
  },
}

const Sql = () => {
  const { isDarkMode } = useTheme()
  const [openAccordion, setOpenAccordion] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key)
  }

  const categoryColors = {
    Database: "from-blue-500 to-cyan-500",
    SQL: "from-purple-500 to-pink-500",
    DataTypes: "from-green-500 to-emerald-500",
    SQL_Commands: "from-orange-500 to-red-500",
    Database_Queries: "from-indigo-500 to-purple-500",
    Table_Queries: "from-teal-500 to-blue-500",
    Keys: "from-yellow-500 to-orange-500",
    Constraints: "from-red-500 to-pink-500",
    Clauses: "from-cyan-500 to-blue-500",
    Operators: "from-violet-500 to-purple-500",
    Aggregate_Functions: "from-emerald-500 to-teal-500",
    Joins: "from-rose-500 to-orange-500",
    Union: "from-blue-500 to-indigo-500",
    Subqueries: "from-pink-500 to-rose-500",
    Views: "from-lime-500 to-green-500",
  }

  const iconMap = {
    Database: Database,
    SQL: Code,
    DataTypes: Type,
    SQL_Commands: List,
    Database_Queries: Search,
    Table_Queries: Layers,
    Keys: Key,
    Constraints: Lock,
    Clauses: Filter,
    Operators: Calculator,
    Aggregate_Functions: FunctionSquare,
    Joins: GitMerge,
    Union: Combine,
    Subqueries: Box,
    Views: Eye,
  }

  const renderSection = (title, content, key) => {
    const Icon = iconMap[key]
    const gradient = categoryColors[key]
    const isSelected = selectedCategory === key
    return (
      <div
        className={`group relative overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
          isSelected ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white" : ""
        }`}
        onClick={() => setSelectedCategory(isSelected ? null : key)}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-2 h-2 bg-gradient-to-br ${gradient} rounded-full opacity-30 animate-pulse`}
            style={{ top: "10%", left: "20%" }}
          />
          <div
            className={`absolute w-1 h-1 bg-gradient-to-br ${gradient} rounded-full opacity-50 animate-ping`}
            style={{ top: "70%", right: "30%", animationDelay: "1s" }}
          />
          <div
            className={`absolute w-1.5 h-1.5 bg-gradient-to-br ${gradient} rounded-full opacity-40 animate-pulse`}
            style={{ bottom: "20%", left: "10%", animationDelay: "2s" }}
          />
        </div>
        <div
          className={`relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
            isDarkMode
              ? "bg-zinc-900/80 border-gray-700/50 hover:bg-zinc-900"
              : "bg-white/80 border-gray-200/50 hover:bg-white/90"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-slate-300 shadow-lg`}>
                <Icon size={20} />
              </div>
              <h3 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {title.replace(/_/g, " ")}
              </h3>
            </div>
            <div className={`transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`}>
              <ChevronDown size={20} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
            </div>
          </div>
          {/* Content */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              isSelected ? "max-h-96 opacity-100" : "max-h-16 opacity-60"
            }`}
          >
            <div className="space-y-3">
              {typeof content === "string" && (
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{content}</p>
              )}
              {Array.isArray(content) && (
                <div className="space-y-2">
                  {content.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                        isDarkMode ? "hover:bg-zinc-900/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient} mt-2 flex-shrink-0`} />
                      <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {typeof content === "object" && !Array.isArray(content) && (
                <div className="space-y-2">
                  {Object.entries(content).map(([key, value]) => (
                    <div
                      key={key}
                      className={`border rounded-lg overflow-hidden ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleAccordion(`${title}-${key}`)
                        }}
                        className={`w-full text-left p-3 flex items-center justify-between transition-all ${
                          isDarkMode ? "hover:bg-zinc-900/50 text-gray-200" : "hover:bg-gray-50 text-gray-800"
                        }`}
                      >
                        <span className="font-medium">{key}</span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            openAccordion === `${title}-${key}` ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {openAccordion === `${title}-${key}` && (
                        <div
                          className={`p-4 border-t ${
                            isDarkMode
                              ? "bg-zinc-900/50 border-gray-700 text-gray-300"
                              : "bg-gray-50/50 border-gray-200 text-gray-700"
                          }`}
                        >
                          {typeof value === "string" && <p className="text-sm leading-relaxed">{value}</p>}
                          {Array.isArray(value) && (
                            <div className="space-y-1">
                              {value.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <Zap size={12} className={`text-gradient-to-br ${gradient} mt-1 flex-shrink-0`} />
                                  <span className="text-sm">{item}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {typeof value === "object" && !Array.isArray(value) && (
                            <div className="space-y-3">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey} className="space-y-2">
                                  <h4
                                    className={`font-semibold text-sm ${
                                      isDarkMode ? "text-gray-100" : "text-gray-800"
                                    }`}
                                  >
                                    {subKey}:
                                  </h4>
                                  <div className="ml-4 space-y-1">
                                    {typeof subValue === "string" && <p className="text-sm">{subValue}</p>}
                                    {Array.isArray(subValue) && (
                                      <div className="space-y-1">
                                        {subValue.map((item, idx) => (
                                          <div key={idx} className="flex items-start gap-2">
                                            <div
                                              className={`w-1 h-1 rounded-full bg-gradient-to-br ${gradient} mt-2 flex-shrink-0`}
                                            />
                                            <span className="text-sm">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {typeof subValue === "object" && !Array.isArray(subValue) && (
                                      <div className="space-y-1">
                                        {Object.entries(subValue).map(([deepKey, deepValue]) => (
                                          <div key={deepKey} className="flex items-start gap-2">
                                            <span className="font-medium text-sm">{deepKey}:</span>
                                            <span className="text-sm">
                                              {typeof deepValue === "string" ? deepValue : JSON.stringify(deepValue)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isDarkMode
          ? "bg-zinc-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
      // style={{
      //   backgroundImage: `
      //     radial-gradient(circle at 25% 25%, ${isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"} 0%, transparent 50%),
      //     radial-gradient(circle at 75% 75%, ${isDarkMode ? "rgba(168, 85, 247, 0.1)" : "rgba(168, 85, 247, 0.05)"} 0%, transparent 50%),
      //     ${
      //       isDarkMode
      //         ? `repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 20px)`
      //         : `repeating-linear-gradient(0deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)`
      //     },
      //     ${
      //       isDarkMode
      //         ? `repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 20px)`
      //         : `repeating-linear-gradient(90deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px)`
      //     }
      //   `,
      //   backgroundSize: "cover, cover, 20px 20px, 20px 20px",
      //   backgroundRepeat: "no-repeat, no-repeat, repeat, repeat",
      //   backgroundPosition: "0 0, 0 0, 0 0, 0 0",
      // }}
    >
      {/* Header */}
      <div className={`relative z-10 pt-20 pb-12 ${
            isDarkMode
              ? "bg-zinc-900"
              : "bg-white/80"
          } `}>
        <div className="text-center">
          <h1
            className={`text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse`}
          >
            SQL UNIVERSE
          </h1>
          <p className={`text-xl md:text-2xl font-light ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Master the Language of Data
          </p>
          <div className="mt-8 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(sqlData).map(([key, value]) => renderSection(key, value, key))}
        </div>
      </div>
      {/* Footer */}
      <div className="relative z-10 mt-20 pb-10 text-center">
        <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          Click on any section to explore its contents
        </div>
      </div>
    </div>
  )
}

export default Sql
