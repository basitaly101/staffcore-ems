'use client';

import './styles/empolyeeID.css';

export default function EmployeeIDCard({
  name = 'Muhammad Ali',
  employeeId = 'EMP-1023',
  jobTitle = 'Frontend Developer',
  photo
}) {
  return (
    <div className="ems-id-card">
      <div className="card-accent-line"></div>
      
      {/* Branding Header */}
      <div className="card-header">
        <span className="brand-name">STAFFCORE</span>
        <div className="id-chip">OFFICIAL ID</div>
      </div>

      <div className="photo-container">
        <div className="photo-ring">
          {photo ? (
            <img src={photo} alt={name} />
          ) : (
            <div className="photo-placeholder">
               {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <span className="ems-name">{name}</span>
        <p className="ems-job">{jobTitle}</p>
        
        <div className="id-badge-box">
          <p className="ems-id">ID NO: {employeeId}</p>
        </div>
      </div>

      <button className="view-profile-btn">View Full Profile</button>
      
      <div className="card-footer-pattern"></div>
    </div>
  );
}