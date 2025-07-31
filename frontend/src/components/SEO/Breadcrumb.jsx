// Breadcrumb Component for SEO and Navigation
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { generateBreadcrumbStructuredData } from '../../config/seoConfig';
import useSEO from '../../hooks/useSEO';

const Breadcrumb = ({ items, className = '' }) => {
  const { isDarkMode } = useTheme();

  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://www.prepmate.site/' },
    ...items
  ]);

  // Apply breadcrumb structured data
  useSEO({
    structuredData: breadcrumbStructuredData
  });

  const allItems = [
    { name: 'Home', href: '/', icon: Home },
    ...items
  ];

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className={`w-4 h-4 mx-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              )}
              
              {isLast ? (
                <span 
                  className={`font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                  aria-current="page"
                >
                  {item.icon && index === 0 && (
                    <item.icon className="w-4 h-4 inline mr-1" />
                  )}
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.href}
                  className={`hover:underline transition-colors ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {item.icon && index === 0 && (
                    <item.icon className="w-4 h-4 inline mr-1" />
                  )}
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
