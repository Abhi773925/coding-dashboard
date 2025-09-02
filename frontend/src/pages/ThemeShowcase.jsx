import React, { useState } from 'react';
import { Palette, Moon, Sun, Code, Star, Trophy, Users } from 'lucide-react';

const ThemeShowcase = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen theme-page-bg theme-transition ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="theme-nav sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-[var(--color-primary)]" />
              <h1 className="text-2xl font-bold theme-text-primary">
                New Theme Showcase
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="theme-button-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 theme-slide-in">
          <h2 className="text-5xl font-bold theme-text-primary mb-6">
            <span className="theme-brand-gradient">Codeconnecto</span> Theme
          </h2>
          <p className="text-xl theme-text-secondary max-w-3xl mx-auto mb-8">
            An exact replica of codeconnecto.com's color scheme featuring 
            blue and purple gradients, glassmorphism effects, and modern dark theme.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="theme-button-primary px-8 py-3 rounded-lg font-semibold">
              Primary Button
            </button>
            <button className="theme-button-secondary px-8 py-3 rounded-lg font-semibold">
              Secondary Button
            </button>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold theme-text-primary mb-8 text-center">Color Palette</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="theme-card p-6">
              <div className="w-full h-20 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-primary)' }}></div>
              <h4 className="font-semibold theme-text-primary">Primary Blue</h4>
              <p className="theme-text-secondary text-sm">#3B82F6</p>
            </div>
            <div className="theme-card p-6">
              <div className="w-full h-20 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-accent)' }}></div>
              <h4 className="font-semibold theme-text-primary">Accent Purple</h4>
              <p className="theme-text-secondary text-sm">#8B5CF6</p>
            </div>
            <div className="theme-card p-6">
              <div className="w-full h-20 rounded-lg mb-4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
              <h4 className="font-semibold theme-text-primary">Background</h4>
              <p className="theme-text-secondary text-sm">Primary BG</p>
            </div>
            <div className="theme-card p-6">
              <div className="w-full h-20 rounded-lg mb-4" style={{ backgroundColor: 'var(--text-primary)' }}></div>
              <h4 className="font-semibold theme-text-primary">Text</h4>
              <p className="theme-text-secondary text-sm">Primary Text</p>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold theme-text-primary mb-8 text-center">Component Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="theme-card p-6 theme-hover-lift">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-[var(--color-primary)] mr-3" />
                <h4 className="text-xl font-semibold theme-text-primary">Coding Practice</h4>
              </div>
              <p className="theme-text-secondary mb-4">
                Solve challenging problems and improve your coding skills with our comprehensive platform.
              </p>
              <div className="flex justify-between items-center">
                <span className="difficulty-easy px-3 py-1 rounded-full text-xs font-semibold">Easy</span>
                <button className="theme-button-primary px-4 py-2 rounded text-sm">
                  Start Practice
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="theme-card p-6 theme-hover-lift">
              <div className="flex items-center mb-4">
                <Trophy className="w-8 h-8 text-[var(--color-accent)] mr-3" />
                <h4 className="text-xl font-semibold theme-text-primary">Contests</h4>
              </div>
              <p className="theme-text-secondary mb-4">
                Participate in coding contests and compete with programmers worldwide.
              </p>
              <div className="flex justify-between items-center">
                <span className="difficulty-medium px-3 py-1 rounded-full text-xs font-semibold">Medium</span>
                <button className="theme-button-secondary px-4 py-2 rounded text-sm">
                  View Contests
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="theme-card p-6 theme-hover-lift">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-[var(--geeksforgeeks-color)] mr-3" />
                <h4 className="text-xl font-semibold theme-text-primary">Community</h4>
              </div>
              <p className="theme-text-secondary mb-4">
                Connect with fellow developers, share knowledge, and grow together.
              </p>
              <div className="flex justify-between items-center">
                <span className="difficulty-hard px-3 py-1 rounded-full text-xs font-semibold">Hard</span>
                <button className="theme-button-primary px-4 py-2 rounded text-sm">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphism Demo */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold theme-text-primary mb-8 text-center">Glassmorphism Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="theme-glass p-8 rounded-xl">
              <h4 className="text-2xl font-bold theme-text-primary mb-4">Glass Effect Card</h4>
              <p className="theme-text-secondary mb-4">
                This card demonstrates the new glassmorphism effect with backdrop blur 
                and subtle transparency for a modern look.
              </p>
              <div className="flex space-x-2">
                <Star className="w-5 h-5 text-[var(--color-primary)]" />
                <Star className="w-5 h-5 text-[var(--color-primary)]" />
                <Star className="w-5 h-5 text-[var(--color-primary)]" />
                <Star className="w-5 h-5 text-[var(--color-primary)]" />
                <Star className="w-5 h-5 text-[var(--color-secondary)]" />
              </div>
            </div>
            <div className="theme-glass p-8 rounded-xl theme-gradient-shift">
              <h4 className="text-2xl font-bold text-slate-300 mb-4">Animated Gradient</h4>
              <p className="text-slate-300/90 mb-4">
                This card showcases the animated gradient background effect 
                that smoothly transitions between theme colors.
              </p>
              <button className="bg-white/20 text-slate-300 px-6 py-2 rounded-lg hover:bg-white/30 transition-all">
                Explore More
              </button>
            </div>
          </div>
        </section>

        {/* Platform Colors */}
        <section>
          <h3 className="text-3xl font-bold theme-text-primary mb-8 text-center">Platform Integration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="theme-card p-4 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 platform-leetcode flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <p className="font-semibold theme-text-primary">LeetCode</p>
            </div>
            <div className="theme-card p-4 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 platform-codeforces flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <p className="font-semibold theme-text-primary">Codeforces</p>
            </div>
            <div className="theme-card p-4 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 platform-github flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <p className="font-semibold theme-text-primary">GitHub</p>
            </div>
            <div className="theme-card p-4 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 platform-geeksforgeeks flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <p className="font-semibold theme-text-primary">GeeksforGeeks</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ThemeShowcase;
