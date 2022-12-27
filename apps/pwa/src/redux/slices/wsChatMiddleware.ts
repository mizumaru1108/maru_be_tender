import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import {
  startConnecting,
  addConversation,
  connectionEstablished,
  selectConversation,
} from './wschat';

const wsChatMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    const isConnectionEstablished = socket && store.getState().wschat;

    socket = io(
      'https://api-staging.tmra.io/v2/raise?accessToken=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImlQeHF2a056TkJ2dkk5a2oyU255bXRneXlqZyJ9.eyJhdWQiOiJiNWVlNjZmMS1jYzFjLTQxODUtOTdhOS1lNTYyY2U4ZTk4ZjYiLCJleHAiOjE2NzE3ODQ2NTAsImlhdCI6MTY3MTc4Mjg1MCwiaXNzIjoic3RhZ2luZy50bXJhLmlvIiwic3ViIjoiZmQ1ZjUwZDgtMzFhOC00MTQ1LWE5NGYtYzZlMDk3YzcwMTZmIiwianRpIjoiOWZhZTZhNWYtNWJkNi00MTBmLThkOGMtYWM4MTBkMTdiYjk1IiwiYXV0aGVudGljYXRpb25UeXBlIjoiUEFTU1dPUkQiLCJlbWFpbCI6ImZyaXNreSthY2NfbWFuYWdlckBzb2x1dmFzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiYXBwbGljYXRpb25JZCI6ImI1ZWU2NmYxLWNjMWMtNDE4NS05N2E5LWU1NjJjZThlOThmNiIsInJvbGVzIjpbInRlbmRlcl9hY2NvdW50c19tYW5hZ2VyIl0sImF1dGhfdGltZSI6MTY3MTc4Mjg1MCwidGlkIjoiNzMxNDI1Y2MtMjE4NC00Yjc1LWE4OTUtZTA3NWNkZWY5OWVjIn0.C2q9wpkhosImqTXLqNZGGACPzZQ3KGWEVrTNCrAw917dbNYPGOK5firfh_C2fyG_QFR8vOg_Gp9gW6zgITdXHw',
      {
        transports: ['websocket', 'polling', 'flashsocket'],
      }
    );

    socket.on('connect', () => {
      store.dispatch(connectionEstablished());
    });
    // if (startConnecting.match(action)) {
    //   socket = io('https://api-staging.tmra.io/v2/raise', {
    //     transports: ['websocket', 'polling', 'flashsocket'],
    //   });

    //   socket.on('connect', () => {
    //     store.dispatch(connectionEstablished());
    //   });
    // }

    // console.log('dispatching', store.getState());

    const result = next(action);

    console.log('next state', store.getState());
    return result;
  };

  // return (next) => (action) => {
  //   const isConnectionEstablished = socket && store.getState().wschat.isConnected;
  //   if (startConnecting.match(action)) {
  //     socket = io('https://api-staging.tmra.io/v2/raise', {
  //       transports: ['websocket', 'polling', 'flashsocket'],
  //     });
  //     socket.on('connect', () => {
  //       store.dispatch(connectionEstablished());
  //     });
  //   }
  //   next(action);
  // };
};

export default wsChatMiddleware;
