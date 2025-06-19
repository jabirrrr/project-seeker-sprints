
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Settings } from "lucide-react";

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  priority: "low" | "medium" | "high";
  dependencies: string[];
  status: "not-started" | "in-progress" | "completed" | "blocked";
}

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "planning";
  startDate: string;
  endDate: string;
  progress: number;
  teamMembers: number;
}

interface TimelineViewProps {
  project: Project;
}

const sampleTasks: Task[] = [
  {
    id: "1",
    name: "Project Planning & Research",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    progress: 100,
    assignee: "Sarah Johnson",
    priority: "high",
    dependencies: [],
    status: "completed",
  },
  {
    id: "2",
    name: "UI/UX Design",
    startDate: "2024-01-26",
    endDate: "2024-02-15",
    progress: 85,
    assignee: "Mike Chen",
    priority: "high",
    dependencies: ["1"],
    status: "in-progress",
  },
  {
    id: "3",
    name: "Frontend Development",
    startDate: "2024-02-10",
    endDate: "2024-03-15",
    progress: 45,
    assignee: "Alex Rodriguez",
    priority: "medium",
    dependencies: ["2"],
    status: "in-progress",
  },
  {
    id: "4",
    name: "Backend Development",
    startDate: "2024-02-01",
    endDate: "2024-03-10",
    progress: 60,
    assignee: "Emily Davis",
    priority: "medium",
    dependencies: ["1"],
    status: "in-progress",
  },
  {
    id: "5",
    name: "Testing & QA",
    startDate: "2024-03-16",
    endDate: "2024-03-25",
    progress: 0,
    assignee: "David Wilson",
    priority: "high",
    dependencies: ["3", "4"],
    status: "not-started",
  },
  {
    id: "6",
    name: "Deployment",
    startDate: "2024-03-26",
    endDate: "2024-03-30",
    progress: 0,
    assignee: "Sarah Johnson",
    priority: "high",
    dependencies: ["5"],
    status: "not-started",
  },
];

const TimelineView = ({ project }: TimelineViewProps) => {
  const [tasks] = useState<Task[]>(sampleTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      case "not-started":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const getDaysFromStart = (dateString: string, projectStart: string) => {
    const taskDate = new Date(dateString);
    const startDate = new Date(projectStart);
    const diffTime = taskDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTaskDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalProjectDays = getDaysFromStart(project.endDate, project.startDate);

  return (
    <div className="p-6 space-y-6">
      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter((t) => t.status === "blocked").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Timeline</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                View Options
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 border-b pb-2">
              <div className="w-64">Task Name</div>
              <div className="w-32">Assignee</div>
              <div className="w-24">Priority</div>
              <div className="w-24">Progress</div>
              <div className="flex-1 min-w-0">Timeline</div>
            </div>

            {/* Task Rows */}
            {tasks.map((task) => {
              const startOffset = getDaysFromStart(task.startDate, project.startDate);
              const duration = getTaskDuration(task.startDate, task.endDate);
              const barWidth = (duration / totalProjectDays) * 100;
              const barLeft = (startOffset / totalProjectDays) * 100;

              return (
                <div
                  key={task.id}
                  className={`flex items-center space-x-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedTask?.id === task.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="w-64 truncate font-medium">{task.name}</div>
                  <div className="w-32 truncate text-sm text-gray-600">
                    {task.assignee}
                  </div>
                  <div className="w-24">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="w-24 text-sm">{task.progress}%</div>
                  <div className="flex-1 min-w-0 relative h-8">
                    <div className="absolute inset-y-0 left-0 right-0 bg-gray-100 rounded"></div>
                    <div
                      className={`absolute top-1 bottom-1 rounded ${getStatusColor(
                        task.status
                      )} flex items-center px-2`}
                      style={{
                        left: `${barLeft}%`,
                        width: `${barWidth}%`,
                      }}
                    >
                      <div className="text-xs text-white font-medium truncate">
                        {task.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task Details (if selected) */}
      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle>Task Details: {selectedTask.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-sm capitalize">{selectedTask.status.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Assignee
                  </label>
                  <p className="text-sm">{selectedTask.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <p className="text-sm capitalize">{selectedTask.priority}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <p className="text-sm">
                    {new Date(selectedTask.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <p className="text-sm">
                    {new Date(selectedTask.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Progress
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedTask.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedTask.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineView;
