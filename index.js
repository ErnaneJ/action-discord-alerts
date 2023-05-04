const { getInputs, getDiscordPayload } = require('./lib/helpers');

const main = async () => {
  const inputs = getInputs();
  const payload = getDiscordPayload(inputs);

  await sendMessage(inputs.webhook.trim(), payload)
}

main();