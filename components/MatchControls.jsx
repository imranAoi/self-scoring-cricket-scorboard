import { useState, useEffect } from 'react';

function MatchControls({ match, onScoreUpdate, onEndMatch }) {
  const [currentBatsmen, setCurrentBatsmen] = useState(match.currentBatsmen || []);
  const [currentBowler, setCurrentBowler] = useState(match.currentBowler || '');
  const [ballsInOver, setBallsInOver] = useState(0);
  const [showBowlerSelection, setShowBowlerSelection] = useState(false);
  const [availableBowlers, setAvailableBowlers] = useState([]);
  const [inningsCompleted, setInningsCompleted] = useState(false);

  // Initialize or reset match state
  useEffect(() => {
    if (match) {
      setCurrentBatsmen(match.currentBatsmen || match.openingBatsmen);
      setCurrentBowler(match.currentBowler || match.openingBowlers[0]);
      setBallsInOver(0);
      setInningsCompleted(false);
    }
  }, [match]);

  // Update available bowlers whenever the bowling team changes
  useEffect(() => {
    if (match) {
      const bowlingTeam = match.currentInnings === 1 ? match.team2Players : match.team1Players;
      setAvailableBowlers(bowlingTeam.filter(player => player !== currentBowler));
    }
  }, [match, currentBowler]);

  const handleScore = (runs, isWicket = false) => {
    if (inningsCompleted) return;

    // Update match score
    const scoreUpdate = { runs, isWicket };
    onScoreUpdate(scoreUpdate);

    // Update batsmen stats if runs scored
    if (runs > 0) {
      const updatedBatsmen = [...currentBatsmen];
      updatedBatsmen[0].runs += runs;
      updatedBatsmen[0].ballsFaced++;
      setCurrentBatsmen(updatedBatsmen);

      // Rotate strike for 1, 3, or 5 runs
      if (runs % 2 !== 0) {
        rotateStrike();
      }
    }

    // Handle wicket
    if (isWicket) {
      // In a real app, you'd show a batsman selection dialog here
      // For now, we'll just rotate the strike
      rotateStrike();
    }

    // Update over count
    const newBalls = ballsInOver + 1;
    setBallsInOver(newBalls);

    // Check if over is completed
    if (newBalls >= 6) {
      setShowBowlerSelection(true);
      setBallsInOver(0);
      rotateStrike(); // Strike rotates after every over
    }
  };

  const rotateStrike = () => {
    if (currentBatsmen.length >= 2) {
      setCurrentBatsmen([currentBatsmen[1], currentBatsmen[0]]);
    }
  };

  const selectNewBowler = (bowler) => {
    setCurrentBowler(bowler);
    setShowBowlerSelection(false);
  };

  const completeInnings = () => {
    if (match.currentInnings === 1) {
      // Switch to second innings
      setCurrentBatsmen(match.openingBatsmen);
      setCurrentBowler(match.openingBowlers[0]);
      setBallsInOver(0);
      setInningsCompleted(false);
    } else {
      // End the match
      onEndMatch();
    }
  };

  const calculateStrikeRate = (batsman) => {
    if (batsman.ballsFaced === 0) return 0;
    return ((batsman.runs / batsman.ballsFaced) * 100).toFixed(2);
  };

  if (!match) return null;

  const battingTeam = match.currentInnings === 1 ? match.team1 : match.team2;
  const bowlingTeam = match.currentInnings === 1 ? match.team2 : match.team1;
  const currentScore = match[`team${match.currentInnings}Score`];
  const completedOvers = Math.floor(currentScore.overs);
  const completedBalls = Math.round((currentScore.overs - completedOvers) * 10);

  return (
    <div className="match-controls">
      <div className="player-status">
        <h3>Batting: {battingTeam}</h3>
        <div className="batsmen">
          {currentBatsmen.map((batsman, index) => (
            <div key={batsman.id} className={`batsman ${index === 0 ? 'striker' : 'non-striker'}`}>
              <span className="player-name">
                {batsman.name} {index === 0 ? '⚡' : ''}
              </span>
              <span className="player-stats">
                {batsman.runs} ({batsman.ballsFaced}) - SR: {calculateStrikeRate(batsman)}
              </span>
            </div>
          ))}
        </div>

        <h3>Bowling: {bowlingTeam}</h3>
        <div className="bowler">
          <span className="player-name">{currentBowler}</span>
          <span className="over-stats">
            Over: {completedOvers}.{completedBalls}
          </span>
        </div>
      </div>

      <div className="score-controls">
        <h3>Score Controls</h3>
        <div className="control-buttons">
          <button onClick={() => handleScore(0)}>Dot Ball</button>
          <button onClick={() => handleScore(1)}>1 Run</button>
          <button onClick={() => handleScore(2)}>2 Runs</button>
          <button onClick={() => handleScore(3)}>3 Runs</button>
          <button onClick={() => handleScore(4)}>4 Runs</button>
          <button onClick={() => handleScore(6)}>6 Runs</button>
          <button onClick={() => handleScore(0, true)}>Wicket</button>
          <button onClick={rotateStrike}>Rotate Strike</button>
        </div>
      </div>

      {showBowlerSelection && (
        <div className="bowler-selection">
          <h3>Select Next Bowler</h3>
          <div className="bowler-options">
            {availableBowlers.map((bowler) => (
              <button
                key={bowler}
                onClick={() => selectNewBowler(bowler)}
              >
                {bowler}
              </button>
            ))}
          </div>
        </div>
      )}

      {inningsCompleted && (
        <div className="innings-complete">
          <h3>Innings Complete!</h3>
          <button onClick={completeInnings}>
            {match.currentInnings === 1 ? 'Start Second Innings' : 'Finish Match'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MatchControls;