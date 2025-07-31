// SEO Component for Page-specific optimizations
import React from 'react';
import useSEO from '../../hooks/useSEO';
import { SEO_CONFIG, PAGE_SEO } from '../../config/seoConfig';

const SEO = ({ 
  page = 'home',
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  customStructuredData = null,
  additionalMeta = {}
}) => {
  // Get page-specific SEO configuration
  const pageConfig = PAGE_SEO[page] || PAGE_SEO.home;
  
  // Construct full URL
  const currentUrl = url || `${SEO_CONFIG.siteUrl}${window.location.pathname}`;
  
  // Use provided values or fall back to page config or defaults
  const seoTitle = title || pageConfig.title || SEO_CONFIG.defaultTitle;
  const seoDescription = description || pageConfig.description || SEO_CONFIG.defaultDescription;
  const seoKeywords = keywords || pageConfig.keywords || SEO_CONFIG.defaultKeywords;
  const seoImage = image || SEO_CONFIG.defaultImage;
  const structuredData = customStructuredData || pageConfig.structuredData;

  // Apply SEO
  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    image: seoImage,
    url: currentUrl,
    type,
    author: SEO_CONFIG.author,
    siteName: SEO_CONFIG.siteName,
    structuredData,
    ...additionalMeta
  });

  // This component doesn't render anything
  return null;
};

export default SEO;
