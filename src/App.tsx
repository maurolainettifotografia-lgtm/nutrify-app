import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { MobileShell, TabType } from './components/layout/MobileShell';
import { DiaryScreen } from './components/diary/DiaryScreen';
import { WaterWeightScreen } from './components/water/WaterWeightScreen';
import { WorkoutsScreen } from './components/workouts/WorkoutsScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { NutriChatScreen } from './components/ai/NutriChatScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AuthScreen } from './components/auth/AuthScreen';

export const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('diary');

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MobileShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLockScreen={() => setIsAuthenticated(false)}
    >
      {currentTab === 'diary' && (
        <DiaryScreen onNavigateToAi={() => setCurrentTab('ai')} />
      )}
      {currentTab === 'water' && <WaterWeightScreen />}
      {currentTab === 'workouts' && <WorkoutsScreen />}
      {currentTab === 'reports' && <ReportsScreen />}
      {currentTab === 'ai' && <NutriChatScreen />}
      {currentTab === 'profile' && <ProfileScreen />}
    </MobileShell>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
