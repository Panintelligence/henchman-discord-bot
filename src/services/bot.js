const utils = require('../utils/utils');
const jiraConfig = require('../config/jira-config.json');

const isPermitted = (channelId, roleIds, whitelistedChannels, whitelistedRoles) => {
  if (!roleIds || !channelId) {
    return false;
  }
  return utils.array.anyIntersection(roleIds, whitelistedRoles) &&
    whitelistedChannels.includes(channelId);
};

const command = (info, bangCommands, regex, f) => {
  const match = regex ? info.message.match(regex) : null;
  const bangCommand = utils.string.getMatchingStartingWord(info.message, bangCommands || []);
  if (bangCommand !== null || (match && match.length > 0)) {
    f(info, bangCommand, (match && match.length > 0) ? match : []);
  }
};

const triggers = {
  poke: {
    commands: ['!poke'],
    regex: /.* *(is |)(the |) *bot (is |)(on(line|)|around)\?/i
  },
  jiraProjects: {
    commands: jiraConfig.projects.map(p => `!${p.code}`),
    regex: new RegExp(`(^|\\s+)((${jiraConfig.projects.map(p => `${p.code}`).join('|')})-|)[0-9]+(\\s+|$)`, 'gim'),
    regexForTest: new RegExp(`(^|\\s+)((PROJ1|PROJ2)-|)[0-9]+(\\s+|$)`, 'gim')
  },
  holiday: {
    commands: ['!away', '!holiday'],
    regex: /.* *Who('s| is) (out( of( the|) office| off|)|on holiday) *(|today|tomorrow|this week|next week)\?/i
  },
  release: {
    commands: ['!release'],
    regex: /.* *(((what|which|where)(\'s| is|)|have) (the|) release (branch|))/i
  },
  branches: {
    commands: ['!branches'],
    regex: null
  },
  build: {
    commands: ['!build'],
    regex: /.* *(start) .* *(build) *((on|for|from|) *(`|)((?!please\b)\b\w+)(`|)|)/i
  },
  cancelBuild: {
    commands: ['!cancel'],
    regex: /.* *(cancel) .* *(build|queue) *(`|)((?!please\b)\b\w+)(`|)/i
  },
  help: {
    commands: ['!info', '!help'],
    regex: null
  },
}

module.exports = {
  isPermitted: isPermitted,
  command: command,
  triggers: triggers
}
