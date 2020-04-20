var responseHeaders=new Headers({
	"Content-Type":"text/javascript"
});
Game.Win("Third-party");
Game.massBuild=function(inputMode,determined,BuyBothSell,amount,name,RigidelEven,RigidelDirection){
	if(name!=undefined){
		name=name.charAt(0).toUpperCase()+name.slice(1);
		if(typeof Game.Objects[name]=="undefined")return name+" is not a building.";
	}
	if(Game.OnAscend)return;
	if(Game.stopBuying){console.log("Buying has been halted.");setTimeout(function(){Game.stopBuying=false;},5000);return;}
	var amountDifferences=[5,10,11,11,11,13,14,13,13,12,12,11,11,11,11,32];
	var a=[];
	var price=0;
	for(var i in Game.ObjectsById){
		var obj=Game.ObjectsById[i];
		if(inputMode=="array"&&i<amount.length)a[i]=amount[i]-obj.amount;
		else if(inputMode=="base"){
			var nameId=Game.Objects[name].id;
			a[i]=amount-obj.amount;
			if(nameId>i)for(var j=i;j<nameId;j++){
				a[i]+=amountDifferences[j];
			}
			else if(nameId<i)for(var j=nameId;j<i;j++){
				a[i]-=amountDifferences[j];
			}
		}
		else a[i]=0;
		if(obj.amount<-a[i])a[i]=-obj.amount;//stops negative amounts of buildings
		//if(a[i]>0&&BuyBothSell=="buy"||BuyBothSell=="both")price+=obj.getSumPrice(a[i]);
		//else if(a[i]<0&&BuyBothSell=="sell"||BuyBothSell=="both")price-=obj.getReverseSumPrice(-a[i]);
	}
	if(typeof RigidelEven=="string"){
		var total=Game.BuildingsOwned;
		var buyTotal=0;
		for(var i in a){
			total+=a[i];
			buyTotal+=a[i];
		}
		var less=total%10;
		var more=10-less;
		//var mult=RigidelDirection=="more"?1:-1;
		if(less!=0){
			var obj=-1;
			if(RigidelEven=="any"){
				if(BuyBothSell=="buy"&&RigidelDirection=="less"&&buyTotal-less<0)RigidelDirection="more";//the impossible has been requested
				else if(BuyBothSell=="sell"&&RigidelDirection=="more"&&buyTotal+more>0)RigidelDirection="less";//again
			}
			else obj=Game.Objects[RigidelEven].id;
			function fixDifference(id){
				var priceDiff=0;
				
				//won't work? return "no"
				return priceDiff;
			}
			if(RigidelEven=="any")for(var i=0;i<(RigidelDirection=="more"?more:less);i++){//loop stuff to determine which one to get each time
				priceArray=[];
				for(var j in a){
					priceArray.push(fixDifference(j));
				}
				//add/remove the cheapest one that works
			}
			else{
				if(RigidelDirection=="more")a[obj]+=more;
				else if(RigidelDirection=="less")a[obj]-=less;
				if(BuyBothSell=="buy"&&a[obj]<0)a[obj]+=10;
				if(BuyBothSell=="sell"&&a[obj]>0)a[obj]-=10;
			}
		}
	}
	for(var i in Game.ObjectsById){
		if(a[i]>0&&BuyBothSell=="buy"||BuyBothSell=="both")price+=Game.ObjectsById[i].getSumPrice(a[i]);
		else if(a[i]<0&&BuyBothSell=="sell"||BuyBothSell=="both")price-=Game.ObjectsById[i].getReverseSumPrice(-a[i]);
	}
	if(price>Game.cookies){
		if(determined==0)return "You can't afford to buy all the buildings.";
		else if(determined==1)console.log("You can't afford to buy all the buildings.");
		else if(determined>=2){
			if(determined==2)console.log("You can't afford to buy all the buildings right now. This program will buy as many of the buildings as it can every five seconds until the buildings have all been bought.");
			setTimeout(Game.massBuild,5000,inputMode,3,BuyBothSell,amount,name);
		}
	}
	else if(determined==3)console.log("Your buildings have been bought.");
	for(var i in a){
		if(a[i]<0&&(BuyBothSell=="sell"||BuyBothSell=="both"))Game.ObjectsById[i].sell(-a[i]);
	}
	for(var i in a){
		if(a[i]>0&&(BuyBothSell=="buy"||BuyBothSell=="both"))Game.ObjectsById[i].buy(a[i]);
	}
}
Game.massPlant=function(doPlant,parentN,override,what,what2,separate){
	var plotSize=Math.min(Game.Objects["Farm"].level,9)-1;
	if(plotSize==-1||Game.Objects["Farm"].amount==0)return "Garden minigame is not available!";
	var Mini=Game.Objects["Farm"].minigame;//super handy
	if(typeof what!="undefined"&&separate!=2)for(var i in Mini.plantsById){
		if(Mini.plantsById[i].name==what){
			what=Mini.plantsById[i];
			if(!what.plantable)return "First plant is not a plantable plant. Please choose another plant.";
			break;
		}
	}
	if(typeof what2!="undefined"&&separate!=1)for(var i in Mini.plantsById){
		if(Mini.plantsById[i].name==what2){
			what2=Mini.plantsById[i];
			if(!what2.plantable)return "Second plant is not a plantable plant. Please choose another plant.";
			break;
		}
	}
	if(!what.unlocked&&separate!=2)return "First plant has not been unlocked yet!";
	if(typeof what2!="undefined"&&separate!=1)if(!what2.unlocked)return "Second plant has not been unlocked yet!";
	//plantPatterns[parentN][plotSize]([whichParent])=spot
	var plantPatterns=[[],[],//0 and 1 parent(s) (N/A)
		[//2 parents
			[[14],				[20]],
			[[15],				[21]],
			[[20,22],			[21]],
			[[19,22],			[20,21]],
			[[7,10,25,28],		[15,20]],
			[[13,16,25,29],		[14,17,27]],
			[[7,10,25,28],		[13,16,31,34]],
			[[7,10,25,28],		[13,16,31,34]],
			[[1,4,13,16,31,34],	[7,10,25,28]]
		],[//3 parents
			[14,15,20],
			[14,16,20],
			[14,16,21,26,28],
			[13,16,20,21,25,28],
			[7,10,14,15,20,21,25,28],
			[7,11,14,15,16,20,21,22,25,29],
			[7,11,14,15,16,20,22,26,27,28,31,35],
			[6,11,13,14,15,16,19,22,25,26,27,28,30,35],
			[0,5,7,8,9,10,13,16,19,22,25,26,27,28,30,35]
		],[//4 parents
			[],
			[14,16,20,22],
			[14,16,20,22,26,28],
			[13,16,19,20,21,22,25,28],
			[7,8,10,15,16,19,20,25,27,28],
			[7,8,9,11,16,17,19,20,25,27,28,29],
			[7,9,11,13,14,16,17,21,25,26,28,29,31,33,35],
			[6,8,9,11,12,13,16,17,20,24,25,28,29,30,32,33,35],
			[0,3,5,6,7,8,9,10,16,17,18,19,25,26,27,28,29,30,32,35]
		],[//5 parents
			[],
			[14,15,16,20,22],
			[14,16,20,21,22,26,28],
			[13,15,16,19,20,21,25,27,28],
			[7,8,9,10,13,16,19,22,25,26,27,28],
			[7,8,9,10,11,13,16,19,22,23,25,26,27,28],
			[7,8,9,10,11,13,16,19,22,23,25,26,27,28,32,34,35],
			[6,8,10,11,12,13,14,16,19,22,23,24,25,26,28,30,32,34,35],
			[0,1,2,3,4,6,9,12,15,17,18,19,20,21,23,24,29,32,33,34]
		],[//6 parents
			[[],[]],[[],[]],
			[[20,22,26],							[14,15,16]],
			[[13,16,25,27,28],						[14,15,26]],
			[[7,8,10,13,22,25,27],					[9,16,19,21,26]],
			[[7,11,13,17,19,23,25,29],				[9,15,21,27]],
			[[7,8,9,10,11,31,32,33,34,35],			[19,20,21,22,23]],
			[[6,7,8,9,10,11,30,31,32,33,34,35],		[18,19,20,21,22,23]],
			[[1,3,5,6,14,16,20,23,24,29,30,33,34],	[0,2,4,13,15,17,18,26,28,32]]
		],[],//7 parents (N/A)
		[//8 parents
			[],[],
			[14,15,16,20,22,26,27,28],
			[13,14,15,19,21,25,26,27],
			[7,8,9,13,15,19,20,21],
			[7,8,9,10,11,13,15,17,19,20,21,22,23],
			[7,8,9,10,11,13,15,17,19,20,21,22,23,25,27,29,31,32,33,34,35],
			[6,7,8,9,10,12,14,16,18,19,20,21,22,24,26,28,30,31,32,33,34],
			[0,1,2,3,4,6,8,10,12,13,14,15,16,18,20,22,24,25,26,27,28]
		]
	];//end of plantPatterns assigning
	if(plantPatterns[parentN].length==0)return "Amount of plants required to mutate is invalid.";
	var array=plantPatterns[parentN];
	if(array[plotSize].length==0)return "Plot size is invalid.";
	array=array[plotSize];var array2=[];
	var twoPar=(parentN==2||parentN==6);
	if(twoPar){
		if((array[0].length==0||separate==2)&&(array[1].length==0||separate==1))return "Plot size is invalid.";
		if(what==what2||typeof what2=="undefined"){array=array[0].concat(array[1]);twoPar=false;}
		else{array2=array[1];array=array[0];}
	}if(!twoPar)separate=0;//because separation requires at least two things to separate
	for(var i in array){array[i]=[array[i]%6,Math.floor(array[i]/6)];}
	for(var i in array2){array2[i]=[array2[i]%6,Math.floor(array2[i]/6)];}
	if(doPlant<2){//I want to know the cost of such an endeavour, not to actually do it
		//Copy the current state of the garden, calculate most of the current cps multiplier (only stuff that doesn't change because of the garden),
		//then do the mass plant on the local version of the garden, tile by tile, recalculating the rest of the CpS calculations each time, to find the cost of actually doing it
		var plot=[];//initializing the local plot,
		for(var y=0;y<6;y++){plot[y]=[];for(var x=0;x<6;x++){//and giving it the contents of the real garden plot (at first)
			plot[y][x]=[];
			plot[y][x].push(Mini.getTile(x,y)[0],Mini.getTile(x,y)[1]);
		}}
		var effs={cps:1,cursorCps:1,grandmaCps:1,milk:1,wrinklerEat:1};//the effects of the plants in our local garden that affect the cost of plants
		function calcEffs(){//recalculate our local garden's effects
			for(var y=0;y<6;y++){for(var x=0;x<6;x++){plot[y][x][2]=1;}}//here goes the power boost on each tile
			function effectOn(X,Y,mult){
				for(var y=Math.max(0,Y-1);y<Math.min(6,Y+2);y++){for(var x=Math.max(0,X-1);x<Math.min(6,X+2);x++){
					if(X!=x||Y!=y)plot[y][x][2]*=mult;
				}}
			}
			for(var y=0;y<6;y++){for(var x=0;x<6;x++){//adding power boosts
				var tile=plot[y][x];
				if(tile[0]>0){
					var me=Mini.plantsById[tile[0]-1];
					var name=me.key;
					var mult=Mini.soilsById[Mini.soil].effMult*1;
					if(tile[1]<me.mature){
						if(tile[1]>=me.mature*0.666)mult*=0.5;
						else if(tile[1]>=me.mature*0.333)mult*=0.25;
						else mult*=0.1;
					}
					var powerMult=(name=='queenbeetLump'?0.8:name=='nursetulip'?1.2:name=='shriekbulb'?0.95:name=='ichorpuff'?0.5:1);
					if(powerMult>=1)powerMult=(powerMult-1)*mult+1;else if(mult>=1)powerMult=1/((1/powerMult)*mult);else powerMult=1-(1-powerMult)*mult;
					if(powerMult!=1)effectOn(x,y,powerMult);
				}
			}}
			//resetting them before we recalculate them
			effs.cps=1;effs.cursorCps=1;effs.grandmaCps=1;effs.milk=1;effs.wrinklerEat=1;
			if(!Mini.freeze){for(var y=0;y<6;y++){for(var x=0;x<6;x++){
				var tile=plot[y][x];
				if(tile[0]>0){
					var me=Mini.plantsById[tile[0]-1];
					var name=me.key;
					var mult=Mini.soilsById[Mini.soil].effMult*plot[y][x][2];
					if(tile[1]<me.mature){
						if(tile[1]>=me.mature*0.666)mult*=0.5;
						else if(tile[1]>=me.mature*0.333)mult*=0.25;
						else mult*=0.1;
					}
					if(name=='bakerWheat')effs.cps+=0.01*mult;
					else if(name=='cronerice')effs.grandmaCps+=0.03*mult;
					else if(name=='elderwort')effs.grandmaCps+=0.01*mult;
					else if(name=='bakeberry')effs.cps+=0.01*mult;
					else if(name=='chocoroot')effs.cps+=0.01*mult;
					else if(name=='whiteMildew')effs.cps+=0.01*mult;
					else if(name=='brownMold')effs.cps*=1-0.01*mult;
					else if(name=='whiskerbloom')effs.milk+=0.002*mult;
					else if(name=='nursetulip')effs.cps*=1-0.02*mult;
					else if(name=='drowsyfern')effs.cps+=0.03*mult;
					else if(name=='queenbeet')effs.cps*=1-0.02*mult;
					else if(name=='queenbeetLump')effs.cps*=1-0.1*mult;
					else if(name=='glovemorel'){effs.cursorCps+=0.01*mult;effs.cps*=1-0.01*mult;}
					else if(name=='wrinklegill')effs.wrinklerEat+=0.01*mult;
					else if(name=='shriekbulb')effs.cps*=1-0.02*mult;
				}
			}}}
		}
		//and now for the the cps calcs, starting with what won't change...
		//we do this from scratch here because taking the actual cps and factoring out the effects of the garden plants would be harder, longer, and less accurate
		var baseMult=1;
		if(Game.ascensionMode!=1)baseMult+=parseFloat(Game.prestige)*0.01*Game.heavenlyPower*Game.GetHeavenlyMultiplier();
		if(Game.Has('Heralds')&&Game.ascensionMode!=1)baseMult*=1+0.01*Game.heralds;
		for(var i in Game.cookieUpgrades){
			var me=Game.cookieUpgrades[i];
			if(Game.Has(me.name))baseMult*=(1+(typeof(me.power)=='function'?me.power(me):me.power)*0.01);
		}
		if(Game.Has('Specialized chocolate chips'))baseMult*=1.01;
		if(Game.Has('Designer cocoa beans'))baseMult*=1.02;
		if(Game.Has('Underworld ovens'))baseMult*=1.03;
		if(Game.Has('Exotic nuts'))baseMult*=1.04;
		if(Game.Has('Arcane sugar'))baseMult*=1.05;
		if(Game.Has('Increased merriness'))baseMult*=1.15;
		if(Game.Has('Improved jolliness'))baseMult*=1.15;
		if(Game.Has('A lump of coal'))baseMult*=1.01;
		if(Game.Has('An itchy sweater'))baseMult*=1.01;
		if(Game.Has('Santa\'s dominion'))baseMult*=1.2;
		if(Game.hasGod){
			var godLvl=Game.hasGod('asceticism');
			if(godLvl==1)baseMult*=1.15;
			else if(godLvl==2)baseMult*=1.1;
			else if(godLvl==3)baseMult*=1.05;
			var godLvl=Game.hasGod('ages');
			if(godLvl==1)baseMult*=1+0.15*Math.sin((Date.now()/(3600000*3))*Math.PI*2);
			else if(godLvl==2)baseMult*=1+0.15*Math.sin((Date.now()/(3600000*12))*Math.PI*2);
			else if(godLvl==3)baseMult*=1+0.15*Math.sin((Date.now()/(3600000*24))*Math.PI*2);
		}
		if(Game.Has('Santa\'s legacy'))baseMult*=1+(Game.santaLevel+1)*0.03;
		for(var i in Game.customCps){baseMult*=Game.customCps[i]();}
		if(Game.Has('Chicken egg'))baseMult*=1.01;
		if(Game.Has('Duck egg'))baseMult*=1.01;
		if(Game.Has('Turkey egg'))baseMult*=1.01;
		if(Game.Has('Quail egg'))baseMult*=1.01;
		if(Game.Has('Robin egg'))baseMult*=1.01;
		if(Game.Has('Ostrich egg'))baseMult*=1.01;
		if(Game.Has('Cassowary egg'))baseMult*=1.01;
		if(Game.Has('Salmon roe'))baseMult*=1.01;
		if(Game.Has('Frogspawn'))baseMult*=1.01;
		if(Game.Has('Shark egg'))baseMult*=1.01;
		if(Game.Has('Turtle egg'))baseMult*=1.01;
		if(Game.Has('Ant larva'))baseMult*=1.01;
		if(Game.Has('Century egg'))baseMult*=1+(1-Math.pow(1-Math.min((Math.floor((Date.now()-Game.startDate)/10000)/864000),1),3))/10;//the boost increases a little every day, with diminishing returns up to +10% on the 100th day
		if(Game.Has('Sugar baking'))baseMult*=1+Math.min(1,Game.lumps/100);
		if(Game.hasAura('Radiant Appetite'))baseMult*=2;
		if(Game.hasAura('Dragon\'s Fortune'))for(var i=0;i<Game.shimmerTypes['golden'].n;i++){baseMult*=2.23;}
		name=Game.bakeryName.toLowerCase();
		if(name=='orteil')baseMult*=0.99;
		else if(name=='ortiel')baseMult*=0.98;//or so help me		XD
		if(Game.Has('Elder Covenant'))baseMult*=0.95;
		if(Game.Has('Golden switch [off]')){
			var goldenSwitchMult=1.5;
			if(Game.Has('Residual luck')){
				var upgrades=Game.goldenCookieUpgrades;
				for(var i in upgrades){if(Game.Has(upgrades[i]))goldenSwitchMult+=0.1;}
			}baseMult*=goldenSwitchMult;
		}
		if(Game.Has('Shimmering veil [off]'))baseMult*=Game.Has('Reinforced membrane')?1.6:1.5;
		if(Game.Has('Magic shenanigans'))baseMult*=1000;
		if(Game.Has('Occult obstruction'))baseMult*=0;
		for(var i in Game.customCpsMult){baseMult*=Game.customCpsMult[i]();}
		function calcCpS(){//this function contains all the (mostly) isolated chunks of the cps calcs that are affected by the garden minigame
			//some of this stuff won't change, but it's better to just keep some things together
			//add up effect bonuses from building minigames
			calcEffs();//don't forget to recalc the garden's effs, it's *kind of* important...
			var Geffs=[];//can't change Game.effs itself, now can I?
			for(var i in Game.Objects){
				if(Game.Objects[i].minigameLoaded&&Game.Objects[i].minigame.effs){
					var myEffs=(Game.Objects[i].name=="Farm"?effs:Game.Objects[i].minigame.effs);//use local effs for garden minigame
					for(var ii in myEffs){
						if(Geffs[ii])Geffs[ii]*=myEffs[ii];
						else Geffs[ii]=myEffs[ii];
					}
				}
			}
			var mult=Geffs['cps'];
			var sucking=0;
			for(var i in Game.wrinklers){if(Game.wrinklers[i].phase==2)sucking++;}
			mult*=1-(sucking*Geffs['wrinklerEat']/20);//each wrinkler eats a twentieth of your CpS
			//building cps stuff begins
			var buildMult=1;
			if(Game.hasGod){
				var godLvl=Game.hasGod('decadence');
				if(godLvl==1)buildMult*=0.93;
				else if(godLvl==2)buildMult*=0.95;
				else if(godLvl==3)buildMult*=0.98;
				var godLvl=Game.hasGod('industry');
				if(godLvl==1)buildMult*=1.1;
				else if(godLvl==2)buildMult*=1.06;
				else if(godLvl==3)buildMult*=1.03;
				var godLvl=Game.hasGod('labor');
				if(godLvl==1)buildMult*=0.97;
				else if(godLvl==2)buildMult*=0.98;
				else if(godLvl==3)buildMult*=0.99;
			}
			function buildsCps(me){//cursor and grandma cps may be affected by the garden
				if(me.name=="Cursor"){
					var add=0;
					if(Game.Has('Thousand fingers'))add+=0.1;
					if(Game.Has('Million fingers'))add+=0.5;
					if(Game.Has('Billion fingers'))add+=5;
					if(Game.Has('Trillion fingers'))add+=50;
					if(Game.Has('Quadrillion fingers'))add+=500;
					if(Game.Has('Quintillion fingers'))add+=5000;
					if(Game.Has('Sextillion fingers'))add+=50000;
					if(Game.Has('Septillion fingers'))add+=500000;
					if(Game.Has('Octillion fingers'))add+=5000000;
					var num=0;
					for(var i in Game.Objects){if(Game.Objects[i].name!='Cursor')num+=Game.Objects[i].amount;}
					add*=num;
					return Game.ComputeCps(0.1,Game.Has('Reinforced index finger')+Game.Has('Carpal tunnel prevention cream')+Game.Has('Ambidextrous'),add)*Game.GetTieredCpsMult(me)*Geffs['cursorCps'];
				}
				else if(me.name=="Grandma"){
					var tmult=Game.GetTieredCpsMult(me)*Geffs['grandmaCps'];//temp mult (mult is taken)
					for(var i in Game.GrandmaSynergies){if(Game.Has(Game.GrandmaSynergies[i]))tmult*=2;}
					if(Game.Has('Bingo center/Research facility'))tmult*=4;
					if(Game.Has('Ritual rolling pins'))tmult*=2;
					if(Game.Has('Naughty list'))tmult*=2;
					if(Game.Has('Elderwort biscuits'))tmult*=1.02;
					var add=me.amount*0.02*((Game.Has('One mind')?1:0)+(Game.Has('Communal brainsweep')?1:0));
					if(Game.Has('Elder Pact'))add+=Game.Objects['Portal'].amount*0.05;
					var num=0;
					for(var i in Game.Objects){if(Game.Objects[i].name!='Grandma')num+=Game.Objects[i].amount;}
					if(Game.hasAura('Elder Battalion'))tmult*=1+0.01*num;
					return(me.baseCps+add)*tmult;
				}else return me.cps(me);
			}
			//how long have you been waiting for the cps itself to appear?
			var cookiesPs=Game.Has('"egg"')?9:0;//"egg"
			for(var i in Game.Objects){
				var me=Game.Objects[i];
				cookiesPs+=me.amount*(typeof(me.cps)=='function'?buildsCps(me):me.cps)*(Game.ascensionMode!=1?((1+me.level*0.01)*buildMult):1);
			}
			//building cps stuff ends, milk stuff begins
			var milkProgress=Game.AchievementsOwned/25;
			var milkMult=Geffs['milk'];
			if(Game.Has('Santa\'s milk and cookies'))milkMult*=1.05;
			if(Game.hasAura('Breath of Milk'))milkMult*=1.05;
			if(Game.hasGod){
				var godLvl=Game.hasGod('mother');
				if(godLvl==1)milkMult*=1.1;
				else if(godLvl==2)milkMult*=1.05;
				else if(godLvl==3)milkMult*=1.03;
			}
			if(Game.Has('Kitten helpers'))mult*=(1+milkProgress*0.1*milkMult);
			if(Game.Has('Kitten workers'))mult*=(1+milkProgress*0.125*milkMult);
			if(Game.Has('Kitten engineers'))mult*=(1+milkProgress*0.15*milkMult);
			if(Game.Has('Kitten overseers'))mult*=(1+milkProgress*0.175*milkMult);
			if(Game.Has('Kitten managers'))mult*=(1+milkProgress*0.2*milkMult);
			if(Game.Has('Kitten accountants'))mult*=(1+milkProgress*0.2*milkMult);
			if(Game.Has('Kitten specialists'))mult*=(1+milkProgress*0.2*milkMult);
			if(Game.Has('Kitten experts'))mult*=(1+milkProgress*0.2*milkMult);
			if(Game.Has('Kitten consultants'))mult*=(1+milkProgress*0.2*milkMult);
			if(Game.Has('Kitten assistants to the regional manager'))mult*=(1+milkProgress*0.175*milkMult);
			if(Game.Has('Kitten marketeers'))mult*=(1+milkProgress*0.15*milkMult);
			if(Game.Has('Kitten analysts'))mult*=(1+milkProgress*0.125*milkMult);
			if(Game.Has('Kitten angels'))mult*=(1+milkProgress*0.1*milkMult);
			//milk stuff ends
			for(var i in Game.buffs){if(typeof Game.buffs[i].multCpS!='undefined')mult*=Game.buffs[i].multCpS;}
			return cookiesPs*baseMult*mult;
		}
		var totalCost=0;
		var autoIsUnsafe=false;//this mass-planting program isn't smart about how it does everything and simply does it all, so this boolean turns true if it's planting method doesn't avoid negative cookies in the bank
		function getCost(me){//what would it cost to plant this?
			if(Game.Has('Turbo-charged soil'))return 0;
			return Math.max(me.costM,calcCpS()*me.cost*60)*(Game.HasAchiev('Seedless to nay')?0.95:1);
		}
		function harvesting(me){
			var bank=0;
			var time=0;
			if(me.key=="bakeberry"){bank=0.03;time=1800;}
			else if(me.key=="chocoroot"||me.key=="whiteChocoroot"){bank=0.03;time=180;}
			else if(me.key=="queenbeet"){bank=0.04;time=3600;}
			else if(me.key=="duketater"){bank=0.08;time=7200;}
			autoIsUnsafe=(totalCost>Game.cookies||autoIsUnsafe);
			return Math.max(Math.min((Game.cookies-totalCost)*bank,calcCpS()*time),0);
		}
		function fakePlant(w,a){
			var tile=plot[a[1]][a[0]];
			if(tile[0]>0){//is there something there already?
				if(tile[0]!=w.id||tile[1]>0){//is it a fresh copy of what we wanted to plant? no?
					if(override>=2||(override>=1&&tile[0]!=w.id)){//harvest and plant if the override level is high enough
						//Mini.seedSelected=w.id;
						var current=Mini.plantsById[tile[0]-1];
						if(current.onHarvest)totalCost-=harvesting(current);
						plot[a[1]][a[0]]=[0,0,tile[2]];
						totalCost+=getCost(w);
						autoIsUnsafe=(totalCost>Game.cookies||autoIsUnsafe);
						plot[a[1]][a[0]][0]=w.id+1;
					}
				}
			}
			else{
				totalCost+=getCost(w);
				autoIsUnsafe=(totalCost>Game.cookies||autoIsUnsafe);
				plot[a[1]][a[0]]=[w.id+1,0,tile[2]];
			}
		}
		if(separate==3&&(Math.ceil(what.mature/(what.ageTick+(what.ageTickR/2))))>(Math.ceil(what2.mature/(what2.ageTick+(what2.ageTickR/2))))){//in this case, the second plant is planted first, so we have to calculate it in that order
			for(var i in array2){fakePlant(what2,array2[i]);}
			for(var i in array){fakePlant(what,array[i]);}
		}
		else{
			if(separate!=2)for(var i in array){fakePlant(what,array[i]);}
			if(twoPar&&separate!=1)for(var i in array2){fakePlant(what2,array2[i]);}
		}
		if(Game.cookies<totalCost)return "You can't afford all the plants! You need "+Beautify(totalCost-Game.cookies)+" more cookies for that.";
		else if(autoIsUnsafe)return "YOU could afford all the plants if you did everything yourself, but if this program did it, you would at some point not have enough cookies to plant the next plant, although the total cost would technically be "+Beautify(totalCost)+" cookies. You can do everything yourself in an order that works, or try again after waiting a few minutes or harvesting a plant(s) for more cookies.";
		else if(doPlant==0)return "Right now, performing this mass-planting action would cost "+Beautify(totalCost)+" cookies. To proceed, call this same function with the same parameters, but put 1 or 2 as the first parameter instead of 0.";
	}
	if(doPlant>0){//I don't care about the cost, just do it now
		//var seed=Mini.seedSelected;
		var delay=100;
		var currentDelay=0;
		function plantplant(w,a){
			var tile=Mini.plot[a[1]][a[0]];
			if(tile[0]>0){//is there something there already?
				if(tile[0]!=w.id||tile[1]>0){//is it a fresh copy of what we wanted to plant? no?
					if(override>=2||(override>=1&&tile[0]!=w.id)){//harvest and plant if the override level is high enough
						Mini.seedSelected=w.id;
						Mini.clickTile(a[0],a[1]);//test?
						if(Mini.plot[a[1]][a[0]][0]!=0)Mini.clickTile(a[0],a[1]);//if we harvested and the tile still wasn't empty, harvest again (darn meddleweed dropping brown mold or crumbspore)
						Mini.clickTile(a[0],a[1]);
					}
				}
			}
			else{Mini.seedSelected=w.id;Mini.clickTile(a[0],a[1]);}
		}
		function addDelay(w,a){//does the logic of plantplant, but increases the delay instead of actually doing stuff
			var tile=Mini.plot[a[1]][a[0]];
			if(tile[0]>0)if((override>=1&&tile[0]!=w.id)||(override>=2&&tile[1]>0))currentDelay+=2;
			else currentDelay++;//clicking the tile once is ONLY an option if it's not already occupied
		}
		function plantplantAll(w,a){
			for(var i in a){
				addDelay(w,a[i]);
				setTimeout(plantplant,currentDelay*delay,w,a[i]);
			}
		}
		/*switch(separate){
			case 0: plant both plants immediately;
			case 1: plant only the first plant;
			case 2: plant only the second plant;
			case 3: delay the planting of whichever plant matures faster so they mature at about the same time;
		}*/
		var tickDelay=(Math.ceil(what.mature/(what.ageTick+(what.ageTickR/2))))-(Math.ceil(what2.mature/(what2.ageTick+(what2.ageTickR/2))));
		if(separate==3&&tickDelay<0){
			setTimeout(plantplantAll,Mini.soilsById[Mini.soil].tick*tickDelay*-60000,what,array);//first plant matures faster, so wait before planting it
			console.log("The "+what.name+"s will be planted in "+(tickDelay*Mini.soilsById[Mini.soil].tick*-1)+" minutes.");
		}
		else if(separate!=2)plantplantAll(what,array);//naturally includes the remaining separate==3 cases
		if(twoPar){//this only happens if we actually have a second plant to plant
			if(separate==3)currentDelay=0;//no sense in waiting a couple extra seconds, we already waited at least a few minutes
			if(separate==3&&tickDelay>0){
				setTimeout(plantplantAll,Mini.soilsById[Mini.soil].tick*tickDelay*60000,what2,array2);//first plant takes longer to mature, so wait on second plant
				console.log("The "+what2.name+"s will be planted in "+(tickDelay*Mini.soilsById[Mini.soil].tick)+" minutes.");
			}
			else if(separate!=1)plantplantAll(what2,array2);
		}
		//Mini.seedSelected=seed;
	}
}
