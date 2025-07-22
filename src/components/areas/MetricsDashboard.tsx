import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Line,
  Bar,
  Pie,
  Radar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KPI {
  id: number;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  priority: 'high' | 'medium' | 'low';
  frequency: 'daily' | 'weekly' | 'monthly';
  historical: { date: string; value: number }[];
  threshold: {
    critical: number;
    warning: number;
  };
}

interface MetricsDashboardProps {
  areaId: number;
  areaName: string;
}

const defaultKPIs: KPI[] = [
  {
    id: 1,
    name: "Satisfacción del equipo",
    description: "Nivel de satisfacción promedio del equipo (encuesta semanal)",
    currentValue: 8.2,
    targetValue: 9.0,
    unit: "/10",
    trend: 'up',
    category: "Clima laboral",
    priority: 'high',
    frequency: 'weekly',
    historical: [
      { date: '2024-01-01', value: 7.5 },
      { date: '2024-01-08', value: 7.8 },
      { date: '2024-01-15', value: 8.0 },
      { date: '2024-01-22', value: 8.2 }
    ],
    threshold: {
      critical: 6.0,
      warning: 7.0
    }
  },
  {
    id: 2,
    name: "Velocidad de entrega",
    description: "Porcentaje de tareas completadas a tiempo",
    currentValue: 85,
    targetValue: 95,
    unit: "%",
    trend: 'down',
    category: "Productividad",
    priority: 'high',
    frequency: 'weekly',
    historical: [
      { date: '2024-01-01', value: 88 },
      { date: '2024-01-08', value: 90 },
      { date: '2024-01-15', value: 87 },
      { date: '2024-01-22', value: 85 }
    ],
    threshold: {
      critical: 70,
      warning: 80
    }
  },
  {
    id: 3,
    name: "Tiempo de respuesta",
    description: "Tiempo promedio de respuesta a incidentes",
    currentValue: 15,
    targetValue: 10,
    unit: "min",
    trend: 'stable',
    category: "Calidad",
    priority: 'medium',
    frequency: 'daily',
    historical: [
      { date: '2024-01-19', value: 12 },
      { date: '2024-01-20', value: 18 },
      { date: '2024-01-21', value: 14 },
      { date: '2024-01-22', value: 15 }
    ],
    threshold: {
      critical: 30,
      warning: 20
    }
  },
  {
    id: 4,
    name: "Horas de formación",
    description: "Horas de formación del equipo por semana",
    currentValue: 6,
    targetValue: 8,
    unit: "h/sem",
    trend: 'up',
    category: "Desarrollo",
    priority: 'medium',
    frequency: 'weekly',
    historical: [
      { date: '2024-01-01', value: 4 },
      { date: '2024-01-08', value: 5 },
      { date: '2024-01-15', value: 5.5 },
      { date: '2024-01-22', value: 6 }
    ],
    threshold: {
      critical: 2,
      warning: 4
    }
  }
];

export default function MetricsDashboard({ areaId, areaName }: MetricsDashboardProps) {
  const kpis = defaultKPIs;

  const getKPIStatus = (kpi: KPI) => {
    const { currentValue, targetValue, threshold } = kpi;
    const progress = (currentValue / targetValue) * 100;
    
    if (currentValue <= threshold.critical) return 'critical';
    if (currentValue <= threshold.warning) return 'warning';
    if (progress >= 100) return 'excellent';
    if (progress >= 80) return 'good';
    return 'needs-improvement';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'needs-improvement': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'needs-improvement': return 'Mejorar';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Normal';
    }
  };

  // Chart data
  const trendData = useMemo(() => {
    const labels = kpis[0]?.historical.map(h => 
      new Date(h.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    ) || [];
    
    return {
      labels,
      datasets: kpis.map((kpi, index) => ({
        label: kpi.name,
        data: kpi.historical.map(h => h.value),
        borderColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        backgroundColor: `hsla(${(index * 137.5) % 360}, 70%, 50%, 0.1)`,
        fill: false,
        tension: 0.4,
      }))
    };
  }, [kpis]);

  const performanceData = useMemo(() => {
    return {
      labels: kpis.map(kpi => kpi.name),
      datasets: [
        {
          label: 'Valor Actual',
          data: kpis.map(kpi => (kpi.currentValue / kpi.targetValue) * 100),
          backgroundColor: kpis.map((kpi, index) => 
            `hsla(${(index * 137.5) % 360}, 70%, 50%, 0.8)`
          ),
          borderColor: kpis.map((kpi, index) => 
            `hsl(${(index * 137.5) % 360}, 70%, 50%)`
          ),
          borderWidth: 2,
        }
      ]
    };
  }, [kpis]);

  const categoryData = useMemo(() => {
    const categories = [...new Set(kpis.map(kpi => kpi.category))];
    const categoryPerformance = categories.map(category => {
      const categoryKPIs = kpis.filter(kpi => kpi.category === category);
      const avgPerformance = categoryKPIs.reduce((acc, kpi) => 
        acc + (kpi.currentValue / kpi.targetValue) * 100, 0
      ) / categoryKPIs.length;
      return avgPerformance;
    });

    return {
      labels: categories,
      datasets: [
        {
          data: categoryPerformance,
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-5))',
          ],
          borderWidth: 2,
          borderColor: 'hsl(var(--background))',
        }
      ]
    };
  }, [kpis]);

  const radarData = useMemo(() => {
    return {
      labels: kpis.map(kpi => kpi.name),
      datasets: [
        {
          label: 'Rendimiento Actual',
          data: kpis.map(kpi => (kpi.currentValue / kpi.targetValue) * 100),
          backgroundColor: 'hsla(var(--para-areas), 0.2)',
          borderColor: 'hsl(var(--para-areas))',
          pointBackgroundColor: 'hsl(var(--para-areas))',
          pointBorderColor: 'hsl(var(--background))',
          pointHoverBackgroundColor: 'hsl(var(--background))',
          pointHoverBorderColor: 'hsl(var(--para-areas))',
        }
      ]
    };
  }, [kpis]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 120,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Panel de Métricas</h2>
        <Badge variant="outline">{areaName}</Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">KPIs Totales</p>
                <p className="text-2xl font-bold text-para-areas">{kpis.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cumpliendo Meta</p>
                <p className="text-2xl font-bold text-green-600">
                  {kpis.filter(kpi => kpi.currentValue >= kpi.targetValue).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Necesitan Atención</p>
                <p className="text-2xl font-bold text-orange-600">
                  {kpis.filter(kpi => getKPIStatus(kpi) === 'warning' || getKPIStatus(kpi) === 'needs-improvement').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Estado Crítico</p>
                <p className="text-2xl font-bold text-red-600">
                  {kpis.filter(kpi => getKPIStatus(kpi) === 'critical').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpis.map(kpi => {
          const status = getKPIStatus(kpi);
          const progress = Math.min((kpi.currentValue / kpi.targetValue) * 100, 120);
          
          return (
            <Card key={kpi.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{kpi.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {kpi.category}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                      {kpi.trend === 'stable' && <BarChart3 className="h-4 w-4 text-blue-600" />}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Current Value */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-para-areas">
                    {kpi.currentValue}
                    <span className="text-lg text-muted-foreground ml-1">{kpi.unit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Meta: {kpi.targetValue}{kpi.unit}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso hacia meta</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-3"
                  />
                </div>

                {/* Thresholds */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Crítico</p>
                    <p className="font-medium text-red-600">≤ {kpi.threshold.critical}{kpi.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Advertencia</p>
                    <p className="font-medium text-yellow-600">≤ {kpi.threshold.warning}{kpi.unit}</p>
                  </div>
                </div>

                {/* Mini Trend */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Últimas mediciones</p>
                  <div className="flex gap-1">
                    {kpi.historical.slice(-7).map((point, index) => {
                      const height = (point.value / kpi.targetValue) * 40;
                      const isLast = index === kpi.historical.slice(-7).length - 1;
                      
                      return (
                        <div
                          key={point.date}
                          className={`flex-1 bg-para-areas/20 rounded-t ${
                            isLast ? 'bg-para-areas' : ''
                          }`}
                          style={{ height: `${Math.max(height, 4)}px` }}
                          title={`${new Date(point.date).toLocaleDateString('es-ES')}: ${point.value}${kpi.unit}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          <TabsTrigger value="radar">Vista Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias Históricas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={trendData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento vs Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={performanceData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie data={categoryData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Vista General de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}