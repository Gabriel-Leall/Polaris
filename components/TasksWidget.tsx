import React, { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { TaskItem } from '../types';
import { Check, Plus, GripVertical } from 'lucide-react';

interface TasksWidgetProps {
  initialTasks: TaskItem[];
}

const TasksWidget: React.FC<TasksWidgetProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskLabel, setNewTaskLabel] = useState('');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;

    const newTask: TaskItem = {
        id: Math.random().toString(36).substr(2, 9),
        label: newTaskLabel,
        completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskLabel('');
  };

  return (
    <div className="bg-surface rounded-3xl p-6 border border-border-subtle h-full flex flex-col shadow-card min-h-0">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-xl font-medium text-textPrimary tracking-tight">Tasks</h3>
        <div className="bg-highlight px-2 py-0.5 rounded text-[10px] text-textSecondary font-mono">
           {tasks.filter(t => t.completed).length}/{tasks.length}
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-start p-2 rounded-xl hover:bg-highlight transition-all duration-200">
            {/* Grip Handle (Visible on Hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-textSecondary mr-1 mt-0.5 cursor-grab">
               <GripVertical size={14} />
            </div>

            <Checkbox.Root
              className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-[6px] bg-inputBg border border-border-subtle hover:border-indigo-500/50 focus:outline-none transition-all data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 data-[state=checked]:text-white shrink-0"
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              id={task.id}
            >
              <Checkbox.Indicator>
                <Check size={12} strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            
            <label 
              htmlFor={task.id}
              className={`ml-3 text-sm flex-1 cursor-pointer transition-all duration-300 leading-snug ${
                task.completed ? 'text-textSecondary line-through opacity-50' : 'text-textPrimary font-light'
              }`}
            >
              {task.label}
              {task.dueDate && !task.completed && (
                <span className="block text-[10px] text-indigo-400 mt-1 font-medium">Due {task.dueDate}</span>
              )}
            </label>
          </div>
        ))}

        {/* Ghost Input */}
        <form onSubmit={handleAddTask} className="flex items-center group opacity-50 hover:opacity-100 transition-opacity pl-6 pt-2">
            <div className="w-5 h-5 rounded-[6px] border border-dashed border-border-subtle shrink-0 flex items-center justify-center">
                <Plus size={10} className="text-textSecondary group-hover:text-textPrimary" />
            </div>
            
            <input 
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Add new task..."
                className="ml-3 flex-1 bg-transparent text-sm text-textPrimary placeholder-textSecondary focus:placeholder-textPrimary/40 focus:outline-none transition-colors h-6"
            />
        </form>
      </div>
    </div>
  );
};

export default TasksWidget;