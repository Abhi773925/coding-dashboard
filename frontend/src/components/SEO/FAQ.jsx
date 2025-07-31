import React, { useEffect } from 'react';
import { SEO_CONFIG } from '../../config/seoConfig';

/**
 * FAQ Component that renders a FAQ section with structured data for rich results in search
 * This component follows the FAQPage schema from schema.org
 * @param {Object} props - Component props
 * @param {Array} props.questions - Array of question/answer objects
 * @param {string} props.title - Optional title for the FAQ section
 * @param {string} props.className - Optional className for styling
 */
const FAQ = ({ questions, title = "Frequently Asked Questions", className = "" }) => {
  useEffect(() => {
    // Generate and insert FAQ structured data
    if (questions && questions.length > 0) {
      const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      };

      // Add publisher info to enhance trust signals
      faqStructuredData.publisher = {
        "@type": "Organization",
        "name": SEO_CONFIG.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${SEO_CONFIG.siteUrl}/images/prepmate-logo.svg`
        }
      };

      // Find or create JSON-LD script tag for FAQ
      let scriptTag = document.querySelector('script[data-type="faq-schema"]');
      if (scriptTag) {
        scriptTag.textContent = JSON.stringify(faqStructuredData);
      } else {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(faqStructuredData);
        scriptTag.setAttribute('data-type', 'faq-schema');
        document.head.appendChild(scriptTag);
      }
    }

    // Clean up function
    return () => {
      const scriptTag = document.querySelector('script[data-type="faq-schema"]');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [questions]);

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <section className={`faq-section my-12 ${className}`}>
      <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
      <div className="max-w-3xl mx-auto">
        {questions.map((q, index) => (
          <div key={index} className="mb-6 p-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
            <div className="text-gray-700 dark:text-gray-300" 
                 dangerouslySetInnerHTML={{ __html: q.answer }} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
