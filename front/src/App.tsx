import { useState, useEffect } from "react";

// ユーザーの型を定義
interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]); // ユーザーの型を指定
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/api/users`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        // エラー処理を行う
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
