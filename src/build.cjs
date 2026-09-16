const fs=require('fs'),crypto=require('crypto'),assert=require('assert'),{open,extract}=require('./pak.cjs');
const path=require('path'),paths=require('./paths.cjs');
const root=paths.input, out=paths.output+'/zzzz_FivePlayers_Experimental_P.pak';
const p=open(root+'/pakchunk0-WindowsNoEditor.pak'), e=p.entries.find(e=>e.name==='Remnant/Config/DefaultGame.ini');
let source=extract(p,e).toString('utf8');assert.equal((source.match(/^MaxPlayers=3\r?$/gm)||[]).length,1);
let data=Buffer.from(source.replace(/^MaxPlayers=3\r?$/m,'MaxPlayers=5\r'));
function u32(n){let b=Buffer.alloc(4);b.writeUInt32LE(n);return b;}function u64(n){let b=Buffer.alloc(8);b.writeBigUInt64LE(BigInt(n));return b;}function str(s){let b=Buffer.from(s+'\0');return Buffer.concat([u32(b.length),b]);}function sha(b){return crypto.createHash('sha1').update(b).digest();}
const entry=Buffer.concat([u64(0),u64(data.length),u64(data.length),u32(0),sha(data),Buffer.alloc(5)]);
const index=Buffer.concat([str('../../../'),u32(1),str(e.name),entry]);
const pak=Buffer.concat([entry,data,index,u32(0x5a6f12e1),u32(3),u64(entry.length+data.length),u64(index.length),sha(index)]);
fs.writeFileSync(out,pak);const check=open(out);assert(extract(check,check.entries[0]).equals(data));
const exe=fs.readFileSync(path.join(paths.game,'Remnant/Binaries/Win64/Remnant-Win64-Shipping.exe'));
const exeSHA256=crypto.createHash('sha256').update(exe).digest('hex');
const platforms={
  '078278b3d52fde90b0d9234c787f27c908db326b8601da9993ea7f1f09da584f':{store:'Epic Games',memoryPatch:true,instructionRVA:'0x59A639'},
  '05c2d85e6c26f7d9aab5d90979f0b487283e180303422f05a7cc3bfa1f13be4c':{store:'Steam',memoryPatch:false},
};
const platform=platforms[exeSHA256];assert(platform,`Unsupported executable SHA256: ${exeSHA256}`);
if(platform.memoryPatch){const offset=0x599639+1024;assert.equal(exe.subarray(offset,offset+7).toString('hex'),'c7400803000000');}
const report={status:'Experimental five-player version; Epic and Steam launch paths statically verified; five-player gameplay not independently tested',pak:out,pakSHA256:crypto.createHash('sha256').update(pak).digest('hex'),buildExecutable:{store:platform.store,sha256:exeSHA256},supportedExecutables:platforms,epicMemoryPatch:{instructionRVA:'0x59A639',expected:'C7 40 08 03 00 00 00',replacement:'C7 40 08 05 00 00 00',function:'UMatchmaker::CreateSession'},validation:['Original pak index SHA1 valid','Generated pak index SHA1 valid','Extracted config byte-for-byte roundtrip valid','Supported executable hash matches local installation',...(platform.memoryPatch?['Epic native instruction matches local executable']:[])],limitations:['No independent five-player gameplay test','Door and zone travel not fixed or verified','Steam uses the PAK limit without the Epic-specific EOS memory patch']};fs.writeFileSync(path.join(paths.reports,'build-report.json'),JSON.stringify(report,null,2));console.log(report);

const helperOut=path.join(paths.output,'FivePlayers');fs.mkdirSync(helperOut,{recursive:true});
for(const name of ['ndc_Activar-5-Jugadores.ps1','ndc_Activar-5-Jugadores.cmd','ndc_Jugar-Remnant.vbs']) {
const source=fs.readFileSync(path.join(paths.project,'runtime',name),'utf8');
fs.writeFileSync(path.join(helperOut,name),source.replaceAll('__PAK_SHA256__',report.pakSHA256));
}
fs.copyFileSync(path.join(paths.project,'README.md'),path.join(paths.project,'dist/README.md'));
