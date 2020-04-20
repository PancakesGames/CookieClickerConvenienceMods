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