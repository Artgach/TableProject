import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

function UserModal({ show, userId, onHide }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!show || !userId) return;
    setLoading(true);
    setErr('');
    setUser(null);

    fetch(`https://dummyjson.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки пользователя!');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [show, userId]);

  const fullName = user ? [user.firstName, user.lastName, user.maidenName].filter(Boolean).join(' ') : '';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Детали пользователя</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : err ? (
          <div className="alert alert-danger">{err}</div>
        ) : user ? (
          <div className="d-flex flex-column align-items-center">
            <img src={user.image} alt="avatar" style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 15, objectFit: 'cover', border: '3px solid #ddd' }} />
            <h5 className="mb-3">{fullName}</h5>
            <div className="w-100">
              <p><b>Возраст:</b> {user.age}</p>
              <p><b>Телефон:</b> {user.phone}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Рост:</b> {user.height} см</p>
              <p><b>Вес:</b> {user.weight} кг</p>
              <p>
                <b>Адрес:</b><br />
                {user.address && (
                  <>
                    {user.address.address}<br />
                    {user.address.city}, {user.address.state}, {user.address.country}
                  </>
                )}
              </p>
            </div>
          </div>
        ) : <div>Нет данных</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;