import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarDays,
  FileText,
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Send
} from "lucide-react";

interface Review {
  id: number;
  date: string;
  type: 'weekly' | 'monthly' | 'quarterly';
  status: 'completed' | 'pending' | 'scheduled';
  kpiSummary: {
    improved: number;
    maintained: number;
    declined: number;
  };
  achievements: string[];
  challenges: string[];
  actionItems: string[];
  notes: string;
  nextReviewDate: string;
}

interface ScheduledReviewsProps {
  areaId: number;
  areaName: string;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    date: '2024-01-22',
    type: 'weekly',
    status: 'completed',
    kpiSummary: {
      improved: 2,
      maintained: 1,
      declined: 1
    },
    achievements: [
      'Implementación exitosa del nuevo proceso de onboarding',
      'Reducción del 15% en tiempo de respuesta a incidentes',
      'Incremento en la satisfacción del equipo a 8.2/10'
    ],
    challenges: [
      'Dificultades en la coordinación entre equipos remotos',
      'Retraso en la implementación de herramientas de automatización'
    ],
    actionItems: [
      'Implementar reuniones diarias de sincronización',
      'Evaluar herramientas alternativas de automatización',
      'Crear guía de mejores prácticas para trabajo remoto'
    ],
    notes: 'Progreso general positivo. Enfocar esfuerzos en mejorar la coordinación del equipo.',
    nextReviewDate: '2024-01-29'
  },
  {
    id: 2,
    date: '2024-01-29',
    type: 'weekly',
    status: 'pending',
    kpiSummary: {
      improved: 0,
      maintained: 0,
      declined: 0
    },
    achievements: [],
    challenges: [],
    actionItems: [],
    notes: '',
    nextReviewDate: '2024-02-05'
  },
  {
    id: 3,
    date: '2024-02-01',
    type: 'monthly',
    status: 'scheduled',
    kpiSummary: {
      improved: 0,
      maintained: 0,
      declined: 0
    },
    achievements: [],
    challenges: [],
    actionItems: [],
    notes: '',
    nextReviewDate: '2024-03-01'
  }
];

export default function ScheduledReviews({ areaId, areaName }: ScheduledReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getReviewTypeText = (type: string) => {
    switch (type) {
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'scheduled': return 'Programada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const completeReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'completed' as const }
        : review
    ));
  };

  const generateReport = (review: Review) => {
    const reportContent = `
REPORTE DE REVISIÓN ${getReviewTypeText(review.type).toUpperCase()}
Área: ${areaName}
Fecha: ${new Date(review.date).toLocaleDateString('es-ES')}

RESUMEN DE KPIs:
- Mejorados: ${review.kpiSummary.improved}
- Mantenidos: ${review.kpiSummary.maintained}
- Disminuidos: ${review.kpiSummary.declined}

LOGROS:
${review.achievements.map(achievement => `• ${achievement}`).join('\n')}

DESAFÍOS:
${review.challenges.map(challenge => `• ${challenge}`).join('\n')}

ELEMENTOS DE ACCIÓN:
${review.actionItems.map(action => `• ${action}`).join('\n')}

NOTAS:
${review.notes}

Próxima revisión: ${new Date(review.nextReviewDate).toLocaleDateString('es-ES')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revision_${review.type}_${review.date}_${areaName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revisiones Programadas</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{areaName}</Badge>
          <Button className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Nueva Revisión
          </Button>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.status === 'completed').length}
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
                <p className="text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Programadas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reviews.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-para-areas">
                  {reviews.length}
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reviews.map(review => {
          const isPending = review.status === 'pending';
          const isOverdue = isPending && new Date(review.date) < new Date();
          
          return (
            <Card 
              key={review.id}
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                isOverdue ? 'ring-2 ring-red-500/20' : ''
              }`}
              onClick={() => setSelectedReview(review)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">
                        Revisión {getReviewTypeText(review.type)}
                      </CardTitle>
                      <Badge className={getStatusColor(review.status)}>
                        {getStatusIcon(review.status)}
                        <span className="ml-1">{getStatusText(review.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      Vencida
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* KPI Summary */}
                {review.status === 'completed' && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-bold">{review.kpiSummary.improved}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Mejorados</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600">
                        <Target className="h-4 w-4" />
                        <span className="font-bold">{review.kpiSummary.maintained}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Mantenidos</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-bold">{review.kpiSummary.declined}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Disminuidos</p>
                    </div>
                  </div>
                )}

                {/* Summary Content */}
                {review.status === 'completed' && (
                  <div className="space-y-2 text-sm">
                    {review.achievements.length > 0 && (
                      <div>
                        <p className="font-medium text-green-600 mb-1">Logros principales:</p>
                        <ul className="text-xs text-muted-foreground">
                          {review.achievements.slice(0, 2).map((achievement, index) => (
                            <li key={index}>• {achievement}</li>
                          ))}
                          {review.achievements.length > 2 && (
                            <li>... y {review.achievements.length - 2} más</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {review.actionItems.length > 0 && (
                      <div>
                        <p className="font-medium text-blue-600 mb-1">Acciones pendientes:</p>
                        <ul className="text-xs text-muted-foreground">
                          {review.actionItems.slice(0, 2).map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                          {review.actionItems.length > 2 && (
                            <li>... y {review.actionItems.length - 2} más</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Review */}
                <div className="text-sm border-t pt-3">
                  <p className="text-muted-foreground mb-1">
                    {review.status === 'completed' ? 'Próxima revisión:' : 'Programada para:'}
                  </p>
                  <p className="font-medium">
                    {new Date(review.nextReviewDate).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {isPending && (
                    <Button 
                      variant="areas" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        completeReview(review.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completar
                    </Button>
                  )}
                  
                  {review.status === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateReport(review);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Detail Modal would go here */}
      {selectedReview && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Detalles de Revisión {getReviewTypeText(selectedReview.type)} - 
              {new Date(selectedReview.date).toLocaleDateString('es-ES')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Detailed view implementation would go here */}
            <p className="text-muted-foreground">
              Vista detallada de la revisión seleccionada...
            </p>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay revisiones programadas</h3>
            <p className="text-muted-foreground mb-4">
              Programa revisiones automáticas para esta área de responsabilidad
            </p>
            <Button className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Programar Primera Revisión
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}