function TossDecision({ config, setConfig, nextStep, prevStep }) {
    const handleTossWinner = (team) => {
      setConfig({ ...config, tossWinner: team });
    };
  
    const handleTossDecision = (decision) => {
      setConfig({ 
        ...config, 
        tossDecision: decision,
        battingFirst: decision === 'bat' ? config.tossWinner : 
                    (config.tossWinner === config.team1 ? config.team2 : config.team1),
        bowlingFirst: decision === 'bowl' ? config.tossWinner : 
                     (config.tossWinner === config.team1 ? config.team2 : config.team1)
      });
    };
  
    return (
      <div className="setup-card">
        <h2>Toss Decision</h2>
        
        <div className="toss-section">
          <h3>Who won the toss?</h3>
          <div className="option-buttons">
            <button
              className={config.tossWinner === config.team1 ? 'active' : ''}
              onClick={() => handleTossWinner(config.team1)}
            >
              {config.team1}
            </button>
            <button
              className={config.tossWinner === config.team2 ? 'active' : ''}
              onClick={() => handleTossWinner(config.team2)}
            >
              {config.team2}
            </button>
          </div>
        </div>
        
        {config.tossWinner && (
          <div className="toss-section">
            <h3>{config.tossWinner} chose to:</h3>
            <div className="option-buttons">
              <button
                className={config.tossDecision === 'bat' ? 'active' : ''}
                onClick={() => handleTossDecision('bat')}
                disabled={!config.tossWinner}
              >
                Bat First
              </button>
              <button
                className={config.tossDecision === 'bowl' ? 'active' : ''}
                onClick={() => handleTossDecision('bowl')}
                disabled={!config.tossWinner}
              >
                Bowl First
              </button>
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <button onClick={prevStep}>Back</button>
          <button 
            onClick={nextStep}
            disabled={!config.tossDecision}
          >
            Next: Select Opening Players
          </button>
        </div>
      </div>
    );
  }
  
  export default TossDecision;