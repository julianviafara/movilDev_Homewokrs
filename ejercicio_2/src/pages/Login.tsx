import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonContent, IonPage, IonItem, IonLabel, IonInput, IonButton, IonToast, IonText,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = () => {
    if (login(username, password)) {
      navigate("/tabs/visitas", { replace: true });
    } else {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <div className="login-wrapper">
          <IonText><h1 className="deco-title">Visitas Médicas</h1></IonText>
          <div className="deco-divider" />
          <IonItem className="deco-item">
            <IonLabel position="stacked">Usuario</IonLabel>
            <IonInput value={username} onIonInput={(e) => setUsername(e.detail.value ?? "")} />
          </IonItem>
          <IonItem className="deco-item">
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonInput={(e) => setPassword(e.detail.value ?? "")} />
          </IonItem>
          <IonButton expand="block" className="deco-button" onClick={handleLogin}>
            Ingresar
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          message="Usuario o contraseña incorrectos."
          duration={2500}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}