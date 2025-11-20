import React, { useState } from 'react';
import { GeneratedReport } from '../types';
import { CopyIcon, CheckIcon } from './icons';

interface UserData {
    fullName: string;
    rentalNumber: string;
    location: string;
}

interface ReportPreviewProps {
  report: GeneratedReport;
  userData: UserData;
  onExport: () => void;
  isExporting: boolean;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, userData, onExport, isExporting }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, itemName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedItem(itemName);
        setTimeout(() => {
          setCopiedItem(null);
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('فشل نسخ النص.');
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const CopyButton = ({ textToCopy, itemName }: { textToCopy: string; itemName: string }) => (
    <button
      onClick={() => handleCopy(textToCopy, itemName)}
      className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:bg-gray-200"
      aria-label={`نسخ ${itemName}`}
    >
      {copiedItem === itemName ? <CheckIcon /> : <CopyIcon />}
    </button>
  );


  return (
    <div className="mt-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
      {/* Report Header */}
      <div className="border-b pb-4 mb-6 text-gray-700 space-y-2">
        <div className="flex justify-between items-center">
            <div className="relative group pr-2">
                <p><strong>الاسم الكامل:</strong> {userData.fullName}</p>
                <CopyButton textToCopy={userData.fullName} itemName="fullName" />
            </div>
            <div className="relative group pl-2">
                <p>{userData.location} في {currentDate}</p>
                <CopyButton textToCopy={`${userData.location} في ${currentDate}`} itemName="locationDate" />
            </div>
        </div>
        <div className="relative group text-right pr-2">
            <p><strong>رقم التأجير:</strong> {userData.rentalNumber}</p>
            <CopyButton textToCopy={userData.rentalNumber} itemName="rentalNumber" />
        </div>
      </div>
      
      {/* Report Title */}
      <div className="relative group">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{report.title}</h2>
        <CopyButton textToCopy={report.title} itemName="title" />
      </div>
      
      {/* Report Body */}
      <div className="relative group">
        <div className="prose max-w-none text-right" dir="rtl">
          {report.body.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph || '\u00A0'}
            </p>
          ))}
        </div>
        <CopyButton textToCopy={report.body} itemName="body" />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
        <button
          onClick={onExport}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التصدير...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تصدير كملف Word (.docx)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportPreview;