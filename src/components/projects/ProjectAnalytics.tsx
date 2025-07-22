import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Proyecto {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  progreso: number;
  etiquetas: string[];
  responsable: string;
}

interface ProjectAnalyticsProps {
  proyectos: Proyecto[];
}

export default function ProjectAnalytics({ proyectos }: ProjectAnalyticsProps) {
  // Estado distribution
  const estadoData = {
    labels: ['En Progreso', 'Pausado', 'Completado'],
    datasets: [
      {
        data: [
          proyectos.filter(p => p.estado === 'En progreso').length,
          proyectos.filter(p => p.estado === 'Pausado').length,
          proyectos.filter(p => p.estado === 'Completado').length,
        ],
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
        ],
        borderWidth: 2,
        borderColor: 'hsl(var(--background))',
      },
    ],
  };

  // Prioridad distribution
  const prioridadData = {
    labels: ['Alta', 'Media', 'Baja'],
    datasets: [
      {
        label: 'Proyectos por Prioridad',
        data: [
          proyectos.filter(p => p.prioridad === 'Alta').length,
          proyectos.filter(p => p.prioridad === 'Media').length,
          proyectos.filter(p => p.prioridad === 'Baja').length,
        ],
        backgroundColor: [
          'hsl(var(--destructive))',
          'hsl(var(--warning))',
          'hsl(var(--success))',
        ],
      },
    ],
  };

  // Progress distribution
  const progressRanges = ['0-25%', '26-50%', '51-75%', '76-100%'];
  const progressData = {
    labels: progressRanges,
    datasets: [
      {
        label: 'Distribución de Progreso',
        data: [
          proyectos.filter(p => p.progreso <= 25).length,
          proyectos.filter(p => p.progreso > 25 && p.progreso <= 50).length,
          proyectos.filter(p => p.progreso > 50 && p.progreso <= 75).length,
          proyectos.filter(p => p.progreso > 75).length,
        ],
        backgroundColor: 'hsl(var(--para-projects))',
        borderColor: 'hsl(var(--para-projects))',
        borderWidth: 1,
      },
    ],
  };

  // Monthly creation trend
  const monthlyData = (() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const data = months.map((_, index) => {
      return proyectos.filter(p => {
        const month = new Date(p.fechaCreacion).getMonth();
        return month === index;
      }).length;
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Proyectos Creados',
          data,
          borderColor: 'hsl(var(--para-projects))',
          backgroundColor: 'hsla(var(--para-projects), 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  })();

  // Team performance
  const teamData = (() => {
    const teams = [...new Set(proyectos.map(p => p.responsable))];
    const completedByTeam = teams.map(team => 
      proyectos.filter(p => p.responsable === team && p.estado === 'Completado').length
    );
    const totalByTeam = teams.map(team => 
      proyectos.filter(p => p.responsable === team).length
    );

    return {
      labels: teams,
      datasets: [
        {
          label: 'Completados',
          data: completedByTeam,
          backgroundColor: 'hsl(var(--success))',
        },
        {
          label: 'Total',
          data: totalByTeam,
          backgroundColor: 'hsl(var(--muted))',
        },
      ],
    };
  })();

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
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analíticas de Proyectos</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="teams">Equipos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Pie data={estadoData} options={pieOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Prioridad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={prioridadData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={progressData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Creación Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={monthlyData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={teamData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}