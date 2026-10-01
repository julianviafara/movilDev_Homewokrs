import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  
  import { useEffect, useState } from "react";
  import {
    useNavigate,
    useParams,
  } from "react-router-dom";
  
  import { useTasksContext } from "../contexts/TasksContext";
  
  const EditTask = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
  
    const {
      tasks,
      updateTask,
    } = useTasksContext();
  
    const task = tasks.find(
      (currentTask) => currentTask.id === id
    );
  
    const [title, setTitle] = useState("");
    const [description, setDescription] =
      useState("");
  
    useEffect(() => {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
      }
    }, [task]);
  
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
  
    const handleSubmit = async () => {
      if (!title.trim()) return;
  
      await updateTask(
        task.id,
        title.trim(),
        description.trim(),
        task.completed
      );
  
      navigate(`/tasks/${task.id}`);
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="deco-toolbar">
            <IonTitle>EDIT TASK</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="tasks-page">
          <div className="form-container">
            <span className="eyebrow">
              REFINEMENT
            </span>
  
            <h1>EDIT TASK</h1>
  
            <div className="deco-line" />
  
            <IonInput
              className="deco-input"
              label="Title"
              labelPlacement="stacked"
              value={title}
              onIonInput={(e) =>
                setTitle(e.detail.value ?? "")
              }
            />
  
            <IonTextarea
              className="deco-input"
              label="Description"
              labelPlacement="stacked"
              rows={6}
              value={description}
              onIonInput={(e) =>
                setDescription(e.detail.value ?? "")
              }
            />
  
            <div className="form-actions">
              <IonButton
                fill="outline"
                onClick={() =>
                  navigate(`/tasks/${task.id}`)
                }
              >
                CANCEL
              </IonButton>
  
              <IonButton
                className="deco-button"
                onClick={handleSubmit}
              >
                SAVE CHANGES
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditTask;