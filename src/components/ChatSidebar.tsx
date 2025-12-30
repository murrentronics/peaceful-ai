import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Project } from '@/hooks/useProjects';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  collapsed,
  onToggleCollapse,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onRenameProject(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-full border-r border-border/50 bg-muted/30 flex flex-col"
    >
      <div className="p-3 border-b border-border/50 flex items-center justify-between gap-2">
        {!collapsed && (
          <Button
            onClick={onCreateProject}
            className="flex-1 gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {collapsed ? (
        <div className="flex-1 flex flex-col items-center pt-3 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={onCreateProject}
          >
            <Plus className="h-5 w-5" />
          </Button>
          {projects.slice(0, 8).map((project) => (
            <Button
              key={project.id}
              variant={currentProjectId === project.id ? 'secondary' : 'ghost'}
              size="icon"
              className="h-10 w-10"
              onClick={() => onSelectProject(project.id)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          ))}
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  layout
                >
                  {editingId === project.id ? (
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-muted">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveEdit}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                        currentProjectId === project.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      )}
                      onClick={() => onSelectProject(project.id)}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(project);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {projects.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No chats yet. Start a new one!
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
};

export default ChatSidebar;
