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
  
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  import { useTasksContext } from "../contexts/TasksContext";
  
  const AddTask = () => {
    const navigate = useNavigate();
  
    const { addTask } = useTasksContext();
  
    const [title, setTitle] = useState("");
    const [description, setDescription] =
      useState("");
  
    const handleSubmit = async () => {
      if (!title.trim()) return;
  
      await addTask(
        title.trim(),
        description.trim()
      );
  
      navigate("/tasks");
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="deco-toolbar">
            <IonTitle>NEW TASK</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="tasks-page">
          <div className="form-container">
            <span className="eyebrow">
              CREATE SOMETHING
            </span>
  
            <h1>NEW TASK</h1>
  
            <div className="deco-line" />
  
            <IonInput
              className="deco-input"
              label="Title"
              labelPlacement="stacked"
              placeholder="What needs to be done?"
              value={title}
              onIonInput={(e) =>
                setTitle(e.detail.value ?? "")
              }
            />
  
            <IonTextarea
              className="deco-input"
              label="Description"
              labelPlacement="stacked"
              placeholder="Add some details..."
              rows={6}
              value={description}
              onIonInput={(e) =>
                setDescription(e.detail.value ?? "")
              }
            />
  
            <div className="form-actions">
              <IonButton
                fill="outline"
                onClick={() => navigate("/tasks")}
              >
                CANCEL
              </IonButton>
  
              <IonButton
                className="deco-button"
                onClick={handleSubmit}
              >
                CREATE TASK
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default AddTask;