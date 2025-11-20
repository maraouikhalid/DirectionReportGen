
import { GoogleGenAI } from "@google/genai";
import { ReportData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateReportBody = async (data: ReportData): Promise<string> => {
  const { moduleTitle, sessionNumber, keyPoints } = data;

  const keyPointsList = keyPoints.map(point => `- ${point}`).join('\n');

  const prompt = `
    أنت مساعد خبير في كتابة التقارير التكوينية الاحترافية.
    مهمتك هي كتابة تقرير يومي مفصل ومنسق باللغة العربية الفصحى بناءً على المعطيات التالية:
    
    - مجزوءة التكوين: ${moduleTitle}
    - رقم الحصة: ${sessionNumber}
    - النقاط والمحاور الرئيسية التي تمت تغطيتها:
      ${keyPointsList}
    
    الرجاء كتابة نص تقرير شامل يربط بين هذه النقاط ويوسعها بأسلوب أكاديمي ومنهجي، كما لو أنك المتدرب الذي حضر الحصة ويدون ملاحظاته. يجب أن يكون النص غنياً بالمعلومات ومفيداً.
    لا تقم بتضمين العنوان أو معلومات الرأس (الاسم، التاريخ، رقم التأجير) في إجابتك، فقط قم بإنشاء نص التقرير الأساسي بشكل مباشر.
    ابدأ التقرير بمقدمة مناسبة، ثم صلب الموضوع الذي يفصل النقاط المذكورة، واختتم بخاتمة موجزة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report from Gemini API:", error);
    return "عذرًا، حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.";
  }
};

export { generateReportBody };
