import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Clock, Calendar } from "lucide-react";

interface TimeEntry {
  id: number;
  projectId: number;
  projectTitle: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  description: string;
  date: string;
}

interface TimeTrackerProps {
  projectId?: number;
  projectTitle?: string;
}

export default function TimeTracker({ projectId, projectTitle }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: 1,
      projectId: 1,
      projectTitle: "Rediseño de la aplicación móvil",
      startTime: new Date(2024, 1, 15, 9, 0),
      endTime: new Date(2024, 1, 15, 11, 30),
      duration: 9000, // 2.5 hours
      description: "Diseño de wireframes",
      date: "2024-02-15"
    },
    {
      id: 2,
      projectId: 1,
      projectTitle: "Rediseño de la aplicación móvil",
      startTime: new Date(2024, 1, 16, 14, 0),
      endTime: new Date(2024, 1, 16, 17, 0),
      duration: 10800, // 3 hours
      description: "Desarrollo de componentes",
      date: "2024-02-16"
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
    setCurrentTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (startTime && projectId && projectTitle) {
      const newEntry: TimeEntry = {
        id: Date.now(),
        projectId,
        projectTitle,
        startTime,
        endTime: new Date(),
        duration: currentTime,
        description: "Tiempo registrado",
        date: new Date().toISOString().split('T')[0]
      };
      
      setTimeEntries(prev => [newEntry, ...prev]);
    }
    
    setIsRunning(false);
    setCurrentTime(0);
    setStartTime(null);
  };

  const getTotalTimeForProject = (projectId: number) => {
    return timeEntries
      .filter(entry => entry.projectId === projectId)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const getTotalTimeToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Seguimiento de Tiempo</h2>
      </div>

      {/* Timer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timer Activo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projectTitle && (
            <div>
              <p className="text-sm text-muted-foreground">Proyecto actual:</p>
              <p className="font-medium">{projectTitle}</p>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-para-projects mb-4">
              {formatTime(currentTime)}
            </div>
            
            <div className="flex justify-center gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} className="gap-2" disabled={!projectId}>
                  <Play className="h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <>
                  <Button onClick={handlePause} variant="outline" className="gap-2">
                    <Pause className="h-4 w-4" />
                    Pausar
                  </Button>
                  <Button onClick={handleStop} variant="destructive" className="gap-2">
                    <Square className="h-4 w-4" />
                    Finalizar
                  </Button>
                </>
              )}
            </div>
          </div>

          {!projectId && (
            <p className="text-sm text-muted-foreground text-center">
              Selecciona un proyecto para comenzar a registrar tiempo
            </p>
          )}
        </CardContent>
      </Card>

      {/* Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Hoy</p>
                <p className="text-2xl font-bold text-para-projects">
                  {formatDuration(getTotalTimeToday())}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        {projectId && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Este Proyecto</p>
                  <p className="text-2xl font-bold text-para-projects">
                    {formatDuration(getTotalTimeForProject(projectId))}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Entradas</p>
                <p className="text-2xl font-bold text-para-projects">
                  {timeEntries.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{entry.projectTitle}</p>
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    {formatDuration(entry.duration)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - 
                    {entry.endTime?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay entradas de tiempo registradas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}