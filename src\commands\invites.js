const { SlashCommandBuilder } = require("discord.js");
const { getInviteCount } = require("../features/invites");
module.exports = { data: new SlashCommandBuilder().setName("invites").setDescription("ნახე მოწვევების რაოდენობა").addUserOption(o=>o.setName("user").setDescription("მომხმარებელი")), async execute(i){ const u=i.options.getUser("user")||i.user; return i.reply(`${u}-ს მოწვევები: **${getInviteCount(i.guild.id,u.id)}**`); } };
