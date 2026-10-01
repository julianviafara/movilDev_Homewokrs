import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
  } from "@ionic/react";
  
  import { useNavigate } from "react-router-dom";
  import { Task } from "../types/Task";
  
  interface TaskCardProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
  }
  
  const TaskCard = ({
    task,
    onToggle,
    onDelete,
  }: TaskCardProps) => {
    const navigate = useNavigate();
  
    return (
      <IonCard className="task-card">
        <IonCardHeader>
          <IonCardTitle
            className={
              task.completed ? "task-completed" : ""
            }
          >
            {task.title}
          </IonCardTitle>
        </IonCardHeader>
  
        <IonCardContent>
          <p>{task.description}</p>
  
          <div className="task-actions">
            <IonCheckbox
              checked={task.completed}
              onIonChange={onToggle}
            >
              Completed
            </IonCheckbox>
  
            <div>
              <IonButton
                fill="clear"
                onClick={() =>
                  navigate(`/tasks/${task.id}`)
                }
              >
                VIEW
              </IonButton>
  
              <IonButton
                fill="clear"
                onClick={() =>
                  navigate(`/tasks/${task.id}/edit`)
                }
              >
                EDIT
              </IonButton>
  
              <IonButton
                fill="clear"
                color="danger"
                onClick={onDelete}
              >
                DELETE
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    );
  };
  
  export default TaskCard;