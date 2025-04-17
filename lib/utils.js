import { STATUS_OPTIONS, INPUTS, DEFAULT_VALUES } from './constants';
import { checkPayload, checkInputs } from './validations';

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

export function getInputs() {
  let inputs = { }

  INPUTS.forEach(input => {
    inputs[input] = core.getInput(input, { required: false });
  });

  inputs = checkInputs(inputs);

  return inputs;
}

export function getDiscordPayload(inputs) {
  const githubContext = github.context;
  const { owner, repo } = githubContext.repo;
  const { ref, workflow, actor, payload, serverUrl, runId, triggering_actor } = githubContext;
  const repoURL = `${serverUrl}/${owner}/${repo}`;
  const workflowURL = `${repoURL}/actions/runs/${runId}`;

  const actorName = triggering_actor || actor;
  const actorURL = `https://github.com/${actorName}`;

  const eventDetail = payload.head_commit
    ? `[${payload.head_commit.author.name}](${actorURL}) commit: ${payload.head_commit.message}`
    : `Action run by [${actorName}](${actorURL})`;

  const [ refs, head, branch ] = ref.split('/');

  if(!inputs.status) inputs.status = DEFAULT_VALUES.status;

  let embed = {
    color: inputs.color || STATUS_OPTIONS[inputs.status.toLowerCase()].color,
    footer: { text: `Triggered by ${actor}`, icon_url: `https://github.com/${actor}.png?size=32` },
  }

  if(inputs.thumbnail){
    embed.thumbnail = { url: inputs.image };
  }else{
    embed.thumbnail = { url: DEFAULT_VALUES.thumbnail };
  }

  if (inputs.title) {
    embed.title = inputs.title;
  }else{
    embed.title = `${STATUS_OPTIONS[inputs.status.toLowerCase()].status}`;
  }

  if (inputs.description) {
    embed.description = inputs.description;
  }else{
    embed.description = eventDetail;
  }

  if (inputs.timestamp) embed.timestamp = (new Date()).toISOString();
  if (inputs.image) embed.image = { url: inputs.image };

  if (inputs.custom_fields) {
    try {
      const customFields = JSON.parse(inputs.custom_fields);
      if (customFields && Array.isArray(customFields)) {
        embed.fields = customFields;
      }
    } catch (e) {
      log('error', `Failed to parse custom_fields: ${e.message}`);
    }
  }

  if (inputs.event_info) {
      const baseFields = [];
      const hiddenFields = inputs.hide_default_fields || []
      console.log(hiddenFields)
  
      if (!hiddenFields.includes('repository') || !hiddenFields.includes('branch')) {
        baseFields.push({ name: '', value: '', inline: false });
      }
  
      if (!hiddenFields.includes('repository')) {
        baseFields.push({ 
          name: 'Repository', 
          value: `[\`${owner}/${repo}\`](${repoURL})`, 
          inline: true 
        });
      }
  
      if (!hiddenFields.includes('branch')) {
        baseFields.push({ 
          name: 'Branch', 
          value: `[\`${branch}\`](${repoURL}/tree/${branch})`, 
          inline: true 
        });
      }
  
      if (!hiddenFields.includes('commit') || !hiddenFields.includes('workflow')) {
        baseFields.push({ name: '', value: '', inline: false });
      }
  
      if (!hiddenFields.includes('commit')) {
        baseFields.push({ 
          name: 'Commit', 
          value: payload.head_commit ? `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url})` : '-', 
          inline: true 
        });
      }
  
      if (!hiddenFields.includes('workflow')) {
        baseFields.push({ 
          name: 'Workflow', 
          value: `[\`${workflow}#${runId}\`](${workflowURL})`, 
          inline: true 
        });
      }
  
      // Add final spacing if we're showing any fields
      if (baseFields.length > 0 && baseFields[baseFields.length - 1].name !== '') {
        baseFields.push({ name: '', value: '', inline: false });
      }
  
      embed.fields = embed.fields ? [ ...baseFields, ...embed.fields] : baseFields;
  }

  let discord_payload = { embeds: [embed] }

  if (inputs.username) {
    discord_payload.username = inputs.username;
  }else{
    discord_payload.username = DEFAULT_VALUES.username;
  }

  if (inputs.avatar_url) {
    discord_payload.avatar_url = inputs.avatar_url
  }else{
    discord_payload.avatar_url = DEFAULT_VALUES.avatar_url;
  }

  if (inputs.content) discord_payload.content = inputs.content

  if(inputs.verbose) log('info', `${JSON.stringify(discord_payload)}`);

  discord_payload = checkPayload(discord_payload);

  return discord_payload;
}

export function log(type, message){
  if(process.env.SILENT) return;
  return {
    error: (message) => core.setFailed(message),
    info: (message) => core.info(message),
    warning: (message) => core.warning(message)
  }[type](message);
}

export async function sendPayload(webhook, payload) {
  try {
    await axios.post(webhook, payload)
  } catch (error) {
    if (error.response) {
      log('error', `Webhook response: ${error.response.status}: ${JSON.stringify(error.response.data)}`)
    } else {
      log('error', error)
    }
  }
}