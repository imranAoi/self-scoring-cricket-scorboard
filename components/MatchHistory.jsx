import { useState } from 'react';

function MatchHistory({ matches, onNewMatch }) {
  const [expandedMatch, setExpandedMatch] = useState(null);

  const toggleMatchDetails = (matchId) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMatchResult = (match) => {
    const team1Total = match.team1Score.runs;
    const team2Total = match.team2Score.runs;
    
    if (team1Total > team2Total) {
      return `${match.team1} won by ${team1Total - team2Total} runs`;
    } else if (team2Total > team1Total) {
      return `${match.team2} won by ${match.playersPerTeam - match.team2Score.wickets} wickets`;
    } else {
      return "Match tied";
    }
  };

  return (
    <div className="match-history">
      <div className="history-header">
        <h2>Match History</h2>
        <button onClick={onNewMatch} className="new-match-btn">
          + New Match
        </button>
      </div>
      
      {matches.length === 0 ? (
        <div className="no-matches">
          <p>No matches recorded yet</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.slice().reverse().map((match) => (
            <div key={match.id} className="match-card">
              <div 
                className="match-summary"
                onClick={() => toggleMatchDetails(match.id)}
              >
                <div className="teams">
                  <span className="team-name">{match.team1}</span>
                  <span className="vs">vs</span>
                  <span className="team-name">{match.team2}</span>
                </div>
                <div className="match-info">
                  <span className="result">{getMatchResult(match)}</span>
                  <span className="date">{formatDate(match.date)}</span>
                  <span className="toggle-icon">
                    {expandedMatch === match.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>
              
              {expandedMatch === match.id && (
                <div className="match-details">
                  <div className="innings">
                    <h4>1st Innings - {match.battingFirst}</h4>
                    <p>
                      {match.team1Score.runs}/{match.team1Score.wickets} in {match.team1Score.overs.toFixed(1)} overs
                    </p>
                    {match.team1Score.topScorers && match.team1Score.topScorers.length > 0 && (
                      <div className="player-stats">
                        <h5>Top Scorers:</h5>
                        <ul>
                          {match.team1Score.topScorers.map((player, index) => (
                            <li key={index}>
                              {player.name}: {player.runs} ({player.ballsFaced}) - SR: {player.strikeRate}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {match.team1Score.topBowlers && match.team1Score.topBowlers.length > 0 && (
                      <div className="player-stats">
                        <h5>Top Bowlers:</h5>
                        <ul>
                          {match.team1Score.topBowlers.map((player, index) => (
                            <li key={index}>
                              {player.name}: {player.wickets}/{player.runs} in {player.overs} overs
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="innings">
                    <h4>2nd Innings - {match.bowlingFirst}</h4>
                    <p>
                      {match.team2Score.runs}/{match.team2Score.wickets} in {match.team2Score.overs.toFixed(1)} overs
                    </p>
                    {match.team2Score.topScorers && match.team2Score.topScorers.length > 0 && (
                      <div className="player-stats">
                        <h5>Top Scorers:</h5>
                        <ul>
                          {match.team2Score.topScorers.map((player, index) => (
                            <li key={index}>
                              {player.name}: {player.runs} ({player.ballsFaced}) - SR: {player.strikeRate}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {match.team2Score.topBowlers && match.team2Score.topBowlers.length > 0 && (
                      <div className="player-stats">
                        <h5>Top Bowlers:</h5>
                        <ul>
                          {match.team2Score.topBowlers.map((player, index) => (
                            <li key={index}>
                              {player.name}: {player.wickets}/{player.runs} in {player.overs} overs
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="match-meta">
                    <p><strong>Toss:</strong> {match.tossWinner} chose to {match.tossDecision}</p>
                    <p><strong>Overs:</strong> {match.overs} per innings</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchHistory;