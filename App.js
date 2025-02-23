import React from 'react';
import { ThemeProvider } from './src/layout/ThemeContext';
import Router from './src/router/Router';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}