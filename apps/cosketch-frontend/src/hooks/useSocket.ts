// import { useState, useEffect, useCallback, useRef } from 'react';

// type RoomEventType = 'room:join' | 'room:leave';

// type UserEventType = 'user:connected' | 'user:disconnected';

// type CanvasEventType =
//   | 'canvas:draw'
//   | 'canvas:clear'
//   | 'canvas:erase'
//   | 'canvas:update';

// type MessageType = RoomEventType | UserEventType | CanvasEventType | 'error';

// interface SocketMessage {
//   type: MessageType;
//   room?: string;
//   message?: any;
//   payload?: any;
// }

// interface UseSocketOptions {
//   token: string;
//   serverUrl: string;
//   // userId: string;
//   onUserConnected?: (message: any) => void;
//   onUserDisconnected?: (message: any) => void;
//   onCanvasEvent?: (message: any) => void;
//   onError?: (error: any) => void;
// }

// export const useSocket = (options: UseSocketOptions) => {
//   const {
//     token,
//     serverUrl,
//     onUserConnected,
//     onUserDisconnected,
//     onCanvasEvent,
//     onError,
//   } = options;

//   const [isConnected, setIsConnected] = useState(false);
//   const [currentRoom, setCurrentRoom] = useState<string | null>(null);
//   const [lastMessage, setLastMessage] = useState<any>(null);
//   const [usersInRoom, setUsersInRoom] = useState<string[]>([]);

//   const socketRef = useRef<WebSocket | null>(null);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectAttemptsRef = useRef(0);
//   const MAX_RECONNECT_ATTEMPTS = 5;
//   const RECONNECT_INTERVAL = 3000;

//   // Connect to WebSocket server
//   const connect = useCallback(() => {
//     // Close existing connection if any
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.close();
//     }

//     try {
//       // Add token to URL for authentication
//       const url = `${serverUrl}?token=${token}`;
//       socketRef.current = new WebSocket(url);

//       socketRef.current.onopen = () => {
//         setIsConnected(true);
//         reconnectAttemptsRef.current = 0;
//         console.log('WebSocket connection established');

//         // Rejoin room if we were in one before reconnecting
//         if (currentRoom) {
//           joinRoom(currentRoom);
//         }
//       };

//       socketRef.current.onclose = () => {
//         setIsConnected(false);
//         console.log('WebSocket connection closed');

//         // Attempt to reconnect
//         if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//           reconnectAttemptsRef.current += 1;

//           reconnectTimeoutRef.current = setTimeout(() => {
//             connect();
//           }, RECONNECT_INTERVAL);
//         }
//       };

//       socketRef.current.onerror = error => {
//         console.error('WebSocket error:', error);
//         if (onError) onError(error);
//       };

//       socketRef.current.onmessage = event => {
//         try {
//           const message = JSON.parse(event.data);
//           setLastMessage(message);

//           // Handle different message types
//           switch (message.type) {
//             case 'user:connected':
//               if (onUserConnected) onUserConnected(message);
//               // Could update users list here if message contains user info
//               break;

//             case 'user:disconnected':
//               if (onUserDisconnected) onUserDisconnected(message);
//               // Could update users list here if message contains user info
//               break;

//             case 'canvas:draw':
//             case 'canvas:clear':
//             case 'canvas:erase':
//             case 'canvas:update':
//               if (onCanvasEvent) onCanvasEvent(message);
//               break;

//             case 'error':
//               console.error('Server error:', message.message);
//               if (onError) onError(message);
//               break;

//             default:
//               console.log('Received message:', message);
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
//     } catch (error) {
//       console.error('Error creating WebSocket connection:', error);
//       if (onError) onError(error);
//     }
//   }, [
//     serverUrl,
//     token,
//     currentRoom,
//     onUserConnected,
//     onUserDisconnected,
//     onCanvasEvent,
//     onError,
//   ]);

//   // Send a message through the WebSocket
//   const sendMessage = useCallback((message: SocketMessage) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(message));
//       return true;
//     } else {
//       console.warn('Cannot send message: WebSocket is not connected');
//       return false;
//     }
//   }, []);

//   // Join a room
//   const joinRoom = useCallback(
//     (room: string) => {
//       if (
//         sendMessage({
//           type: 'room:join',
//           room,
//         })
//       ) {
//         setCurrentRoom(room);
//         return true;
//       }
//       return false;
//     },
//     [sendMessage],
//   );

//   // Leave a room
//   const leaveRoom = useCallback(() => {
//     if (
//       currentRoom &&
//       sendMessage({
//         type: 'room:leave',
//         room: currentRoom,
//       })
//     ) {
//       setCurrentRoom(null);
//       setUsersInRoom([]);
//       return true;
//     }
//     return false;
//   }, [currentRoom, sendMessage]);

//   // Send canvas event to current room
//   const sendCanvasEvent = useCallback(
//     (eventType: CanvasEventType, payload: any) => {
//       if (!currentRoom) {
//         console.warn('Cannot send canvas event: Not in a room');
//         return false;
//       }

//       return sendMessage({
//         type: eventType,
//         room: currentRoom,
//         payload,
//       });
//     },
//     [currentRoom, sendMessage],
//   );

//   // Disconnect from WebSocket
//   const disconnect = useCallback(() => {
//     // Leave room first if in one
//     if (currentRoom) {
//       leaveRoom();
//     }

//     if (socketRef.current) {
//       socketRef.current.close();
//       socketRef.current = null;
//     }

//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }

//     reconnectAttemptsRef.current = 0;
//     setIsConnected(false);
//   }, [currentRoom, leaveRoom]);

//   // Connect on mount and clean up on unmount
//   useEffect(() => {
//     connect();

//     return () => {
//       disconnect();
//     };
//   }, [connect, disconnect]);

//   return {
//     isConnected,
//     currentRoom,
//     lastMessage,
//     usersInRoom,
//     sendMessage,
//     joinRoom,
//     leaveRoom,
//     sendCanvasEvent,
//     disconnect,
//     reconnect: connect,
//   };
// };
