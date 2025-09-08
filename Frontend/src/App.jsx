import React from 'react';
import './index.css';

// Import components from new directory
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <AppRoutes />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
