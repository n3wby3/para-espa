import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Clock,
  Star
} from "lucide-react";

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  category: string;
  isActive: boolean;
  completedDates: string[];
  lastCompleted?: string;
}

interface HabitTrackerProps {
  areaId: number;
  areaName: string;
}

const defaultHabits: Habit[] = [
  {
    id: 1,
    name: "Ejercicio matutino",
    description: "30 minutos de ejercicio físico",
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 5,
    longestStreak: 12,
    category: "Salud",
    isActive: true,
    completedDates: ['2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21', '2024-01-22'],
    lastCompleted: '2024-01-22'
  },
  {
    id: 2,
    name: "Lectura técnica",
    description: "Leer artículos de desarrollo",
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 3,
    longestStreak: 8,
    category: "Desarrollo",
    isActive: true,
    completedDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
    lastCompleted: '2024-01-22'
  },
  {
    id: 3,
    name: "Planificación semanal",
    description: "Revisar objetivos y planificar la semana",
    frequency: 'weekly',
    targetCount: 1,
    currentStreak: 2,
    longestStreak: 4,
    category: "Productividad",
    isActive: true,
    completedDates: ['2024-01-15', '2024-01-22'],
    lastCompleted: '2024-01-22'
  }
];

export default function HabitTracker({ areaId, areaName }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const markHabitComplete = (habitId: number, date: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompletedDates = [...habit.completedDates];
          const dateIndex = newCompletedDates.indexOf(date);
          
          if (dateIndex > -1) {
            // Remove if already completed
            newCompletedDates.splice(dateIndex, 1);
          } else {
            // Add completion
            newCompletedDates.push(date);
          }
          
          // Calculate new streak
          const sortedDates = newCompletedDates.sort();
          let currentStreak = 0;
          const today = new Date();
          const checkDate = new Date(today);
          
          while (checkDate >= new Date(sortedDates[0] || today)) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (sortedDates.includes(dateStr)) {
              currentStreak++;
            } else {
              break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
          }
          
          return {
            ...habit,
            completedDates: newCompletedDates,
            currentStreak,
            longestStreak: Math.max(habit.longestStreak, currentStreak),
            lastCompleted: newCompletedDates.length > 0 ? date : undefined
          };
        }
        return habit;
      })
    );
  };

  const isHabitCompletedOnDate = (habit: Habit, date: string) => {
    return habit.completedDates.includes(date);
  };

  const getHabitProgress = (habit: Habit) => {
    const today = new Date();
    const startOfPeriod = new Date(today);
    
    switch (habit.frequency) {
      case 'daily':
        return habit.completedDates.includes(today.toISOString().split('T')[0]) ? 100 : 0;
      case 'weekly':
        startOfPeriod.setDate(today.getDate() - today.getDay());
        break;
      case 'monthly':
        startOfPeriod.setDate(1);
        break;
    }
    
    const periodDates = habit.completedDates.filter(date => 
      new Date(date) >= startOfPeriod
    );
    
    return Math.min((periodDates.length / habit.targetCount) * 100, 100);
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      default: return frequency;
    }
  };

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Seguimiento de Hábitos</h2>
        <Badge variant="outline">{areaName}</Badge>
      </div>

      {/* Habit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Hábitos Activos</p>
                <p className="text-2xl font-bold text-para-areas">
                  {habits.filter(h => h.isActive).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completados Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {habits.filter(h => isHabitCompletedOnDate(h, new Date().toISOString().split('T')[0])).length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Racha Promedio</p>
                <p className="text-2xl font-bold text-para-areas">
                  {Math.round(habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {habits.map(habit => {
          const progress = getHabitProgress(habit);
          const isCompletedToday = isHabitCompletedOnDate(habit, new Date().toISOString().split('T')[0]);
          
          return (
            <Card key={habit.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {habit.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getFrequencyText(habit.frequency)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                  <Switch
                    checked={habit.isActive}
                    onCheckedChange={(checked) => 
                      setHabits(prev => prev.map(h => 
                        h.id === habit.id ? { ...h, isActive: checked } : h
                      ))
                    }
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso {getFrequencyText(habit.frequency).toLowerCase()}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Streaks */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Racha Actual</p>
                    <p className="font-bold text-lg text-para-areas">{habit.currentStreak}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Mejor Racha</p>
                    <p className="font-bold text-lg text-orange-600">{habit.longestStreak}</p>
                  </div>
                </div>

                {/* Last Completed */}
                {habit.lastCompleted && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Último completado</p>
                    <p className="font-medium">
                      {new Date(habit.lastCompleted).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Quick Complete for Today */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isCompletedToday}
                    onCheckedChange={() => 
                      markHabitComplete(habit.id, new Date().toISOString().split('T')[0])
                    }
                  />
                  <span className="text-sm">
                    {isCompletedToday ? 'Completado hoy' : 'Marcar como completado hoy'}
                  </span>
                </div>

                {/* Mini Calendar View */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Últimos 7 días</p>
                  <div className="flex gap-1">
                    {calendarDates.slice(-7).map(date => {
                      const isCompleted = isHabitCompletedOnDate(habit, date);
                      const isToday = date === new Date().toISOString().split('T')[0];
                      
                      return (
                        <div
                          key={date}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs cursor-pointer transition-all ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : isToday
                                ? 'border-para-areas bg-para-areas/10'
                                : 'border-muted bg-muted/30'
                          }`}
                          onClick={() => markHabitComplete(habit.id, date)}
                        >
                          {new Date(date).getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay hábitos definidos</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando hábitos para esta área de responsabilidad
            </p>
            <Button className="gap-2">
              <Star className="h-4 w-4" />
              Crear Primer Hábito
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}