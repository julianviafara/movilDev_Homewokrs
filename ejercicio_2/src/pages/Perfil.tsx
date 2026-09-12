import { useNavigate } from "react-router-dom";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonText } from "@ionic/react";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar className="deco-toolbar"><IonTitle>Perfil</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2 className="deco-subtitle">{user?.nombre}</h2>
          <p>Usuario: {user?.username}</p>
        </IonText>
        <IonButton expand="block" color="danger" onClick={handleLogout}>Cerrar sesión</IonButton>
      </IonContent>
    </IonPage>
  );
}