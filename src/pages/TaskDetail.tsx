import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  
  import {
    useNavigate,
    useParams,
  } from "react-router-dom";
  
  import { useTasksContext } from "../contexts/TasksContext";
  
  const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
  
    const navigate = useNavigate();
  
    const { tasks, deleteTask } =
      useTasksContext();
  
    const task = tasks.find(
      (currentTask) => currentTask.id === id
    );
  
    if (!task) {
      return (
        <IonPage>
          <IonContent className="tasks-page">
            <div className="empty-state">
              <h2>Task not found</h2>
  
              <IonButton
                onClick={() => navigate("/tasks")}
              >
                BACK
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      );
    }
  
    const handleDelete = async () => {
      await deleteTask(task.id);
      navigate("/tasks");
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="deco-toolbar">
            <IonTitle>TASK DETAIL</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="tasks-page">
          <div className="detail-container">
            <span className="eyebrow">
              TASK #{task.id.slice(0, 6)}
            </span>
  
            <h1>{task.title}</h1>
  
            <div className="deco-line" />
  
            <div className="detail-status">
              {task.completed
                ? "✓ COMPLETED"
                : "○ IN PROGRESS"}
            </div>
  
            <p className="detail-description">
              {task.description ||
                "No description provided."}
            </p>
  
            <div className="form-actions">
              <IonButton
                fill="outline"
                onClick={() => navigate("/tasks")}
              >
                BACK
              </IonButton>
  
              <IonButton
                onClick={() =>
                  navigate(`/tasks/${task.id}/edit`)
                }
              >
                EDIT
              </IonButton>
  
              <IonButton
                color="danger"
                onClick={handleDelete}
              >
                DELETE
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default TaskDetail;