import { createClient } from "redis";
const subscriber = createClient();
const dataClient = createClient(); 

await subscriber.connect();
await dataClient.connect();

const activeSubscriptions = new Set();

const registerListener = async (junctionId, callback, socket) => {
 
  const lastMessage = await dataClient.get(`latest:${junctionId}`);

  if (lastMessage) {
    const signalState = JSON.parse(lastMessage);
    socket.emit("signalUpdate", { junctionId, signalState });
  }


  if (!activeSubscriptions.has(junctionId)) {
    await subscriber.subscribe(junctionId, (message) => {
      const signalState = JSON.parse(message);
      callback(junctionId, signalState);
    });
    activeSubscriptions.add(junctionId);
  }
};

export default registerListener;
