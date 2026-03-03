import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import Pagination from './components/Pagination';
import Filter from './components/Filter';

function App() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(150);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    q: '',
    gender: '',
    age: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, order, filter]);

  async function fetchUsers() {
    setLoading(true);
    setError('');

    try {
      let url = '';
      const skip = (page - 1) * limit;

      // Базовый запрос
      url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      // Поиск по q (если заполнено)
      if (filter.q.trim()) {
        url = `https://dummyjson.com/users/search?q=${encodeURIComponent(filter.q.trim())}&limit=${limit}&skip=${skip}`;
      }

      // Сортировка (на сервере, где возможно)
      if (sortBy && order) {
        url += (url.includes('?') ? '&' : '?') + `sortBy=${sortBy}&order=${order}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      let fetchedUsers = data.users || [];

      // Клиентская фильтрация по возрасту и полу
      if (filter.age.trim() || filter.gender) {
        fetchedUsers = fetchedUsers.filter(user => {
          let match = true;

          // Возраст
          if (filter.age.trim()) {
            const ageNum = Number(filter.age.trim());
            if (isNaN(ageNum) || user.age !== ageNum) {
              match = false;
            }
          }

          // Пол
          if (filter.gender && user.gender !== filter.gender) {
            match = false;
          }

          return match;
        });
      }

      // Клиентская сортировка по возрасту (если выбрано age)
      if (sortBy === 'age' && order) {
        fetchedUsers.sort((a, b) => {
          const aAge = Number(a.age);
          const bAge = Number(b.age);
          if (order === 'asc') return aAge - bAge;
          if (order === 'desc') return bAge - aAge;
          return 0;
        });
      }

      setUsers(fetchedUsers);
      setTotal(data.total || fetchedUsers.length);
    } catch (e) {
      setError(e.message || 'Не удалось загрузить пользователей');
      console.error('Ошибка fetch:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleRowClick = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleSort = (field) => {
    let nextOrder = 'asc';
    if (sortBy === field) {
      if (order === 'asc') nextOrder = 'desc';
      else if (order === 'desc') {
        setSortBy(null);
        setOrder(null);
        return;
      }
    }
    setSortBy(field);
    setOrder(nextOrder);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setPage(1); // Сброс страницы при изменении фильтров
  };

  return (
    <div className="app-root">
      <div className="container">
        <h1 className="my-3 text-center">Таблица пользователей</h1>

        <Filter filter={filter} onChange={handleFilterChange} />

        {loading && (
          <div className="alert alert-info my-2 text-center">Загрузка данных...</div>
        )}
        {error && (
          <div className="alert alert-danger my-2 text-center">Ошибка: {error}</div>
        )}

        {/* Обёртка для таблицы с фиксированной высотой и скроллом */}
        <div className="table-responsive">
          <UserTable
            users={users}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
        </div>

        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={handlePageChange}
        />

        <UserModal
          show={showModal}
          userId={selectedUserId}
          onHide={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default App;