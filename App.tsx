import React, { useState, useCallback } from 'react';
import ReportForm from './components/ReportForm';
import ReportPreview from './components/ReportPreview';
import { generateReportBody } from './services/geminiService';
import { exportToDocx, ensureDocxIsLoaded } from './utils/docxGenerator';
import type { ReportData, GeneratedReport } from './types';

const USER_DATA = {
  fullName: 'خالد مراوي',
  rentalNumber: '1597607',
  location: 'مراكش',
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [lastReportData, setLastReportData] = useState<ReportData | null>(null);


  const handleGenerateReport = useCallback(async (data: ReportData) => {
    setIsLoading(true);
    setGeneratedReport(null);
    setLastReportData(data); // Save data for export
    
    try {
      const reportBody = await generateReportBody(data);
      const reportTitle = `تقرير عن الحصة ${data.sessionNumber} من مجزوءة ${data.moduleTitle}`;
      setGeneratedReport({ title: reportTitle, body: reportBody });
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("عذرًا، حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExport = async () => {
    if (!generatedReport || !lastReportData) return;
    
    setIsExporting(true);
    try {
      // Wait for the docx library to be ready
      await ensureDocxIsLoaded();

      const currentDate = new Date().toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      exportToDocx({
        ...USER_DATA,
        date: currentDate,
        title: generatedReport.title,
        body: generatedReport.body,
      });
    } catch (error) {
      console.error(error);
      alert("عذرًا، فشل تحميل مكتبة تصدير المستندات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            مولّد التقارير اليومية
          </h1>
          <p className="mt-2 text-md text-gray-600">
            أداة لإنشاء تقارير تكوينية احترافية بسرعة وسهولة.
          </p>
        </header>

        <main>
          <ReportForm onGenerate={handleGenerateReport} isLoading={isLoading} />
          {generatedReport && (
            <ReportPreview 
              report={generatedReport} 
              userData={USER_DATA}
              onExport={handleExport}
              isExporting={isExporting}
            />
          )}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} - تم التطوير لتسهيل عملية التوثيق اليومي.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;