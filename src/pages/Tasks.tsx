import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
  } from "@ionic/react";
  
  import { useNavigate } from "react-router-dom";
  import { useAuthContext } from "../contexts/AuthContext";
  import { useTasksContext } from "../contexts/TasksContext";
  
  import TaskCard from "../components/TaskCard";
  
  const Tasks = () => {
    const navigate = useNavigate();
  
    const { logout } = useAuthContext();
  
    const {
      tasks,
      loading,
      deleteTask,
      toggleTask,
    } = useTasksContext();
  
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="deco-toolbar">
            <IonTitle>TASK DECO</IonTitle>
  
            <IonButton
              slot="end"
              fill="clear"
              onClick={handleLogout}
            >
              LOGOUT
            </IonButton>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="tasks-page">
          <div className="tasks-container">
            <div className="tasks-heading">
              <div>
                <span className="eyebrow">
                  YOUR COLLECTION
                </span>
  
                <h1>MY TASKS</h1>
              </div>
  
              <IonButton
                className="deco-button"
                onClick={() => navigate("/tasks/add")}
              >
                + NEW TASK
              </IonButton>
            </div>
  
            <div className="deco-line" />
  
            {loading ? (
              <div className="loading-container">
                <IonSpinner />
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="deco-symbol">◇</div>
  
                <h2>NO TASKS YET</h2>
  
                <p>
                  Your masterpiece is waiting to be created.
                </p>
              </div>
            ) : (
              <div>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() =>
                      toggleTask(
                        task.id,
                        task.completed
                      )
                    }
                    onDelete={() =>
                      deleteTask(task.id)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Tasks;