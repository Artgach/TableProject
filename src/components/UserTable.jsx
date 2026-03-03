import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const columns = [
  { field: 'lastName', label: 'Фамилия', sortable: true },
  { field: 'firstName', label: 'Имя', sortable: true },
  { field: 'maidenName', label: 'Отчество', sortable: true },
  { field: 'age', label: 'Возраст', sortable: true },
  { field: 'gender', label: 'Пол', sortable: true },
  { field: 'phone', label: 'Телефон', sortable: true },
  { field: 'email', label: 'Email', sortable: false },
  { field: 'country', label: 'Страна', sortable: false },
  { field: 'city', label: 'Город', sortable: false }
];

const sortIcons = {
  asc: '▲',
  desc: '▼',
  none: '↕'
};

function UserTable({ users, sortBy, order, onSort, onRowClick }) {
  const [colWidths, setColWidths] = useState(() => columns.map(() => 130));

  const handleResize = (idx, size) => {
    setColWidths((widths) =>
      widths.map((w, i) => (i === idx ? Math.max(size.width, 50) : w))
    );
  };

  const genderRu = (g) => g === 'male' ? 'М' : g === 'female' ? 'Ж' : g;

  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table className="table table-bordered table-hover w-100" style={{ minWidth: '900px', background: "#fff" }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.field}
                className="resizable-header text-center align-middle"
                style={{
                  position: 'relative',
                  width: colWidths[idx],
                  minWidth: '50px',
                  maxWidth: '500px',
                  paddingRight: 15
                }}
              >
                <ResizableBox
                  width={colWidths[idx]}
                  height={36}
                  axis="x"
                  minConstraints={[50, 36]}
                  maxConstraints={[500, 36]}
                  handle={
                    <span
                      className="resize-handle"
                      onClick={e => e.stopPropagation()}
                    />
                  }
                  onResize={(e, { size }) => handleResize(idx, size)}
                  draggableOpts={{ enableUserSelectHack: false }}
                  resizeHandles={['e']}
                >
                  <div
                    style={{ width: colWidths[idx] - 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: col.sortable ? 'pointer' : 'default' }}
                    onClick={() => col.sortable && onSort(col.field)}
                  >
                    <span style={{ marginRight: 3 }}>{col.label}</span>
                    {col.sortable && (
                      <span style={{ fontSize: '15px', paddingLeft: 2, color: sortBy === col.field ? '#0d6efd' : '#9aa' }}>
                        {sortBy !== col.field ? sortIcons.none
                          : order === 'asc' ? sortIcons.asc
                          : order === 'desc' ? sortIcons.desc
                          : sortIcons.none}
                      </span>
                    )}
                  </div>
                </ResizableBox>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted">
                Нет данных
              </td>
            </tr>
          ) : users.map(user => (
            <tr key={user.id} style={{ cursor: 'pointer' }} onClick={() => onRowClick(user.id)}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.maidenName}</td>
              <td>{user.age}</td>
              <td>{genderRu(user.gender)}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.address ? user.address.country : ''}</td>
              <td>{user.address ? user.address.city : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;