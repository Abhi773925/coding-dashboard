import React, { useState } from "react";
import { Check, AlertCircle, Star, Zap, ArrowRight } from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [compareMode, setCompareMode] = useState(false);
  
  // Theme colors
  const theme = {
    gradientBg: "from-violet-600 to-fuchsia-600",
    gradientText: "from-violet-400 to-fuchsia-400",
    accentBg: "bg-violet-600",
    accentText: "text-violet-500",
    accentBorder: "border-violet-600",
    accentShadow: "shadow-purple-900/20",
  };

  // Calculate discounted prices for annual plans
  const getPrice = (monthlyPrice, cycle) => {
    if (cycle === "monthly") return monthlyPrice;
    // 20% discount for yearly
    const yearlyPrice = (monthlyPrice * 12 * 0.8).toFixed(0);
    return yearlyPrice / 12;
  };

  // Pricing data for plans
  const pricingPlans = [
    {
      name: "Free",
      description: "For hobbyists and personal projects",
      monthlyPrice: 0,
      features: [
        "5 projects",
        "Basic analytics",
        "1 GB storage",
        "Community support",
        "Limited API access"
      ],
      badge: null,
      buttonText: "Get Started",
      buttonVariant: "outline"
    },
    {
      name: "Pro",
      description: "For professionals and small teams",
      monthlyPrice: 15,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "10 GB storage",
        "Priority support",
        "Full API access",
        "Custom reporting",
        "Team collaboration (up to 5)"
      ],
      badge: "Most Popular",
      buttonText: "Start Free Trial",
      buttonVariant: "primary"
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      monthlyPrice: 49,
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Dedicated support",
        "Custom integrations",
        "SSO & advanced security",
        "Unlimited team members",
        "SLA guarantees",
        "Onboarding assistance"
      ],
      badge: null,
      buttonText: "Contact Sales",
      buttonVariant: "secondary"
    }
  ];

  // Features coming soon
  const comingSoonFeatures = [
    {
      name: "AI-Powered Analytics",
      description: "Advanced data insights with our upcoming ML models",
      badge: "Coming April 2025",
      icon: <Zap className="h-6 w-6" />
    },
    {
      name: "Team Collaboration Suite",
      description: "Enhanced team workspaces with real-time collaboration",
      badge: "Coming May 2025",
      icon: <Star className="h-6 w-6" />
    },
    {
      name: "White-Label Solutions",
      description: "Fully customizable branding for Enterprise customers",
      badge: "Coming Q2 2025",
      icon: <ArrowRight className="h-6 w-6" />
    }
  ];

  return (
    <div className="bg-[#090e1a]  min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent mb-6`}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900 p-1 rounded-lg mb-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? `${theme.accentBg} text-white`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center ${
                billingCycle === "annual"
                  ? `${theme.accentBg} text-white`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual
              <span className="ml-1 text-xs bg-emerald-500 text-black px-1.5 py-0.5 rounded-full font-medium">
                20% OFF
              </span>
            </button>
          </div>
          
          {/* Compare Features Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="text-sm text-gray-400 underline hover:text-white transition-colors"
          >
            {compareMode ? "Hide comparison" : "Compare all features"}
          </button>
        </div>
        
        {/* Main Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`bg-gray-900 border ${
                plan.badge ? theme.accentBorder : "border-gray-800"
              } rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                plan.badge ? `${theme.accentShadow} hover:-translate-y-1` : ""
              } relative`}
            >
              {/* Badge if exists */}
              {plan.badge && (
                <div className="absolute -right-10 top-5 rotate-45">
                  <div className={`${theme.accentBg} px-10 py-1 text-xs text-white font-medium shadow-sm`}>
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end mb-6">
                  <span className="text-white text-4xl font-bold">
                    ${getPrice(plan.monthlyPrice, billingCycle)}
                  </span>
                  <span className="text-gray-400 ml-2 mb-1">
                    /month
                  </span>
                </div>
                
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-300">
                      <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    plan.buttonVariant === "primary"
                      ? `bg-gradient-to-r ${theme.gradientBg} text-white hover:opacity-90`
                      : plan.buttonVariant === "outline"
                      ? "bg-transparent border border-gray-700 text-white hover:bg-gray-800"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Comparison Table - Visible when compareMode is true */}
        {compareMode && (
          <div className="max-w-6xl mx-auto mb-16 overflow-x-auto">
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-4 px-6 text-left text-gray-400 font-normal">Features</th>
                    {pricingPlans.map(plan => (
                      <th key={plan.name} className="py-4 px-6 text-center text-white font-medium">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-6 text-gray-400">Projects</td>
                    <td className="py-3 px-6 text-center text-gray-300">5</td>
                    <td className="py-3 px-6 text-center text-gray-300">Unlimited</td>
                    <td className="py-3 px-6 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-6 text-gray-400">Storage</td>
                    <td className="py-3 px-6 text-center text-gray-300">1 GB</td>
                    <td className="py-3 px-6 text-center text-gray-300">10 GB</td>
                    <td className="py-3 px-6 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-6 text-gray-400">Team Members</td>
                    <td className="py-3 px-6 text-center text-gray-300">1</td>
                    <td className="py-3 px-6 text-center text-gray-300">5</td>
                    <td className="py-3 px-6 text-center text-gray-300">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-6 text-gray-400">API Access</td>
                    <td className="py-3 px-6 text-center text-gray-300">Limited</td>
                    <td className="py-3 px-6 text-center text-gray-300">Full</td>
                    <td className="py-3 px-6 text-center text-gray-300">Custom</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 px-6 text-gray-400">Support</td>
                    <td className="py-3 px-6 text-center text-gray-300">Community</td>
                    <td className="py-3 px-6 text-center text-gray-300">Priority</td>
                    <td className="py-3 px-6 text-center text-gray-300">Dedicated</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-gray-400">SLA Guarantees</td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-gray-600">—</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-gray-600">—</span>
                    </td>
                    <td className="py-3 px-6 text-center text-gray-300">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Coming Soon Features */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Coming Soon</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {comingSoonFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                <div className={`w-12 h-12 ${theme.accentBg} bg-opacity-20 rounded-lg flex items-center justify-center mb-4`}>
                  <div className={`text-white`}>{feature.icon}</div>
                </div>
                
                <div className="flex items-center mb-3">
                  <h3 className="text-white font-medium mr-2">{feature.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-violet-300">
                    {feature.badge}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enterprise CTA */}
        <div className="max-w-4xl mx-auto mt-20 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-8 md:p-12 relative">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-radial from-violet-600 to-transparent"></div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-center">
              <div className="md:max-w-xl mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need a custom solution?</h2>
                <p className="text-gray-400">
                  Our team can help you with custom integrations, dedicated support, and tailored solutions for your specific needs.
                </p>
              </div>
              
              <button className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${theme.gradientBg} text-white hover:opacity-90 transition-opacity whitespace-nowrap`}>
               <a
  href="mailto:rockabhisheksingh778189@gmail.com"
  className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${theme.gradientBg} text-white hover:opacity-90 transition-opacity whitespace-nowrap`}
>
  Contact Our Sales Team
</a>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;