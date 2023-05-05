const validations = require("../lib/validations");

const { 
  DEFAULT_VALUES, MAX_TITLE_LENGTH, 
  MAX_DESCRIPTION_LENGTH, MAX_FIELD_NAME_LENGTH, 
  MAX_FIELD_VALUE_LENGTH 
} = require("../lib/constants");

const { inputs } = require("./fixtures/inputs");
const { payload } = require("./fixtures/payload");

const bigString = "a".repeat(3000);

describe("Validation Inputs", () => {
  test("checkInputs - valids", () => {
    expect(validations.checkInputs(inputs)).toEqual(inputs);
    expect(validations.checkInputs(inputs).status).toEqual(DEFAULT_VALUES.status);
    expect(validations.checkInputs(inputs).username).toEqual(DEFAULT_VALUES.username);
    expect(validations.checkInputs(inputs).avatar_url).toEqual(DEFAULT_VALUES.avatar_url);
  });

  test("checkInputs - status not provided", () => {
    inputs.status = null;
    expect(validations.checkInputs(inputs).status).toEqual(DEFAULT_VALUES.status);
  });

  test("checkInputs - username not provided", () => {
    inputs.username = null;
    expect(validations.checkInputs(inputs).username).toEqual(DEFAULT_VALUES.username);
  });

  test("checkInputs - avatar_url not provided", () => {
    inputs.avatar_url = null;
    expect(validations.checkInputs(inputs).avatar_url).toEqual(DEFAULT_VALUES.avatar_url);
  });
});

describe("Validation Payload", () => {
  test("CheckPayload - valids", () => {
    expect(validations.checkPayload(payload)).toEqual(payload);
    expect(validations.checkPayload(payload).embeds[0].title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    expect(validations.checkPayload(payload).embeds[0].description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(validations.checkPayload(payload).embeds[0].fields[0].name.length).toBeLessThanOrEqual(MAX_FIELD_NAME_LENGTH);
    expect(validations.checkPayload(payload).embeds[0].fields[0].value.length).toBeLessThanOrEqual(MAX_FIELD_VALUE_LENGTH);
  });

  test("CheckPayload - Title exceeds max characters", () => {
    payload.embeds[0].title = bigString;
    expect(validations.checkPayload(payload).embeds[0].title.length).toEqual(MAX_TITLE_LENGTH);
  });

  test("CheckPayload - Description exceeds max characters", () => {
    payload.embeds[0].description = bigString;
    expect(validations.checkPayload(payload).embeds[0].description.length).toEqual(MAX_DESCRIPTION_LENGTH);
  });

  test("CheckPayload - Field name exceeds max characters", () => {
    payload.embeds[0].fields[0].name = bigString;
    expect(validations.checkPayload(payload).embeds[0].fields[0].name.length).toEqual(MAX_FIELD_NAME_LENGTH);
  });

  test("CheckPayload - Field value exceeds max characters", () => {
    payload.embeds[0].fields[0].value = bigString;
    expect(validations.checkPayload(payload).embeds[0].fields[0].value.length).toEqual(MAX_FIELD_VALUE_LENGTH);
  });
});