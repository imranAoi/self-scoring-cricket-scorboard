import { useState } from 'react';
import PlayerEntry from './PlayerEntry';

function TeamConfiguration({ config, setConfig, teamsData, saveTeamsData, nextStep }) {
  const [showPlayerEntry, setShowPlayerEntry] = useState(false);
  const [currentTeam, setCurrentTeam] = useState('');

  const handleTeamSelect = (team, field) => {
    setConfig({ ...config, [field]: team });
    
    // If team exists in saved data, load their players
    if (teamsData[team]) {
      setConfig(prev => ({
        ...prev,
        [`${field}Players`]: teamsData[team].players
      }));
    }
  };

  const savePlayers = (team, players) => {
    const updatedTeams = {
      ...teamsData,
      [team]: { players }
    };
    saveTeamsData(updatedTeams);
    
    setConfig(prev => ({
      ...prev,
      [`${team === config.team1 ? 'team1' : 'team2'}Players`]: players
    }));
    setShowPlayerEntry(false);
  };

  const canProceed = config.team1 && config.team2 && 
    config.team1Players.length >= config.playersPerTeam && 
    config.team2Players.length >= config.playersPerTeam;

  return (
    <div className="setup-card">
      <h2>Match Configuration</h2>
      
      <div className="form-group">
        <label>Number of Overs:</label>
        <input
          type="number"
          value={config.overs}
          onChange={(e) => setConfig({ ...config, overs: parseInt(e.target.value) || 20 })}
          min="1"
          max="50"
        />
      </div>
      
      <div className="form-group">
        <label>Players per Team:</label>
        <input
          type="number"
          value={config.playersPerTeam}
          onChange={(e) => setConfig({ ...config, playersPerTeam: parseInt(e.target.value) || 11 })}
          min="2"
          max="15"
        />
      </div>
      
      <div className="team-selection">
        <div className="form-group">
          <label>Team 1:</label>
          <input
            type="text"
            value={config.team1}
            onChange={(e) => handleTeamSelect(e.target.value, 'team1')}
            list="team1-suggestions"
          />
          <datalist id="team1-suggestions">
            {Object.keys(teamsData).map(team => (
              <option key={`team1-${team}`} value={team} />
            ))}
          </datalist>
          {config.team1 && (
            <button 
              className="small-btn"
              onClick={() => {
                setCurrentTeam(config.team1);
                setShowPlayerEntry(true);
              }}
            >
              {teamsData[config.team1] ? 'Edit Players' : 'Add Players'}
            </button>
          )}
          {config.team1Players.length > 0 && (
            <p>{config.team1Players.length} players added</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Team 2:</label>
          <input
            type="text"
            value={config.team2}
            onChange={(e) => handleTeamSelect(e.target.value, 'team2')}
            list="team2-suggestions"
          />
          <datalist id="team2-suggestions">
            {Object.keys(teamsData).map(team => (
              <option key={`team2-${team}`} value={team} />
            ))}
          </datalist>
          {config.team2 && (
            <button 
              className="small-btn"
              onClick={() => {
                setCurrentTeam(config.team2);
                setShowPlayerEntry(true);
              }}
            >
              {teamsData[config.team2] ? 'Edit Players' : 'Add Players'}
            </button>
          )}
          {config.team2Players.length > 0 && (
            <p>{config.team2Players.length} players added</p>
          )}
        </div>
      </div>
      
      {showPlayerEntry && (
        <PlayerEntry
          teamName={currentTeam}
          existingPlayers={teamsData[currentTeam]?.players || []}
          onSave={savePlayers}
          onCancel={() => setShowPlayerEntry(false)}
          requiredCount={config.playersPerTeam}
        />
      )}
      
      <div className="action-buttons">
        <button 
          onClick={nextStep}
          disabled={!canProceed}
        >
          Next: Toss Decision
        </button>
      </div>
    </div>
  );
}

export default TeamConfiguration;