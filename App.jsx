import { useState, useEffect } from 'react';
import MatchHistory from './components/MatchHistory';

import MatchControls from './components/MatchControls';
import TeamConfiguration from './components/MatchSetup/TeamConfiguration';
import TossDecision from './components/MatchSetup/TossDecision';
import OpeningPlayers from './components/MatchSetup/OpeningPlayers';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [teamsData, setTeamsData] = useState({});
  const [setupStep, setSetupStep] = useState('team-config');
  const [matchConfig, setMatchConfig] = useState({
    team1: '',
    team2: '',
    playersPerTeam: 11,
    overs: 20,
    tossWinner: '',
    tossDecision: '',
    battingFirst: '',
    bowlingFirst: '',
    team1Players: [],
    team2Players: [],
    openingBatsmen: [],
    openingBowlers: []
  });

  // Load saved teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('cricketTeams');
    if (savedTeams) {
      setTeamsData(JSON.parse(savedTeams));
    }
  }, []);

  const saveTeamsData = (teams) => {
    setTeamsData(teams);
    localStorage.setItem('cricketTeams', JSON.stringify(teams));
  };

  const startNewMatch = () => {
    setCurrentMatch(null);
    setSetupStep('team-config');
    setMatchConfig({
      team1: '',
      team2: '',
      playersPerTeam: 11,
      overs: 20,
      tossWinner: '',
      tossDecision: '',
      battingFirst: '',
      bowlingFirst: '',
      team1Players: [],
      team2Players: [],
      openingBatsmen: [],
      openingBowlers: []
    });
  };

  const completeSetup = () => {
    const newMatch = {
      id: Date.now(),
      ...matchConfig,
      date: new Date().toLocaleString(),
      team1Score: { runs: 0, wickets: 0, overs: 0, batsmen: {}, bowlers: {} },
      team2Score: { runs: 0, wickets: 0, overs: 0, batsmen: {}, bowlers: {} },
      currentInnings: 1,
      currentBatsmen: matchConfig.openingBatsmen,
      currentBowler: matchConfig.openingBowlers[0],
      completed: false
    };
    setCurrentMatch(newMatch);
    setSetupStep('match');
  };

  const updateScore = (runs = 0, isWicket = false, isExtra = false) => {
    // Score update logic with player tracking
  };

  const endMatch = () => {
    const updatedMatch = { ...currentMatch, completed: true };
    setMatches([...matches, updatedMatch]);
    setCurrentMatch(null);
  };

  return (
    <div className="app">
      <h1>Cricket Scoreboard</h1>
      
      {!currentMatch ? (
        <>
          {setupStep === 'team-config' && (
            <TeamConfiguration
              config={matchConfig}
              setConfig={setMatchConfig}
              teamsData={teamsData}
              saveTeamsData={saveTeamsData}
              nextStep={() => setSetupStep('toss')}
            />
          )}
          
          {setupStep === 'toss' && (
            <TossDecision
              config={matchConfig}
              setConfig={setMatchConfig}
              nextStep={() => setSetupStep('players')}
              prevStep={() => setSetupStep('team-config')}
            />
          )}
          
          {setupStep === 'players' && (
            <OpeningPlayers
              config={matchConfig}
              setConfig={setMatchConfig}
              completeSetup={completeSetup}
              prevStep={() => setSetupStep('toss')}
            />
          )}
          
          <MatchHistory matches={matches} onNewMatch={startNewMatch} />
        </>
      ) : (
        <>
          <LiveScoreboard match={currentMatch} />
          <MatchControls 
            onScoreUpdate={updateScore}
            onEndMatch={endMatch}
            match={currentMatch}
          />
        </>
      )}
    </div>
  );
}

export default App;