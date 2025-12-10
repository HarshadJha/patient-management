import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, deletePatient } from '../services/api';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import PatientForm from '../components/PatientForm'; // Reusing for Edit
import { updatePatient } from '../services/api';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await getPatient(id);
                setPatient(data);
            } catch (err) {
                setError('Failed to load patient data. Patient may not exist.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deletePatient(id);
            navigate('/');
        } catch (err) {
            alert('Failed to delete patient');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const updated = await updatePatient(id, formData);
            setPatient(updated);
            setIsEditFormOpen(false);
        } catch (err) {
            alert('Failed to update patient');
        }
    };

    if (isLoading) return <div className="container loading">Loading patient details...</div>;
    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>{error}</h2>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Dashboard</button>
        </div>
    );
    if (!patient) return null;

    return (
        <div className="container animate-fade-in">
            {/* Header */}
            <div className="app-header" style={{ background: 'transparent', border: 'none', padding: '1rem 0' }}>
                <div className="header-content">
                    <div>
                        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
                            ← Back to List
                        </button>
                        <h1>{patient.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ID: {patient.id}</p>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="content-card" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '800px', margin: '0 auto' }}>

                <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Patient Information</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="detail-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', fontWeight: '500' }}>{patient.name}</p>
                    </div>
                    <div className="detail-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{patient.email}</p>
                    </div>
                    <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Address</label>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{patient.address}</p>
                    </div>
                    <div className="detail-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Date of Birth</label>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{patient.dateOfBirth}</p>
                    </div>
                    <div className="detail-group">
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Registered Date</label>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{patient.registeredDate || 'N/A'}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions" style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <button onClick={() => setIsEditFormOpen(true)} className="btn btn-primary">
                        Edit Patient
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-danger">
                        Delete Patient
                    </button>
                </div>
            </div>

            {/* Modals */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                patientName={patient.name}
                patientId={patient.id}
            />

            {isEditFormOpen && (
                <PatientForm
                    initialData={patient}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditFormOpen(false)}
                />
            )}
        </div>
    );
};

export default PatientDetails;
