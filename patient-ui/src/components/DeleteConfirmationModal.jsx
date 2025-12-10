import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, patientName, patientId }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ color: 'var(--danger)' }}>Confirm Deletion</h2>
                <div style={{ margin: '1.5rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Are you sure you want to delete this patient?</p>
                    <div style={{ marginTop: '1rem', background: 'var(--surface-bg)', padding: '1rem', borderRadius: '8px' }}>
                        <p style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{patientName}</p>
                        <p style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>ID: {patientId}</p>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>This action cannot be undone.</p>
                </div>
                <div className="form-actions" style={{ justifyContent: 'center' }}>
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Delete Patient
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
