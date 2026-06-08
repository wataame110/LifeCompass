import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DiagnosisProvider } from '@/hooks/useDiagnosis';
import { ThemeProvider } from '@/hooks/useTheme';
import HomePage from '@/pages/HomePage';
import DiagnosisPage from '@/pages/DiagnosisPage';
import ResultPage from '@/pages/ResultPage';
import ExportPage from '@/pages/ExportPage';

function App() {
  return (
    <ThemeProvider>
      <DiagnosisProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </BrowserRouter>
      </DiagnosisProvider>
    </ThemeProvider>
  );
}

export default App;
