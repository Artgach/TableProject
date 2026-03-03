import React, { useState } from 'react';

function Filter({ filter, onChange }) {
  const [q, setQ] = useState(filter.q || '');
  const [gender, setGender] = useState(filter.gender || '');
  const [age, setAge] = useState(filter.age || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ q, gender, age });
  };

  const handleClear = () => {
    setQ('');
    setGender('');
    setAge('');
    onChange({ q: '', gender: '', age: '' });
  };

  return (
    <form className="row g-2 mb-2" style={{ alignItems: 'end' }} onSubmit={handleSubmit}>
      <div className="col-md-4">
        <label htmlFor="searchQ" className="form-label mb-0">Поиск по имени/email/телефону</label>
        <input
          id="searchQ"
          className="form-control"
          type="text"
          value={q}
          placeholder="Введите имя, email или телефон"
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label mb-0">Пол</label>
        <select
          className="form-select"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Любой</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label mb-0">Возраст (точно)</label>
        <input
          className="form-control"
          type="number"
          min={0}
          value={age}
          placeholder="Напр. 25"
          onChange={e => setAge(e.target.value)}
        />
      </div>
      <div className="col-md-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">Применить</button>
        <button className="btn btn-outline-secondary" type="button" onClick={handleClear}>Сбросить</button>
      </div>
    </form>
  );
}

export default Filter;