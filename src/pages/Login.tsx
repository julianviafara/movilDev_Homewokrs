import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import { useApp } from "../context/AppContext";

const Login: React.FC = () => {
  const { login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isRegister) await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
    } catch (e: any) {
      setError(e?.code ? e.code.replace("auth/", "").replace(/-/g, " ") : "Error al continuar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="auth">
          <h1>Misiones</h1>
          <p className="muted">{isRegister ? "Crea tu cuenta" : "Inicia sesión"}</p>

          {isRegister && (
            <IonItem>
              <IonInput
                label="Nombre"
                labelPlacement="floating"
                value={name}
                onIonInput={(e) => setName(e.detail.value ?? "")}
              />
            </IonItem>
          )}
          <IonItem>
            <IonInput
              label="Correo"
              labelPlacement="floating"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value ?? "")}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Contraseña"
              labelPlacement="floating"
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? "")}
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            onClick={submit}
            disabled={loading || !email || !password || (isRegister && !name)}
          >
            {isRegister ? "Registrarme" : "Entrar"}
          </IonButton>
          <IonButton expand="block" fill="clear" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Ya tengo cuenta" : "Crear cuenta"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
