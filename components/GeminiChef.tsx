import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; 
import { GEMINI_API_KEY_INFO } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { GeminiDishSuggestion } from '../types';

const FALLBACK_API_KEY = "YOUR_GEMINI_API_KEY"; 

const GeminiChef: React.FC = () => {
  const [preferences, setPreferences] = useState<string>('');
  const [suggestions, setSuggestions] = useState<GeminiDishSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiKey = process.env.API_KEY || FALLBACK_API_KEY;

  const handleGetSuggestions = async () => {
    if (!preferences.trim()) {
      setError('กรุณาบอกความชอบของคุณ หรือว่าคุณอยากทานอะไร');
      return;
    }
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        setError(`API key ไม่ได้ถูกตั้งค่า. ${GEMINI_API_KEY_INFO}`);
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `จากความชอบต่อไปนี้: "${preferences}" ช่วยแนะนำอาหารไทยที่สร้างสรรค์และไม่เหมือนใคร 3 รายการ ที่ไม่ค่อยพบในเมนูปกติ สำหรับแต่ละจาน โปรดระบุชื่อ คำอธิบายสั้นๆ ที่น่าลิ้มลอง และประเภทอาหาร (อาหารเรียกน้ำย่อย, อาหารจานหลัก, ของหวาน, เครื่องดื่ม) เป็นภาษาไทยทั้งหมด คืนค่าการตอบกลับเป็นอาร์เรย์ JSON ของออบเจ็กต์ โดยแต่ละออบเจ็กต์มีฟิลด์ "name", "description", และ "category" ซึ่งมีค่าเป็นภาษาไทย ตัวอย่าง: [{"name": "ชื่ออาหาร", "description": "อาหารจานอร่อย...", "category": "อาหารจานหลัก"}]`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", 
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsedSuggestions: GeminiDishSuggestion[] = JSON.parse(jsonStr);
      if (Array.isArray(parsedSuggestions) && parsedSuggestions.every(s => s.name && s.description && s.category)) {
        setSuggestions(parsedSuggestions);
      } else {
        throw new Error("รูปแบบคำแนะนำที่ได้รับจาก AI ไม่ถูกต้อง");
      }

    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงคำแนะนำ:', err);
      setError(`ไม่สามารถรับคำแนะนำได้: ${err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่รู้จัก'}. ${GEMINI_API_KEY_INFO}`);
      setSuggestions([]); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const themedInputClass = "w-full p-3.5 bg-input-bg-theme text-input-text-theme border border-input-border-theme rounded-lg focus:ring-2 focus:ring-accent-theme focus:border-accent-theme text-lg min-h-[100px] shadow-sm";
  const themedButtonBase = "w-full bg-accent-theme text-button-text-theme font-semibold py-3 px-6 rounded-lg hover:bg-accent-hover-theme transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-70 text-xl shadow-button-theme";

  return (
    <div className="p-4 sm:p-6 bg-card-bg-theme text-text-theme rounded-xl shadow-card-theme border border-border-theme font-main">
      <div className="flex items-center mb-8">
        <SparklesIcon className="w-12 h-12 sm:w-14 sm:h-14 text-accent-theme mr-4" />
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-theme font-heading">คำแนะนำจากเชฟ AI</h2>
          <p className="text-text-muted-theme text-lg sm:text-xl mt-1">ให้เชฟ AI ของเราแนะนำเมนูพิเศษสำหรับคุณ!</p>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="preferences" className="block text-xl sm:text-2xl font-medium text-text-theme mb-2.5">
          คุณอยากทานอะไรเป็นพิเศษ? (เช่น รสจัด, มังสวิรัติ, อาหารเบาๆ)
        </label>
        <textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="บอกความอยาก, ความต้องการด้านโภชนาการ, หรือรสชาติที่คุณชื่นชอบ..."
          className={themedInputClass}
          rows={4}
        />
      </div>

      <button
        onClick={handleGetSuggestions}
        disabled={isLoading}
        className={themedButtonBase}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-button-text-theme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังรับคำแนะนำ...
          </>
        ) : (
          'ถามเชฟ AI'
        )}
      </button>

      {error && <p className="mt-5 text-center text-error-theme bg-bg-theme p-4 rounded-lg text-md border border-error-theme/50">{error}</p>}
      
      {!isLoading && !error && suggestions.length === 0 && !preferences && (
         <p className="mt-8 text-center text-text-muted-theme text-lg">
          กรอกความชอบของคุณด้านบน แล้วให้เชฟ AI ของเราทำให้คุณประหลาดใจ!
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl sm:text-3xl font-semibold text-text-theme mb-5 font-heading">คำแนะนำจากเชฟ:</h3>
          <div className="space-y-5">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-bg-theme rounded-lg shadow-sm border border-border-theme cursor-default transition-all duration-200 hover:shadow-card-theme">
                <h4 className="text-xl sm:text-2xl font-bold text-text-theme font-heading">{suggestion.name}</h4>
                <p className="text-text-muted-theme my-2 text-md sm:text-lg">{suggestion.description}</p>
                <p className="text-lg sm:text-xl text-accent-theme font-medium">ประเภท: {suggestion.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChef;