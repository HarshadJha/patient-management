
import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [patients, setPatients] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredPatients = patients.filter(patient => {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesName = patient.name.toLowerCase().includes(lowerQuery);
        const matchesAddress = patient.address.toLowerCase().includes(lowerQuery);
        const age = calculateAge(patient.dateOfBirth).toString();
        // Check if age starts with query or is equal (simple text match)
        const matchesAge = age.includes(lowerQuery);
        return matchesName || matchesAddress || matchesAge;
    });

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPatient = () => {
        setEditingPatient(null);
        setIsFormOpen(true);
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setIsFormOpen(true);
    };

    const handleDeletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                setPatients(patients.filter((p) => p.id !== id));
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Failed to delete patient');
            }
        }
    };

    const handleSavePatient = async (formData) => {
        try {
            if (editingPatient) {
                const updated = await updatePatient(editingPatient.id, formData);
                setPatients(patients.map((p) => (p.id === updated.id ? updated : p)));
            } else {
                const created = await createPatient(formData);
                setPatients([...patients, created]);
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error saving patient:', error);
            if (error.message && error.message.includes('email already exist')) {
                alert('patient already exist by email');
            } else {
                alert('Failed to save patient');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="dashboard">
            <header className="app-header">
                <div className="container header-content">
                    <div className="header-left">
                        <h1>Patient Management</h1>
                    </div>
                    <div className="header-right">
                        <span className="welcome-text">Welcome, {user?.username}</span>
                        <button onClick={handleAddPatient} className="btn btn-primary">
                            + Add Patient
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="dashboard-content">
                        {/* Metrics Section */}
                        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Patients</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{patients.length}</p>
                            </div>
                            <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>New This Month</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                    {patients.filter(p => {
                                        if (!p.registeredDate) return false;
                                        const regDate = new Date(p.registeredDate);
                                        const now = new Date();
                                        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>

                        {/* Search and List Section */}
                        <div className="content-card" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-color)' }}>Patient List</h2>
                                <div style={{ width: '300px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by name, city, or age..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="form-control"
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--input-bg)',
                                            color: 'var(--text-color)',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <PatientList
                                patients={filteredPatients}
                                onEdit={handleEditPatient}
                                onDelete={handleDeletePatient}
                            />
                        </div>
                    </div>
                )}
            </main>

            {isFormOpen && (
                <PatientForm
                    onSubmit={handleSavePatient}
                    initialData={editingPatient}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
