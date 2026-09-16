const fs=require('fs'),assert=require('assert'),crypto=require('crypto'),{open,extract}=require('./pak.cjs');
const path=require('path'),paths=require('./paths.cjs');
const root=paths.input,pak=open(root+'/zmore_survival_items_P.pak');
function map(b){let n=b.readUInt32LE(41),p=b.readUInt32LE(45),a=[];for(let i=0;i<n;i++){let start=p,len=b.readInt32LE(p);p+=4;let name=b.subarray(p,p+Math.abs(len)*(len<0?2:1)).toString(len<0?'utf16le':'utf8').replace(/\0$/,'');p+=Math.abs(len)*(len<0?2:1)+4;a.push({name,start,end:p});}return a;}
function num(n){let b=Buffer.alloc(4);b.writeUInt32LE(n);return b;}function fname(n){return Buffer.concat([num(n),num(0)]);}
let restrictionName;
for(const e of pak.entries.filter(e=>e.name.endsWith('.uasset'))){let b=extract(pak,e),m=map(b),r=m.find(x=>x.name==='RestrictedTags');if(r){restrictionName=b.subarray(r.start,r.end);break;}}
assert(restrictionName);let files=[],changes=[];
for(const e of pak.entries.filter(e=>e.name.endsWith('.uasset'))){let h=extract(pak,e),m=map(h),names=m.map(n=>n.name),triple=names.indexOf('3P');if(triple<0)continue;let xentry=pak.entries.find(x=>x.name===e.name.replace('.uasset','.uexp')),x=extract(pak,xentry),tag=names.indexOf('Tags'),array=names.indexOf('ArrayProperty'),nt=names.indexOf('NameProperty');let locations=[];
 for(let p=0;p<x.length-45;p++){if(x.readUInt32LE(p)!==tag||x.readUInt32LE(p+4)!==0||x.readUInt32LE(p+8)!==array||x.readUInt32LE(p+12)!==0||x.readUInt32LE(p+16)!==12||x.readUInt32LE(p+20)!==0||x.readUInt32LE(p+24)!==nt||x.readUInt32LE(p+28)!==0||x[p+32]!==0||x.readUInt32LE(p+33)!==1||x.readUInt32LE(p+37)!==triple||x.readUInt32LE(p+41)!==0)continue;locations.push(p);}
 assert.equal(locations.length,1,e.name+' expected exactly one 3P group');let pos=locations[0],rid=names.indexOf('RestrictedTags'),nameDelta=rid<0?restrictionName.length:0,oldHeaderLen=h.length;
 let originalH=Buffer.from(h),originalX=Buffer.from(x),nend=m.at(-1).end;
 if(rid<0){rid=names.length;h=Buffer.concat([h.subarray(0,nend),restrictionName,h.subarray(nend)]);h.writeUInt32LE(names.length+1,41);h.writeUInt32LE(names.length+1,117);
  for(const at of [24,45,53,61,69,73,81,85,89,165,189]){let value=originalH.readUInt32LE(at);if(value>=nend&&value<=oldHeaderLen)h.writeUInt32LE(value+nameDelta,at);}
 }
 const prop=Buffer.concat([fname(rid),fname(array),num(20),num(0),fname(nt),Buffer.from([0]),num(2),fname(names.indexOf('1P')),fname(names.indexOf('2P'))]);assert.equal(prop.length,53);
 x=Buffer.concat([x.subarray(0,pos),prop,x.subarray(pos+45)]);
 let ec=originalH.readUInt32LE(57),eo=originalH.readUInt32LE(61),modified=0;
 for(let i=0;i<ec;i++){let oldAt=eo+i*104,newAt=h.readUInt32LE(61)+i*104,size=Number(originalH.readBigInt64LE(oldAt+28)),off=Number(originalH.readBigInt64LE(oldAt+36)),local=off-oldHeaderLen;assert(local>=0&&local+size<=originalX.length-4,'export bounds');let inside=pos>=local&&pos+45<=local+size;if(inside){size+=8;modified++;}let newOff=off+nameDelta+(local>pos?8:0);h.writeBigInt64LE(BigInt(size),newAt+28);h.writeBigInt64LE(BigInt(newOff),newAt+36);}
 assert.equal(modified,1);h.writeBigInt64LE(originalH.readBigInt64LE(169)+BigInt(nameDelta+8),169);assert.equal(h.readUInt32LE(24),h.length);
 assert.equal(map(h)[rid].name,'RestrictedTags');assert(originalX.subarray(0,pos).equals(x.subarray(0,pos)));assert(originalX.subarray(pos+45).equals(x.subarray(pos+53)));
 files.push({name:e.name,data:h},{name:xentry.name,data:x});changes.push({asset:e.name,propertyOffset:pos,old:'Tags=[3P]',new:'RestrictedTags=[1P,2P]',effect:'The existing 3-player stock also applies at 4 players; 1/2-player groups unchanged',nameDelta});
}
assert(changes.length>=8);function u64(n){let b=Buffer.alloc(8);b.writeBigUInt64LE(BigInt(n));return b;}function str(s){let b=Buffer.from(s+'\0');return Buffer.concat([num(b.length),b]);}function sha(b){return crypto.createHash('sha1').update(b).digest();}
let payload=[],idx=[],offset=0;for(const f of files){let ent=Buffer.concat([u64(offset),u64(f.data.length),u64(f.data.length),num(0),sha(f.data),Buffer.alloc(5)]);let local=Buffer.from(ent);local.writeBigUInt64LE(0n);payload.push(local,f.data);idx.push(str(f.name),ent);offset+=local.length+f.data.length;}
let index=Buffer.concat([str('../../../'),num(files.length),...idx]),result=Buffer.concat([...payload,index,num(0x5a6f12e1),num(3),u64(offset),u64(index.length),sha(index)]);
let output=paths.output+'/zzzzz_SurvivalShop_4Players_P.pak';fs.writeFileSync(output,result);let v=open(output);assert.equal(v.entries.length,files.length);for(let i=0;i<files.length;i++)assert(extract(v,v.entries[i]).equals(files[i].data));
fs.writeFileSync(path.join(paths.reports,'build-report.json'),JSON.stringify({output,status:'Static checks passed; in-game verification required',changes},null,2));console.log(changes.map(c=>c.asset.split('/').pop()).join('\n'));console.log('Validated',files.length,'files;',result.length,'bytes');

fs.copyFileSync(path.join(paths.project,'README.md'),path.join(paths.project,'dist/README.md'));
