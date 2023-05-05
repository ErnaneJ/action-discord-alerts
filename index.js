import { getInputs, getDiscordPayload, log, sendPayload } from './lib/utils';

const main = async () => {
  log('info', 'Starting Discord Action Alert ✨');
  log('info', 'Getting inputs..');
  const inputs = getInputs();

  log('info', 'Getting Discord payload..');
  const payload = getDiscordPayload(inputs);

  log('info', 'Sending Discord payload..');
  await sendPayload(inputs.webhook.trim(), payload);

  log('info', 'Discord Action Alert completed successfully! 🎉');
}

main();