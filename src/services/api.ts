
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Transaction, Category, SavingsGoal } from '@/types';

// Transactions
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  try {
    const transactionRef = doc(db, 'transactions', id);
    await updateDoc(transactionRef, transaction);
    return { success: true };
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const transactionRef = doc(db, 'transactions', id);
    await deleteDoc(transactionRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as Transaction;
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Categories
export const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...category,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, category);
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getUserCategories = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('userId', '==', userId),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as Category;
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Savings Goals
export const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'savingsGoals'), {
      ...goal,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding savings goal:', error);
    throw error;
  }
};

export const updateSavingsGoal = async (id: string, goal: Partial<SavingsGoal>) => {
  try {
    const goalRef = doc(db, 'savingsGoals', id);
    await updateDoc(goalRef, goal);
    return { success: true };
  } catch (error) {
    console.error('Error updating savings goal:', error);
    throw error;
  }
};

export const deleteSavingsGoal = async (id: string) => {
  try {
    const goalRef = doc(db, 'savingsGoals', id);
    await deleteDoc(goalRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    throw error;
  }
};

export const getUserSavingsGoals = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'savingsGoals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline instanceof Timestamp ? data.deadline.toDate() : data.deadline,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as SavingsGoal;
    });
  } catch (error) {
    console.error('Error getting savings goals:', error);
    throw error;
  }
};
