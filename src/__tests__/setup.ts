import 'jest-environment-jsdom';

// Add any global test setup here
Object.defineProperty(window, 'SVGElement', {
  value: function() {},
  writable: true
});

// Ensure document is available globally
global.document = document;
global.window = window;