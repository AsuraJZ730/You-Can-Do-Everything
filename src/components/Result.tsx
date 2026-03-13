import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { ChevronDown, RefreshCw, Download, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import { anchors } from "../data/anchors";

interface ResultProps {
  scores: Record<string, number>;
  onRestart: () => void;
  key?: string;
}

export function Result({ scores, onRestart }: ResultProps) {
  const [activeTab, setActiveTab] = useState<"traits" | "advice" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Find dominant type(s)
  const maxScore = Math.max(...Object.values(scores));
  const dominantTypes = Object.keys(scores).filter(
    (key) => scores[key] === maxScore
  );
  
  const dominantNames = dominantTypes.map(t => anchors[t].name).join(" 或者 ");
  const dominantCodes = dominantTypes.map(t => anchors[t].code).join(" / ");

  // Prepare chart data
  const chartData = Object.keys(anchors).map((key) => ({
    subject: key,
    A: scores[key] || 0,
    fullMark: 30,
  }));

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    setIsSaving(true);
    
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(resultRef.current!, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#e0e5ec", // Neumorphic background
        });
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsSaving(false);
            return;
          }

          const file = new File([blob], "职业锚测评结果.png", { type: "image/png" });

          // Try Web Share API for mobile devices
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: '我的职业锚测评结果',
              });
            } catch (error) {
              // If user cancels share, do nothing. If other error, fallback to download.
              if ((error as Error).name !== 'AbortError') {
                fallbackDownload(blob);
              }
            }
          } else {
            // Fallback for Desktop / Unsupported browsers
            fallbackDownload(blob);
          }
          setIsSaving(false);
        }, "image/png");
      } catch (err) {
        console.error("Failed to save image", err);
        setIsSaving(false);
      }
    }, 100);
  };

  const fallbackDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "职业锚测评结果.png";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      {/* Capture Area */}
      <div ref={resultRef} className="pb-6 bg-[#e0e5ec]">
        {/* Header */}
        <div className="pt-12 pb-12 px-6 relative">
          <div className="max-w-md mx-auto relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 neu-flat text-[#4a5568] px-5 py-2 rounded-full text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4 neu-text-primary" />
              你的职业锚类型是
            </div>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d3748] tracking-tight">
                {dominantNames}
              </h1>
              <span className="inline-block neu-pressed neu-text-primary px-4 py-1.5 rounded-xl text-lg font-bold tracking-widest">
                {dominantCodes}
              </span>
            </div>
            
            <p className="text-[#4a5568] text-sm leading-relaxed font-medium neu-pressed p-5 rounded-2xl">
              {dominantTypes.length === 1 
                ? anchors[dominantTypes[0]].shortDesc 
                : "你在多个维度上表现出强烈的倾向，具备复合型的职业动机。"}
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 space-y-8">
          {/* Chart Card */}
          <div className="neu-flat p-6 rounded-[24px]">
            <h3 className="text-sm font-bold text-[#2d3748] mb-6 text-center uppercase tracking-widest">
              八维得分分布
            </h3>
            <div className="h-64 w-full neu-pressed rounded-[20px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                  <PolarGrid stroke="#a3b1c6" strokeDasharray="3 3" opacity={0.5} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#4a5568", fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#6B8AFD"
                    strokeWidth={2}
                    fill="#6B8AFD"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Score List */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {chartData.map((item) => (
                <div key={item.subject} className="text-center neu-flat-sm rounded-xl p-2">
                  <div className="text-[10px] font-medium text-[#718096] mb-1">{item.subject}</div>
                  <div className="text-sm font-bold text-[#2d3748]">{item.A}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Content inside capture area */}
          <AnimatePresence mode="wait">
            {activeTab === "traits" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-flat p-6 rounded-[24px] space-y-8">
                  {dominantTypes.map((type, index) => (
                    <div key={type} className={index > 0 ? "pt-6 border-t border-[#a3b1c6]/30" : ""}>
                      {dominantTypes.length > 1 && (
                        <h3 className="text-lg font-bold text-[#2d3748] mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full neu-bg-primary" />
                          {anchors[type].name}
                        </h3>
                      )}
                      <div className="space-y-6">
                        <Section title="类型定义" content={anchors[type].traits.definition} />
                        <Section title="人群特征" content={anchors[type].traits.characteristics} />
                        <Section title="典型行为偏好" content={anchors[type].traits.behaviors} />
                        <Section title="工作价值取向" content={anchors[type].traits.values} />
                        <Section title="适合的发展环境" content={anchors[type].traits.environment} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "advice" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-flat p-6 rounded-[24px] space-y-8">
                  {dominantTypes.map((type, index) => (
                    <div key={type} className={index > 0 ? "pt-6 border-t border-[#a3b1c6]/30" : ""}>
                      {dominantTypes.length > 1 && (
                        <h3 className="text-lg font-bold text-[#2d3748] mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full neu-bg-primary" />
                          {anchors[type].name}
                        </h3>
                      )}
                      <div className="space-y-6">
                        <Section title="职业发展建议" content={anchors[type].advice.career} />
                        <Section title="学习成长建议" content={anchors[type].advice.learning} />
                        <Section title="管理建议" content={anchors[type].advice.management} />
                        <Section title="决策建议" content={anchors[type].advice.decision} />
                        <Section title="不适配场景提醒" content={anchors[type].advice.warnings} isWarning />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons (Outside capture area) */}
      <div className="max-w-md mx-auto px-6 mt-4 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab(activeTab === "traits" ? null : "traits")}
            className={`p-4 rounded-[20px] text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
              activeTab === "traits"
                ? "neu-pressed neu-text-primary"
                : "neu-btn text-[#4a5568]"
            }`}
          >
            查看主导特质
            <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === "traits" ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === "advice" ? null : "advice")}
            className={`p-4 rounded-[20px] text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 ${
              activeTab === "advice"
                ? "neu-pressed neu-text-primary"
                : "neu-btn text-[#4a5568]"
            }`}
          >
            职业发展建议
            <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === "advice" ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="pt-4 flex justify-center gap-8">
          <button onClick={onRestart} className="flex flex-col items-center gap-3 text-[#718096] hover:text-[#2d3748] transition-colors group">
            <div className="w-14 h-14 rounded-full neu-btn flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">重新测试</span>
          </button>
          
          <button 
            onClick={handleSaveImage} 
            disabled={isSaving}
            className={`flex flex-col items-center gap-3 transition-colors group ${isSaving ? 'opacity-50 cursor-not-allowed text-[#a0aec0]' : 'text-[#718096] hover:text-[#2d3748]'}`}
          >
            <div className={`w-14 h-14 rounded-full ${isSaving ? 'neu-pressed' : 'neu-btn'} flex items-center justify-center`}>
              <Download className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">{isSaving ? '保存中...' : '保存图片'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, content, isWarning = false }: { title: string; content: string; isWarning?: boolean }) {
  return (
    <div className="relative">
      <div className={`inline-block px-4 py-1.5 rounded-lg text-xs font-bold mb-3 ${isWarning ? "neu-pressed text-red-500" : "neu-pressed text-[#4a5568]"}`}>
        {title}
      </div>
      <p className="text-sm text-[#4a5568] leading-relaxed">
        {content}
      </p>
    </div>
  );
}
