import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable.jsx";
import StatusFilter from "./components/StatusFilter.jsx";
import SearchBox from "./components/SearchBox.jsx";
import { fetchUsers } from "./utils/mockApi";
import debounce from "./utils/debounce";
export default function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleSearch = debounce(() => {
    const data = users.filter(user => {
      const matchesSearch = search.trim() === "" || 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statuses.length === 0 || statuses.includes(user.status);
      return matchesSearch && matchesStatus;
    });

    setFiltered(data);
  }, 300);
  const handleStatuses = () => {
    handleSearch();
  };

  const handleSort = () => {
    const sortedData = [...users].sort((a, b) => {
      const dateA = new Date(a.lastLogin);
      const dateB = new Date(b.lastLogin);
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
    setFiltered(sortedData);
  };

  useEffect(() => {
    handleSearch();
  }, [users, search, statuses]);
  useEffect(() => {
    handleSort();
  }, [users, sortAsc]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f4f4f4" }}>
      <h2>User Insights Dashboard</h2>
      <SearchBox onSearch={setSearch} />
      <StatusFilter onChange={setStatuses} />
      <UserTable users={filtered} onToggleSort={() => setSortAsc(!sortAsc)} />
      {!filtered.length && <p>No users found</p>}
    </div>
  );
}