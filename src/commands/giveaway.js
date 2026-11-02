const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { read, write } = require("../core/db");
module.exports = {
 data: new SlashCommandBuilder().setName("giveaway").setDescription("დაიწყე გათამაშება").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild).addStringOption(o=>o.setName("prize").setDescription("პრიზი").setRequired(true)).addIntegerOption(o=>o.setName("minutes").setDescription("ხანგრძლივობა წუთებში").setMinValue(1).setMaxValue(10080).setRequired(true)),
 async execute(i,client){
  const prize=i.options.getString("prize"), mins=i.options.getInteger("minutes"), endsAt=Date.now()+mins*60000;
  const msg=await i.reply({embeds:[new EmbedBuilder().setTitle("🎉 GIVEAWAY").setDescription(`პრიზი: **${prize}**\nმონაწილეობისთვის დააჭირე 🎉 რეაქციას.\nდასრულება: <t:${Math.floor(endsAt/1000)}:R>`).setColor(0xF1C40F)],fetchReply:true});
  await msg.react("🎉");
  const db=read("giveaways",{}); db[msg.id]={channelId:i.channelId,messageId:msg.id,prize,endsAt,ended:false}; write("giveaways",db);
  setTimeout(()=>require("../features/giveaways").endGiveaway(client,msg.id),mins*60000);
 }
};
