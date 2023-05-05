import { STATUS_OPTIONS } from './constants';

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

export function getInputs() {
  return {
    webhook:      core.getInput('webhook', {required: false}),
    status:       core.getInput('status', {required: false}).toLowerCase(),
    content:      core.getInput('content', {required: false}),
    title:        core.getInput('custom_title', {required: false}),
    description:  core.getInput('description', {required: false}),
    image:        core.getInput('image', {required: false}),
    color:        core.getInput('color', {required: false}),
    username:     core.getInput('username', {required: false}),
    avatar_url:   core.getInput('avatar_url', {required: false}),
    event_info:   core.getInput('event_info', {required: false}),
    timestamp:    core.getInput('timestamp', {required: false})
  }
}

export function getDiscordPayload(inputs) {
  const githubContext = github.context
  const { owner, repo } = githubContext.repo
  const { ref, workflow, actor, payload, serverUrl, runId } = githubContext
  const repoURL = `${serverUrl}/${owner}/${repo}`
  const workflowURL = `${repoURL}/actions/runs/${runId}`

  const eventDetail = `[${payload.head_commit.author.name}](https://github.com/${actor}) authored & committed - ${payload.head_commit.message}`
  const [ refs, head, branch ] = ref.split('/')

  let embed = {
    color: inputs.color || STATUS_OPTIONS[inputs.status].color,
    footer: { text: `Triggered by ${actor}`, icon_url: `https://github.com/${actor}.png?size=32` },
    thumbnail: { url: 'https://github.com/github.png' }
  }

  if (inputs.title) {
    embed.title = inputs.title
  }else{
    embed.title = `${STATUS_OPTIONS[inputs.status].status}`
  }

  if (inputs.description) {
    embed.description = inputs.description
  }else{
    embed.description = eventDetail
  }

  if (inputs.timestamp) embed.timestamp = (new Date()).toISOString()
  if (inputs.image) embed.image = { url: inputs.image }

  if (inputs.event_info) {
    embed.fields = [
      { name: '', value: ``, inline: false },
      { name: 'Repository', value: `[${owner}/${repo}](${repoURL})`, inline: true },
      { name: 'Branch', value: `[${branch}](${repoURL}/tree/${branch})`, inline: true },
      { name: '', value: ``, inline: false },
      { name: 'Commit', value: `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url})`, inline: true },
      { name: 'Workflow', value: `[${workflow}#${runId}](${workflowURL})`, inline: true },
      { name: '', value: ``, inline: false },
    ]
  }

  // embeds: [fitEmbed(embed)]
  let discord_payload = { embeds: [embed] }

  if (inputs.username) discord_payload.username = inputs.username
  if (inputs.avatar_url) discord_payload.avatar_url = inputs.avatar_url
  if (inputs.content) discord_payload.content = inputs.content

  return discord_payload
}

export async function sendPayload(webhook, payload) {
  try {
    await axios.post(webhook, payload)
  } catch (error) {
    core.setFailed(error.message);
  }
}