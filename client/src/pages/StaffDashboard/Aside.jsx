import React from 'react';
import './Aside.css';

function Aside() {
  return (
    <aside className="staff-aside">
      <div className="staff-header">
        <h2 className="staff-title">
          <svg className="staff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Support Team
        </h2>
        <p className="staff-subtitle">Logged in support staff</p>
      </div>

      <div className="staff-list">
        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Mario bild */}
              <img 
                src="/img/team-avatars/mh.jpg" 
                alt="Mario" 
                className="avatar-image"
                onError={(e) => {
                  // Fallback till placeholder om bilden inte laddas
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>MH</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Martin</h3>
              <p className="staff-member-role">Support Lead</p>
            </div>
          </div>
        </div>

        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Luigi bild */}
              <img 
                src="/img/team-avatars/we.jpg" 
                alt="Luigi" 
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>WE</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Ville</h3>
              <p className="staff-member-role">Technical Support</p>
            </div>
          </div>
        </div>

        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Toad bild */}
              <img 
                src="/img/team-avatars/kl.jpg" 
                alt="Toad" 
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>KL</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Kevin</h3>
              <p className="staff-member-role">Customer Service</p>
            </div>
          </div>
        </div>

        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Yoshi bild */}
              <img 
                src="/img/team-avatars/ss.jpg" 
                alt="Yoshi" 
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>SS</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Shaban</h3>
              <p className="staff-member-role">Product Specialist</p>
            </div>
          </div>
        </div>

        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Bowser bild */}
              <img 
                src="/img/team-avatars/sb.jpg" 
                alt="Bowser" 
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>SB</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Sigge</h3>
              <p className="staff-member-role">Technical Support</p>
            </div>
          </div>
        </div>

        <div className="staff-member">
          <div className="staff-member-content">
            <div className="staff-member-avatar">
              {/* Ersätt med Princess Peach bild */}
              <img 
                src="/img/team-avatars/shn.jpg" 
                alt="Princess Peach" 
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="avatar-placeholder" style={{display: "none"}}>SHN</div>
            </div>
            <div className="staff-member-info">
              <h3 className="staff-member-name">Sebbe</h3>
              <p className="staff-member-role">Customer Service</p>
            </div>
          </div>
        </div>
      </div>

      <div className="staff-footer">
        <div className="staff-status">
          <span>Online Support</span>
          <span className="status-indicator"></span>
        </div>
      </div>
    </aside>
  );
}

export default Aside;