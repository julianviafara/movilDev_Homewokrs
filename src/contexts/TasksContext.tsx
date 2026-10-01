import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import { Task } from "../types/Task";
  import { useTasks } from "../hooks/useTasks";
  import { useAuthContext } from "./AuthContext";
  
  interface TasksContextType {
    tasks: Task[];
    loading: boolean;
    addTask: (
      title: string,
      description: string
    ) => Promise<void>;
    updateTask: (
      id: string,
      title: string,
      description: string,
      completed: boolean
    ) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (
      id: string,
      completed: boolean
    ) => Promise<void>;
    refreshTasks: () => Promise<void>;
  }
  
  const TasksContext = createContext<
    TasksContextType | undefined
  >(undefined);
  
  interface TasksProviderProps {
    children: ReactNode;
  }
  
  export const TasksProvider = ({
    children,
  }: TasksProviderProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
  
    const {
      getTasks,
      addTask: firebaseAddTask,
      updateTask: firebaseUpdateTask,
      deleteTask: firebaseDeleteTask,
      toggleTask: firebaseToggleTask,
    } = useTasks();
  
    const { user } = useAuthContext();
  
    const refreshTasks = async () => {
      if (!user) {
        setTasks([]);
        return;
      }
  
      setLoading(true);
  
      try {
        const data = await getTasks(user.uid);
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      refreshTasks();
    }, [user]);
  
    const addTask = async (
      title: string,
      description: string
    ) => {
      if (!user) return;
  
      await firebaseAddTask(
        user.uid,
        title,
        description
      );
  
      await refreshTasks();
    };
  
    const updateTask = async (
      id: string,
      title: string,
      description: string,
      completed: boolean
    ) => {
      await firebaseUpdateTask(
        id,
        title,
        description,
        completed
      );
  
      await refreshTasks();
    };
  
    const deleteTask = async (id: string) => {
      await firebaseDeleteTask(id);
  
      await refreshTasks();
    };
  
    const toggleTask = async (
      id: string,
      completed: boolean
    ) => {
      await firebaseToggleTask(id, completed);
  
      await refreshTasks();
    };
  
    return (
      <TasksContext.Provider
        value={{
          tasks,
          loading,
          addTask,
          updateTask,
          deleteTask,
          toggleTask,
          refreshTasks,
        }}
      >
        {children}
      </TasksContext.Provider>
    );
  };
  
  export const useTasksContext = () => {
    const context = useContext(TasksContext);
  
    if (!context) {
      throw new Error(
        "useTasksContext must be used inside TasksProvider"
      );
    }
  
    return context;
  };