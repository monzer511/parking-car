import { GoogleGenAI, Type } from "@google/genai";
import { ParkingSlot, ParkingTransaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeParkingData = async (
  slots: ParkingSlot[],
  transactions: ParkingTransaction[]
) => {
  const occupiedCount = slots.filter(s => s.status === 'OCCUPIED').length;
  const totalSlots = slots.length;
  const revenueToday = transactions.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  
  const prompt = `
    أنت نظام ذكي لتحليل مواقف السيارات. قم بتحليل البيانات التالية وقدم تقريراً JSON.
    
    بيانات الحالة الحالية:
    - إجمالي المواقف: ${totalSlots}
    - المشغول حالياً: ${occupiedCount}
    - الإيرادات اليوم: ${revenueToday} جنيه سوداني
    - عدد العمليات المسجلة: ${transactions.length}

    المطلوب:
    1. تقييم الكفاءة (من 0 إلى 100).
    2. توقع وقت الذروة بناءً على نمط (تخيل نمط افتراضي لهذا الوقت من اليوم).
    3. اقتراح للتسعير (رفع/خفض/إبقاء).
    4. 3 توصيات قصيرة لتحسين الإدارة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            efficiencyScore: { type: Type.NUMBER },
            peakTimePrediction: { type: Type.STRING },
            pricingSuggestion: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback data
    return {
      efficiencyScore: 75,
      peakTimePrediction: "غير متاح حالياً",
      pricingSuggestion: "حافظ على السعر الحالي",
      recommendations: ["تأكد من اتصال الإنترنت", "تحقق من الكاميرات", "حدث البيانات"]
    };
  }
};