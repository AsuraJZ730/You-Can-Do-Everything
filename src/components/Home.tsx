import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Anchor } from "lucide-react";

interface HomeProps {
  onStart: () => void;
  key?: string;
}

export function Home({ onStart }: HomeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-md p-8 rounded-[24px] neu-flat text-center">
        <div 
          className="w-16 h-16 mx-auto mb-6 rounded-2xl neu-flat flex items-center justify-center cursor-pointer relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="square"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 45, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-6 neu-bg-primary rounded-md absolute"
              />
            ) : (
              <motion.div
                key="anchor"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="absolute text-[#6B8AFD]"
              >
                <Anchor className="w-8 h-8" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#2d3748] mb-4">
          职业锚测评
        </h1>
        
        <p className="text-[#718096] mb-8 text-[16px] leading-relaxed">
          发现你的核心职业动机<br/>找到最适合你的发展方向
        </p>

        <div className="space-y-4 mb-10 text-left neu-pressed p-6 rounded-[16px]">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#718096]">问卷题量</span>
            <span className="font-semibold text-[#2d3748]">40 题</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#718096]">预计耗时</span>
            <span className="font-semibold text-[#2d3748]">5 - 10 分钟</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center py-4 px-8 rounded-[28px] text-[18px] font-bold neu-btn text-[#6B8AFD] group"
        >
          开始测评
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
