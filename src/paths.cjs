const fs=require('fs'),path=require('path');
const project=path.resolve(__dirname,'..');
const game=path.resolve(process.env.REMNANT_GAME_DIR || process.argv[2] || path.resolve(project,'../..'));
const input=path.join(game,'Remnant/Content/Paks');
const output=path.join(project,'dist/Remnant/Content/Paks');
const reports=path.join(project,'reports');
fs.mkdirSync(output,{recursive:true});fs.mkdirSync(reports,{recursive:true});
module.exports={project,game,input,output,reports};
