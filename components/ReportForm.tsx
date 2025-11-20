import React, { useState } from 'react';
import { ReportData } from '../types';
import { GenerateIcon } from './icons';

interface ReportFormProps {
  onGenerate: (data: ReportData) => void;
  isLoading: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onGenerate, isLoading }) => {
  const [moduleTitle, setModuleTitle] = useState('');
  const [sessionNumber, setSessionNumber] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyPoints = keyPointsText.split('\n').filter(point => point.trim() !== '');

    if (moduleTitle && sessionNumber && keyPoints.length > 0) {
      onGenerate({ moduleTitle, sessionNumber, keyPoints });
    } else {
      alert("الرجاء ملء جميع الحقول وإضافة نقطة واحدة على الأقل في المحاور الأساسية.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="module-title" className="block text-sm font-medium text-gray-700 mb-2">
            عنوان المجزوءة التكوينية
          </label>
          <input
            type="text"
            id="module-title"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="مثال: التربية الدامجة"
            required
          />
        </div>
        <div>
          <label htmlFor="session-number" className="block text-sm font-medium text-gray-700 mb-2">
            رقم الحصة
          </label>
          <input
            type="text"
            id="session-number"
            value={sessionNumber}
            onChange={(e) => setSessionNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="مثال: الأولى، 1"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="key-points" className="block text-sm font-medium text-gray-700 mb-2">
          النقط والمحاور الأساسية
        </label>
        <textarea
          id="key-points"
          value={keyPointsText}
          onChange={(e) => setKeyPointsText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="أدخل كل نقطة في سطر منفصل..."
          rows={8}
          required
        />
        <p className="mt-2 text-xs text-gray-500">
          نصيحة: افصل بين كل نقطة أو محور رئيسي بسطر جديد (عبر الضغط على زر Enter).
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري إنشاء التقرير...
            </>
          ) : (
            <>
              <GenerateIcon />
              إنشاء التقرير
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;