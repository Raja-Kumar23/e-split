/**
 * Main Application Shell.
 * Manages global state, real-time Firebase subscriptions, and navigation across core modules.
 */
'use client';
import { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import Topnav from './Topnav';
import BottomNav from './BottomNav';
import Dashboard from './Dashboard';
import ESplit from './ESplit';
import Connections from './Connections';
import Gifts from './Gifts';
import Profile from './Profile';

export default function AppShell() {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [allGroups, setAllGroups] = useState({});
  const [allConnections, setAllConnections] = useState({});
  const [pendingReqs, setPendingReqs] = useState({});
  const [sentReqs, setSentReqs] = useState({});
  const [triggerNew, setTriggerNew] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAll = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    // Set up real-time database listeners for group data
    const u1 = onValue(ref(db, 'groups'), snap => {
      const groups = {};
      if (snap.exists()) {
        Object.entries(snap.val()).forEach(([gid, g]) => {
          // Only include groups where the current user is a member
          if (g.members?.[uid]) groups[gid] = g;
        });
      }
      setAllGroups(groups);
    });

    // Fetch all accepted connections for the user
    const u2 = onValue(ref(db, `connections/${uid}/accepted`), async snap => {
      const conns = {};
      if (snap.exists()) {
        await Promise.all(Object.keys(snap.val()).map(async tUid => {
          const s = await get(ref(db, 'users/' + tUid));
          if (s.exists()) conns[tUid] = s.val();
        }));
      }
      setAllConnections(conns);
    });

    // Fetch all incoming connection requests
    const u3 = onValue(ref(db, `connections/${uid}/incoming`), async snap => {
      const reqs = {};
      if (snap.exists()) {
        await Promise.all(Object.keys(snap.val()).map(async tUid => {
          const s = await get(ref(db, 'users/' + tUid));
          if (s.exists()) reqs[tUid] = s.val();
        }));
      }
      setPendingReqs(reqs);
    });

    // Fetch all sent connection requests
    const u4 = onValue(ref(db, `connections/${uid}/sent`), async snap => {
      const sent = {};
      if (snap.exists()) {
        await Promise.all(Object.keys(snap.val()).map(async tUid => {
          const s = await get(ref(db, 'users/' + tUid));
          if (s.exists()) sent[tUid] = s.val();
        }));
      }
      setSentReqs(sent);
    });

    return () => { u1(); u2(); u3(); u4(); };
  }, [currentUser, refreshKey]);

  // Handle navigation tab changes
  const handleNav = (page, openNew = false) => {
    setActivePage(page);
    if (page === 'esplit' && openNew) setTriggerNew(true);
  };

  return (
    <div className="app-container">
      {/* Desktop sticky topnav */}
      <Topnav
        activePage={activePage}
        onNav={handleNav}
        pendingCount={Object.keys(pendingReqs).length}
      />

      <div className="main">
        {activePage === 'dashboard' && (
          <Dashboard allGroups={allGroups} onNav={handleNav} />
        )}
        {activePage === 'esplit' && (
          <ESplit
            allGroups={allGroups}
            allConnections={allConnections}
            showNewGroup={triggerNew}
            onNewGroupDone={() => setTriggerNew(false)}
            onGroupsRefresh={refreshAll}
          />
        )}
        {activePage === 'connections' && (
          <Connections
            allConnections={allConnections}
            pendingRequests={pendingReqs}
            sentRequests={sentReqs}
            onRefresh={refreshAll}
          />
        )}
        {activePage === 'gifts' && (
          <Gifts allConnections={allConnections} />
        )}
        {activePage === 'profile' && (
          <Profile allGroups={allGroups} allConnections={allConnections} />
        )}
      </div>

      {/* Mobile fixed bottom nav */}
      <BottomNav
        activePage={activePage}
        onNav={handleNav}
      />
    </div>
  );
}
