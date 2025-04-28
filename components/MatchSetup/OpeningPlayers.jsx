function OpeningPlayers({ config, setConfig, completeSetup, prevStep }) {
    const [openingBatsmen, setOpeningBatsmen] = useState([]);
    const [openingBowlers, setOpeningBowlers] = useState([]);
  
    const battingTeamPlayers = config.battingFirst === config.team1 ? 
      config.team1Players : config.team2Players;
    const bowlingTeamPlayers = config.bowlingFirst === config.team1 ? 
      config.team1Players : config.team2Players;
  
    const handleComplete = () => {
      setConfig({
        ...config,
        openingBatsmen,
        openingBowlers
      });
      completeSetup();
    };
  
    return (
      <div className="setup-card">
        <h2>Select Opening Players</h2>
        
        <div className="player-selection">
          <h3>Opening Batsmen ({config.battingFirst})</h3>
          <div className="player-options">
            {battingTeamPlayers.map(player => (
              <div 
                key={player}
                className={`player-option ${openingBatsmen.includes(player) ? 'selected' : ''}`}
                onClick={() => {
                  if (openingBatsmen.includes(player)) {
                    setOpeningBatsmen(openingBatsmen.filter(p => p !== player));
                  } else if (openingBatsmen.length < 2) {
                    setOpeningBatsmen([...openingBatsmen, player]);
                  }
                }}
              >
                {player}
                {openingBatsmen.includes(player) && <span>✔</span>}
              </div>
            ))}
          </div>
          <p>Selected: {openingBatsmen.join(', ')}</p>
        </div>
        
        <div className="player-selection">
          <h3>Opening Bowlers ({config.bowlingFirst})</h3>
          <div className="player-options">
            {bowlingTeamPlayers.map(player => (
              <div 
                key={player}
                className={`player-option ${openingBowlers.includes(player) ? 'selected' : ''}`}
                onClick={() => {
                  if (openingBowlers.includes(player)) {
                    setOpeningBowlers(openingBowlers.filter(p => p !== player));
                  } else if (openingBowlers.length < 1) {
                    setOpeningBowlers([...openingBowlers, player]);
                  }
                }}
              >
                {player}
                {openingBowlers.includes(player) && <span>✔</span>}
              </div>
            ))}
          </div>
          <p>Selected: {openingBowlers.join(', ')}</p>
        </div>
        
        <div className="action-buttons">
          <button onClick={prevStep}>Back</button>
          <button 
            onClick={handleComplete}
            disabled={openingBatsmen.length !== 2 || openingBowlers.length !== 1}
          >
            Start Match
          </button>
        </div>
      </div>
    );
  }
  
  export default OpeningPlayers;