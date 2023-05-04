const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const STATUS_OPTIONS = {
  success: {
    status: 'Successful action run',
    color: 0x28A745
  },
  failure: {
    status: 'Failed action run',
    color: 0xCB2431
  },
  cancelled: {
    status: 'Canceled action run',
    color: 0xDBAB09
  }
}

function getInputs() {
  return {
    webhook:      core.getInput('webhook', {required: false}),
    status:       core.getInput('status', {required: false}).toLowerCase(),
    content:      core.getInput('content', {required: false}),
    title:        core.getInput('title', {required: false}),
    description:  core.getInput('description', {required: false}),
    image:        core.getInput('image', {required: false}),
    color:        core.getInput('color', {required: false}),
    url:          core.getInput('url', {required: false}),
    username:     core.getInput('username', {required: false}),
    avatar_url:   core.getInput('avatar_url', {required: false}),
    event_info:   core.getInput('event_info', {required: false}),
    full_title:   core.getInput('full_title', {required: false}),
    timestamp:  core.getInput('timestamp', {required: false})
  }
}

function getDiscordPayload(inputs) {
  const ctx = github.context
  const { owner, repo } = ctx.repo
  const { ref, workflow, actor, payload, serverUrl, runId } = ctx
  const repoURL = `${serverUrl}/${owner}/${repo}`
  const workflowURL = `${repoURL}/actions/runs/${runId}`

  const eventDetail = `[${payload.head_commit.author.name}](https://github.com/${actor}) authored & committed: \n "${payload.head_commit.message}"`
  const [ refs, head, branch ] = ref.split('/')

  let embed = {
    color: inputs.color || STATUS_OPTIONS[inputs.status].color,
    footer: { text: `Triggered by ${actor}`, icon_url: `https://github.com/${actor}.png?size=32` },
    thumbnail: { url: 'https://github.com/github.png' }
  }

  if (inputs.timestamp) {
    embed.timestamp = (new Date()).toISOString()
  }

  embed.title = `${STATUS_OPTIONS[inputs.status].status}`
  
  if (inputs.image) {
    embed.image = { url: inputs.image }
  }

  if (inputs.description) {
    embed.description = inputs.description
  }else{
    embed.description = eventDetail
  }

  if (inputs.event_info) {
    embed.fields = [
      { name: '', value: ``, inline: false },
      {
        name: 'Repository',
        value: `[${owner}/${repo}](${repoURL})`,
        inline: true
      },
      {
        name: 'Branch',
        value: `[${branch}](${repoURL}/tree/${branch})`,
        inline: true
      },
      { name: '', value: ``, inline: false },
      {
        name: 'Commit',
        value: `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url})`,
        inline: true
      },
      {
        name: 'Workflow',
        value: `[${workflow}#${runId}](${workflowURL})`,
        inline: true
      },
      { name: '', value: ``, inline: false },
    ]
  }

  let discord_payload = {
    // embeds: [fitEmbed(embed)]
    embeds: [embed]
  }

  if (inputs.username) {
    discord_payload.username = inputs.username
  }
  if (inputs.avatar_url) {
    discord_payload.avatar_url = inputs.avatar_url
  }
  if (inputs.content) {
    discord_payload.content = inputs.content
  }

  return discord_payload
}

async function sendMessage(webhook, payload) {
  try {
    await axios.post(webhook, payload)
  } catch (error) {
    core.setFailed(error.message);
  }
}

const main = async () => {
  const inputs = getInputs();
  core.info(JSON.stringify(inputs))
  core.info(JSON.stringify(STATUS_OPTIONS))
  const payload = getDiscordPayload(inputs);
  core.info(JSON.stringify(payload))

  await sendMessage(inputs.webhook.trim(), payload)
}

main();