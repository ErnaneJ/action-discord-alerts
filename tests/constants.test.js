const constants = require("../lib/constants");

test('Max lengths', () => {
  expect(constants.MAX_TITLE_LENGTH).toBe(256);
  expect(constants.MAX_DESCRIPTION_LENGTH).toBe(2048);
  expect(constants.MAX_FIELD_NAME_LENGTH).toBe(256);
  expect(constants.MAX_FIELD_VALUE_LENGTH).toBe(1024);
  expect(constants.MAX_WEBHOOK_LENGTH).toBe(2000);
});

test('STATUS_OPTIONS', () => {
  expect(constants.STATUS_OPTIONS.success.status).toBe('Successful action run');
  expect(constants.STATUS_OPTIONS.success.color).toBe(2664261); // '0x28A745'

  expect(constants.STATUS_OPTIONS.failure.status).toBe('Failed action run');
  expect(constants.STATUS_OPTIONS.failure.color).toBe(13313073); // 0xCB2431

  expect(constants.STATUS_OPTIONS.cancelled.status).toBe('Canceled action run');
  expect(constants.STATUS_OPTIONS.cancelled.color).toBe(14396169); // 0xDBAB09
});

test('Inputs', () => {
  [
    'webhook',     'status',
    'content',     'title',
    'description', 'image',
    'color',       'username',
    'avatar_url',  'event_info',
    'timestamp',   'verbose'
  ].forEach((input) => {
    expect(constants.INPUTS).toContain(input);
  });
});

test('DEFAULT_VALUES', () => {
  expect(constants.DEFAULT_VALUES.status).toBe('success');
  expect(constants.DEFAULT_VALUES.username).toBe('GitHub Actions');
  expect(constants.DEFAULT_VALUES.avatar_url).toBe('https://github.com/github.png');
});