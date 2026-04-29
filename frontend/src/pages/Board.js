import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects, useDraggable, useDroppable } from '@dnd-kit/core';
import { getTasks, updateTask } from '../services/api';

const KanbanCard = ({ task, isOverlay }) => {
  const priorityColors = {
    high: 'bg-rose-100 text-rose-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 cursor-grab active:cursor-grabbing ${isOverlay ? 'shadow-xl ring-2 ring-indigo-500 scale-105 rotate-2' : 'hover:shadow-md transition-shadow'}`}>
      <div className="flex justify-between items-start">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${priorityColors[task.priority] || 'bg-slate-100 text-slate-700'}`}>
          {task.priority}
        </span>
      </div>
      <h4 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h4>
      {task.dueDate && (
        <div className="text-xs text-slate-500 font-medium mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
};

const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <KanbanCard task={task} />
    </div>
  );
};

const DroppableColumn = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const bgColors = {
    'todo': 'bg-slate-100 border-slate-200',
    'in-progress': 'bg-blue-50 border-blue-200',
    'done': 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className="flex flex-col flex-1 min-w-[300px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-3xl border p-4 flex flex-col gap-3 transition-colors ${bgColors[id]} ${isOver ? 'ring-2 ring-indigo-400 ring-inset bg-opacity-50' : ''}`}
      >
        {tasks.map(task => <DraggableTask key={task._id} task={task} />)}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm font-medium min-h-[100px]">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  // Ensures the drag only starts after a tiny bit of movement (helps prevent accidental drags when clicking)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    const task = active.data.current;

    if (task.status !== newStatus) {
      setTasks(current => current.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      try {
        await updateTask(taskId, { status: newStatus });
      } catch (error) {
        console.error("Failed to update task status", error);
        fetchTasks(); // Revert back if API fails
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
        <p className="mt-2 text-slate-600">Drag and drop tasks to seamlessly update their status.</p>
      </div>

      <DndContext sensors={sensors} onDragStart={(e) => setActiveTask(e.active.data.current)} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-x-auto pb-4">
          <DroppableColumn id="todo" title="To Do" tasks={tasks.filter(t => t.status === 'todo')} />
          <DroppableColumn id="in-progress" title="In Progress" tasks={tasks.filter(t => t.status === 'in-progress')} />
          <DroppableColumn id="done" title="Done" tasks={tasks.filter(t => t.status === 'done')} />
        </div>
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}