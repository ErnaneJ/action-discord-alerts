import { log } from "./utils";
import { 
  DEFAULT_VALUES, MAX_TITLE_LENGTH,
  MAX_FIELD_NAME_LENGTH, MAX_FIELD_VALUE_LENGTH, 
  MAX_WEBHOOK_LENGTH, MAX_DESCRIPTION_LENGTH 
} from "./constants";

export function checkInputs(inputs){
  if(!inputs.status){
    inputs.status = DEFAULT_VALUES.status;
    log('warning', `Status not provided, defaulting to ${inputs.status}.`);
  }

  if(!inputs.username){
    inputs.username = DEFAULT_VALUES.username;
    log('warning', `Username not provided, defaulting to ${inputs.username}.`);
  }

  if(!inputs.avatar_url){
    inputs.avatar_url = DEFAULT_VALUES.avatar_url;
    log('warning', `Avatar URL not provided, defaulting to ${inputs.avatar_url}.`);
  }

  if(!inputs.webhook){
    log('error', `Webhook not provided, please provide a Discord webhook.`);
  }else if(inputs.webhook.length > MAX_WEBHOOK_LENGTH){
    log('error', `Webhook exceeds ${MAX_WEBHOOK_LENGTH} characters, please provide a valid Discord webhook.`);
  }

  return inputs;
}

export function checkPayload(payload){
  const embeds = payload.embeds[0];
  if(embeds.title.length > MAX_TITLE_LENGTH){
    log('warning', `Title exceeds ${MAX_TITLE_LENGTH} characters, truncating.`);
    embeds.title = embeds.title.substring(0, MAX_TITLE_LENGTH - 3) + '...';
  }

  if(embeds.description.length > MAX_DESCRIPTION_LENGTH){
    log('warning', `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters, truncating.`);
    embeds.description = embeds.description.substring(0, MAX_DESCRIPTION_LENGTH);
  }

  embeds.fields.forEach(field => {
    if(field.name.length > MAX_FIELD_NAME_LENGTH){
      log('warning', `Field name exceeds ${MAX_FIELD_NAME_LENGTH} characters, truncating.`);
      field.name = field.name.substring(0, MAX_FIELD_NAME_LENGTH - 3) + '...'
    }

    if(field.value.length > MAX_FIELD_VALUE_LENGTH){
      log('warning', `Field value exceeds ${MAX_FIELD_VALUE_LENGTH} characters, truncating.`);
      field.value = field.value.substring(0, MAX_FIELD_VALUE_LENGTH - 3) + '...';
    }
  });

  return payload;
}