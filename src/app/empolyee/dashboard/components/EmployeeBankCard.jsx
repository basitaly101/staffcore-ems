'use client';

import './styles/EmployeeBankCard.css';

export default function EmployeeBankCard({
  bank = 'STAFFCORE ELITE',
  cardNumber = '**** **** **** 6576', // Masked number for safety
  validThru = '12/28',
  name = 'EMPLOYEE NAME',
}) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">

        {/* FRONT */}
        <div className="flip-card-front">
          <div className="card-glare"></div>
          <p className="bank-name">{bank}</p>

          {/* Contactless Icon */}
          <svg className="contactless" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M11.5,20C11.5,20 10,20 10,18.5C10,17 11.5,17 11.5,17C13.21,17 14.77,16.33 15.93,15.24L17.34,16.65C15.82,18.17 13.77,19.11 11.5,19.11V20M11.5,15C11.5,15 10,15 10,13.5C10,12 11.5,12 11.5,12C12.38,12 13.19,11.66 13.8,11.1L15.21,12.51C14.25,13.47 12.94,14.07 11.5,14.07V15M11.5,10C11.5,10 10,10 10,8.5C10,7 11.5,7 11.5,7C11.53,7 11.56,7 11.59,7L13.06,8.47C12.67,9.39 11.5,10 11.5,10Z" />
          </svg>

          {/* Gold Chip */}
          <div className="chip">
            <div className="chip-line"></div>
            <div className="chip-line"></div>
            <div className="chip-line"></div>
          </div>

          <p className="card-number">{cardNumber}</p>
          
          <div className="card-footer">
            <div className="details">
              <span className="label">VALID THRU</span>
              <p className="val">{validThru}</p>
            </div>
            <div className="details">
              <span className="label">CARD HOLDER</span>
              <p className="val">{name.toUpperCase()}</p>
            </div>
          </div>

          <svg className="mc-logo" viewBox="0 0 48 48">
            <circle fill="#ff9800" cx="32" cy="24" r="14" fillOpacity="0.8"/>
            <circle fill="#d50000" cx="16" cy="24" r="14" fillOpacity="0.8"/>
          </svg>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <div className="mag-strip"></div>
          <div className="signature-area">
            <div className="sig-box">
              <p className="cvv-label">CVV</p>
              <div className="cvv-code">***</div>
            </div>
          </div>
          <p className="disclaimer">This card is property of StaffCore EMS. If found, please return to HR department.</p>
        </div>

      </div>
    </div>
  );
}