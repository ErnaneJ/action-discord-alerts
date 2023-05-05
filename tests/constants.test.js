const constants = require("../lib/constants");

test('MAX_TITLE_LENGTH to equal 256', () => {
  expect(constants.MAX_TITLE_LENGTH).toBe(256);
});

test('MAX_DESCRIPTION_LENGTH to equal 2048', () => {
  expect(constants.MAX_DESCRIPTION_LENGTH).toBe(2048);
});

test('MAX_FIELD_NAME_LENGTH to equal 256', () => {
  expect(constants.MAX_FIELD_NAME_LENGTH).toBe(256);
});

test('MAX_FIELD_VALUE_LENGTH to equal 1024', () => {
  expect(constants.MAX_FIELD_VALUE_LENGTH).toBe(1024);
});

test('MAX_WEBHOOK_LENGTH to equal 2000', () => {
  expect(constants.MAX_WEBHOOK_LENGTH).toBe(2000);
});

test('STATUS_OPTIONS success', () => {
  expect(constants.STATUS_OPTIONS.status).toBe('Successful action run');
  expect(constants.STATUS_OPTIONS.color).toBe('0x28A745');
});

test('STATUS_OPTIONS failure', () => {
  expect(constants.STATUS_OPTIONS.status).toBe('Failed action run');
  expect(constants.STATUS_OPTIONS.color).toBe('0xCB2431');
});

test('STATUS_OPTIONS cancelled', () => {
  expect(constants.STATUS_OPTIONS.status).toBe('Canceled action run');
  expect(constants.STATUS_OPTIONS.color).toBe('0xDBAB09');
});