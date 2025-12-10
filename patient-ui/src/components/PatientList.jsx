import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientList = ({ patients, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 9;

    // Reset to page 1 when data changes (e.g. search)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [patients]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = patients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(patients.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (patients.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>No patients found.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="patient-grid">
                {currentPatients.map((patient) => (
                    <div key={patient.id} className="patient-card animate-fade-in">
                        <div className="patient-header">
                            <h3
                                onClick={() => navigate(`/patients/${patient.id}`)}
                                style={{ cursor: 'pointer', color: 'var(--primary)' }}
                            >
                                {patient.name}
                            </h3>
                            <span className="patient-id">#{patient.id.substring(0, 8)}</span>
                        </div>
                        <div className="patient-body">
                            <p><strong>Email:</strong> {patient.email}</p>
                            <p><strong>Address:</strong> {patient.address}</p>
                            <p><strong>DOB:</strong> {patient.dateOfBirth}</p>
                        </div>
                        <div className="patient-actions">
                            <button onClick={() => navigate(`/patients/${patient.id}`)} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
                                View
                            </button>
                            <button onClick={() => onEdit(patient)} className="btn btn-outline" style={{ marginRight: '0.5rem' }}>
                                Edit
                            </button>
                            <button onClick={() => onDelete(patient.id)} className="btn btn-danger">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PatientList;
