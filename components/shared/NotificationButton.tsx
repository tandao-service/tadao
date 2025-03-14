import { subscribeToNotifications } from '@/lib/actions/usePushNotifications';
import { useEffect } from 'react';
export interface Props {
    userId: string;
   
  }
const NotificationButton = ({ userId }:Props) => {
  useEffect(() => {
   
    subscribeToNotifications(userId);
  }, [userId]);

  return <>{/*<button onClick={() => {subscribeToNotifications(userId); alert(userId);}}>Enable Notifications</button> */}</>;
};

export default NotificationButton;
