import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { ProjectItem } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectsWidgetProps {
  projects: ProjectItem[];
}

const ProjectsWidget: React.FC<ProjectsWidgetProps> = ({ projects }) => {
  return (
    <div className="bg-[#121214] rounded-3xl p-6 border border-[#27272A] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">Active Projects</h3>
        <button className="text-[#71717A] hover:text-indigo-400 transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </div>
      
      <div className="space-y-6 flex-1 overflow-y-auto">
        {projects.map((project) => (
          <div key={project.id} className="group">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm text-gray-200 group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h4>
              <span className="text-xs text-[#71717A] bg-white/5 px-2 py-0.5 rounded-full">
                Due {project.deadline}
              </span>
            </div>
            
            <Progress.Root 
              className="relative overflow-hidden bg-black/40 rounded-full w-full h-2" 
              value={project.progress}
            >
              <Progress.Indicator 
                className="bg-indigo-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)] shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ transform: `translateX(-${100 - project.progress}%)` }} 
              />
            </Progress.Root>
            
            <div className="flex justify-between mt-2 text-xs text-[#71717A]">
              <span>{project.completedTasks}/{project.totalTasks} Tasks</span>
              <span>{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsWidget;
