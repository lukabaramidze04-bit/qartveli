const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { read, write } = require("../core/db");
const { log } = require("../core/log");
const { getSettings } = require("../core/guildSettings");
module.exports = {
 data: [
  new SlashCommandBuilder().setName("ban").setDescription("აკრძალე წევრი").setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).addUserOption(o=>o.setName("user").setDescription("წევრი").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("მიზეზი")),
  new SlashCommandBuilder().setName("kick").setDescription("გააგდე წევრი").setDefaultMemberPermissions(PermissionFlagsBits.KickMembers).addUserOption(o=>o.setName("user").setDescription("წევრი").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("მიზეზი")),
  new SlashCommandBuilder().setName("timeout").setDescription("დროებითი შეზღუდვა წუთებში").setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).addUserOption(o=>o.setName("user").setDescription("წევრი").setRequired(true)).addIntegerOption(o=>o.setName("minutes").setDescription("წუთები (1-40320)").setMinValue(1).setMaxValue(40320).setRequired(true)),
  new SlashCommandBuilder().setName("warn").setDescription("გაფრთხილება").setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).addUserOption(o=>o.setName("user").setDescription("წევრი").setRequired(true)).addStringOption(o=>o.setName("reason").setDescription("მიზეზი").setRequired(true)),
  new SlashCommandBuilder().setName("warnings").setDescription("ნახე გაფრთხილებები").setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).addUserOption(o=>o.setName("user").setDescription("წევრი").setRequired(true)),
  new SlashCommandBuilder().setName("clear").setDescription("წაშალე შეტყობინებები").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages).addIntegerOption(o=>o.setName("amount").setDescription("რაოდენობა 1-100").setMinValue(1).setMaxValue(100).setRequired(true)),
  new SlashCommandBuilder().setName("lock").setDescription("ჩაკეტე არხი").setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("unlock").setDescription("გახსენი არხი").setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("slowmode").setDescription("დააყენე Slowmode").setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels).addIntegerOption(o=>o.setName("seconds").setDescription("0-21600").setMinValue(0).setMaxValue(21600).setRequired(true))
 ],
 async execute(i) {
  const name=i.commandName, user=i.options.getUser("user"), reason=i.options.getString("reason") || "მიზეზი არ არის მითითებული";
  const cfg = getSettings(i.guildId);
  if(name==="ban"){ await i.guild.members.ban(user,{reason}); await log(i.guild,cfg,"⛔ წევრი დაიბანა",`${user.tag} (${user.id})\nმოდერატორი: ${i.user.tag}\nმიზეზი: ${reason}`,0xED4245); return i.reply(`${user.tag} დაიბანა. მიზეზი: ${reason}`); }
  if(name==="kick"){ const m=await i.guild.members.fetch(user.id); await m.kick(reason); await log(i.guild,cfg,"👢 წევრი გააგდეს",`${user.tag} (${user.id})\nმოდერატორი: ${i.user.tag}\nმიზეზი: ${reason}`,0xED4245); return i.reply(`${user.tag} გაიგდო. მიზეზი: ${reason}`); }
  if(name==="timeout"){ const m=await i.guild.members.fetch(user.id); const minutes=i.options.getInteger("minutes"); await m.timeout(minutes*60000,reason); await log(i.guild,cfg,"🔇 წევრს timeout მიეცა",`${user.tag} (${user.id})\nხანგრძლივობა: ${minutes} წთ.\nმოდერატორი: ${i.user.tag}\nმიზეზი: ${reason}`,0xED4245); return i.reply(`${user.tag} შეიზღუდა.`); }
  if(name==="warn"){ const db=read("warnings",{}), key=`${i.guild.id}:${user.id}`; db[key]=db[key]||[]; db[key].push({by:i.user.id,reason,at:Date.now()}); write("warnings",db); await log(i.guild,cfg,"⚠️ წევრი გაფრთხილდა",`${user.tag} (${user.id})\nმოდერატორი: ${i.user.tag}\nმიზეზი: ${reason}`,0xF1C40F); return i.reply(`${user.tag}-ს გაფრთხილება მიეცა.`); }
  if(name==="warnings"){ const db=read("warnings",{}); const list=db[`${i.guild.id}:${user.id}`]||[]; return i.reply({content:list.length?list.map((w,n)=>`${n+1}. ${w.reason} — <@${w.by}>`).join("\n"):"გაფრთხილება არ აქვს.",ephemeral:true}); }
  if(name==="clear"){ const amount=i.options.getInteger("amount"); await i.channel.bulkDelete(amount,true); await log(i.guild,cfg,"🧹 შეტყობინებები წაიშალა",`${amount} შეტყობინება • ${i.channel}\nმოდერატორი: ${i.user.tag}`,0xF1C40F); return i.reply({content:"შეტყობინებები წაიშალა.",ephemeral:true}); }
  if(name==="lock"||name==="unlock"){ await i.channel.permissionOverwrites.edit(i.guild.roles.everyone,{SendMessages:name==="unlock"?null:false}); await log(i.guild,cfg,name==="lock"?"🔒 არხი ჩაიკეტა":"🔓 არხი გაიხსნა",`${i.channel}\nმოდერატორი: ${i.user.tag}`,0xF1C40F); return i.reply(`არხი ${name==="lock"?"ჩაიკეტა":"გაიხსნა"}.`); }
  if(name==="slowmode"){ const seconds=i.options.getInteger("seconds"); await i.channel.setRateLimitPerUser(seconds); await log(i.guild,cfg,"🐢 Slowmode შეიცვალა",`${i.channel}\n${seconds} წამი • ${i.user.tag}`,0xF1C40F); return i.reply("Slowmode განახლდა."); }
 }
};
