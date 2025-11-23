import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronRight, ChevronLeft, Plus, Trash2, Edit2, Save, X, MessageSquare, Loader2, LayoutGrid, List, AlertCircle, Menu } from 'lucide-react';

// Storage Manager
const StorageManager = {
  saveProject: (projectId, data) => {
    try {
      localStorage.setItem(`project-${projectId}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },
  loadProject: (projectId) => {
    try {
      const data = localStorage.getItem(`project-${projectId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load error:', e);
      return null;
    }
  }
};

// Date utilities
const DateUtils = {
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  },
  daysBetween: (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const ProjectIntakeForm = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    name: '',
    approverEmail: '',
    category: '',
    projectType: '',
    complexity: 'medium',
    workers: [],
    startDate: '',
    endDate: '',
    deliverables: '',
    description: '',
    constraints: ''
  });

  const projectTypes = [
    'Construction',
    'Software Development',
    'Event Planning',
    'Marketing Campaign',
    'Product Launch',
    'Landscaping',
    'Renovation',
    'Custom'
  ];

  const handleGenerate = () => {
    if (!formData.name || !formData.projectType || !formData.startDate || !formData.endDate || !formData.deliverables) {
      alert('Please fill in all required fields');
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white p-8">
        <h1 className="text-3xl font-bold">Create A Project</h1>
        <p className="mt-2 text-green-100">Welcome back to manage new project. Please complete the form to create a new project</p>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approver Email</label>
                <input
                  type="email"
                  placeholder="Enter Approver email"
                  value={formData.approverEmail}
                  onChange={(e) => setFormData({...formData, approverEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select categories</option>
                  <option value="internal">Internal</option>
                  <option value="client">Client</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">(OPTIONAL) Associated Job</label>
                <input
                  type="text"
                  placeholder="-- Select a Job --"
                  value={formData.associatedJob || ''}
                  onChange={(e) => setFormData({...formData, associatedJob: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type/Industry *</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Complexity</label>
                <div className="flex gap-4 mt-2">
                  {['simple', 'medium', 'complex'].map(level => (
                    <label key={level} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={level}
                        checked={formData.complexity === level}
                        onChange={(e) => setFormData({...formData, complexity: e.target.value})}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Workers</label>
              <input
                type="text"
                placeholder="Enter worker names (comma separated)"
                value={formData.workers.join(', ')}
                onChange={(e) => {
                  const value = e.target.value;
                  const workersList = value.split(',').map(w => w.trim());
                  setFormData({...formData, workers: workersList});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Deliverables (3-5 major outcomes) *</label>
              <textarea
                rows={3}
                placeholder="List the main deliverables for this project"
                value={formData.deliverables}
                onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements/Constraints</label>
              <textarea
                rows={3}
                placeholder="Any regulatory, seasonal, or special requirements"
                value={formData.constraints}
                onChange={(e) => setFormData({...formData, constraints: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => alert('Project saved to browser storage!')}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Save Project
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition flex items-center gap-2"
              >
                <Plus size={20} />
                Generate Project Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectPlanView = ({ projectData, tasks, onTaskUpdate, onAskAI }) => {
  const [view, setView] = useState('gantt');
  const [currentTab, setCurrentTab] = useState('plan'); // 'plan' or 'workload'
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTaskMode, setAddTaskMode] = useState('parent');
  const [selectedParentTask, setSelectedParentTask] = useState(null);
  const [allTasks, setAllTasks] = useState(tasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverTask, setDragOverTask] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [dependencyTask, setDependencyTask] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesTask, setNotesTask] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  useEffect(() => {
    setAllTasks(tasks);
    analyzeTasks(tasks);
  }, [tasks]);

  const analyzeTasks = (taskList) => {
    const newSuggestions = [];

    // 1. Check for tasks with no dependencies (except task 1.0)
    taskList.forEach(task => {
      if (task.wbs !== '1.0' && (!task.dependencies || task.dependencies.length === 0)) {
        // Check if it's not a parent task with children
        const hasChildren = taskList.some(t => t.parentId === task.id);
        if (!hasChildren) {
          newSuggestions.push({
            type: 'warning',
            taskId: task.id,
            message: `Task "${task.wbs} ${task.name}" has no dependencies. Does it depend on another task?`,
            icon: '⚠️'
          });
        }
      }
    });

    // 2. Check for unassigned tasks
    taskList.forEach(task => {
      if (!task.assignedTo || task.assignedTo.length === 0) {
        newSuggestions.push({
          type: 'info',
          taskId: task.id,
          message: `Task "${task.wbs} ${task.name}" has no one assigned.`,
          icon: '👤'
        });
      }
    });

    // 3. Check for resource over-allocation
    const workloadByDate = {};
    taskList.forEach(task => {
      if (task.assignedTo && task.assignedTo.length > 0) {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        
        for (let d = new Date(taskStart); d <= taskEnd; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          
          task.assignedTo.forEach(person => {
            if (!workloadByDate[person]) workloadByDate[person] = {};
            if (!workloadByDate[person][dateStr]) workloadByDate[person][dateStr] = [];
            workloadByDate[person][dateStr].push(task);
          });
        }
      }
    });

    // Find overallocations (3+ tasks on same day)
    Object.keys(workloadByDate).forEach(person => {
      Object.keys(workloadByDate[person]).forEach(date => {
        const tasksOnDate = workloadByDate[person][date];
        if (tasksOnDate.length >= 3) {
          newSuggestions.push({
            type: 'alert',
            message: `${person} has ${tasksOnDate.length} tasks on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${tasksOnDate.map(t => t.wbs).join(', ')}`,
            icon: '🔴'
          });
        }
      });
    });

    // 4. Check for blocked tasks
    taskList.forEach(task => {
      if (task.status === 'blocked') {
        newSuggestions.push({
          type: 'alert',
          taskId: task.id,
          message: `Task "${task.wbs} ${task.name}" is blocked. Review and resolve.`,
          icon: '🚫'
        });
      }
    });

    setSuggestions(newSuggestions);
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedTasks(new Set());
    } else {
      const allTaskIds = new Set(allTasks.map(t => t.id));
      setExpandedTasks(allTaskIds);
    }
    setAllExpanded(!allExpanded);
  };

  const startEditing = (task, field) => {
    setEditingTask(task.id);
    setEditingField(field);
    let value = task[field];
    if (field === 'assignedTo') {
      value = Array.isArray(value) ? value.join(', ') : '';
    }
    setEditValue(value);
    setOriginalValue(value);
  };

  const saveEdit = (task) => {
    let newValue = editValue;

    if (editingField === 'name' && !newValue.trim()) {
      alert('Task name cannot be blank');
      setEditValue(originalValue);
      setEditingTask(null);
      setEditingField(null);
      return;
    }

    if (editingField === 'startDate' || editingField === 'endDate') {
      const projectStart = new Date(projectData.startDate);
      const projectEnd = new Date(projectData.endDate);
      const newDate = new Date(newValue);

      if (newDate < projectStart || newDate > projectEnd) {
        alert(`Date must be between ${DateUtils.formatDate(projectData.startDate)} and ${DateUtils.formatDate(projectData.endDate)}`);
        setEditValue(originalValue);
        setEditingTask(null);
        setEditingField(null);
        return;
      }

      if (editingField === 'startDate' && new Date(newValue) >= new Date(task.endDate)) {
        alert('Start date must be before end date');
        setEditValue(originalValue);
        setEditingTask(null);
        setEditingField(null);
        return;
      }

      if (editingField === 'endDate' && new Date(newValue) <= new Date(task.startDate)) {
        alert('End date must be after start date');
        setEditValue(originalValue);
        setEditingTask(null);
        setEditingField(null);
        return;
      }

      if (editingField === 'startDate') {
        const duration = DateUtils.daysBetween(newValue, task.endDate);
        const updatedTask = { ...task, startDate: newValue, duration };
        let updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
        updatedTasks = cascadeDependencies(updatedTask, updatedTasks);
        setAllTasks(updatedTasks);
        onTaskUpdate(null, updatedTasks);
        setEditingTask(null);
        setEditingField(null);
        return;
      }

      if (editingField === 'endDate') {
        const duration = DateUtils.daysBetween(task.startDate, newValue);
        const updatedTask = { ...task, endDate: newValue, duration };
        let updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
        updatedTasks = cascadeDependencies(updatedTask, updatedTasks);
        setAllTasks(updatedTasks);
        onTaskUpdate(null, updatedTasks);
        setEditingTask(null);
        setEditingField(null);
        return;
      }
    }

    if (editingField === 'assignedTo') {
      newValue = newValue.split(',').map(w => w.trim()).filter(Boolean);
    }

    const updatedTask = { ...task, [editingField]: newValue };
    const updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
    
    setEditingTask(null);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditValue(originalValue);
    setEditingTask(null);
    setEditingField(null);
  };

  const cascadeDependencies = (updatedTask, tasksList) => {
    const dependentTasks = tasksList.filter(t => 
      t.dependencies && t.dependencies.some(d => d.predecessorId === updatedTask.id)
    );

    if (dependentTasks.length === 0) return tasksList;

    let updatedTasks = [...tasksList];

    dependentTasks.forEach(depTask => {
      const dependency = depTask.dependencies.find(d => d.predecessorId === updatedTask.id);
      
      if (dependency.type === 'FS') {
        const newStartDate = DateUtils.addDays(updatedTask.endDate, dependency.lag || 0);
        const newEndDate = DateUtils.addDays(newStartDate, depTask.duration);
        
        const cascadedTask = {
          ...depTask,
          startDate: newStartDate,
          endDate: newEndDate
        };

        updatedTasks = updatedTasks.map(t => t.id === depTask.id ? cascadedTask : t);
        updatedTasks = cascadeDependencies(cascadedTask, updatedTasks);
      }
    });

    return updatedTasks;
  };

  const openDependencyModal = (task) => {
    setDependencyTask(task);
    setShowDependencyModal(true);
  };

  const saveDependencies = (taskId, dependencies) => {
    const updatedTask = allTasks.find(t => t.id === taskId);
    updatedTask.dependencies = dependencies;

    dependencies.forEach(dep => {
      const predecessor = allTasks.find(t => t.id === dep.predecessorId);
      if (predecessor && dep.type === 'FS') {
        const newStartDate = DateUtils.addDays(predecessor.endDate, dep.lag || 0);
        const newEndDate = DateUtils.addDays(newStartDate, updatedTask.duration);
        updatedTask.startDate = newStartDate;
        updatedTask.endDate = newEndDate;
      }
    });

    const updatedTasks = allTasks.map(t => t.id === taskId ? updatedTask : t);
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
    setShowDependencyModal(false);
  };

  const openNotesModal = (task) => {
    setNotesTask(task);
    setShowNotesModal(true);
  };

  const saveNotes = (taskId, notes) => {
    const updatedTask = allTasks.find(t => t.id === taskId);
    updatedTask.notes = notes;

    const updatedTasks = allTasks.map(t => t.id === taskId ? updatedTask : t);
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
    setShowNotesModal(false);
  };

  const getTaskLevel = (task) => {
    return task.wbs.split('.').length - 1;
  };

  const canPromote = (task) => {
    if (task.wbs === '1.0' || task.wbs.endsWith('.0')) return false;
    return true;
  };

  const canDemote = (task) => {
    if (task.wbs === '1.0') return false;
    const level = getTaskLevel(task);
    if (level >= 3) return false;
    
    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    if (taskIndex === 0) return false;
    
    const previousTask = allTasks[taskIndex - 1];
    return previousTask.parentId === task.parentId;
  };

  const promoteTask = (task) => {
    if (!canPromote(task)) return;

    const currentParent = allTasks.find(t => t.id === task.parentId);
    if (!currentParent) return;

    const newParentId = currentParent.parentId;
    
    const updatedTask = { ...task, parentId: newParentId };
    let updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
    
    updatedTasks = renumberAllWBS(updatedTasks);
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
  };

  const demoteTask = (task) => {
    if (!canDemote(task)) return;

    const taskIndex = allTasks.findIndex(t => t.id === task.id);
    const previousTask = allTasks[taskIndex - 1];
    
    const updatedTask = { ...task, parentId: previousTask.id };
    let updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
    
    updatedTasks = renumberAllWBS(updatedTasks);
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
    
    const newExpanded = new Set(expandedTasks);
    newExpanded.add(previousTask.id);
    setExpandedTasks(newExpanded);
  };

  const renumberAllWBS = (tasks) => {
    const renumbered = [];
    
    const processLevel = (parentId, parentWBS = '') => {
      const siblings = tasks.filter(t => t.parentId === parentId);
      siblings.forEach((task, idx) => {
        const newWBS = parentWBS ? `${parentWBS}.${idx + 1}` : `${idx + 1}.0`;
        const updatedTask = { ...task, wbs: newWBS };
        renumbered.push(updatedTask);
        processLevel(task.id, newWBS.replace(/\.0$/, ''));
      });
    };

    processLevel(null);
    return renumbered;
  };

  const toggleExpand = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getChildTasks = (parentId) => {
    return allTasks.filter(t => t.parentId === parentId);
  };

  const calculateNextWBS = (parentId = null) => {
    if (!parentId) {
      const topLevelTasks = allTasks.filter(t => !t.parentId);
      const maxWBS = topLevelTasks.reduce((max, task) => {
        const num = parseFloat(task.wbs);
        return num > max ? num : max;
      }, 0);
      return `${Math.floor(maxWBS) + 1}.0`;
    } else {
      const parent = allTasks.find(t => t.id === parentId);
      const siblings = allTasks.filter(t => t.parentId === parentId);
      const parentWBS = parent.wbs.replace(/\.0$/, '');
      const maxSubNum = siblings.reduce((max, task) => {
        const parts = task.wbs.split('.');
        const subNum = parseInt(parts[parts.length - 1]);
        return subNum > max ? subNum : max;
      }, 0);
      return `${parentWBS}.${maxSubNum + 1}`;
    }
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      wbs: taskData.wbs,
      name: taskData.name,
      duration: parseInt(taskData.duration),
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      assignedTo: taskData.assignedTo ? taskData.assignedTo.split(',').map(w => w.trim()) : [],
      dependencies: [],
      parentId: taskData.parentId || null
    };

    const updatedTasks = [...allTasks, newTask];
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);
    setShowAddModal(false);
    
    if (taskData.parentId) {
      const newExpanded = new Set(expandedTasks);
      newExpanded.add(taskData.parentId);
      setExpandedTasks(newExpanded);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = allTasks.filter(t => t.id !== taskId && t.parentId !== taskId);
      setAllTasks(updatedTasks);
      onTaskUpdate(null, updatedTasks);
    }
  };

  const handleDragStart = (e, task) => {
    if (task.wbs === '1.0') {
      e.preventDefault();
      return;
    }
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, task) => {
    e.preventDefault();
    if (task.wbs === '1.0' || task.id === draggedTask?.id) {
      return;
    }
    setDragOverTask(task);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTask || targetTask.wbs === '1.0' || draggedTask.id === targetTask.id) {
      setDraggedTask(null);
      setDragOverTask(null);
      return;
    }

    if (draggedTask.parentId !== targetTask.parentId) {
      alert('Tasks can only be reordered within the same level');
      setDraggedTask(null);
      setDragOverTask(null);
      return;
    }

    const sameLevelTasks = allTasks.filter(t => t.parentId === draggedTask.parentId);
    const draggedIndex = sameLevelTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = sameLevelTasks.findIndex(t => t.id === targetTask.id);

    sameLevelTasks.splice(draggedIndex, 1);
    sameLevelTasks.splice(targetIndex, 0, draggedTask);

    const parentWBS = draggedTask.parentId 
      ? allTasks.find(t => t.id === draggedTask.parentId).wbs.replace(/\.0$/, '')
      : '';

    sameLevelTasks.forEach((task, idx) => {
      const newWBS = parentWBS ? `${parentWBS}.${idx + 1}` : `${idx + 1}.0`;
      task.wbs = newWBS;
    });

    const otherTasks = allTasks.filter(t => t.parentId !== draggedTask.parentId);
    const updatedTasks = [...otherTasks, ...sameLevelTasks];
    setAllTasks(updatedTasks);
    onTaskUpdate(null, updatedTasks);

    setDraggedTask(null);
    setDragOverTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverTask(null);
  };

  const openAddModal = (mode, parentTask = null) => {
    setAddTaskMode(mode);
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
  };

  const renderTask = (task, level = 0) => {
    const children = getChildTasks(task.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const isDragging = draggedTask?.id === task.id;
    const isDragOver = dragOverTask?.id === task.id;
    const isFirstTask = task.wbs === '1.0';
    const isEditing = editingTask === task.id;
    const canProm = canPromote(task);
    const canDem = canDemote(task);

    return (
      <React.Fragment key={task.id}>
        <div 
          draggable={!isFirstTask}
          onDragStart={(e) => handleDragStart(e, task)}
          onDragOver={(e) => handleDragOver(e, task)}
          onDrop={(e) => handleDrop(e, task)}
          onDragEnd={handleDragEnd}
          className={`grid gap-2 py-2 px-4 border-b hover:bg-gray-50 ${level > 0 ? 'bg-gray-50' : ''} 
            ${isDragging ? 'opacity-50' : ''} 
            ${isDragOver ? 'border-t-2 border-green-500' : ''}
            ${isFirstTask ? 'cursor-default' : 'cursor-move'}`}
          style={{ gridTemplateColumns: '3fr 1fr 1fr 2fr 2fr 2fr 1fr 1fr' }}
        >
          <div className="flex items-center gap-1">
            <div className="flex gap-1 mr-1 justify-end" style={{ width: '52px' }}>
              <button
                onClick={() => promoteTask(task)}
                disabled={!canProm}
                className={`flex items-center justify-center w-5 h-5 rounded-full transition-all ${
                  canProm 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                title="Promote (move left)"
              >
                <ChevronLeft size={12} strokeWidth={3} />
              </button>
              <button
                onClick={() => demoteTask(task)}
                disabled={!canDem}
                className={`flex items-center justify-center w-5 h-5 rounded-full transition-all ${
                  canDem 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                title="Demote (move right)"
              >
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
            
            <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <button onClick={() => toggleExpand(task.id)} className="mr-1 text-gray-600" style={{ width: '16px' }}>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <div style={{ width: '16px', marginRight: '4px' }}></div>
              )}
              
              <span className="text-xs text-gray-500 mr-2 font-mono">{task.wbs}</span>
            {isEditing && editingField === 'name' ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(task)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(task);
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="font-medium px-2 py-1 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
                autoFocus
              />
            ) : (
              <span 
                className="font-medium hover:bg-yellow-100 px-2 py-1 rounded cursor-text"
                onClick={() => startEditing(task, 'name')}
              >
                {task.name}
              </span>
            )}
              {isFirstTask && <span className="ml-2 text-xs text-gray-400">(fixed)</span>}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 text-center flex items-center justify-center">{task.duration}d</div>
          
          <div className="text-sm text-center flex items-start justify-center pt-1">
            <StatusDropdown task={task} onStatusChange={(newStatus) => {
              const updatedTask = { ...task, status: newStatus };
              const updatedTasks = allTasks.map(t => t.id === task.id ? updatedTask : t);
              setAllTasks(updatedTasks);
              onTaskUpdate(null, updatedTasks);
            }} />
          </div>
          
          <div className="text-sm text-gray-600 text-center flex items-start justify-center pt-1">
            {isEditing && editingField === 'startDate' ? (
              <input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(task)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(task);
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="px-2 py-1 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                autoFocus
              />
            ) : (
              <span 
                className="hover:bg-yellow-100 px-2 py-1 rounded cursor-pointer inline-block"
                onClick={() => startEditing(task, 'startDate')}
              >
                {DateUtils.formatDate(task.startDate)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 text-center flex items-start justify-center pt-1">
            {isEditing && editingField === 'endDate' ? (
              <input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(task)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(task);
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="px-2 py-1 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                autoFocus
              />
            ) : (
              <span 
                className="hover:bg-yellow-100 px-2 py-1 rounded cursor-pointer inline-block"
                onClick={() => startEditing(task, 'endDate')}
              >
                {DateUtils.formatDate(task.endDate)}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 text-left flex items-start pt-1">
            {isEditing && editingField === 'assignedTo' ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(task)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(task);
                  if (e.key === 'Escape') cancelEdit();
                }}
                placeholder="Names, comma separated"
                className="px-2 py-1 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                autoFocus
              />
            ) : (
              <span 
                className="hover:bg-yellow-100 px-2 py-1 rounded cursor-pointer inline-block"
                onClick={() => startEditing(task, 'assignedTo')}
              >
                {task.assignedTo?.join(', ') || 'Unassigned'}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 text-center flex items-start justify-center pt-1">
            {task.dependencies && task.dependencies.length > 0 ? (
              <button
                onClick={() => openDependencyModal(task)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                {task.dependencies.length} {task.dependencies.length === 1 ? 'link' : 'links'}
              </button>
            ) : (
              <button
                onClick={() => openDependencyModal(task)}
                className="text-xs text-gray-400 hover:text-blue-600 hover:underline"
              >
                + Add
              </button>
            )}
          </div>
          
          <div className="flex items-start justify-center gap-2 pt-1">
            <button 
              onClick={() => openNotesModal(task)}
              className="relative text-purple-600 hover:text-purple-800"
              title="Task Notes"
            >
              <MessageSquare size={14} />
              {task.notes && task.notes.trim() && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => openAddModal('subtask', task)}
              className="text-green-600 hover:text-green-800"
              title="Add Subtask"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={() => startEditing(task, 'name')}
              className="text-blue-600 hover:text-blue-800" 
              title="Edit Task"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && children.map(child => renderTask(child, level + 1))}
      </React.Fragment>
    );
  };

  const topLevelTasks = allTasks.filter(t => !t.parentId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white p-6 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{projectData.name}</h1>
            <p className="text-green-100 mt-1">{DateUtils.formatDate(projectData.startDate)} - {DateUtils.formatDate(projectData.endDate)}</p>
          </div>
          <div className="flex gap-4 items-center">
            {saving && <span className="text-sm text-green-200">Saving...</span>}
            {!saving && <span className="text-sm text-green-200">All changes saved ✓</span>}
            
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="bg-green-800 text-white p-2 rounded-md hover:bg-green-900 transition relative"
              aria-label="Menu"
            >
              {showMenuDropdown ? <X size={24} /> : <Menu size={24} />}
              {suggestions.length > 0 && !showMenuDropdown && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {suggestions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {showMenuDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenuDropdown(false)} />
            <div className="absolute top-full left-auto right-[380px] mt-2 bg-white text-gray-800 rounded-lg shadow-2xl z-50 w-64 border border-gray-200 overflow-hidden">
              <div className="p-2 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">View Options</div>
                <button onClick={() => { setCurrentTab('plan'); setShowMenuDropdown(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${currentTab === 'plan' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}>
                  <LayoutGrid size={18} />
                  <span>Project Plan</span>
                  {currentTab === 'plan' && <span className="ml-auto text-green-600">✓</span>}
                </button>
                <button onClick={() => { setCurrentTab('workload'); setShowMenuDropdown(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${currentTab === 'workload' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}>
                  <Calendar size={18} />
                  <span>Workload View</span>
                  {currentTab === 'workload' && <span className="ml-auto text-green-600">✓</span>}
                </button>
                {currentTab === 'plan' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">Display Style</div>
                    <button onClick={() => { setView('gantt'); setShowMenuDropdown(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${view === 'gantt' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                      <LayoutGrid size={18} />
                      <span>Gantt View</span>
                      {view === 'gantt' && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                    <button onClick={() => { setView('hierarchy'); setShowMenuDropdown(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${view === 'hierarchy' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                      <List size={18} />
                      <span>Hierarchy View</span>
                      {view === 'hierarchy' && <span className="ml-auto text-blue-600">✓</span>}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-2 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Tools</div>
                <button onClick={() => { setShowSuggestions(!showSuggestions); setShowMenuDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition relative">
                  <AlertCircle size={18} className={suggestions.length > 0 ? 'text-orange-600' : ''} />
                  <span>Suggestions</span>
                  {suggestions.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{suggestions.length}</span>
                  )}
                </button>
                <button onClick={() => { setShowSettings(true); setShowMenuDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition">
                  <AlertCircle size={18} />
                  <span>Project Settings</span>
                </button>
                <button onClick={() => { setShowChat(!showChat); setShowMenuDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition">
                  <MessageSquare size={18} />
                  <span>Ask Jake!</span>
                </button>
              </div>
              <div className="p-3 bg-gray-50 text-xs text-gray-500 text-center">All project tools in one place</div>
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {currentTab === 'plan' ? (
          /* Project Plan View */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid gap-2 py-3 px-4 bg-gray-100 border-b font-semibold text-sm items-center sticky top-0 z-10" style={{ gridTemplateColumns: '3fr 1fr 1fr 2fr 2fr 2fr 1fr 1fr' }}>
              <div className="flex items-center gap-3">
              <button
                onClick={toggleExpandAll}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title={allExpanded ? "Collapse All" : "Expand All"}
              >
                {allExpanded ? (
                  <ChevronRight size={20} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={20} strokeWidth={2.5} />
                )}
              </button>
              <div className="w-px h-5 bg-gray-300"></div>
              <button 
                onClick={() => openAddModal('parent')}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Add Task"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
              <span style={{ marginLeft: '56px' }}>Task Name</span>
            </div>
            <div className="text-center">Duration</div>
            <div className="text-center">Status</div>
            <div className="text-center">Start Date</div>
            <div className="text-center">End Date</div>
            <div className="text-left">Assigned To</div>
            <div className="text-center">Dependencies</div>
            <div className="text-center">Actions</div>
          </div>
          <div className="overflow-y-auto">
            {topLevelTasks.map(task => renderTask(task))}
          </div>
        </div>
        ) : (
          <ResourceWorkloadView 
            allTasks={allTasks}
            projectData={projectData}
          />
        )}
      </div>

      {showAddModal && (
        <AddTaskModal
          mode={addTaskMode}
          parentTask={selectedParentTask}
          projectData={projectData}
          allTasks={allTasks}
          onAdd={handleAddTask}
          onClose={() => setShowAddModal(false)}
          calculateNextWBS={calculateNextWBS}
        />
      )}

      {showSettings && (
        <ProjectSettingsModal
          projectData={projectData}
          onSave={(updatedData) => {
            onTaskUpdate('PROJECT_SETTINGS_UPDATE', updatedData);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showNotesModal && notesTask && (
        <TaskNotesModal
          task={notesTask}
          onSave={saveNotes}
          onClose={() => setShowNotesModal(false)}
        />
      )}

      {showDependencyModal && (
        <DependencyModal
          task={dependencyTask}
          allTasks={allTasks}
          onSave={saveDependencies}
          onClose={() => setShowDependencyModal(false)}
        />
      )}

      {showChat && (
        <AIChatPanel
          projectData={projectData}
          tasks={tasks}
          onClose={() => setShowChat(false)}
          onAskAI={onAskAI}
        />
      )}
    </div>
  );
};

const SuggestionsDropdown = ({ suggestions, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-40 w-96 max-h-96 overflow-y-auto">
      <div className="sticky top-0 bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Smart Suggestions</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {suggestions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <div className="text-4xl mb-2">✨</div>
          <p className="font-medium">All looking good!</p>
          <p className="text-sm mt-1">No issues detected in your project plan.</p>
        </div>
      ) : (
        <div className="divide-y">
          {suggestions.map((suggestion, idx) => (
            <div 
              key={idx} 
              className={`p-4 hover:bg-gray-50 ${
                suggestion.type === 'alert' ? 'bg-red-50' : 
                suggestion.type === 'warning' ? 'bg-yellow-50' : 
                'bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{suggestion.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{suggestion.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t text-xs text-gray-600">
        💡 Suggestions update automatically as you edit your plan
      </div>
    </div>
  );
};

const StatusDropdown = ({ task, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statuses = [
    { value: 'not-started', label: 'Not Started', color: 'bg-gray-100 text-gray-700', icon: '⚪' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: '🔵' },
    { value: 'complete', label: 'Complete', color: 'bg-green-100 text-green-700', icon: '✅' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700', icon: '🔴' }
  ];

  const currentStatus = task.status || 'not-started';
  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 rounded text-xs font-medium ${currentStatusObj.color} hover:opacity-80 transition flex items-center gap-1`}
      >
        <span>{currentStatusObj.icon}</span>
        <span>{currentStatusObj.label}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[140px]">
            {statuses.map(status => (
              <button
                key={status.value}
                onClick={() => {
                  onStatusChange(status.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 ${
                  currentStatus === status.value ? 'font-semibold' : ''
                }`}
              >
                <span>{status.icon}</span>
                <span>{status.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ResourceWorkloadView = ({ allTasks, projectData }) => {
  // Get unique team members
  const teamMembers = projectData.workers || [];
  
  // Get date range (first 14 days from project start)
  const startDate = new Date(projectData.startDate);
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  // Calculate workload for each team member on each date
  const getWorkload = (member, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const tasksOnDate = allTasks.filter(task => {
      if (!task.assignedTo || !task.assignedTo.includes(member)) return false;
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return date >= taskStart && date <= taskEnd;
    });
    return tasksOnDate;
  };

  const getWorkloadColor = (taskCount) => {
    if (taskCount === 0) return 'bg-white';
    if (taskCount === 1) return 'bg-green-100';
    if (taskCount === 2) return 'bg-yellow-100';
    return 'bg-red-100'; // 3+
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resource Workload Calendar</h2>
        <p className="text-sm text-gray-600 mb-6">Shows the first 14 days of the project. Hover over cells to see assigned tasks.</p>

        {/* Legend */}
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-300"></div>
            <span>No tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border border-gray-300"></div>
            <span>1 task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border border-gray-300"></div>
            <span>2 tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border border-gray-300"></div>
            <span>3+ tasks (overloaded)</span>
          </div>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No team members assigned to this project.</p>
            <p className="text-sm mt-2">Add team members in Project Settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold sticky left-0 z-10">
                    Team Member
                  </th>
                  {dates.map((date, idx) => (
                    <th key={idx} className="border border-gray-300 bg-gray-100 px-3 py-2 text-center font-semibold min-w-[80px]">
                      <div className="text-xs">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, memberIdx) => (
                  <tr key={memberIdx}>
                    <td className="border border-gray-300 px-4 py-3 font-medium bg-gray-50 sticky left-0 z-10">
                      {member}
                    </td>
                    {dates.map((date, dateIdx) => {
                      const tasks = getWorkload(member, date);
                      const taskCount = tasks.length;
                      return (
                        <td
                          key={dateIdx}
                          className={`border border-gray-300 px-3 py-3 text-center ${getWorkloadColor(taskCount)} hover:opacity-75 transition cursor-pointer relative group`}
                          title={taskCount > 0 ? tasks.map(t => `${t.wbs} ${t.name}`).join('\n') : 'No tasks'}
                        >
                          {taskCount > 0 && (
                            <>
                              <div className="font-semibold">{taskCount}</div>
                              <div className="hidden group-hover:block absolute z-20 bg-gray-900 text-white text-xs rounded p-2 -mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap shadow-lg">
                                {tasks.map((t, i) => (
                                  <div key={i}>{t.wbs} {t.name}</div>
                                ))}
                              </div>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskNotesModal = ({ task, onSave, onClose }) => {
  const [notes, setNotes] = useState(task.notes || '');

  const handleSave = () => {
    onSave(task.id, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Task Notes</h2>
            <p className="text-sm text-gray-600 mt-1">{task.wbs} {task.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes & Comments
            </label>
            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes, decisions, blockers, or any other information about this task..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this space to track important decisions, blockers, or context for this task
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectSettingsModal = ({ projectData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: projectData.name,
    startDate: projectData.startDate,
    endDate: projectData.endDate,
    workers: projectData.workers.join(', '),
    description: projectData.description || ''
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Project name cannot be empty');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('Start date must be before end date');
      return;
    }

    const updatedData = {
      ...projectData,
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      workers: formData.workers.split(',').map(w => w.trim()).filter(Boolean),
      description: formData.description
    };

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Update project-level information</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <input
              type="text"
              value={formData.workers}
              onChange={(e) => setFormData({ ...formData, workers: e.target.value })}
              placeholder="Enter names (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple names with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Changing project dates will not automatically adjust task dates. 
              Please review and update task dates manually if needed.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const DependencyModal = ({ task, allTasks, onSave, onClose }) => {
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [showHelp, setShowHelp] = useState(false);

  const getChildIds = (taskId) => {
    const children = allTasks.filter(t => t.parentId === taskId);
    let allChildIds = children.map(c => c.id);
    children.forEach(child => {
      allChildIds = [...allChildIds, ...getChildIds(child.id)];
    });
    return allChildIds;
  };

  const childIds = getChildIds(task.id);
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && !childIds.includes(t.id)
  );

  const addDependency = () => {
    setDependencies([...dependencies, { predecessorId: '', type: 'FS', lag: 0 }]);
  };

  const updateDependency = (index, field, value) => {
    const updated = [...dependencies];
    updated[index][field] = value;
    setDependencies(updated);
  };

  const removeDependency = (index) => {
    setDependencies(dependencies.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validDeps = dependencies.filter(d => d.predecessorId);
    onSave(task.id, validDeps);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Dependencies</h2>
            <p className="text-sm text-gray-600 mt-1">{task.wbs} {task.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-blue-900">📚 What are dependencies?</span>
            <ChevronDown size={16} className={`text-blue-700 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
          </button>
          {showHelp && (
            <div className="mt-3 text-sm text-blue-800 space-y-2">
              <p><strong>Dependencies</strong> link tasks together so they happen in the right order.</p>
              <p><strong>Example:</strong> "Site Prep" can't start until "Permit Approval" finishes.</p>
              <p><strong>Finish-to-Start (FS):</strong> This task starts after the other task finishes (most common)</p>
              <p><strong>Lag Time:</strong> Optional delay in days (e.g., concrete needs 7 days to cure)</p>
              <p className="font-medium">💡 When you change a task's dates, all dependent tasks automatically adjust!</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {dependencies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No dependencies yet.</p>
              <p className="text-sm mt-2">This task can start anytime within the project schedule.</p>
            </div>
          ) : (
            dependencies.map((dep, index) => {
              const predecessor = allTasks.find(t => t.id === dep.predecessorId);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        This task starts after:
                      </label>
                      <select
                        value={dep.predecessorId}
                        onChange={(e) => updateDependency(index, 'predecessorId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select a task...</option>
                        {availableTasks.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.wbs} {t.name}
                          </option>
                        ))}
                      </select>
                      {predecessor && (
                        <p className="text-xs text-gray-500 mt-1">
                          Finishes: {DateUtils.formatDate(predecessor.endDate)}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={dep.type}
                        onChange={(e) => updateDependency(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="FS">Finish-to-Start</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Lag (days)
                      </label>
                      <input
                        type="number"
                        value={dep.lag || 0}
                        onChange={(e) => updateDependency(index, 'lag', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeDependency(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={addDependency}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Dependency
        </button>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Dependencies
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTaskModal = ({ mode, parentTask, projectData, allTasks, onAdd, onClose, calculateNextWBS }) => {
  const suggestedWBS = calculateNextWBS(parentTask?.id);
  const [formData, setFormData] = useState({
    wbs: suggestedWBS,
    name: '',
    duration: 5,
    startDate: parentTask?.startDate || projectData.startDate,
    endDate: parentTask?.startDate || projectData.startDate,
    assignedTo: '',
    parentId: parentTask?.id || null
  });

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const endDate = DateUtils.addDays(formData.startDate, parseInt(formData.duration));
      setFormData(prev => ({ ...prev, endDate }));
    }
  }, [formData.duration, formData.startDate]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a task name');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'parent' ? 'Add New Task' : `Add Subtask to ${parentTask?.wbs} ${parentTask?.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WBS Number</label>
              <input
                type="text"
                value={formData.wbs}
                onChange={(e) => setFormData({ ...formData, wbs: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter task name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Enter names (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Available: {projectData.workers.join(', ')}</p>
          </div>

          {mode === 'subtask' && parentTask && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Parent Task:</strong> {parentTask.wbs} {parentTask.name}
                <br />
                <strong>Parent Duration:</strong> {DateUtils.formatDate(parentTask.startDate)} - {DateUtils.formatDate(parentTask.endDate)}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

const AIChatPanel = ({ projectData, tasks, onClose, onAskAI }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Jake, your AI project assistant. I can help you optimize your plan, identify issues, or answer questions about your project. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await onAskAI(input, projectData, tasks);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please make sure your API configuration is correct in the code." 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-50">
      <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <h3 className="font-bold">Ask Jake!</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader2 className="animate-spin" size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Jake anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('form');
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generatePlan = async (formData) => {
    setGenerating(true);
    
    try {
      const response = await fetch('http://https://yepm-mvp-production.up.railway.app/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `You are a professional project manager. Generate a detailed project plan in JSON format.

Project Details:
- Name: ${formData.name}
- Type: ${formData.projectType}
- Complexity: ${formData.complexity}
- Duration: ${formData.startDate} to ${formData.endDate}
- Deliverables: ${formData.deliverables}
- Description: ${formData.description}
- Constraints: ${formData.constraints}
- Team: ${formData.workers.join(', ')}

Create a comprehensive Work Breakdown Structure (WBS) with:
1. Major phases (numbered 1.0, 2.0, etc.)
2. Sub-phases and detailed tasks (1.1, 1.1.1, etc.)
3. Realistic durations in days
4. Logical Finish-to-Start dependencies
5. Resource assignments from the team

Return ONLY valid JSON (no markdown, no backticks) in this exact structure:
{
  "tasks": [
    {
      "id": "task-1",
      "wbs": "1.0",
      "name": "Phase Name",
      "duration": 10,
      "startDate": "2025-01-15",
      "endDate": "2025-01-25",
      "assignedTo": ["Worker Name"],
      "dependencies": [],
      "parentId": null
    },
    {
      "id": "task-2",
      "wbs": "1.1",
      "name": "Sub-task Name",
      "duration": 5,
      "startDate": "2025-01-15",
      "endDate": "2025-01-20",
      "assignedTo": ["Worker Name"],
      "dependencies": [{"predecessorId": "task-1", "type": "FS", "lag": 0}],
      "parentId": "task-1"
    }
  ]
}

Generate 15-25 tasks with proper hierarchy.`
          }]
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      let planText;
      if (data.content && data.content[0]) {
        planText = data.content[0].text;
      } else if (data.text) {
        planText = data.text;
      } else if (typeof data === 'string') {
        planText = data;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected API response format');
      }
      
      planText = planText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log('Plan text:', planText);
      
      const plan = JSON.parse(planText);
      
      setProjectData(formData);
      setTasks(plan.tasks);
      
      const projectId = Date.now().toString();
      StorageManager.saveProject(projectId, {
        metadata: formData,
        tasks: plan.tasks,
        createdAt: new Date().toISOString()
      });
      
      setCurrentView('plan');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate plan. Error: ' + error.message + '\n\nCheck browser console (F12) for details.');
    }
    
    setGenerating(false);
  };

  const handleAskAI = async (question, projectData, tasks) => {
    const response = await fetch('http://https://yepm-mvp-production.up.railway.app/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are Jake, a friendly AI project assistant. Help with this question about the project:

Project: ${projectData.name}
Type: ${projectData.projectType}
Duration: ${projectData.startDate} to ${projectData.endDate}
Total Tasks: ${tasks.length}

Question: ${question}

Provide a helpful, concise answer.`
        }]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  };

  const handleTaskUpdate = (taskId, updatedTasks) => {
    if (taskId === 'PROJECT_SETTINGS_UPDATE') {
      // Update project data
      setProjectData(updatedTasks);
    } else if (Array.isArray(updatedTasks)) {
      setTasks(updatedTasks);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? updatedTasks : t));
    }
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-green-600" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">AI is building your project plan...</h2>
          <p className="text-gray-600 mt-2">This may take 10-20 seconds</p>
        </div>
      </div>
    );
  }

  if (currentView === 'form') {
    return <ProjectIntakeForm onGenerate={generatePlan} />;
  }

  return (
    <ProjectPlanView
      projectData={projectData}
      tasks={tasks}
      onTaskUpdate={handleTaskUpdate}
      onAskAI={handleAskAI}
    />
  );
};

export default App;
