import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus,
  Play,
  Pause,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface RecurringTask {
  id: number;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  schedule: string; // cron-like expression
  nextRun: Date;
  lastRun?: Date;
  isActive: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  autoExecute: boolean;
  notifications: boolean;
  completedRuns: number;
}

interface TaskAutomationProps {
  areaId: number;
  areaName: string;
}

const defaultTasks: RecurringTask[] = [
  {
    id: 1,
    title: "Revisión semanal de métricas",
    description: "Analizar KPIs y generar reporte de progreso",
    frequency: 'weekly',
    schedule: '0 9 * * 1', // Lunes a las 9:00
    nextRun: new Date(2024, 1, 26, 9, 0),
    lastRun: new Date(2024, 1, 19, 9, 0),
    isActive: true,
    category: "Análisis",
    priority: 'high',
    autoExecute: false,
    notifications: true,
    completedRuns: 4
  },
  {
    id: 2,
    title: "Backup de documentos",
    description: "Respaldar documentos importantes del área",
    frequency: 'weekly',
    schedule: '0 22 * * 0', // Domingo a las 22:00
    nextRun: new Date(2024, 1, 25, 22, 0),
    lastRun: new Date(2024, 1, 18, 22, 0),
    isActive: true,
    category: "Mantenimiento",
    priority: 'medium',
    autoExecute: true,
    notifications: false,
    completedRuns: 8
  },
  {
    id: 3,
    title: "Planificación mensual",
    description: "Definir objetivos y prioridades para el próximo mes",
    frequency: 'monthly',
    schedule: '0 10 28-31 * *', // Últimos días del mes a las 10:00
    nextRun: new Date(2024, 1, 29, 10, 0),
    lastRun: new Date(2024, 0, 30, 10, 0),
    isActive: true,
    category: "Planificación",
    priority: 'high',
    autoExecute: false,
    notifications: true,
    completedRuns: 2
  }
];

export default function TaskAutomation({ areaId, areaName }: TaskAutomationProps) {
  const [tasks, setTasks] = useState<RecurringTask[]>(defaultTasks);

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      default: return frequency;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const toggleTaskActive = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    ));
  };

  const executeTask = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // Calculate next run based on frequency
        const nextRun = new Date();
        switch (task.frequency) {
          case 'daily':
            nextRun.setDate(nextRun.getDate() + 1);
            break;
          case 'weekly':
            nextRun.setDate(nextRun.getDate() + 7);
            break;
          case 'monthly':
            nextRun.setMonth(nextRun.getMonth() + 1);
            break;
          case 'quarterly':
            nextRun.setMonth(nextRun.getMonth() + 3);
            break;
        }
        
        return {
          ...task,
          lastRun: new Date(),
          nextRun,
          completedRuns: task.completedRuns + 1
        };
      }
      return task;
    }));
  };

  const isOverdue = (task: RecurringTask) => {
    return task.nextRun < new Date() && task.isActive;
  };

  const getTimeUntilNext = (nextRun: Date) => {
    const now = new Date();
    const diff = nextRun.getTime() - now.getTime();
    
    if (diff < 0) return 'Vencido';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Automatización de Tareas</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{areaName}</Badge>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Tarea Automática
          </Button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tareas Activas</p>
                <p className="text-2xl font-bold text-para-areas">
                  {tasks.filter(t => t.isActive).length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => isOverdue(t)).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Ejecutadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.reduce((acc, t) => acc + t.completedRuns, 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Automáticas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.autoExecute).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map(task => {
          const overdue = isOverdue(task);
          const timeUntil = getTimeUntilNext(task.nextRun);
          
          return (
            <Card 
              key={task.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                overdue ? 'ring-2 ring-red-500/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {task.category}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getFrequencyText(task.frequency)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={task.isActive}
                      onCheckedChange={() => toggleTaskActive(task.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => executeTask(task.id)}
                      disabled={!task.isActive}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Ejecutar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Schedule Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Próxima ejecución</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                        {task.nextRun.toLocaleDateString('es-ES', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className={`text-xs ${overdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {timeUntil}
                    </p>
                  </div>
                  
                  {task.lastRun && (
                    <div>
                      <p className="text-muted-foreground mb-1">Última ejecución</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {task.lastRun.toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Ejecuciones completadas</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{task.completedRuns}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={task.autoExecute} 
                      onCheckedChange={(checked) => 
                        setTasks(prev => prev.map(t => 
                          t.id === task.id ? { ...t, autoExecute: checked } : t
                        ))
                      }
                    />
                    <span>Ejecución automática</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={task.notifications} 
                      onCheckedChange={(checked) => 
                        setTasks(prev => prev.map(t => 
                          t.id === task.id ? { ...t, notifications: checked } : t
                        ))
                      }
                    />
                    <span>Notificaciones</span>
                  </div>
                </div>

                {/* Status indicators */}
                <div className="flex gap-2">
                  {task.autoExecute && (
                    <Badge variant="outline" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Automática
                    </Badge>
                  )}
                  {task.notifications && (
                    <Badge variant="outline" className="text-xs">
                      Notificaciones activas
                    </Badge>
                  )}
                  {overdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Vencida
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay tareas automáticas</h3>
            <p className="text-muted-foreground mb-4">
              Automatiza tareas recurrentes para esta área de responsabilidad
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primera Automatización
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}