const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const STATUS_OPTIONS = {
  success: {
    status: 'Success',
    color: 0x28A745
  },
  failure: {
    status: 'Failure',
    color: 0xCB2431
  },
  cancelled: {
    status: 'Cancelled',
    color: 0xDBAB09
  }
}

function getInputs() {
  return {
    webhook:      core.getInput('webhook', {required: false}),
    status:       core.getInput('status', {required: false}),
    job:          core.getInput('job', {required: false}),
    content:      core.getInput('content', {required: false}),
    title:        core.getInput('title', {required: false}),
    description:  core.getInput('description', {required: false}),
    image:        core.getInput('image', {required: false}),
    color:        core.getInput('color', {required: false}),
    url:          core.getInput('url', {required: false}),
    username:     core.getInput('username', {required: false}),
    avatar_url:   core.getInput('avatar_url', {required: false}),
    nofail:       core.getInput('nofail', {required: false}),
    nocontext:    core.getInput('nocontext', {required: false}),
    noprefix:     core.getInput('noprefix', {required: false}),
    nodetail:     core.getInput('nodetail', {required: false}),
    notimestamp:  core.getInput('notimestamp', {required: false})
  }
}

function getDiscordPayload(inputs) {
  const ctx = github.context
  const { owner, repo } = ctx.repo
  const { eventName, ref, workflow, actor, payload, serverUrl, runId } = ctx
  const repoURL = `${serverUrl}/${owner}/${repo}`
  const workflowURL = `${repoURL}/actions/runs/${runId}`

  const eventFieldTitle = `Event - ${eventName}`
  const eventDetail = `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}` // push

  let embed = {
    color: inputs.color || STATUS_OPTIONS[inputs.status].color
  }

  if (!inputs.notimestamp) {
    embed.timestamp = (new Date()).toISOString()
  }

  if (inputs.title) {
    embed.title = inputs.title
  }

  if (inputs.url) {
    embed.url = inputs.url
  }

  if (inputs.image) {
    embed.image = {
      url: inputs.image
    }
  }

  if (!inputs.noprefix) {
    embed.title = STATUS_OPTIONS[inputs.status].status + (embed.title ? `: ${embed.title}` : '')
  }

  if (inputs.description) {
    embed.description = inputs.description
  }

  if (!inputs.nocontext) {
    embed.fields = [
      {
        name: 'Repository',
        value: `[${owner}/${repo}](${repoURL})`,
        inline: true
      },
      {
        name: 'Ref',
        value: ref,
        inline: true
      },
      {
        name: eventFieldTitle,
        value: eventDetail,
        inline: false
      },
      {
        name: 'Triggered by',
        value: actor,
        inline: true
      },
      {
        name: 'Workflow',
        value: `[${workflow}](${workflowURL})`,
        inline: true
      }
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
      // discord_payload.content = fitContent(inputs.content)
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
  core.info(inputs)
  core.info(STATUS_OPTIONS)
  const payload = getDiscordPayload(inputs);

  await sendMessage(inputs.webhook.trim(), payload)
}

main();