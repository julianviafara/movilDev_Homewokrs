import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
    where,
  } from "firebase/firestore";
  
  import { db } from "../services/firebase";
  import { Task } from "../types/Task";
  
  const tasksCollection = collection(db, "tasks");
  
  export const useTasks = () => {
    const getTasks = async (
      userId: string
    ): Promise<Task[]> => {
      const q = query(
        tasksCollection,
        where("userId", "==", userId)
      );
  
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Task[];
    };
  
    const addTask = async (
      userId: string,
      title: string,
      description: string
    ) => {
      await addDoc(tasksCollection, {
        userId,
        title,
        description,
        completed: false,
        createdAt: Date.now(),
      });
    };
  
    const updateTask = async (
      id: string,
      title: string,
      description: string,
      completed: boolean
    ) => {
      const taskReference = doc(db, "tasks", id);
  
      await updateDoc(taskReference, {
        title,
        description,
        completed,
      });
    };
  
    const deleteTask = async (id: string) => {
      const taskReference = doc(db, "tasks", id);
  
      await deleteDoc(taskReference);
    };
  
    const toggleTask = async (
      id: string,
      completed: boolean
    ) => {
      const taskReference = doc(db, "tasks", id);
  
      await updateDoc(taskReference, {
        completed: !completed,
      });
    };
  
    return {
      getTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
    };
  };