
import { useState, useEffect } from 'react';

interface UpdateEvent {
  id: string;
  type: 'task-updated' | 'user-joined' | 'user-left';
  data: any;
  timestamp: Date;
  user: string;
}

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState<UpdateEvent[]>([]);
  const [connectedUsers] = useState(['You', 'Sarah Johnson', 'Mike Chen']);

  useEffect(() => {
    // Simulate real-time updates every 10-30 seconds
    const interval = setInterval(() => {
      const updateTypes = ['task-updated', 'user-joined'] as const;
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      const users = ['Sarah Johnson', 'Mike Chen', 'Alex Rodriguez', 'Emily Davis'];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const newUpdate: UpdateEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: randomType,
        data: randomType === 'task-updated' ? 
          { taskName: 'UI/UX Design', progress: Math.floor(Math.random() * 20) + 80 } :
          { userName: randomUser },
        timestamp: new Date(),
        user: randomUser,
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
    }, Math.random() * 20000 + 10000);

    return () => clearInterval(interval);
  }, []);

  return { updates, connectedUsers };
};
