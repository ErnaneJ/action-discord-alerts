import { getInputs, getDiscordPayload, sendPayload } from './lib/utils';

const main = async () => {
  const inputs = getInputs();
  const payload = getDiscordPayload(inputs);

  await sendPayload(inputs.webhook.trim(), payload);
}

main();