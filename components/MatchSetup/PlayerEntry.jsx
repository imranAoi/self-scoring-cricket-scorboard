import { useState } from 'react';

function PlayerEntry({ teamName, existingPlayers, onSave, onCancel, requiredCount }) {
  const [players, setPlayers] = useState([...existingPlayers]);
  const [newPlayer, setNewPlayer] = useState('');

  const addPlayer = () => {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  return (
    <div className="player-entry-modal">
      <div className="modal-content">
        <h3>Add Players for {teamName}</h3>
        <p>Need at least {requiredCount} players</p>
        
        <div className="player-input">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button onClick={addPlayer}>Add</button>
        </div>
        
        <div className="player-list">
          {players.map((player, index) => (
            <div key={index} className="player-item">
              <span>{player}</span>
              <button 
                onClick={() => removePlayer(index)}
                className="delete-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button 
            onClick={() => onSave(teamName, players)}
            disabled={players.length < requiredCount}
          >
            Save Players ({players.length}/{requiredCount})
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerEntry;