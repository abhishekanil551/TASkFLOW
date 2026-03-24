import { useAuthContext } from "../context/useAuthContext";

export default function Dashboard() {
  const { user } = useAuthContext();
  // Get all tasks assigned to current user across all workspaces
  // const allUserTasks = MOCK_WORKSPACES.flatMap((ws) =>
  //   ws.tasks.filter((task) => task.assignee.id === CURRENT_USER.id)
  // );

  // const totalTasks = allUserTasks.length;
  // const completedTasks = allUserTasks.filter(
  //   (t) => t.status === 'completed'
  // ).length;
  // const inProgressTasks = allUserTasks.filter(
  //   (t) => t.status === 'in-progress'
  // ).length;
  // const todoTasks = allUserTasks.filter((t) => t.status === 'todo').length;

  // const completionRate =
  //   totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background ">
 
      <main className="ml-20 mt-16 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome {user?.email}
            </h1>
            <p className="text-muted-foreground">
              Here's your task overview and progress
            </p>
          </div>


          {/* Kanban Board */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              My Tasks
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}