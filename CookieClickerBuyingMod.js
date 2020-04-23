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
		if((BuyBothSell=="buy"&&a[i]<0)||(BuyBothSell=="sell"&&a[i]>0))a[i]=0;
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
			if(RigidelEven=="any"){
				if(BuyBothSell=="buy"&&RigidelDirection=="less"&&buyTotal-less<0)RigidelDirection="more";//the impossible has been requested
				else if(BuyBothSell=="sell"&&RigidelDirection=="more"&&buyTotal+more>0)RigidelDirection="less";//again
				function fixDifference(id){
					var obj=Game.ObjectsById[id];
					//won't work? return "no"
					if((((BuyBothSell=="buy"&&RigidelDirection=="less")||(BuyBothSell=="sell"&&RigidelDirection=="more"))&&a[id]==0)||(RigidelDirection=="less"&&obj.amount+a[id]<=0)||(BuyBothSell=="both"&&inputMode=="base"&&obj.name==name&&((RigidelDirection=="more"&&a[id]<0)||(RigidelDirection=="less"&&a[id]>0))))return "no";
					else if(RigidelDirection=="more"){
						if((BuyBothSell=="buy"||BuyBothSell=="both")&&a[id]>=0)return obj.getSumPrice(a[id]+1)-obj.getSumPrice(a[id]);
						else if((BuyBothSell=="sell"||BuyBothSell=="both")&&a[id]<0)return obj.getReverseSumPrice(-a[id]-1)-obj.getReverseSumPrice(-a[id]);
					}
					else if(RigidelDirection=="less"){
						if((BuyBothSell=="buy"||BuyBothSell=="both")&&a[id]>0)return obj.getSumPrice(a[id])-obj.getSumPrice(a[id]-1);
						else if((BuyBothSell=="sell"||BuyBothSell=="both")&&a[id]<=0)return obj.getReverseSumPrice(-a[id])-obj.getReverseSumPrice(-a[id]+1);
					}
					else return "some scenario wasn't accounted for...";
				}
				for(var i=0;i<(RigidelDirection=="more"?more:less);i++){//loop stuff to determine which one to get each time
					var priceArray=[];
					for(var j in a){
						priceArray.push(fixDifference(j));
					}
					var smallest=-1;
					for(var j in priceArray){
						if(typeof priceArray[j]=="string")continue;
						else if(smallest==-1)smallest=j;
						else if(Math.abs(priceArray[j])<Math.abs(priceArray[smallest]))smallest=j;
					}
					/*
					more:compare absolute values
					less:compare absolute values?
					*/
					if(smallest==-1){console.log("F in the chat, please, for our fallen program.");break;}
					else a[smallest]+=(RigidelDirection=="more"?1:-1);
					//add/remove the cheapest one that works
				}
			}
			else{
				var obj=Game.Objects[RigidelEven].id;
				if(RigidelDirection=="more")a[obj]+=more;
				else if(RigidelDirection=="less")a[obj]-=less;
				if(BuyBothSell=="buy"&&a[obj]<0)a[obj]+=10;
				if(BuyBothSell=="sell"&&a[obj]>0)a[obj]-=10;
			}
		}
	}
	for(var i in Game.ObjectsById){
		if(a[i]>0&&(BuyBothSell=="buy"||BuyBothSell=="both"))price+=Game.ObjectsById[i].getSumPrice(a[i]);
		else if(a[i]<0&&(BuyBothSell=="sell"||BuyBothSell=="both"))price-=Game.ObjectsById[i].getReverseSumPrice(-a[i]);
	}
	if(price>Game.cookies){
		if(determined==0)return "You can't afford to buy all the buildings.";
		else if(determined==1)console.log("You can't afford to buy all the buildings.");
		else if(determined>=2){
			if(determined==2)console.log("You can't afford to buy all the buildings right now. This program will buy as many of the buildings as it can every five seconds until the buildings have all been bought.");
			setTimeout(Game.massBuild,5000,inputMode,3,BuyBothSell,amount,name,RigidelEven,RigidelDirection);
		}
	}
	else if(determined==3)console.log("Your buildings have been bought.");
	for(var i in a){
		if(a[i]<0&&(BuyBothSell=="sell"||BuyBothSell=="both"))Game.ObjectsById[i].sell(-a[i]);
	}
	for(var i=a.length-1;i>=0;i--){//getting the highest tier buildings first because they help pay for the lower tier ones
		if(a[i]>0&&(BuyBothSell=="buy"||BuyBothSell=="both"))Game.ObjectsById[i].buy(a[i]);
	}
}
