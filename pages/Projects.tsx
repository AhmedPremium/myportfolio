
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../types';

// Toggle to show construction tapes overlay. Set to false to restore normal Projects view.
const SHOW_CONSTRUCTION = true;
// When true, the overlay will block pointer interactions (projects become non-interactive).
const BLOCK_INTERACTIONS = true;

const ConstructionTape: React.FC<{ isDark: boolean; count?: number }> = ({ isDark, count = 3 }) => {
  const text = 'This Page is still being constructed! Check Later!';
  const tapes = Array.from({ length: count });
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50"
        style={{ pointerEvents: BLOCK_INTERACTIONS ? 'auto' : 'none' }}
        aria-hidden="true"
      >
        {tapes.map((_, i) => {
          const top = 12 + i * (80 / Math.max(1, count));
          const textColorClass = i % 2 === 0 ? 'text-black' : 'text-white';
          return (
            <div
              key={i}
              className="absolute overflow-hidden"
              style={{
                left: '-30%',
                right: '-30%',
                top: `${top}%`,
                height: 64,
                transform: 'rotate(-15deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto'
              }}
            >
              <div
                className={`w-full py-3 px-6 tracking-wider font-bold uppercase bg-yellow-400 ${textColorClass}`}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.98 }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    animation: `marquee ${12 + i * 3}s linear infinite`,
                    willChange: 'transform'
                  }}
                >
                  {Array.from({ length: 6 }).map((_, k) => (
                    <span key={k} className="mx-8">{text}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Projects: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-40 px-6 max-w-7xl mx-auto">
      {SHOW_CONSTRUCTION && <ConstructionTape isDark={isDark} count={4} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 md:mb-24 text-center"
      >
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4 block">Portfolio</span>
        <h2 className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          The <span className="text-blue-600">Anthology.</span>
        </h2>
        <p className={`text-base md:text-xl max-w-2xl mx-auto opacity-60 font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Obsessively crafted projects that prioritize in interaction and simplicity.
        </p>
      </motion.div>

      {/* Grid Layout - Fixed animation behavior */}
      <motion.div 
        className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[350px] md:auto-rows-[450px] ${SHOW_CONSTRUCTION && BLOCK_INTERACTIONS ? 'filter blur-lg' : ''}`}
      >
        {PROJECTS.map((project, idx) => {
          const spans = [
            "md:col-span-8",
            "md:col-span-4",
            "md:col-span-4",
            "md:col-span-8"
          ];
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={spans[idx % spans.length]}
            >
              <ProjectCard 
                project={project} 
                isDark={isDark} 
                onClick={setSelectedProject}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        isDark={isDark} 
      />
    </div>
  );
};

export default Projects;
