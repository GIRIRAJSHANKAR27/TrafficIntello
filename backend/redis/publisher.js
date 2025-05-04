import { createClient } from "redis";
const publisher = createClient();

await publisher.connect();

const publishSignalState = async (junctionId, signalState) => {
  const message = JSON.stringify(signalState);

  await publisher.set(`latest:${junctionId}`, message);


  await publisher.publish(junctionId, message);
};

export default publishSignalState;
